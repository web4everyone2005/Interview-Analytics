'use client';

import { useState } from "react";
import { Brain, Eye, EyeOff, ArrowRight, Shield, Loader2, ChevronLeft } from "lucide-react";

interface LoginPageProps {
    onLoginSuccess: () => void;
    onBack: () => void;
}

export function LoginPage({ onLoginSuccess, onBack }: LoginPageProps) {
    const [email, setEmail] = useState("hr@company.vn");
    const [password, setPassword] = useState("password123");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [tab, setTab] = useState<"login" | "register">("login");
    const [regForm, setRegForm] = useState({ name: "", company: "", email: "", password: "" });

    const handleLogin = () => {
        setError("");
        if (!email || !password) { setError("Vui lòng nhập đầy đủ thông tin."); return; }
        setLoading(true);
        setTimeout(() => { setLoading(false); onLoginSuccess(); }, 1400);
    };

    const handleRegister = () => {
        setLoading(true);
        setTimeout(() => { setLoading(false); onLoginSuccess(); }, 1400);
    };

    return (
        <div className="min-h-screen flex overflow-hidden" style={{ background: "var(--background)" }}>
            {/* Left panel — branding */}
            <div className="hidden lg:flex lg:w-1/2 flex-col relative overflow-hidden"
                style={{ background: "linear-gradient(135deg,#0A1122 0%,#0D1830 60%,#091422 100%)" }}>
                {/* Grid pattern */}
                <div className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: `linear-gradient(rgba(79,117,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(79,117,255,0.3) 1px, transparent 1px)`,
                        backgroundSize: "48px 48px",
                    }} />

                {/* Glows */}
                <div className="absolute top-1/4 left-1/3 w-72 h-72 rounded-full opacity-30"
                    style={{ background: "radial-gradient(circle,#4F75FF,transparent 70%)", filter: "blur(60px)" }} />
                <div className="absolute bottom-1/4 right-1/4 w-56 h-56 rounded-full opacity-20"
                    style={{ background: "radial-gradient(circle,#22D3EE,transparent 70%)", filter: "blur(60px)" }} />

                <div className="relative z-10 flex flex-col h-full px-12 py-10">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                            style={{ background: "linear-gradient(135deg,#4F75FF,#22D3EE)" }}>
                            <Brain className="w-5 h-5 text-white" />
                        </div>
                        <span style={{ fontWeight: 700, fontSize: "18px", color: "#fff" }}>SWD Interview</span>
                    </div>

                    {/* Main copy */}
                    <div className="flex-1 flex flex-col justify-center">
                        <p style={{ fontSize: "13px", color: "#22D3EE", fontWeight: 600, letterSpacing: "0.06em" }} className="mb-4 uppercase">
                            AI-Powered Interview Platform
                        </p>
                        <h2 style={{ fontSize: "42px", fontWeight: 900, lineHeight: 1.15, letterSpacing: "-0.03em", color: "#fff" }} className="mb-6">
                            Chấm điểm khách quan,<br />
                            <span style={{ background: "linear-gradient(135deg,#4F75FF,#22D3EE)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                                tiết kiệm thời gian.
                            </span>
                        </h2>
                        <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.55)", lineHeight: 1.75, maxWidth: "380px" }}>
                            Nền tảng phỏng vấn AI với dual-track recording, RAG retrieval và LLM scoring — hoàn toàn tự động.
                        </p>

                        {/* Feature list */}
                        <div className="mt-8 flex flex-col gap-3.5">
                            {[
                                { color: "#4F75FF", text: "Knowledge Base Setup với MongoDB Vector Search" },
                                { color: "#22D3EE", text: "Dual-track audio — zero bleed-over giữa HR và ứng viên" },
                                { color: "#10B981", text: "LLM chấm điểm theo Rubrics, output JSON tức thì" },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                                        style={{ background: item.color + "33" }}>
                                        <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                                    </div>
                                    <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)" }}>{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Testimonial */}
                    <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                        <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)", lineHeight: 1.7 }} className="mb-3">
                            "SWD giúp chúng tôi chuẩn hóa quy trình phỏng vấn cho 50+ vị trí mỗi tháng. Báo cáo AI chính xác và khách quan hơn đánh giá thủ công."
                        </p>
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
                                style={{ background: "linear-gradient(135deg,#4F75FF,#22D3EE)", color: "#fff" }}>N</div>
                            <div>
                                <p style={{ fontSize: "13px", fontWeight: 600, color: "#fff" }}>Nguyễn Thị Hà</p>
                                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>HR Manager · TechCorp VN</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right panel — form */}
            <div className="flex-1 lg:w-1/2 flex flex-col">
                {/* Back button */}
                <div className="p-6">
                    <button onClick={onBack}
                        className="flex items-center gap-1.5 text-sm transition-colors hover:text-white"
                        style={{ color: "var(--muted-foreground)" }}>
                        <ChevronLeft className="w-4 h-4" /> Trang chủ
                    </button>
                </div>

                <div className="flex-1 flex items-center justify-center px-6 py-8">
                    <div className="w-full max-w-sm">
                        {/* Mobile logo */}
                        <div className="flex items-center gap-3 mb-8 lg:hidden">
                            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                                style={{ background: "linear-gradient(135deg,#4F75FF,#22D3EE)" }}>
                                <Brain className="w-4 h-4 text-white" />
                            </div>
                            <span style={{ fontWeight: 700, fontSize: "16px" }}>SWD Interview</span>
                        </div>

                        {/* Tab switcher */}
                        <div className="flex p-1 rounded-xl mb-8" style={{ background: "var(--muted)" }}>
                            {(["login", "register"] as const).map(t => (
                                <button key={t} onClick={() => { setTab(t); setError(""); }}
                                    className="flex-1 py-2 rounded-lg text-sm font-medium transition-all"
                                    style={{
                                        background: tab === t ? "var(--card)" : "transparent",
                                        color: tab === t ? "var(--foreground)" : "var(--muted-foreground)",
                                        boxShadow: tab === t ? "0 1px 3px rgba(0,0,0,0.2)" : "none",
                                    }}>
                                    {t === "login" ? "Đăng nhập" : "Đăng ký"}
                                </button>
                            ))}
                        </div>

                        {tab === "login" ? (
                            <>
                                <div className="mb-7">
                                    <h1 style={{ fontSize: "26px", fontWeight: 800, letterSpacing: "-0.02em", color: "var(--foreground)" }}>
                                        Chào mừng trở lại
                                    </h1>
                                    <p style={{ fontSize: "14px", color: "var(--muted-foreground)" }} className="mt-1">
                                        Đăng nhập vào tài khoản HR của bạn
                                    </p>
                                </div>

                                {/* Error */}
                                {error && (
                                    <div className="mb-4 px-4 py-3 rounded-xl flex items-center gap-2"
                                        style={{ background: "#EF444411", border: "1px solid #EF444433" }}>
                                        <span style={{ fontSize: "13px", color: "#EF4444" }}>{error}</span>
                                    </div>
                                )}

                                {/* Email */}
                                <div className="mb-4">
                                    <label style={{ fontSize: "13px", fontWeight: 500, color: "var(--foreground)", display: "block", marginBottom: "6px" }}>
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        onKeyDown={e => e.key === "Enter" && handleLogin()}
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
                                        <label style={{ fontSize: "13px", fontWeight: 500, color: "var(--foreground)" }}>Mật khẩu</label>
                                        <a href="#" style={{ fontSize: "13px", color: "var(--primary)" }} className="hover:underline">Quên mật khẩu?</a>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            onKeyDown={e => e.key === "Enter" && handleLogin()}
                                            placeholder="••••••••"
                                            className="w-full px-4 py-3 rounded-xl text-sm outline-none pr-11 transition-all"
                                            style={{
                                                background: "var(--input-background)",
                                                border: "1px solid var(--border)",
                                                color: "var(--foreground)",
                                            }}
                                        />
                                        <button
                                            onClick={() => setShowPassword(s => !s)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors"
                                            style={{ color: "var(--muted-foreground)" }}>
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Login btn */}
                                <button
                                    onClick={handleLogin}
                                    disabled={loading}
                                    className="w-full py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-60"
                                    style={{ background: "linear-gradient(135deg,#4F75FF,#22D3EE)", color: "#fff" }}>
                                    {loading ? (
                                        <><Loader2 className="w-4 h-4 animate-spin" /> Đang xác thực...</>
                                    ) : (
                                        <>Đăng nhập <ArrowRight className="w-4 h-4" /></>
                                    )}
                                </button>

                                {/* Divider */}
                                <div className="flex items-center gap-3 my-5">
                                    <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
                                    <span style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>hoặc tiếp tục với</span>
                                    <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
                                </div>

                                {/* Social login */}
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { label: "Google", icon: "G" },
                                        { label: "Microsoft", icon: "M" },
                                    ].map(s => (
                                        <button key={s.label}
                                            className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all hover:bg-white/10"
                                            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)", color: "var(--foreground)" }}>
                                            <span style={{ fontSize: "15px", fontWeight: 700 }}>{s.icon}</span>
                                            {s.label}
                                        </button>
                                    ))}
                                </div>

                                <p className="mt-6 text-center" style={{ fontSize: "13px", color: "var(--muted-foreground)" }}>
                                    Chưa có tài khoản?{" "}
                                    <button onClick={() => setTab("register")} style={{ color: "var(--primary)" }} className="font-medium hover:underline">
                                        Đăng ký miễn phí
                                    </button>
                                </p>
                            </>
                        ) : (
                            <>
                                <div className="mb-7">
                                    <h1 style={{ fontSize: "26px", fontWeight: 800, letterSpacing: "-0.02em", color: "var(--foreground)" }}>
                                        Tạo tài khoản
                                    </h1>
                                    <p style={{ fontSize: "14px", color: "var(--muted-foreground)" }} className="mt-1">
                                        Miễn phí 14 ngày, không cần thẻ tín dụng
                                    </p>
                                </div>

                                <div className="flex flex-col gap-4 mb-6">
                                    {[
                                        { label: "Họ và tên", key: "name", placeholder: "Nguyễn Thị HR", type: "text" },
                                        { label: "Tên công ty", key: "company", placeholder: "TechCorp Vietnam", type: "text" },
                                        { label: "Email công ty", key: "email", placeholder: "hr@company.vn", type: "email" },
                                        { label: "Mật khẩu", key: "password", placeholder: "Tối thiểu 8 ký tự", type: "password" },
                                    ].map(field => (
                                        <div key={field.key}>
                                            <label style={{ fontSize: "13px", fontWeight: 500, color: "var(--foreground)", display: "block", marginBottom: "6px" }}>
                                                {field.label}
                                            </label>
                                            <input
                                                type={field.type}
                                                value={regForm[field.key as keyof typeof regForm]}
                                                onChange={e => setRegForm(f => ({ ...f, [field.key]: e.target.value }))}
                                                placeholder={field.placeholder}
                                                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                                                style={{ background: "var(--input-background)", border: "1px solid var(--border)", color: "var(--foreground)" }}
                                            />
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={handleRegister}
                                    disabled={loading}
                                    className="w-full py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-60 mb-4"
                                    style={{ background: "linear-gradient(135deg,#4F75FF,#22D3EE)", color: "#fff" }}>
                                    {loading ? (
                                        <><Loader2 className="w-4 h-4 animate-spin" /> Đang tạo tài khoản...</>
                                    ) : (
                                        <>Tạo tài khoản <ArrowRight className="w-4 h-4" /></>
                                    )}
                                </button>

                                <p style={{ fontSize: "12px", color: "var(--muted-foreground)", textAlign: "center", lineHeight: 1.6 }}>
                                    Bằng cách đăng ký, bạn đồng ý với{" "}
                                    <a href="#" style={{ color: "var(--primary)" }}>Điều khoản sử dụng</a>{" "}
                                    và{" "}
                                    <a href="#" style={{ color: "var(--primary)" }}>Chính sách bảo mật</a>
                                </p>

                                <p className="mt-5 text-center" style={{ fontSize: "13px", color: "var(--muted-foreground)" }}>
                                    Đã có tài khoản?{" "}
                                    <button onClick={() => setTab("login")} style={{ color: "var(--primary)" }} className="font-medium hover:underline">
                                        Đăng nhập
                                    </button>
                                </p>
                            </>
                        )}

                        {/* Security note */}
                        <div className="mt-8 flex items-center justify-center gap-2">
                            <Shield className="w-3.5 h-3.5" style={{ color: "var(--muted-foreground)" }} />
                            <span style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>
                                Bảo mật SSL · Dữ liệu mã hóa AES-256
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
