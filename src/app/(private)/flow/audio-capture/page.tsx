"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useSessions } from "@/hooks/useSession";
import { Session, SessionStatus } from "@/models/session.model";
import { StatusPill } from "@/components/pages/CreateInterview/Panel";
import {
  Mic,
  Radio,
  Video,
  Clock,
  Users,
  ArrowRight,
  Search,
  Loader2,
  AlertCircle,
} from "lucide-react";

// ─── Filter tabs ──────────────────────────────────────────────
type FilterTab = "ALL" | "SCHEDULED" | "IN_PROGRESS";

const TABS: { key: FilterTab; label: string }[] = [
  { key: "ALL", label: "Tất cả" },
  { key: "SCHEDULED", label: "Đã lên lịch" },
  { key: "IN_PROGRESS", label: "Đang diễn ra" },
];

// ─── Helpers ──────────────────────────────────────────────────
function isActiveSession(session: Session): boolean {
  const s = session.status as string;
  return (
    s === SessionStatus.SCHEDULED ||
    s === SessionStatus.IN_PROGRESS ||
    s === SessionStatus.ONGOING
  );
}

function statusBorderClass(status: string): string {
  if (status === SessionStatus.IN_PROGRESS || status === SessionStatus.ONGOING)
    return "border-emerald-500/40 hover:border-emerald-400/60";
  return "border-blue-500/30 hover:border-blue-400/50";
}

