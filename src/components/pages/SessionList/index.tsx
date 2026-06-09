"use client";

// ============================================================
// Component - SessionList
//
// Gọi useSessions hook và hiển thị danh sách phiên phỏng vấn.
// Style dark theme khớp với thiết kế sidebar.
// ============================================================

import { useSessions } from "@/hooks/useSession";
import { Session, SessionStatus } from "@/models/session.model";
import { Calendar, Clock, MoreHorizontal, User, Users } from "lucide-react";

// ─── Status Badge ──────────────────────────────────────────────

const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; dot: string }
> = {
  [SessionStatus.SCHEDULED]: {
    label: "Lịch hẹn",
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    dot: "bg-blue-400",
  },
  [SessionStatus.IN_PROGRESS]: {
    label: "Đang xử lý",
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    dot: "bg-purple-400",
  },
  [SessionStatus.COMPLETED]: {
    label: "Hoàn thành",
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    dot: "bg-emerald-400",
  },
  [SessionStatus.CANCELLED]: {
    label: "Đã hủy",
    bg: "bg-red-500/10",
    text: "text-red-400",
    dot: "bg-red-400",
  },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? {
    label: status,
    bg: "bg-white/10",
    text: "text-white/50",
    dot: "bg-white/50",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

// ─── Avatar ────────────────────────────────────────────────────

const AVATAR_COLORS = [
  "from-blue-500 to-cyan-400",
  "from-purple-500 to-pink-400",
  "from-emerald-500 to-teal-400",
  "from-orange-500 to-amber-400",
  "from-rose-500 to-pink-400",
];

function CandidateAvatar({ name, index }: { name: string; index: number }) {
  const color = AVATAR_COLORS[index % AVATAR_COLORS.length];
  const initial = name?.[0]?.toUpperCase() ?? "?";
  return (
    <div
      className={`flex items-center justify-center w-9 h-9 rounded-full bg-linear-to-br ${color} text-white text-sm font-bold shrink-0 shadow-lg`}
    >
      {initial}
    </div>
  );
}

// ─── Skeleton Row ──────────────────────────────────────────────

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 px-5 py-4 animate-pulse">
      <div className="w-9 h-9 rounded-full bg-white/6 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 bg-white/6 rounded w-40" />
        <div className="h-3 bg-white/4 rounded w-28" />
      </div>
      <div className="h-3 bg-white/6 rounded w-24 hidden sm:block" />
      <div className="h-6 bg-white/6 rounded-full w-20" />
      <div className="w-6 h-6 bg-white/4 rounded" />
    </div>
  );
}

// ─── Session Row ───────────────────────────────────────────────

function SessionRow({ session, index }: { session: Session; index: number }) {
  const date = new Date(session.createdAt);
  const formattedDate = date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const formattedTime = date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className="group flex items-center gap-4 px-5 py-4
        border-b border-white/4 last:border-0
        hover:bg-white/3 transition-colors duration-150 cursor-pointer"
    >
      {/* Avatar */}
      <CandidateAvatar name={session.candidate_name} index={index} />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-medium leading-tight truncate">
          {session.candidate_name}
        </p>
        <p className="text-white/40 text-xs leading-tight mt-0.5 truncate">
          {session.title}
        </p>
      </div>

      {/* HR */}
      <div className="hidden md:flex items-center gap-1.5 text-white/40 text-xs">
        <User size={12} />
        <span>{session.hr_id?.name ?? "—"}</span>
      </div>

      {/* Room code */}
      <div className="hidden lg:flex items-center gap-1.5">
        <span className="text-white/20 text-[10px] font-mono tracking-wider">
          #{session.room_code}
        </span>
      </div>

      {/* Date */}
      <div className="hidden sm:flex items-center gap-1.5 text-white/40 text-xs">
        <Clock size={12} />
        <span>
          {formattedTime} · {formattedDate}
        </span>
      </div>

      {/* Status */}
      <StatusBadge status={session.status} />

      {/* Actions */}
      <button
        className="p-1.5 rounded-lg text-white/20 hover:text-white/60 hover:bg-white/6
          transition-all duration-150 opacity-0 group-hover:opacity-100"
        aria-label="Thêm tùy chọn"
      >
        <MoreHorizontal size={16} />
      </button>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────

export default function SessionList() {
  const { sessions, isLoading, error } = useSessions();

  return (
    <div className="rounded-2xl bg-white/3 border border-white/6 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/6">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/10">
            <Users size={15} className="text-blue-400" />
          </div>
          <div>
            <h2 className="text-white text-sm font-semibold">
              Phỏng vấn gần đây
            </h2>
            {!isLoading && !error && (
              <p className="text-white/30 text-[11px] mt-0.5">
                {sessions.length} phiên phỏng vấn
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-white/30 text-xs">
          <Calendar size={12} />
          <span>Mới nhất trước</span>
        </div>
      </div>

      {/* Content */}
      {isLoading && (
        <div>
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </div>
      )}

      {error && !isLoading && (
        <div className="flex flex-col items-center justify-center py-16 text-center px-6">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-red-500/10 mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <p className="text-white/60 text-sm font-medium">
            Không thể tải dữ liệu
          </p>
          <p className="text-white/30 text-xs mt-1">
            Kiểm tra kết nối và thử lại
          </p>
        </div>
      )}

      {!isLoading && !error && sessions.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center px-6">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/5 mb-4">
            <Users size={22} className="text-white/20" />
          </div>
          <p className="text-white/60 text-sm font-medium">
            Chưa có phiên phỏng vấn nào
          </p>
          <p className="text-white/30 text-xs mt-1">
            Tạo phỏng vấn đầu tiên để bắt đầu
          </p>
        </div>
      )}

      {!isLoading && !error && sessions.length > 0 && (
        <div>
          {sessions.map((session, idx) => (
            <SessionRow key={session.id} session={session} index={idx} />
          ))}
        </div>
      )}
    </div>
  );
}
