"use client";

// ============================================================
// Component - Register
//
// Giao diện Đăng ký tài khoản dành cho HR.
// Phong cách Dark Theme cao cấp đồng bộ 100% với trang Login.
// Có đầy đủ Validation, hiển thị Toast thông báo và tự động đăng nhập.
// ============================================================

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Brain,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  Loader2,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useRegister } from "@/hooks/useRegister";
import { AxiosError } from "axios";

export default function RegisterComponent() {
  const router = useRouter();
  const { trigger, isMutating } = useRegister();

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleName, setRoleName] = useState("CANDIDATE");
  const [showPassword, setShowPassword] = useState(false);

  // UI states
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Validation & Submit handler
  const handleRegister = async () => {
    setError("");
    setToast(null);

    if (!name || !email || !password) {
      setError("Vui lòng nhập đầy đủ họ tên, email và mật khẩu.");
      return;
    }

    // Email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Định dạng email không hợp lệ.");
      return;
    }

    if (password.length < 6) {
      setError("Mật khẩu phải chứa ít nhất 6 ký tự.");
      return;
    }

    try {
      await trigger({
        name,
        email,
        password,
        roleName,
      });

      // Show success toast
      setToast({ message: "Đăng ký tài khoản thành công!", type: "success" });

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push("/dashboard/user");
      }, 2000);
    } catch (err) {
      console.error(err);
      const axiosError = err as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message ?? "Đăng ký thất bại. Vui lòng thử lại sau.";
      setError(message);
      setToast({ message, type: "error" });
    }
  };

  return (
    <div
      className="min-h-screen flex overflow-hidden relative"
      style={{ background: "var(--background)" }}
    >
      {/* ── Toast Notification ────────────────────────────────── */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl text-white font-medium transition-all duration-300 transform translate-y-0 ${toast.type === "success"
            ? "bg-emerald-500 shadow-emerald-500/20 border border-emerald-400/30"
            : "bg-red-500 shadow-red-500/20 border border-red-400/30"
            }`}
          style={{ animation: "slideIn 0.3s ease-out" }}
        >
          {toast.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span className="text-sm">{toast.message}</span>
        </div>
      )}

      {/* CSS Animation for Toast */}
      <style jsx global>{`
        @keyframes slideIn {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>

      {/* ── Left panel — branding (Đồng bộ với LoginPage) ── */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg,#0A1122 0%,#0D1830 60%,#091422 100%)",
        }}
      >
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(rgba(79,117,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(79,117,255,0.3) 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
        />

        {/* Glows */}
        <div
          className="absolute top-1/4 left-1/3 w-72 h-72 rounded-full opacity-30"
          style={{
            background: "radial-gradient(circle,#4F75FF,transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-56 h-56 rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle,#22D3EE,transparent 70%)",
            filter: "blur(60px)",
          }}
        />

        <div className="relative z-10 flex flex-col h-full px-12 py-10">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#4F75FF,#22D3EE)" }}
            >
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span style={{ fontWeight: 700, fontSize: "18px", color: "#fff" }}>
              SWD Interview
            </span>
          </div>

          {/* Main copy */}
          <div className="flex-1 flex flex-col justify-center">
            <p
              style={{
                fontSize: "13px",
                color: "#22D3EE",
                fontWeight: 600,
                letterSpacing: "0.06em",
              }}
              className="mb-4 uppercase"
            >
              AI-Powered Interview Platform
            </p>
            <h2
              style={{
                fontSize: "42px",
                fontWeight: 900,
                lineHeight: 1.15,
                letterSpacing: "-0.03em",
                color: "#fff",
              }}
              className="mb-6"
            >
              Đăng ký tài khoản,
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg,#4F75FF,#22D3EE)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                bắt đầu phỏng vấn ngay.
              </span>
            </h2>
            <p
              style={{
                fontSize: "16px",
                color: "rgba(255,255,255,0.55)",
                lineHeight: 1.75,
                maxWidth: "380px",
              }}
            >
              Tham gia cùng hàng trăm nhà tuyển dụng tối ưu hóa quy trình đánh giá ứng viên bằng trí tuệ nhân tạo.
            </p>
          </div>

          {/* Security note */}
          <div
            className="rounded-2xl p-5"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div className="flex items-center gap-2.5">
              <Shield className="w-5 h-5 text-[#22D3EE]" />
              <div>
                <p style={{ fontSize: "13px", fontWeight: 600, color: "#fff" }}>
                  Bảo mật thông tin tối đa
                </p>
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>
                  Mọi dữ liệu ứng viên & âm thanh đều được mã hóa đầu cuối AES-256.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right panel — Form ── */}
      <div className="flex-1 lg:w-1/2 flex flex-col">
        {/* Back button */}
        <div className="p-6">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-sm transition-colors hover:text-white"
            style={{ color: "var(--muted-foreground)" }}
          >
            <ChevronLeft className="w-4 h-4" /> Quay lại Đăng nhập
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-8">
          <div className="w-full max-w-sm">
            {/* Mobile logo */}
            <div className="flex items-center gap-3 mb-8 lg:hidden">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg,#4F75FF,#22D3EE)" }}
              >
                <Brain className="w-4 h-4 text-white" />
              </div>
              <span style={{ fontWeight: 700, fontSize: "16px" }}>
                SWD Interview
              </span>
            </div>

            {/* Header copy */}
            <div className="mb-7">
              <h1
                style={{
                  fontSize: "26px",
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  color: "var(--foreground)",
                }}
              >
                Đăng ký tài khoản
              </h1>
              <p
                style={{ fontSize: "14px", color: "var(--muted-foreground)" }}
                className="mt-1"
              >
                Nhập thông tin bên dưới để bắt đầu tạo phòng phỏng vấn
              </p>
            </div>

            {/* Error Message banner */}
            {error && (
              <div
                className="mb-4 px-4 py-3 rounded-xl flex items-center gap-2"
                style={{
                  background: "#EF444411",
                  border: "1px solid #EF444433",
                }}
              >
                <AlertCircle size={15} className="text-[#EF4444] shrink-0" />
                <span style={{ fontSize: "13px", color: "#EF4444" }}>
                  {error}
                </span>
              </div>
            )}

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label
                  htmlFor="reg-name"
                  style={{
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "var(--foreground)",
                    display: "block",
                    marginBottom: "6px",
                  }}
                >
                  Họ và tên
                </label>
                <input
                  id="reg-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{
                    background: "var(--input-background)",
                    border: "1px solid var(--border)",
                    color: "var(--foreground)",
                  }}
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="reg-email"
                  style={{
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "var(--foreground)",
                    display: "block",
                    marginBottom: "6px",
                  }}
                >
                  Email công việc
                </label>
                <input
                  id="reg-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hr@company.vn"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{
                    background: "var(--input-background)",
                    border: "1px solid var(--border)",
                    color: "var(--foreground)",
                  }}
                />
              </div>

              {/* Role */}
              <div>
                <label
                  htmlFor="reg-role"
                  style={{
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "var(--foreground)",
                    display: "block",
                    marginBottom: "6px",
                  }}
                >
                  Vai trò (Role)
                </label>
                <select
                  id="reg-role"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all cursor-pointer"
                  style={{
                    background: "var(--input-background)",
                    border: "1px solid var(--border)",
                    color: "var(--foreground)",
                  }}
                >
                  <option value="CANDIDATE" className="bg-[#0b1223] text-white">CANDIDATE</option>
                  <option value="HR" className="bg-[#0b1223] text-white">HR</option>
                  <option value="ADMIN" className="bg-[#0b1223] text-white">ADMIN</option>
                </select>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="reg-password"
                  style={{
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "var(--foreground)",
                    display: "block",
                    marginBottom: "6px",
                  }}
                >
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    id="reg-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleRegister()}
                    placeholder="Tối thiểu 6 ký tự"
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none pr-11 transition-all"
                    style={{
                      background: "var(--input-background)",
                      border: "1px solid var(--border)",
                      color: "var(--foreground)",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors text-white/40 hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleRegister}
              disabled={isMutating}
              className="w-full mt-6 py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-60 cursor-pointer active:scale-95"
              style={{
                background: "linear-gradient(135deg,#4F75FF,#22D3EE)",
                color: "#fff",
              }}
            >
              {isMutating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang xử lý đăng ký...
                </>
              ) : (
                <>
                  Đăng ký ngay <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Switch to login link */}
            <p className="text-center text-xs mt-6" style={{ color: "var(--muted-foreground)" }}>
              Đã có tài khoản?{" "}
              <Link href="/login" className="font-semibold transition-colors hover:text-white" style={{ color: "#22D3EE" }}>
                Đăng nhập ngay
              </Link>
            </p>

            {/* Verification Footer Note */}
            <div className="mt-8 flex items-center justify-center gap-2 border-t border-white/[0.04] pt-6">
              <Shield
                className="w-3.5 h-3.5"
                style={{ color: "var(--muted-foreground)" }}
              />
              <span
                style={{ fontSize: "11px", color: "var(--muted-foreground)" }}
              >
                Hệ thống mã hóa bảo mật chuẩn ngân hàng
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
