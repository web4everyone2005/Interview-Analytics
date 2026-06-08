"use client";

// ============================================================
// Shared Component - Sidebar
//
// Thanh điều hướng bên trái dùng chung cho layout private.
// Sử dụng Next.js <Link> + usePathname để highlight active route.
// ============================================================

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Plus,
  Video,
  FileBarChart2,
  Settings,
  ChevronRight,
  Brain,
} from "lucide-react";
import { useMe } from "@/hooks/useUser";

// ─── Types ────────────────────────────────────────────────────

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface CoreFlowItem {
  step: string;
  label: string;
  href: string;
  color: string;
}

// ─── Data ─────────────────────────────────────────────────────

const mainMenuItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard/user",
    icon: <LayoutDashboard size={18} />,
  },
  {
    label: "Tạo câu hỏi",
    href: "/dashboard/questions",
    icon: <Plus size={16} />,
  },
  {
    label: "Tạo phỏng vấn",
    href: "/interviews/create",
    icon: <Plus size={16} />,
  },
  {
    label: "Phòng phỏng vấn",
    href: "/interviews/room",
    icon: <Video size={16} />,
  },
  {
    label: "Báo cáo AI",
    href: "/reports",
    icon: <FileBarChart2 size={16} />,
  },
];

const coreFlowItems: CoreFlowItem[] = [
  {
    step: "01",
    label: "Knowledge Base",
    href: "/flow/knowledge-base",
    color: "#3b82f6",
  },
  {
    step: "02",
    label: "Audio Capture",
    href: "/flow/audio-capture",
    color: "#8b5cf6",
  },
  {
    step: "03",
    label: "AI Evaluation",
    href: "/flow/ai-evaluation",
    color: "#22c55e",
  },
];



// ─── Component ────────────────────────────────────────────────

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  const { data, isLoading, error } = useMe();

  return (
    <aside className="flex flex-col w-[240px] min-h-screen bg-[#0f1117] border-r border-white/[0.06] px-3 py-5 shrink-0">
      {/* ── Logo ── */}
      <div className="flex items-center gap-3 px-2 mb-8">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/30">
          <Brain size={18} className="text-white" />
        </div>
        <div>
          <p className="text-white font-semibold text-sm leading-tight tracking-wide">
            SWD Interview
          </p>
          <p className="text-white/40 text-[10px] leading-tight mt-0.5">
            AI-Powered Platform
          </p>
        </div>
      </div>

      {/* ── Menu Chính ── */}
      <div className="mb-6">
        <p className="text-white/30 text-[10px] font-semibold uppercase tracking-widest px-2 mb-2">
          Menu Chính
        </p>

        <nav className="flex flex-col gap-0.5">
          {mainMenuItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                  transition-all duration-150 relative
                  ${active
                    ? "bg-white/10 text-white"
                    : "text-white/50 hover:text-white/80 hover:bg-white/[0.05]"
                  }
                `}
              >
                <span
                  className={`shrink-0 transition-colors duration-150 ${active ? "text-white" : "text-white/40 group-hover:text-white/60"
                    }`}
                >
                  {item.icon}
                </span>

                <span className="flex-1">{item.label}</span>

                {active && (
                  <ChevronRight
                    size={14}
                    className="text-white/50 shrink-0"
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* ── Divider ── */}
      <div className="h-px bg-white/[0.06] mx-2 mb-6" />

      {/* ── Core Flow ── */}
      <div className="mb-6">
        <p className="text-white/30 text-[10px] font-semibold uppercase tracking-widest px-2 mb-2">
          Core Flow
        </p>

        <nav className="flex flex-col gap-0.5">
          {coreFlowItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
                  transition-all duration-150
                  ${active
                    ? "bg-white/10 text-white font-medium"
                    : "text-white/50 hover:text-white/80 hover:bg-white/[0.05]"
                  }
                `}
              >
                {/* Step badge */}
                <span
                  className="shrink-0 text-[11px] font-bold tabular-nums"
                  style={{ color: item.color }}
                >
                  {item.step}
                </span>

                <span className="flex-1">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* ── Spacer ── */}
      <div className="flex-1" />

      {/* ── User Section ── */}
      <div className="mt-4">
        <div className="h-px bg-white/[0.06] mb-4" />

        {/* User info */}
        <div className="flex items-center gap-3 px-2 mb-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 text-white text-xs font-bold shrink-0">
            {data?.name?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium leading-tight truncate">
              {isLoading ? "Đang tải..." : (data?.name ?? "—")}
            </p>
            <p className="text-white/40 text-[11px] leading-tight truncate mt-0.5">
              {isLoading ? "" : (data?.email ?? "—")}
            </p>
          </div>
        </div>

        {/* Settings button */}
        <Link
          href="/settings"
          className="flex items-center justify-center gap-2 w-full py-2 rounded-lg
            bg-white/[0.06] hover:bg-white/10
            text-white/50 hover:text-white/80
            text-sm transition-all duration-150"
        >
          <Settings size={14} />
          <span>Cài đặt</span>
        </Link>
      </div>
    </aside>
  );
}
