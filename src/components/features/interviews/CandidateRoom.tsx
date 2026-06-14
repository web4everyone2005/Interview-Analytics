"use client";

import React, { useState } from "react";
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

  const sessionId = session?._id || session?.id || "";

  const { startRecording, stopRecordingAndUpload, isRecording } = useAudioRecording(
    sessionId,
    "CANDIDATE"
  );

  const { isConnected } = useInterviewSocket({
    roomCode,
    onRecordingStarted: (data) => {
      console.log("HR started recording", data);
      setCurrentQuestionId(data.questionId);
      startRecording();
    },
    onRecordingStopped: (data) => {
      console.log("HR stopped recording", data);
      stopRecordingAndUpload(data.questionId);
      setCurrentQuestionId(null);
    },
    onError: (err) => {
      console.error("Socket error:", err);
      alert(err.message || "Lỗi kết nối Socket");
    }
  });

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
          <p className="text-gray-600 mb-8">
            Phòng phỏng vấn đã sẵn sàng. Vui lòng chờ HR bắt đầu đặt câu hỏi. 
            Khi HR bắt đầu ghi âm, hệ thống sẽ tự động bật Microphone của bạn.
          </p>

          <div className="flex justify-center mb-6">
            <div className={`p-6 rounded-full ${isRecording ? "bg-red-100 animate-pulse" : "bg-gray-100"}`}>
              {isRecording ? <Mic className="text-red-600" size={48} /> : <MicOff className="text-gray-400" size={48} />}
            </div>
          </div>

          <div className="text-lg font-medium">
            {isRecording ? (
              <span className="text-red-600">Đang ghi âm câu trả lời...</span>
            ) : (
              <span className="text-gray-500">Đang chờ...</span>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
