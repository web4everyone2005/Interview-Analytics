"use client";

import React, { useState, useEffect } from "react";
import { useSessionByRoomCode } from "@/hooks/useSession";
import { useInterviewSocket } from "@/hooks/useInterviewSocket";
import { useAudioRecording } from "@/hooks/useAudioRecording";
import { Mic, MicOff } from "lucide-react";

interface CandidateRoomProps {
    roomCode: string;
}

export default function CandidateRoom({ roomCode }: CandidateRoomProps) {
    const { session, isLoading, error } = useSessionByRoomCode(roomCode);
    const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(null);
    const [liveTranscript, setLiveTranscript] = useState<string>("");

    const sessionId = session?._id || session?.id || "";

    // 1. Lấy Magic Link Token trên URL để chuẩn bị cấu hình hoặc truyền cho hook upload
    let magicToken = "";
    if (typeof window !== "undefined") {
        const searchParams = new URLSearchParams(window.location.search);
        magicToken = searchParams.get("token") || "";
    }

    const { startRecording, stopRecordingAndUpload, isRecording, getMediaRecorder } = useAudioRecording(
        sessionId,
        "CANDIDATE"
    );

    // 2. Lấy thêm hàm emitAudioStream từ hook socket đã tối ưu
    const { isConnected, getSocket, emitAudioStream } = useInterviewSocket({
        roomCode,
        onRecordingStarted: (data) => {
            console.log("HR started recording", data);
            setLiveTranscript(""); // Reset text bóc băng cho câu hỏi mới
            setCurrentQuestionId(data.questionId);
            startRecording();
        },
        onRecordingStopped: async (data) => { // 1. Thêm async ở đây
            console.log("HR stopped recording", data);

            // 2. Ưu tiên lấy questionId từ socket gửi về (nếu có), nếu không có mới fallback về state
            const activeQuestionId = data?.questionId || currentQuestionId;

            if (activeQuestionId) {
                console.log(`[UPLOAD] Kích hoạt upload file cho câu hỏi: ${activeQuestionId}`);
                // 3. Thêm await để đảm bảo upload xong xuôi
                await stopRecordingAndUpload(activeQuestionId);
            } else {
                console.warn("[UPLOAD] Không tìm thấy questionId hợp lệ để upload.");
            }

            // 4. Upload xong hoàn toàn mới xóa state câu hỏi hiện tại
            setCurrentQuestionId(null);
        },
        onError: (err) => {
            console.error("Socket error:", err);
            alert(err.message || "Lỗi kết nối Socket");
        }
    });

    // 3. Lắng nghe luồng bóc băng hiển thị chữ từ AI Realtime gửi về qua Socket
    useEffect(() => {
        const socket = getSocket();
        if (!socket) return;

        socket.on("audio:transcription", (data: { text: string; questionId: string }) => {
            console.log("Nhận text realtime từ server:", data.text);
            setLiveTranscript((prev) => prev + " " + data.text);
        });

        return () => {
            socket.off("audio:transcription");
        };
    }, [getSocket(), currentQuestionId]);

    // 4. Kích hoạt luồng Stream Chunk âm thanh realtime khi Microphone có dữ liệu (ondataavailable)
    useEffect(() => {
        const recorder = getMediaRecorder?.();
        if (!recorder || !isRecording || !currentQuestionId) return;

        const handleDataAvailable = (event: BlobEvent) => {
            if (event.data && event.data.size > 0) {
                // Gửi chunk nhị phân qua socket
                emitAudioStream(event.data, currentQuestionId);
            }
        };

        recorder.addEventListener("dataavailable", handleDataAvailable);
        return () => {
            recorder.removeEventListener("dataavailable", handleDataAvailable);
        };
    }, [isRecording, currentQuestionId, getMediaRecorder]);

    if (isLoading) return <div className="flex h-screen items-center justify-center">Đang tải phòng phỏng vấn...</div>;
    if (error || !session) return <div className="flex h-screen items-center justify-center text-red-500">Phòng không tồn tại hoặc đã kết thúc.</div>;

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            <header className="bg-white shadow-sm p-4 flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-bold text-gray-800">Interview Analytics</h1>
                    <p className="text-sm text-gray-500">
                        Vị trí: {session.job_position_id?.title || "N/A"}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}></div>
                    <span className="text-sm font-medium">{isConnected ? "Đã kết nối" : "Mất kết nối"}</span>
                </div>
            </header>

            <main className="flex-1 p-6 flex flex-col items-center justify-center">
                <div className="bg-white p-8 rounded-xl shadow-lg max-w-lg w-full text-center">
                    <h2 className="text-2xl font-semibold mb-2">Xin chào, {session.candidate_profile_id?.full_name || "Ứng viên"}</h2>
                    <p className="text-gray-600 mb-6">
                        Phòng phỏng vấn đã sẵn sàng. Vui lòng chờ HR bắt đầu đặt câu hỏi.
                        Khi HR bắt đầu ghi âm, hệ thống sẽ tự động bật Microphone của bạn.
                    </p>

                    <div className="flex justify-center mb-6">
                        <div className={`p-6 rounded-full ${isRecording ? "bg-red-100 animate-pulse" : "bg-gray-100"}`}>
                            {isRecording ? <Mic className="text-red-600" size={48} /> : <MicOff className="text-gray-400" size={48} />}
                        </div>
                    </div>

                    <div className="text-lg font-medium mb-4">
                        {isRecording ? (
                            <span className="text-red-600 font-bold">Đang ghi âm câu trả lời...</span>
                        ) : (
                            <span className="text-gray-500">Đang chờ tín hiệu từ HR...</span>
                        )}
                    </div>

                    {/* HIỂN THỊ TRANSCRIPT REALTIME KHI ĐANG NÓI */}
                    {isRecording && liveTranscript && (
                        <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg text-left text-sm text-gray-700 max-h-32 overflow-y-auto">
                            <strong className="block text-xs text-gray-500 mb-1">Nội dung nhận diện trực tiếp:</strong>
                            {liveTranscript}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}