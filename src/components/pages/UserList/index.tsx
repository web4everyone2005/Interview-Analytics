"use client";

// ============================================================
// Component - UserList
//
// Gọi useUsers hook và hiển thị danh sách các thành viên HR.
// Style dark theme đồng bộ với SessionList.
// ============================================================

import { useUsers } from "@/hooks/useUser";
import { User as UserModel } from "@/models/user.model";
import { Users, MoreHorizontal } from "lucide-react";

// ─── Avatar ────────────────────────────────────────────────────
function CandidateAvatar({ name, index }: { name: string; index: number }) {
  const AVATAR_COLORS = [
    "from-blue-500 to-cyan-400",
    "from-purple-500 to-pink-400",
    "from-emerald-500 to-teal-400",
    "from-orange-500 to-amber-400",
    "from-rose-500 to-pink-400",
  ];
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

// ─── User Row ──────────────────────────────────────────────────
function UserRow({ user, index }: { user: UserModel; index: number }) {
  return (
    <div
      className="group flex items-center gap-4 px-5 py-4
        border-b border-white/4 last:border-0
        hover:bg-white/3 transition-colors duration-150 cursor-pointer"
    >
      {/* Avatar */}
      <CandidateAvatar name={user.name} index={index} />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-medium leading-tight truncate">
          {user.name}
        </p>
        <p className="text-white/40 text-xs leading-tight mt-0.5 truncate">
          {user.email}
        </p>
      </div>

      {/* Role */}
      <div className="hidden md:flex items-center gap-1.5 text-white/40 text-xs">
        <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-medium text-[10px]">
          {user.role}
        </span>
      </div>

      {/* Status */}
      <div className="flex items-center gap-1.5">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${user.isActive
            ? "bg-emerald-500/10 text-emerald-400"
            : "bg-red-500/10 text-red-400"
            }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${user.isActive ? "bg-emerald-400" : "bg-red-400"}`} />
          {user.isActive ? "Hoạt động" : "Tạm khóa"}
        </span>
      </div>

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
export default function UserList() {
  const { users, isLoading, error } = useUsers();


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
              Thành viên HR tuyển dụng
            </h2>
            {!isLoading && !error && (
              <p className="text-white/30 text-[11px] mt-0.5">
                {users.length} thành viên
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      {isLoading && (
        <div>
          {Array.from({ length: 3 }).map((_, i) => (
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
            Không thể tải dữ liệu thành viên
          </p>
          <p className="text-white/30 text-xs mt-1">
            Kiểm tra kết nối và thử lại
          </p>
        </div>
      )}

      {!isLoading && !error && users.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center px-6">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/5 mb-4">
            <Users size={22} className="text-white/20" />
          </div>
          <p className="text-white/60 text-sm font-medium">
            Không tìm thấy thành viên ứng viên nào
          </p>
        </div>
      )}

      {!isLoading && !error && users.length > 0 && (
        <div>
          {users.map((usr, idx) => (
            <UserRow key={usr.id} user={usr} index={idx} />
          ))}
        </div>
      )}
    </div>
  );
}
