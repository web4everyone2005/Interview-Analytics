import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { tokenStorage } from "@/lib/axios";

interface SocketRecordingData {
    questionId: string;
    [key: string]: unknown;
}

interface SocketUserData {
    userId: string;
    name?: string;
    email?: string;
    role?: "HR" | "CANDIDATE";
}

interface SocketErrorData {
    message: string;
    status?: number;
}

interface UseInterviewSocketProps {
    roomCode: string;
    onRecordingStarted?: (data: SocketRecordingData) => void;
    onRecordingStopped?: (data: SocketRecordingData) => void;
    onQuestionChanged?: (data: { questionIndex: number }) => void;
    onUserJoined?: (data: SocketUserData) => void;
    onUserLeft?: (data: SocketUserData) => void;
    onError?: (error: SocketErrorData) => void;
}

export const useInterviewSocket = ({
    roomCode,
    onRecordingStarted,
    onRecordingStopped,
    onQuestionChanged,
    onUserJoined,
    onUserLeft,
    onError,
}: UseInterviewSocketProps) => {
    const socketRef = useRef<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    // Use refs for callbacks to prevent socket reconnection loop on re-renders
    const callbacksRef = useRef({
        onRecordingStarted,
        onRecordingStopped,
        onQuestionChanged,
        onUserJoined,
        onUserLeft,
        onError,
    });

    useEffect(() => {
        callbacksRef.current = {
            onRecordingStarted,
            onRecordingStopped,
            onQuestionChanged,
            onUserJoined,
            onUserLeft,
            onError,
        };
    });

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const magicToken = searchParams.get("token");

        const token = magicToken || tokenStorage.getAccessToken();

        if (!token) {
            if (callbacksRef.current.onError) {
                callbacksRef.current.onError({ message: "Không tìm thấy token hợp lệ để kết nối." });
            }
            return;
        }

        // Tự động phân tích socketUrl từ API Base URL nếu không có NEXT_PUBLIC_SOCKET_URL cấu hình
        let socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;
        if (!socketUrl) {
            const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
            if (apiBaseUrl) {
                // Loại bỏ đuôi /api/v1 hoặc /api để lấy domain gốc
                socketUrl = apiBaseUrl.replace(/\/api\/v1\/?$/, "").replace(/\/api\/?$/, "");
            } else {
                socketUrl = "http://localhost:5000"; // Fallback về cổng 5000 của BE
            }
        }

        const socket = io(socketUrl, {
            auth: { token },
            query: { token },
            transports: ["websocket", "polling"],
        });

        socketRef.current = socket;

        socket.on("connect", () => {
            setIsConnected(true);
            socket.emit("room:join", { roomCode });
        });

        socket.on("disconnect", () => {
            setIsConnected(false);
        });

        socket.on("room:error", (err) => {
            if (callbacksRef.current.onError) callbacksRef.current.onError(err);
        });

        socket.on("recording:started", (data) => {
            if (callbacksRef.current.onRecordingStarted) callbacksRef.current.onRecordingStarted(data);
        });

        socket.on("recording:stopped", (data) => {
            if (callbacksRef.current.onRecordingStopped) callbacksRef.current.onRecordingStopped(data);
        });

        socket.on("question:changed", (data) => {
            if (callbacksRef.current.onQuestionChanged) callbacksRef.current.onQuestionChanged(data);
        });

        socket.on("room:user-joined", (data) => {
            if (callbacksRef.current.onUserJoined) callbacksRef.current.onUserJoined(data);
        });

        socket.on("room:user-left", (data) => {
            if (callbacksRef.current.onUserLeft) callbacksRef.current.onUserLeft(data);
        });

        return () => {
            socket.emit("room:leave", { roomCode });
            socket.disconnect();
        };
    }, [roomCode]);

    const emitStartRecording = (questionId: string) => {
        socketRef.current?.emit("recording:start", { roomCode, questionId });
    };

    const emitStopRecording = (questionId: string) => {
        socketRef.current?.emit("recording:stop", { roomCode, questionId });
    };

    const emitNextQuestion = (questionIndex: number) => {
        socketRef.current?.emit("question:next", { roomCode, questionIndex });
    };

    // ADDED: Hàm giúp Candidate truyền luồng âm thanh realtime (Buffer chunk) lên server
    const emitAudioStream = (audioChunk: Blob | Buffer, questionId: string) => {
        socketRef.current?.emit("audio:stream", { roomCode, audioChunk, questionId });
    };

    return {
        getSocket: () => socketRef.current,
        isConnected,
        emitStartRecording,
        emitStopRecording,
        emitNextQuestion,
        emitAudioStream, // Export hàm này ra ngoài
    };
};