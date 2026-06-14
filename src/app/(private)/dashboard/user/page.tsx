"use client";

// ============================================================
// Page - Dashboard (User)
//
// Trang dashboard chính sau khi đăng nhập.
// Header: chào mừng + nút tạo phỏng vấn.
// Body: Danh sách phiên phỏng vấn (SessionList).
// ============================================================

import { Plus } from "lucide-react";
import { useMe } from "@/hooks/useUser";
import SessionList from "@/components/features/sessions/SessionList";

export default function DashboardUserPage() {
  const { data: user, isLoading: userLoading } = useMe();

  // Lấy ngày hiện tại hiển thị theo tiếng Việt
  const today = new Date().toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const greeting = userLoading
    ? "Đang tải..."
    : `Xin chào, ${user?.name ?? "HR Manager"} 👋`;

  return (
    <div className="min-h-full">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-white text-2xl font-bold tracking-tight">
            {greeting}
          </h1>
          <p className="text-white/40 text-sm mt-1 capitalize">{today}</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl
              bg-blue-500 hover:bg-blue-400 active:scale-95
              text-white text-sm font-semibold
              shadow-lg shadow-blue-500/25
              transition-all duration-150 whitespace-nowrap"
          >
            <Plus size={16} />
            Import Câu Hỏi
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl
              bg-blue-500 hover:bg-blue-400 active:scale-95
              text-white text-sm font-semibold
              shadow-lg shadow-blue-500/25
              transition-all duration-150 whitespace-nowrap"
          >
            <Plus size={16} />
            Tạo Câu Hỏi
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl
              bg-blue-500 hover:bg-blue-400 active:scale-95
              text-white text-sm font-semibold
              shadow-lg shadow-blue-500/25
              transition-all duration-150 whitespace-nowrap"
          >
            <Plus size={16} />
            Tạo phỏng vấn mới
          </button>
        </div>
      </div>

      {/* ── Session List ────────────────────────────────────── */}
      <SessionList />
    </div>
  );
}
