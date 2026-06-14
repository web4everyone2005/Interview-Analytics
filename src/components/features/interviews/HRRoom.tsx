"use client";

import React, { useState, useEffect } from "react";
import { useSessionByRoomCode } from "@/hooks/useSession";
import { useInterviewSocket } from "@/hooks/useInterviewSocket";
import { useAudioRecording } from "@/hooks/useAudioRecording";
import { Mic, Square, ArrowRight, ArrowLeft } from "lucide-react";
import { updateSessionStatus } from "@/services/session.service";

interface HRRoomProps {
  roomCode: string;
}

export default function HRRoom({ roomCode }: HRRoomProps) {
  const { session, isLoading, error, mutate } = useSessionByRoomCode(roomCode);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const questions = session?.questions || [];
  const currentQuestion = questions[currentQuestionIndex];
  
  const sessionId = session?._id || session?.id || "";

  // HR cũng ghi âm song song (Dual-track audio)
  const { startRecording, stopRecordingAndUpload, isRecording } = useAudioRecording(
    sessionId,
    "HR"
  );

  const { isConnected, emitStartRecording, emitStopRecording, emitNextQuestion } = useInterviewSocket({
    roomCode,
    onUserJoined: (data) => console.log("User joined:", data),
    onUserLeft: (data) => console.log("User left:", data),
  });

  const handleStartRecording = () => {
    if (!currentQuestion) return;
    const qId = currentQuestion._id;
    // Báo cho Candidate bật Mic
    emitStartRecording(qId);
    // Bật Mic của HR luôn
    startRecording();
  };

  const handleStopRecording = () => {
    if (!currentQuestion) return;
    const qId = currentQuestion._id;
    // Báo cho Candidate tắt Mic
    emitStopRecording(qId);
    // Tắt Mic của HR
    stopRecordingAndUpload(qId);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      const nextIdx = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIdx);
      emitNextQuestion(nextIdx);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      const prevIdx = currentQuestionIndex - 1;
      setCurrentQuestionIndex(prevIdx);
      emitNextQuestion(prevIdx);
    }
  };

  const handleEndSession = async () => {
    if (!confirm("Kết thúc phỏng vấn? AI sẽ bắt đầu chấm điểm.")) return;
    try {
      await updateSessionStatus(sessionId, "COMPLETED");
      alert("Đã kết thúc! Vui lòng chờ AI chấm điểm (Phase 3).");
      mutate();
    } catch (err) {
      alert("Lỗi khi kết thúc phỏng vấn");
    }
  };

  if (isLoading) return <div className="p-4">Đang kết nối phòng điều khiển...</div>;
  if (error || !session) return <div className="p-4 text-red-500">Phòng không tồn tại.</div>;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar: Danh sách câu hỏi */}
      <aside className="w-1/3 bg-white border-r overflow-y-auto flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-lg font-bold">Danh sách câu hỏi</h2>
          <p className="text-sm text-gray-500">Tổng: {questions.length} câu</p>
        </div>
        <div className="flex-1 p-4 space-y-3">
          {questions.map((q, idx) => (
            <div 
              key={q._id} 
              className={`p-3 border rounded cursor-pointer transition ${currentQuestionIndex === idx ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"}`}
              onClick={() => setCurrentQuestionIndex(idx)}
            >
              <div className="text-xs font-semibold text-gray-500 mb-1">Câu {idx + 1}</div>
              <div className="text-sm">{q.content}</div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Panel: Điều khiển ghi âm & Hiện tại */}
      <main className="flex-1 flex flex-col">
        <header className="bg-white p-4 shadow-sm flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">HR Control Room: {roomCode}</h1>
            <p className="text-sm text-gray-600">Ứng viên: {session.candidate_profile_id?.full_name || "N/A"}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-sm font-medium">
              <span className={`w-3 h-3 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}></span>
              {isConnected ? "Socket Connected" : "Disconnected"}
            </div>
            <button 
              onClick={handleEndSession}
              disabled={session.status === "COMPLETED"}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
            >
              Kết thúc Phỏng vấn
            </button>
          </div>
        </header>

        <div className="flex-1 p-6 flex flex-col items-center justify-center">
          {currentQuestion ? (
            <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-lg text-center">
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">
                Câu hỏi hiện tại ({currentQuestionIndex + 1}/{questions.length})
              </h2>
              <p className="text-2xl font-medium text-gray-800 mb-8">
                {currentQuestion.content}
              </p>
              
              <div className="flex justify-center gap-4 mb-8">
                {!isRecording ? (
                  <button 
                    onClick={handleStartRecording}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 font-medium"
                  >
                    <Mic size={20} /> Bắt đầu Ghi âm (Cả 2 bên)
                  </button>
                ) : (
                  <button 
                    onClick={handleStopRecording}
                    className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 font-medium animate-pulse"
                  >
                    <Square size={20} /> Dừng Ghi âm
                  </button>
                )}
              </div>

              <div className="flex justify-between items-center border-t pt-6">
                <button 
                  onClick={handlePrevQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="flex items-center gap-1 text-gray-600 hover:text-blue-600 disabled:opacity-30"
                >
                  <ArrowLeft size={18} /> Câu trước
                </button>
                <button 
                  onClick={handleNextQuestion}
                  disabled={currentQuestionIndex === questions.length - 1}
                  className="flex items-center gap-1 text-gray-600 hover:text-blue-600 disabled:opacity-30"
                >
                  Câu tiếp <ArrowRight size={18} />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-gray-500">Phòng phỏng vấn chưa có bộ câu hỏi nào.</div>
          )}
        </div>
      </main>
    </div>
  );
}
