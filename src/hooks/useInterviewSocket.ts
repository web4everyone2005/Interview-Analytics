import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { tokenStorage } from "@/lib/axios";

interface UseInterviewSocketProps {
  roomCode: string;
  onRecordingStarted?: (data: any) => void;
  onRecordingStopped?: (data: any) => void;
  onQuestionChanged?: (data: { questionIndex: number }) => void;
  onUserJoined?: (data: any) => void;
  onUserLeft?: (data: any) => void;
  onError?: (error: any) => void;
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
    const token = tokenStorage.getAccessToken();
    if (!token) {
      if (callbacksRef.current.onError) callbacksRef.current.onError({ message: "No token found" });
      return;
    }

    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";
    
    const socket = io(socketUrl, {
      auth: { token },
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

  return {
    getSocket: () => socketRef.current,
    isConnected,
    emitStartRecording,
    emitStopRecording,
    emitNextQuestion,
  };
};
