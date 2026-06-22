"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Brain,
  BarChart3,
  FileText,
  Download,
  RefreshCw,
  Award,
  TrendingUp,
  Search,
  Calendar,
  ChevronRight,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useDashboardReports, useReportMutations } from "@/hooks/useReport";
import { DashboardReport } from "@/models/report.model";

/* ── helpers ──────────────────────────────────────────────── */

function scoreColor(score: number) {
  if (score >= 8) return { bg: "bg-emerald-500/15", text: "text-emerald-400", ring: "ring-emerald-500/30" };
  if (score >= 5) return { bg: "bg-amber-500/15", text: "text-amber-400", ring: "ring-amber-500/30" };
  return { bg: "bg-red-500/15", text: "text-red-400", ring: "ring-red-500/30" };
}

function ScoreBadge({ score }: { score: number }) {
  const c = scoreColor(score);
  return (
    <span
      className={`inline-flex items-center justify-center w-11 h-11 rounded-full text-sm font-bold ring-2 ${c.bg} ${c.text} ${c.ring}`}
    >
      {score}
    </span>
  );
}

function formatDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/* ── stat card ────────────────────────────────────────────── */

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  accent: string;
}) {
  return (
    <div className="bg-white/[0.04] border border-white/8 rounded-2xl p-5 flex items-center gap-4 hover:border-white/15 transition-colors">
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center ${accent}`}
      >
        <Icon size={22} />
      </div>
      <div>
        <p className="text-white/40 text-xs font-medium tracking-wide">
          {label}
        </p>
        <p className="text-2xl font-bold text-white mt-0.5">{value}</p>
      </div>
    </div>
  );
}

/* ── page ─────────────────────────────────────────────────── */

export default function AIEvaluationPage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [reEvalLoading, setReEvalLoading] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState<string | null>(null);

  const { reports, isLoading, isError, mutate } = useDashboardReports(
    startDate,
    endDate
  );
  const { triggerReEvaluate, downloadPdf } = useReportMutations();

  /* only completed sessions with evaluation data */
  const completed: DashboardReport[] = reports.filter(
    (r) => r.status === "COMPLETED"
  );

  /* search filter */
  const filtered = completed.filter((r) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      r.candidate?.full_name?.toLowerCase().includes(term) ||
      r.room_code?.toLowerCase().includes(term)
    );
  });

  /* aggregates */
  const totalCompleted = completed.length;
  const evaluated = completed.filter(
    (r) => r.metrics?.evaluated_questions > 0
  );
  const evaluatedCount = evaluated.length;
  const avgScore =
    evaluatedCount > 0
      ? (
          evaluated.reduce(
            (sum, r) => sum + (r.metrics?.average_score || 0),
            0
          ) / evaluatedCount
        ).toFixed(1)
      : "—";
  const highScoreCount = evaluated.filter(
    (r) => r.metrics?.average_score >= 8
  ).length;

  const handleReEvaluate = async (sessionId: string) => {
    try {
      setReEvalLoading(sessionId);
      await triggerReEvaluate(sessionId);
      alert("Đã gửi yêu cầu đánh giá lại thành công. Vui lòng quay lại sau ít phút.");
      await mutate();
    } catch (error: any) {
      const msg = error.response?.data?.message || "Lỗi khi gửi yêu cầu đánh giá lại.";
      alert(msg);
    } finally {
      setReEvalLoading(null);
    }
  };

  const handleExportPdf = async (report: DashboardReport) => {
    try {
      setPdfLoading(report.session_id);
      const fileName = `report_${report.candidate?.full_name || report.room_code}.pdf`;
      await downloadPdf(report.session_id, fileName);
    } catch {
      // error handled by axios interceptor
    } finally {
      setPdfLoading(null);
    }
  };

  /* ── error state ──────────────────────────────────────── */

  if (isError) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-red-400 text-sm">
        Đã có lỗi xảy ra khi tải dữ liệu đánh giá AI.
      </div>
    );
  }

  /* ── render ────────────────────────────────────────────── */

  return (
    <div className="flex flex-col min-h-screen bg-[#0b0c10] text-white p-6 md:p-8 space-y-8">
      {/* ── header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
            <Brain size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              AI Evaluation
            </h1>
            <p className="text-white/40 text-sm mt-0.5">
              Báo Cáo Đánh Giá AI — Kết quả phân tích phỏng vấn tự động
            </p>
          </div>
        </div>

        {/* date filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center bg-white/5 border border-white/10 rounded-lg px-3 py-2">
            <Calendar size={14} className="text-white/40 mr-2" />
            <input
              type="date"
              className="bg-transparent text-sm text-white/80 focus:outline-none"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <span className="text-white/30">→</span>
          <div className="flex items-center bg-white/5 border border-white/10 rounded-lg px-3 py-2">
            <Calendar size={14} className="text-white/40 mr-2" />
            <input
              type="date"
              className="bg-transparent text-sm text-white/80 focus:outline-none"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ── stats row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={CheckCircle2}
          label="Đã hoàn thành"
          value={totalCompleted}
          accent="bg-blue-500/20 text-blue-400"
        />
        <StatCard
          icon={BarChart3}
          label="Đã đánh giá"
          value={evaluatedCount}
          accent="bg-green-500/20 text-green-400"
        />
        <StatCard
          icon={TrendingUp}
          label="Điểm trung bình"
          value={avgScore === "—" ? avgScore : `${avgScore}/10`}
          accent="bg-purple-500/20 text-purple-400"
        />
        <StatCard
          icon={Award}
          label="Xuất sắc (≥ 8)"
          value={highScoreCount}
          accent="bg-amber-500/20 text-amber-400"
        />
      </div>

      {/* ── search ── */}
      <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 max-w-md">
        <Search size={16} className="text-white/30 mr-2 shrink-0" />
        <input
          type="text"
          placeholder="Tìm theo tên ứng viên hoặc mã phòng…"
          className="bg-transparent text-sm text-white placeholder:text-white/25 w-full focus:outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* ── session cards ── */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-white/40">
          <Loader2 size={20} className="animate-spin mr-2" />
          Đang tải danh sách đánh giá…
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-white/30">
          <Brain size={48} className="mb-4 opacity-30" />
          <p className="text-sm">
            {searchTerm
              ? "Không tìm thấy kết quả phù hợp."
              : "Chưa có phiên phỏng vấn hoàn thành nào."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((report) => {
            const hasEval = report.metrics?.evaluated_questions > 0;
            const score = report.metrics?.average_score ?? 0;
            const sc = scoreColor(score);

            return (
              <div
                key={report.session_id}
                className="group relative bg-gradient-to-br from-white/[0.04] to-white/[0.02] border border-white/8 hover:border-white/20 rounded-2xl p-5 transition-all duration-200"
              >
                {/* top row */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-white truncate">
                      {report.candidate?.full_name || "Ứng viên"}
                    </h3>
                    <p className="text-xs text-white/40 mt-1 truncate">
                      Mã phòng: {report.room_code}
                    </p>
                  </div>
                  {hasEval ? (
                    <ScoreBadge score={score} />
                  ) : (
                    <span className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium bg-white/8 text-white/45">
                      Chưa chấm
                    </span>
                  )}
                </div>

                {/* meta */}
                <div className="flex items-center gap-4 text-xs text-white/35 mb-5">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {formatDate(report.scheduled_at)}
                  </span>
                  {hasEval && (
                    <span className="flex items-center gap-1">
                      <FileText size={12} />
                      {report.metrics.evaluated_questions}/
                      {report.metrics.total_questions} câu hỏi
                    </span>
                  )}
                </div>

                {/* progress bar */}
                {hasEval && (
                  <div className="mb-5">
                    <div className="flex items-center justify-between text-[11px] text-white/40 mb-1.5">
                      <span>Điểm tổng</span>
                      <span className={sc.text}>{score}/10</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/8 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          score >= 8
                            ? "bg-emerald-500"
                            : score >= 5
                              ? "bg-amber-500"
                              : "bg-red-500"
                        }`}
                        style={{ width: `${Math.min(score * 10, 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-white/6">
                  <Link
                    href={`/reports/${report.session_id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-500/15 px-3 py-1.5 text-xs font-medium text-blue-400 hover:bg-blue-500/25 transition-colors"
                  >
                    <FileText size={13} />
                    Xem báo cáo
                    <ChevronRight size={12} />
                  </Link>

                  <button
                    onClick={() => handleReEvaluate(report.session_id)}
                    disabled={reEvalLoading === report.session_id}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-white/7 px-3 py-1.5 text-xs font-medium text-white/70 hover:bg-white/12 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {reEvalLoading === report.session_id ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <RefreshCw size={13} />
                    )}
                    Đánh giá lại
                  </button>

                  <button
                    onClick={() => handleExportPdf(report)}
                    disabled={pdfLoading === report.session_id}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-white/7 px-3 py-1.5 text-xs font-medium text-white/70 hover:bg-white/12 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
                  >
                    {pdfLoading === report.session_id ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <Download size={13} />
                    )}
                    PDF
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
