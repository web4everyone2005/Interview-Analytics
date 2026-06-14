"use client";

// ============================================================
// Page - Login  (/login)
//
// Gọi useLogin hook để xác thực với BE.
// Redirect đến /dashboard/user sau khi đăng nhập thành công.
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
} from "lucide-react";
import { useLogin } from "@/hooks/useLogin";
import { AxiosError } from "axios";

export default function LoginPage() {
  const router = useRouter();
  const { trigger, isMutating } = useLogin();

  const [email, setEmail] = useState("hr@company.vn");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // ── Login handler ─────────────────────────────────────────
  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    try {
      await trigger({ email, password });
      // Token đã được lưu vào localStorage bởi auth.service
      router.push("/dashboard/user");
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message ?? "Đăng nhập thất bại. Vui lòng thử lại.";
      setError(message);
    }
  };


  return (
    <div
      className="min-h-screen flex overflow-hidden"
      style={{ background: "var(--background)" }}
    >
      {/* ── Left panel — branding ── */}
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
              Chấm điểm khách quan,
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg,#4F75FF,#22D3EE)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                tiết kiệm thời gian.
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
              Nền tảng phỏng vấn AI với dual-track recording, RAG retrieval và
              LLM scoring — hoàn toàn tự động.
            </p>

            {/* Feature list */}
            <div className="mt-8 flex flex-col gap-3.5">
              {[
                {
                  color: "#4F75FF",
                  text: "Knowledge Base Setup với MongoDB Vector Search",
                },
                {
                  color: "#22D3EE",
                  text: "Dual-track audio — zero bleed-over giữa HR và ứng viên",
                },
                {
                  color: "#10B981",
                  text: "LLM chấm điểm theo Rubrics, output JSON tức thì",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: item.color + "33" }}
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ background: item.color }}
                    />
                  </div>
                  <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)" }}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonial */}
          <div
            className="rounded-2xl p-5"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <p
              style={{
                fontSize: "14px",
                color: "rgba(255,255,255,0.7)",
                lineHeight: 1.7,
              }}
              className="mb-3"
            >
              &ldquo;SWD giúp chúng tôi chuẩn hóa quy trình phỏng vấn cho 50+
              vị trí mỗi tháng. Báo cáo AI chính xác và khách quan hơn đánh giá
              thủ công.&rdquo;
            </p>
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
                style={{
                  background: "linear-gradient(135deg,#4F75FF,#22D3EE)",
                  color: "#fff",
                }}
              >
                N
              </div>
              <div>
                <p style={{ fontSize: "13px", fontWeight: 600, color: "#fff" }}>
                  Nguyễn Thị Hà
                </p>
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>
                  HR Manager · TechCorp VN
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex-1 lg:w-1/2 flex flex-col">
        {/* Back button */}
        <div className="p-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-sm transition-colors hover:text-white"
            style={{ color: "var(--muted-foreground)" }}
          >
            <ChevronLeft className="w-4 h-4" /> Trang chủ
          </button>
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

            {/* ── Login form ── */}
            <>
                <div className="mb-7">
                  <h1
                    style={{
                      fontSize: "26px",
                      fontWeight: 800,
                      letterSpacing: "-0.02em",
                      color: "var(--foreground)",
                    }}
                  >
                    Chào mừng trở lại
                  </h1>
                  <p
                    style={{ fontSize: "14px", color: "var(--muted-foreground)" }}
                    className="mt-1"
                  >
                    Đăng nhập vào tài khoản HR của bạn
                  </p>
                </div>

                {/* Error */}
                {error && (
                  <div
                    className="mb-4 px-4 py-3 rounded-xl flex items-center gap-2"
                    style={{
                      background: "#EF444411",
                      border: "1px solid #EF444433",
                    }}
                  >
                    <span style={{ fontSize: "13px", color: "#EF4444" }}>
                      {error}
                    </span>
                  </div>
                )}

                {/* Email */}
                <div className="mb-4">
                  <label
                    htmlFor="login-email"
                    style={{
                      fontSize: "13px",
                      fontWeight: 500,
                      color: "var(--foreground)",
                      display: "block",
                      marginBottom: "6px",
                    }}
                  >
                    Email
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    placeholder="hr@company.vn"
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{
                      background: "var(--input-background)",
                      border: "1px solid var(--border)",
                      color: "var(--foreground)",
                    }}
                  />
                </div>

                {/* Password */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="login-password"
                      style={{
                        fontSize: "13px",
                        fontWeight: 500,
                        color: "var(--foreground)",
                      }}
                    >
                      Mật khẩu
                    </label>
                    <a
                      href="#"
                      style={{ fontSize: "13px", color: "var(--primary)" }}
                      className="hover:underline"
                    >
                      Quên mật khẩu?
                    </a>
                  </div>
                  <div className="relative">
                    <input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                      placeholder="••••••••"
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
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Login btn */}
                <button
                  id="login-submit"
                  onClick={handleLogin}
                  disabled={isMutating}
                  className="w-full py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-60"
                  style={{
                    background: "linear-gradient(135deg,#4F75FF,#22D3EE)",
                    color: "#fff",
                  }}
                >
                  {isMutating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Đang xác thực...
                    </>
                  ) : (
                    <>
                      Đăng nhập <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-center text-xs mt-6" style={{ color: "var(--muted-foreground)" }}>
                  Chưa có tài khoản?{" "}
                  <Link href="/register" className="font-semibold transition-colors hover:text-white" style={{ color: "#22D3EE" }}>
                    Đăng ký tài khoản mới
                  </Link>
                </p>

              </>


            {/* Security note */}
            <div className="mt-8 flex items-center justify-center gap-2">
              <Shield
                className="w-3.5 h-3.5"
                style={{ color: "var(--muted-foreground)" }}
              />
              <span
                style={{ fontSize: "12px", color: "var(--muted-foreground)" }}
              >
                Bảo mật SSL · Dữ liệu mã hóa AES-256
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