function statusGlowClass(status: string): string {
  if (status === SessionStatus.IN_PROGRESS || status === SessionStatus.ONGOING)
    return "shadow-emerald-500/5";
  return "shadow-blue-500/5";
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Mic pulse animation (for active sessions) ───────────────
function MicPulse() {
  return (
    <span className="relative flex h-8 w-8 items-center justify-center">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/30" />
      <span className="relative flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20">
        <Mic size={14} className="text-emerald-300" />
      </span>
    </span>
  );
}

// ─── Session Card ─────────────────────────────────────────────
function SessionCard({ session }: { session: Session }) {
  const status = session.status as string;
  const isLive =
    status === SessionStatus.IN_PROGRESS || status === SessionStatus.ONGOING;
  const jobTitle =
    typeof session.job_position_id === "object"
      ? session.job_position_id?.title
      : null;
  const candidateName =
    typeof session.candidate_profile_id === "object"
      ? session.candidate_profile_id?.full_name
      : session.candidate_name;
  const candidateEmail =
    typeof session.candidate_profile_id === "object"
      ? session.candidate_profile_id?.email
      : session.candidate_email;

  return (
    <div
      className={`group relative rounded-xl border bg-white/[0.03] p-5 transition-all duration-200 hover:bg-white/[0.05] ${statusBorderClass(status)} shadow-lg ${statusGlowClass(status)}`}
    >
      {/* Top row: status + mic indicator */}
      <div className="mb-4 flex items-start justify-between">
        <StatusPill tone={isLive ? "green" : "blue"}>
          {isLive ? (
            <span className="flex items-center gap-1.5">
              <Radio size={11} className="animate-pulse" />
              Đang diễn ra
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              <Clock size={11} />
              Đã lên lịch
            </span>
          )}
        </StatusPill>

        {isLive && <MicPulse />}
      </div>

      {/* Job position */}
      <h3 className="mb-1 text-sm font-semibold text-white line-clamp-1">
        {jobTitle || "Vị trí chưa xác định"}
      </h3>

      {/* Candidate info */}
      <div className="mb-4 flex items-center gap-2 text-xs text-white/50">
        <Users size={13} className="shrink-0" />
        <span className="truncate">
          {candidateName || "Ứng viên"}{" "}
          {candidateEmail && (
            <span className="text-white/30">· {candidateEmail}</span>
          )}
        </span>
      </div>

      {/* Meta row */}
      <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-white/35">
        <span className="flex items-center gap-1">
          <Clock size={11} />
          {formatDate(session.scheduled_at || session.createdAt)}
        </span>
        <span className="font-mono tracking-wider">
          #{session.room_code}
        </span>
      </div>

      {/* Join button */}
      <Link
        href={`/dashboard/interviews/${session.room_code}`}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-500/90 px-4 py-2.5 text-xs font-semibold text-white transition-all hover:bg-blue-400 active:scale-[0.98]"
      >
        <Video size={14} />
        Vào phòng ghi âm
        <ArrowRight
          size={14}
          className="ml-auto transition-transform group-hover:translate-x-0.5"
        />
      </Link>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────
export default function AudioCapturePage() {
  const { sessions, isLoading, error } = useSessions({
    refreshInterval: 15_000, // live-poll every 15 s
  });
  const [activeTab, setActiveTab] = useState<FilterTab>("ALL");
  const [search, setSearch] = useState("");

  // Filter to active sessions, then apply tab + search
  const filtered = useMemo(() => {
    let list = sessions.filter(isActiveSession);

    if (activeTab === "SCHEDULED") {
      list = list.filter((s) => s.status === SessionStatus.SCHEDULED);
    } else if (activeTab === "IN_PROGRESS") {
      list = list.filter(
        (s) =>
          s.status === SessionStatus.IN_PROGRESS ||
          s.status === SessionStatus.ONGOING
      );
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((s) => {
        const job =
          typeof s.job_position_id === "object"
            ? s.job_position_id?.title
            : "";
        const name =
          typeof s.candidate_profile_id === "object"
            ? s.candidate_profile_id?.full_name
            : s.candidate_name || "";
        return (
          (job || "").toLowerCase().includes(q) ||
          (name || "").toLowerCase().includes(q) ||
          s.room_code.toLowerCase().includes(q)
        );
      });
    }

    // Sort: in-progress first, then by scheduled_at descending
    return list.sort((a, b) => {
      const aLive =
        a.status === SessionStatus.IN_PROGRESS ||
        a.status === SessionStatus.ONGOING;
      const bLive =
        b.status === SessionStatus.IN_PROGRESS ||
        b.status === SessionStatus.ONGOING;
      if (aLive && !bLive) return -1;
      if (!aLive && bLive) return 1;
      return (
        new Date(b.scheduled_at || b.createdAt).getTime() -
        new Date(a.scheduled_at || a.createdAt).getTime()
      );
    });
  }, [sessions, activeTab, search]);

  // Count badges
  const counts = useMemo(() => {
    const active = sessions.filter(isActiveSession);
    return {
      ALL: active.length,
      SCHEDULED: active.filter((s) => s.status === SessionStatus.SCHEDULED)
        .length,
      IN_PROGRESS: active.filter(
        (s) =>
          s.status === SessionStatus.IN_PROGRESS ||
          s.status === SessionStatus.ONGOING
      ).length,
    };
  }, [sessions]);

  return (
    <div className="min-h-screen bg-[#0f1117] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* ── Header ─────────────────────────────────────────── */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15">
              <Mic size={20} className="text-blue-400" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-white sm:text-2xl">
                Audio Capture — Phòng Ghi Âm
              </h1>
              <p className="text-xs text-white/40">
                Tham gia phiên phỏng vấn đang hoạt động để ghi âm và giám sát
              </p>
            </div>
          </div>
        </div>

        {/* ── Toolbar: tabs + search ─────────────────────────── */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Tabs */}
          <div className="flex gap-1 rounded-lg bg-white/[0.04] p-1">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                  activeTab === tab.key
                    ? "bg-white/10 text-white shadow-sm"
                    : "text-white/45 hover:text-white/70"
                }`}
              >
                {tab.label}
                {counts[tab.key] > 0 && (
                  <span
                    className={`ml-1.5 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[10px] font-semibold ${
                      activeTab === tab.key
                        ? "bg-blue-500/25 text-blue-300"
                        : "bg-white/8 text-white/40"
                    }`}
                  >
                    {counts[tab.key]}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative max-w-xs w-full sm:w-auto">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
            />
            <input
              type="text"
              placeholder="Tìm theo vị trí, ứng viên, mã phòng..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-black/20 py-2 pl-8 pr-3 text-xs text-white outline-none transition-colors placeholder:text-white/25 focus:border-blue-400/70"
            />
          </div>
        </div>

        {/* ── Content ────────────────────────────────────────── */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 text-white/40">
            <Loader2 size={28} className="mb-3 animate-spin" />
            <p className="text-sm">Đang tải danh sách phiên phỏng vấn...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 text-red-400/70">
            <AlertCircle size={28} className="mb-3" />
            <p className="text-sm">Không thể tải dữ liệu. Vui lòng thử lại.</p>
          </div>
        ) : filtered.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/8 py-20">
            <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.04]">
              <Radio size={24} className="text-white/20" />
            </span>
            <p className="mb-1 text-sm font-medium text-white/50">
              Không có phiên nào
            </p>
            <p className="max-w-xs text-center text-xs text-white/30">
              {activeTab === "ALL"
                ? "Hiện chưa có phiên phỏng vấn nào đang hoạt động hoặc được lên lịch."
                : `Không tìm thấy phiên nào với trạng thái "${
                    activeTab === "SCHEDULED" ? "Đã lên lịch" : "Đang diễn ra"
                  }".`}
            </p>
          </div>
        ) : (
          /* Grid */
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((session) => (
              <SessionCard
                key={session.id || session._id}
                session={session}
              />
            ))}
          </div>
        )}

        {/* ── Footer hint ────────────────────────────────────── */}
        {!isLoading && !error && filtered.length > 0 && (
          <p className="mt-6 text-center text-[11px] text-white/20">
            Tự động cập nhật mỗi 15 giây · {filtered.length} phiên hiển thị
          </p>
        )}
      </div>
    </div>
  );
}
