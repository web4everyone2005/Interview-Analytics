"use client";

import { useInterviewReport, useReportMutations } from "@/hooks/useReport";
import { DetailedResult } from "@/models/report.model";
import Link from "next/link";
import { ArrowLeft, Download, RefreshCw, CheckCircle, AlertTriangle, FileText, Play } from "lucide-react";
import { useState } from "react";

export default function DetailedReport({ sessionId }: { sessionId: string }) {
  const { report, isLoading, isError, mutate } = useInterviewReport(sessionId);
  const { downloadPdf, triggerReEvaluate } = useReportMutations();
  const [isExporting, setIsExporting] = useState(false);
  const [isReevaluating, setIsReevaluating] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full text-white/40">
        Đang tải chi tiết báo cáo...
      </div>
    );
  }

  if (isError || !report) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-red-400 gap-4">
        <p>Không thể tải báo cáo hoặc phiên không tồn tại.</p>
        <Link href="/reports" className="text-blue-400 underline">Quay lại danh sách</Link>
      </div>
    );
  }

  const { session_info, metrics, detailed_results } = report;

  const handleExport = async () => {
    try {
      setIsExporting(true);
      await downloadPdf(sessionId, `Interview_Report_${session_info.room_code}.pdf`);
    } catch (error) {
      alert("Lỗi khi tải xuống PDF!");
    } finally {
      setIsExporting(false);
    }
  };

  const handleReevaluate = async () => {
    if (!confirm("Bạn có chắc chắn muốn yêu cầu AI chấm lại phiên này? Dữ liệu chấm điểm cũ có thể bị ghi đè.")) return;
    try {
      setIsReevaluating(true);
      await triggerReEvaluate(sessionId);
      alert("Đã gửi yêu cầu chấm lại thành công. Vui lòng quay lại sau ít phút.");
      mutate();
    } catch (error: any) {
      const msg = error.response?.data?.message || "Lỗi khi gửi yêu cầu chấm lại.";
      alert(msg);
    } finally {
      setIsReevaluating(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0b0c10] text-white p-6 max-w-5xl mx-auto w-full custom-scrollbar overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/reports"
            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors text-white/60"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Báo Cáo Đánh Giá</h1>
            <p className="text-white/40 text-sm mt-1">
              Phòng: {session_info.room_code} • {new Date(session_info.scheduled_at || "").toLocaleString("vi-VN")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleReevaluate}
            disabled={isReevaluating}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 text-white text-sm font-semibold transition-all disabled:opacity-50"
          >
            <RefreshCw size={16} className={isReevaluating ? "animate-spin" : ""} />
            {isReevaluating ? "Đang yêu cầu..." : "Chấm điểm lại"}
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 active:scale-95 text-white text-sm font-semibold shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50"
          >
            <Download size={16} />
            {isExporting ? "Đang xuất..." : "Xuất file PDF"}
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 rounded-2xl p-6 flex flex-col justify-center items-center text-center">
          <p className="text-blue-400 text-sm font-medium mb-1">Tổng điểm trung bình</p>
          <p className="text-5xl font-bold text-white drop-shadow-md">{metrics.average_score}<span className="text-2xl text-white/40">/10</span></p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <p className="text-white/40 text-sm font-medium mb-1">Ứng viên</p>
          <p className="text-lg font-semibold text-white truncate">{session_info.candidate_profile_id?.full_name}</p>
          <p className="text-sm text-white/60 truncate mt-1">{session_info.candidate_profile_id?.email}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <p className="text-white/40 text-sm font-medium mb-1">Tiến độ chấm điểm</p>
          <p className="text-lg font-semibold text-white">{metrics.evaluated_questions} / {metrics.total_questions}</p>
          <div className="w-full h-2 bg-white/10 rounded-full mt-3 overflow-hidden">
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-1000" 
              style={{ width: `${metrics.total_questions > 0 ? (metrics.evaluated_questions / metrics.total_questions) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Detailed Results */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold mb-4">Chi tiết từng câu hỏi</h2>
        
        {detailed_results.length === 0 ? (
          <div className="text-center text-white/40 py-10 bg-white/5 rounded-2xl border border-white/10">
            Chưa có câu hỏi nào được lưu cho phiên này.
          </div>
        ) : (
          detailed_results.map((detail: DetailedResult, idx: number) => (
            <div key={detail.question_id} className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-white/[0.02] p-5 border-b border-white/10 flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <h3 className="font-medium text-white/90 leading-relaxed">
                      {detail.question_content}
                    </h3>
                  </div>
                  <p className="text-sm text-green-400/80 mt-2 pl-9">
                    <span className="font-semibold text-white/40 mr-2">Expected:</span>
                    {detail.expected_answer}
                  </p>
                </div>
                {detail.evaluation ? (
                  <div className="shrink-0 w-16 h-16 rounded-xl border border-blue-500/20 bg-blue-500/10 flex flex-col items-center justify-center">
                    <span className="text-xl font-bold text-blue-400">{detail.evaluation.score}</span>
                    <span className="text-[10px] text-white/40 font-medium">ĐIỂM</span>
                  </div>
                ) : session_info.status === "COMPLETED" ? (
                  <div className="shrink-0 w-16 h-16 rounded-xl border border-red-500/20 bg-red-500/10 flex flex-col items-center justify-center">
                    <span className="text-xl font-bold text-red-400">0</span>
                    <span className="text-[10px] text-white/40 font-medium">ĐIỂM</span>
                  </div>
                ) : (
                  <div className="shrink-0 px-3 py-1.5 rounded-lg border border-yellow-500/20 bg-yellow-500/10 text-yellow-400 text-xs font-medium">
                    Chưa chấm
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="p-5 flex flex-col md:flex-row gap-6">
                {/* Left: Transcript & Audio */}
                <div className="flex-1 space-y-4">
                  <div>
                    <h4 className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <FileText size={14} /> Transcript câu trả lời
                    </h4>
                    <div className="bg-black/20 rounded-xl p-4 text-sm text-white/70 leading-relaxed italic border border-white/[0.02]">
                      &quot;{detail.candidate_transcript || "Không có câu trả lời từ ứng viên."}&quot;
                    </div>
                  </div>
                  {detail.audio_url && (
                    <div>
                      <h4 className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Play size={14} /> Ghi âm
                      </h4>
                      <audio controls className="w-full h-10 outline-none rounded-lg" src={detail.audio_url} />
                    </div>
                  )}
                </div>

                {/* Right: AI Evaluation */}
                {detail.evaluation ? (
                  <div className="flex-1 space-y-4 md:border-l md:border-white/10 md:pl-6">
                    <div>
                      <h4 className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-2">Nhận xét của AI</h4>
                      <p className="text-sm text-white/80 leading-relaxed bg-blue-500/5 p-3 rounded-lg border border-blue-500/10">
                        {detail.evaluation.feedback}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Điểm mạnh */}
                      {detail.evaluation.strengths && detail.evaluation.strengths.length > 0 && (
                        <div>
                          <h4 className="text-xs font-semibold text-green-400/60 uppercase tracking-widest mb-2 flex items-center gap-1">
                            <CheckCircle size={12} /> Điểm mạnh
                          </h4>
                          <ul className="space-y-1.5">
                            {detail.evaluation.strengths.map((s, i) => (
                              <li key={i} className="text-sm text-white/60 flex items-start gap-2">
                                <span className="text-green-400 mt-1">•</span>
                                <span className="leading-tight">{s}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {/* Điểm yếu */}
                      {detail.evaluation.weaknesses && detail.evaluation.weaknesses.length > 0 && (
                        <div>
                          <h4 className="text-xs font-semibold text-red-400/60 uppercase tracking-widest mb-2 flex items-center gap-1">
                            <AlertTriangle size={12} /> Điểm cần cải thiện
                          </h4>
                          <ul className="space-y-1.5">
                            {detail.evaluation.weaknesses.map((w, i) => (
                              <li key={i} className="text-sm text-white/60 flex items-start gap-2">
                                <span className="text-red-400 mt-1">•</span>
                                <span className="leading-tight">{w}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ) : session_info.status === "COMPLETED" ? (
                  <div className="flex-1 space-y-4 md:border-l md:border-white/10 md:pl-6 flex flex-col justify-center min-h-[150px]">
                    <p className="text-sm text-white/40 italic text-center">
                      Không có câu trả lời ghi âm. AI không thể đánh giá.
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
