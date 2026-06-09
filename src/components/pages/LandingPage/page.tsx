'use client';
import { useState, useEffect } from "react";
import Link from "next/link";
import { Brain, Mic, FileText, ArrowRight, CheckCircle2, Play, Zap, BarChart2, Star } from "lucide-react";

// interface LandingPageProps {
//     onLogin: () => void;
// }

const features = [
    {
        stage: "01",
        color: "#4F75FF",
        icon: FileText,
        title: "Knowledge Base Setup",
        subtitle: "Giai đoạn 1 — Tạo phỏng vấn",
        desc: "HR tạo phiên, upload JD & Rubrics. Hệ thống tự động chunking, embedding và lưu vector vào MongoDB Atlas, gán chặt với interview_id duy nhất.",
        bullets: ["Auto-generate Interview ID", "PDF/DOCX/XLSX embedding", "MongoDB Vector Search indexing", "Bảo mật link WebRTC"],
    },
    {
        stage: "02",
        color: "#22D3EE",
        icon: Mic,
        title: "Audio Capture",
        subtitle: "Giai đoạn 2 — Tiến hành phỏng vấn",
        desc: "Công nghệ dual-track client-side recording qua MediaRecorder API. Track A (HR) và Track B (ứng viên) được ghi âm độc lập — đảm bảo dữ liệu siêu sạch cho STT.",
        bullets: ["WebRTC real-time video call", "Dual-track audio recording", "Socket.io sync đồng loạt", "Zero audio bleed-over"],
    },
    {
        stage: "03",
        color: "#10B981",
        icon: Brain,
        title: "AI Evaluation",
        subtitle: "Giai đoạn 3 — Bóc băng & Chấm điểm",
        desc: "STT chuyển đổi hai track riêng biệt, RAG retrieval kéo tiêu chí chấm điểm từ Vector DB, LLM đối chiếu và trả về JSON điểm số chi tiết.",
        bullets: ["Speech-to-Text độc lập", "RAG retrieval chính xác", "LLM scoring với Rubrics", "Dashboard báo cáo real-time"],
    },
];

const stats = [
    { value: "98%", label: "Độ chính xác STT" },
    { value: "<30s", label: "Xử lý AI mỗi câu" },
    { value: "247+", label: "Vector chunks trung bình" },
    { value: "4.9★", label: "Đánh giá HR" },
];

const testimonials = [
    { name: "Nguyễn Thị Hà", role: "HR Manager · TechCorp VN", avatar: "N", text: "SWD giúp tôi tiết kiệm 3 giờ chấm điểm mỗi tuần. Báo cáo AI khách quan hơn nhiều so với đánh giá thủ công.", score: 5 },
    { name: "Trần Văn Khoa", role: "Talent Acquisition · StartupX", avatar: "T", text: "Dual-track recording là game changer. Không còn tình trạng transcript bị lẫn tiếng HR và ứng viên nữa.", score: 5 },
    { name: "Lê Minh Phương", role: "Head of HR · MegaCorp", avatar: "L", text: "Tích hợp RAG với MongoDB cực kỳ ấn tượng. Rubrics được áp dụng nhất quán cho mọi ứng viên.", score: 5 },
];

export function LandingPage() {
    const [scrolled, setScrolled] = useState(false);
    const [activeFeature, setActiveFeature] = useState(0);

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", handler);
        return () => window.removeEventListener("scroll", handler);
    }, []);

    useEffect(() => {
        const iv = setInterval(() => setActiveFeature(i => (i + 1) % 3), 4000);
        return () => clearInterval(iv);
    }, []);

    return (
        <div className="min-h-screen overflow-x-hidden" style={{ background: "var(--background)", color: "var(--foreground)" }}>
            {/* Ambient glow */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
                <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-20"
                    style={{ background: "radial-gradient(circle, #4F75FF 0%, transparent 70%)", filter: "blur(80px)" }} />
                <div className="absolute top-48 right-1/4 w-80 h-80 rounded-full opacity-15"
                    style={{ background: "radial-gradient(circle, #22D3EE 0%, transparent 70%)", filter: "blur(80px)" }} />
                <div className="absolute bottom-0 left-1/3 w-72 h-72 rounded-full opacity-10"
                    style={{ background: "radial-gradient(circle, #10B981 0%, transparent 70%)", filter: "blur(80px)" }} />
            </div>

            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
                style={{
                    background: scrolled ? "rgba(8,14,28,0.85)" : "transparent",
                    backdropFilter: scrolled ? "blur(12px)" : "none",
                    borderBottom: scrolled ? "1px solid rgba(255,255,255,0.07)" : "none",
                }}>
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                            style={{ background: "linear-gradient(135deg, #4F75FF 0%, #22D3EE 100%)" }}>
                            <Brain className="w-4 h-4 text-white" />
                        </div>
                        <span style={{ fontWeight: 700, fontSize: "16px", letterSpacing: "-0.01em" }}>SWD Interview</span>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        {["Tính năng", "Core Flow", "Đánh giá", "Bảng giá"].map(item => (
                            <a key={item} href="#" style={{ fontSize: "14px", color: "var(--muted-foreground)" }}
                                className="hover:text-white transition-colors">{item}</a>
                        ))}
                    </div>
                    <Link href="/login">
                        <button className="hidden md:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95"
                            style={{
                                background: "linear-gradient(135deg,#4F75FF,#22D3EE)",
                                color: "#fff",
                                boxShadow: "0 4px 20px rgba(79,117,255,0.4)"
                            }}>
                            Đăng nhập <ArrowRight className="w-4 h-4 ml-1" />
                        </button>
                    </Link>
                </div>
            </nav>

            {/* Hero */}
            <section className="relative pt-32 pb-24 px-6" style={{ zIndex: 1 }}>
                <div className="max-w-5xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
                        style={{ background: "#4F75FF22", border: "1px solid #4F75FF44", fontSize: "13px", color: "#22D3EE" }}>
                        <Zap className="w-3.5 h-3.5" />
                        Powered by RAG + LLM + WebRTC
                    </div>

                    <h1 className="mb-6" style={{ fontSize: "clamp(40px,7vw,72px)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.03em" }}>
                        Phỏng vấn thông minh hơn
                        <br />
                        <span style={{ background: "linear-gradient(135deg,#4F75FF,#22D3EE)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                            với AI chấm điểm tự động
                        </span>
                    </h1>

                    <p className="mx-auto mb-10" style={{ fontSize: "18px", color: "var(--muted-foreground)", lineHeight: 1.75, maxWidth: "600px" }}>
                        Ghi âm dual-track, bóc băng chính xác, chấm điểm theo Rubrics bằng AI — tiết kiệm 3+ giờ HR mỗi tuần, tăng tính khách quan 100%.
                    </p>



                    <p className="mt-5" style={{ fontSize: "13px", color: "var(--muted-foreground)" }}>
                        Không cần thẻ tín dụng · Miễn phí 14 ngày · Setup trong 5 phút
                    </p>
                </div>

                {/* Hero visual */}
                <div className="max-w-5xl mx-auto mt-16 relative">
                    <div className="rounded-3xl overflow-hidden border"
                        style={{ border: "1px solid rgba(255,255,255,0.1)", background: "var(--card)", boxShadow: "0 40px 120px rgba(0,0,0,0.5)" }}>
                        {/* Mock browser chrome */}
                        <div className="flex items-center gap-2 px-4 py-3" style={{ background: "#0A1122", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full" style={{ background: "#EF4444" }} />
                                <div className="w-3 h-3 rounded-full" style={{ background: "#F59E0B" }} />
                                <div className="w-3 h-3 rounded-full" style={{ background: "#10B981" }} />
                            </div>
                            <div className="flex-1 flex justify-center">
                                <div className="px-4 py-1 rounded-lg text-xs" style={{ background: "rgba(255,255,255,0.05)", color: "var(--muted-foreground)" }}>
                                    swd.interview.vn/room/ITV-2025-0547
                                </div>
                            </div>
                        </div>

                        {/* Mock interview room */}
                        <div className="grid grid-cols-5 min-h-64">
                            {/* Left panel: video feeds */}
                            <div className="col-span-2 p-4 flex flex-col gap-3" style={{ borderRight: "1px solid rgba(255,255,255,0.06)", background: "#080E1C" }}>
                                {/* HR video mock */}
                                <div className="flex-1 rounded-2xl flex flex-col items-center justify-center gap-2"
                                    style={{ background: "#0A1122", minHeight: "100px" }}>
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg"
                                        style={{ background: "linear-gradient(135deg,#22D3EE,#4F75FF)", color: "#fff" }}>H</div>
                                    <div className="flex gap-0.5 items-end h-4">
                                        {[3, 6, 4, 8, 5, 7, 3, 6].map((h, i) => (
                                            <div key={i} className="w-1 rounded-full" style={{ height: `${h * 1.5}px`, background: "#22D3EE", opacity: 0.7 }} />
                                        ))}
                                    </div>
                                    <span style={{ fontSize: "10px", color: "#6B7A99" }}>HR · Track A</span>
                                </div>
                                {/* Candidate video mock */}
                                <div className="flex-1 rounded-2xl flex flex-col items-center justify-center gap-2"
                                    style={{ background: "#0A1122", border: "2px solid #4F75FF33", minHeight: "100px" }}>
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg"
                                        style={{ background: "linear-gradient(135deg,#131E35,#1A2540)", color: "#4F75FF", border: "2px solid #4F75FF33" }}>N</div>
                                    <div className="flex gap-0.5 items-end h-4">
                                        {[5, 8, 6, 10, 7, 9, 5, 8].map((h, i) => (
                                            <div key={i} className="w-1 rounded-full" style={{ height: `${h * 1.5}px`, background: "#4F75FF", opacity: 0.7 }} />
                                        ))}
                                    </div>
                                    <span style={{ fontSize: "10px", color: "#6B7A99" }}>Ứng viên · Track B</span>
                                </div>
                            </div>

                            {/* Right: Question panel */}
                            <div className="col-span-3 p-5 flex flex-col gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#EF4444" }} />
                                    <span style={{ fontSize: "12px", color: "#EF4444", fontWeight: 600 }}>REC</span>
                                    <span style={{ fontSize: "12px", color: "#6B7A99", marginLeft: "auto" }}>00:04:23</span>
                                </div>
                                <div className="rounded-xl p-4" style={{ background: "#0F1829", border: "1px solid rgba(79,117,255,0.2)" }}>
                                    <div className="flex gap-2 mb-3">
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: "#4F75FF22", color: "#4F75FF" }}>Kỹ thuật</span>
                                        <span style={{ fontSize: "10px", color: "#6B7A99" }}>Q02 / 04</span>
                                    </div>
                                    <p style={{ fontSize: "13px", color: "var(--foreground)", lineHeight: 1.6 }}>
                                        Hãy giải thích sự khác biệt giữa Virtual DOM và Real DOM trong React...
                                    </p>
                                </div>
                                <div className="mt-auto flex gap-2">
                                    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "#1A2540" }}>
                                        <div className="h-full rounded-full" style={{ width: "62%", background: "linear-gradient(90deg,#4F75FF,#22D3EE)" }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Floating badges */}
                    <div className="absolute -left-6 top-12 px-3 py-2 rounded-xl shadow-xl hidden md:flex items-center gap-2"
                        style={{ background: "#0F1829", border: "1px solid #10B98133" }}>
                        <CheckCircle2 className="w-4 h-4" style={{ color: "#10B981" }} />
                        <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--foreground)" }}>AI đang chấm điểm...</span>
                    </div>
                    <div className="absolute -right-6 bottom-12 px-3 py-2 rounded-xl shadow-xl hidden md:flex items-center gap-2"
                        style={{ background: "#0F1829", border: "1px solid #22D3EE33" }}>
                        <Brain className="w-4 h-4" style={{ color: "#22D3EE" }} />
                        <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--foreground)" }}>Điểm: <strong style={{ color: "#22D3EE" }}>87/100</strong></span>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="relative py-12 px-6" style={{ zIndex: 1, borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="max-w-4xl mx-auto grid grid-cols-4 gap-8">
                    {stats.map(s => (
                        <div key={s.label} className="text-center">
                            <p style={{ fontSize: "36px", fontWeight: 900, letterSpacing: "-0.03em", background: "linear-gradient(135deg,#4F75FF,#22D3EE)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                                {s.value}
                            </p>
                            <p style={{ fontSize: "13px", color: "var(--muted-foreground)", marginTop: "4px" }}>{s.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Core Flow section */}
            <section className="relative py-24 px-6" style={{ zIndex: 1 }}>
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
                            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", fontSize: "13px", color: "var(--muted-foreground)" }}>
                            Core Flow
                        </div>
                        <h2 style={{ fontSize: "clamp(28px,5vw,48px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.2 }}>
                            3 giai đoạn,<br />một quy trình hoàn chỉnh
                        </h2>
                        <p className="mt-4 mx-auto" style={{ fontSize: "16px", color: "var(--muted-foreground)", maxWidth: "500px" }}>
                            Từ thiết lập Knowledge Base đến báo cáo AI — tự động hóa toàn bộ pipeline đánh giá ứng viên.
                        </p>
                    </div>

                    {/* Stage tabs */}
                    <div className="flex justify-center gap-2 mb-10">
                        {features.map((f, i) => (
                            <button key={i} onClick={() => setActiveFeature(i)}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
                                style={{
                                    background: activeFeature === i ? f.color + "22" : "rgba(255,255,255,0.04)",
                                    color: activeFeature === i ? f.color : "var(--muted-foreground)",
                                    border: `1px solid ${activeFeature === i ? f.color + "44" : "rgba(255,255,255,0.07)"}`,
                                }}>
                                <span className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold"
                                    style={{ background: activeFeature === i ? f.color + "33" : "transparent" }}>
                                    {f.stage}
                                </span>
                                {f.title}
                            </button>
                        ))}
                    </div>

                    {/* Feature content */}
                    <div className="grid grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4"
                                style={{ background: features[activeFeature].color + "22", fontSize: "12px", color: features[activeFeature].color }}>
                                {features[activeFeature].subtitle}
                            </div>
                            <h3 style={{ fontSize: "30px", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.3 }} className="mb-4">
                                {features[activeFeature].title}
                            </h3>
                            <p style={{ fontSize: "15px", color: "var(--muted-foreground)", lineHeight: 1.8 }} className="mb-6">
                                {features[activeFeature].desc}
                            </p>
                            <ul className="flex flex-col gap-3">
                                {features[activeFeature].bullets.map((b, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                                            style={{ background: features[activeFeature].color + "22" }}>
                                            <CheckCircle2 className="w-3.5 h-3.5" style={{ color: features[activeFeature].color }} />
                                        </div>
                                        <span style={{ fontSize: "14px", color: "var(--foreground)" }}>{b}</span>
                                    </li>
                                ))}
                            </ul>

                        </div>

                        {/* Visual card */}
                        <div className="rounded-3xl p-6 border"
                            style={{ background: "var(--card)", borderColor: "rgba(255,255,255,0.07)", boxShadow: `0 0 60px ${features[activeFeature].color}22` }}>
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
                                    style={{ background: features[activeFeature].color + "22" }}>
                                    {(() => { const Icon = features[activeFeature].icon; return <Icon className="w-5 h-5" style={{ color: features[activeFeature].color }} />; })()}
                                </div>
                                <div>
                                    <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--foreground)" }}>Giai đoạn {features[activeFeature].stage}</p>
                                    <p style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>{features[activeFeature].title}</p>
                                </div>
                                <div className="ml-auto w-2 h-2 rounded-full" style={{ background: features[activeFeature].color }} />
                            </div>

                            {activeFeature === 0 && (
                                <div className="flex flex-col gap-3">
                                    {["JD_SeniorFrontend_2025.pdf", "Interview_Questions.docx", "Rubrics_v3.xlsx"].map((f, i) => (
                                        <div key={i} className="flex items-center gap-3 p-3 rounded-xl"
                                            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                                            <FileText className="w-4 h-4 shrink-0" style={{ color: "#4F75FF" }} />
                                            <span style={{ fontSize: "13px", color: "var(--foreground)", flex: 1 }}>{f}</span>
                                            <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: "#10B981" }} />
                                        </div>
                                    ))}
                                    <div className="mt-2 p-3 rounded-xl" style={{ background: "#4F75FF11", border: "1px solid #4F75FF33" }}>
                                        <p style={{ fontSize: "11px", color: "#4F75FF", fontWeight: 600 }}>✓ 247 vectors đã lưu vào MongoDB Atlas</p>
                                        <p style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>interview_id: ITV-2025-0547</p>
                                    </div>
                                </div>
                            )}

                            {activeFeature === 1 && (
                                <div className="flex flex-col gap-3">
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { label: "Track A (HR)", color: "#22D3EE", bars: [3, 5, 4, 7, 5, 6] },
                                            { label: "Track B (UV)", color: "#4F75FF", bars: [5, 8, 6, 9, 7, 8] },
                                        ].map(t => (
                                            <div key={t.label} className="rounded-xl p-3 flex flex-col items-center gap-2"
                                                style={{ background: t.color + "11", border: `1px solid ${t.color}33` }}>
                                                <span style={{ fontSize: "11px", color: t.color, fontWeight: 600 }}>{t.label}</span>
                                                <div className="flex gap-1 items-end h-8">
                                                    {t.bars.map((h, i) => (
                                                        <div key={i} className="w-1.5 rounded-full" style={{ height: `${h * 4}px`, background: t.color }} />
                                                    ))}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Mic className="w-3 h-3" style={{ color: t.color }} />
                                                    <span style={{ fontSize: "10px", color: "var(--muted-foreground)" }}>Recording...</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                                        <div className="flex items-center justify-between mb-1">
                                            <span style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>Thời gian ghi âm</span>
                                            <span style={{ fontSize: "11px", fontFamily: "monospace", color: "var(--foreground)" }}>04:23</span>
                                        </div>
                                        <div className="h-1 rounded-full overflow-hidden" style={{ background: "var(--muted)" }}>
                                            <div className="h-full rounded-full" style={{ width: "62%", background: "linear-gradient(90deg,#4F75FF,#22D3EE)" }} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeFeature === 2 && (
                                <div className="flex flex-col gap-3">
                                    {[
                                        { label: "Kỹ thuật", score: 88, color: "#10B981" },
                                        { label: "Kinh nghiệm", score: 72, color: "#4F75FF" },
                                        { label: "Tư duy lập luận", score: 91, color: "#22D3EE" },
                                        { label: "Giao tiếp", score: 76, color: "#F59E0B" },
                                    ].map(s => (
                                        <div key={s.label}>
                                            <div className="flex justify-between mb-1">
                                                <span style={{ fontSize: "12px", color: "var(--foreground)" }}>{s.label}</span>
                                                <span style={{ fontSize: "12px", fontWeight: 700, color: s.color }}>{s.score}</span>
                                            </div>
                                            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--muted)" }}>
                                                <div className="h-full rounded-full transition-all" style={{ width: `${s.score}%`, background: s.color }} />
                                            </div>
                                        </div>
                                    ))}
                                    <div className="mt-1 p-2.5 rounded-xl flex items-center gap-2"
                                        style={{ background: "#10B98111", border: "1px solid #10B98133" }}>
                                        <BarChart2 className="w-4 h-4 shrink-0" style={{ color: "#10B981" }} />
                                        <span style={{ fontSize: "12px", fontWeight: 700, color: "#10B981" }}>Điểm tổng: 79/100 — ĐẠT</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="relative py-20 px-6" style={{ zIndex: 1, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 style={{ fontSize: "clamp(24px,4vw,40px)", fontWeight: 800, letterSpacing: "-0.02em" }}>
                            HR yêu thích SWD
                        </h2>
                    </div>
                    <div className="grid grid-cols-3 gap-5">
                        {testimonials.map((t, i) => (
                            <div key={i} className="rounded-2xl p-5 border"
                                style={{ background: "var(--card)", borderColor: "rgba(255,255,255,0.07)" }}>
                                <div className="flex gap-1 mb-4">
                                    {Array.from({ length: t.score }).map((_, j) => (
                                        <Star key={j} className="w-4 h-4 fill-current" style={{ color: "#F59E0B" }} />
                                    ))}
                                </div>
                                <p style={{ fontSize: "14px", color: "var(--muted-foreground)", lineHeight: 1.7 }} className="mb-4">"{t.text}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
                                        style={{ background: "linear-gradient(135deg,#4F75FF,#22D3EE)", color: "#fff" }}>
                                        {t.avatar}
                                    </div>
                                    <div>
                                        <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--foreground)" }}>{t.name}</p>
                                        <p style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            {/* Footer */}
            <footer className="relative py-8 px-6 text-center" style={{ zIndex: 1, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex items-center justify-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center"
                        style={{ background: "linear-gradient(135deg, #4F75FF, #22D3EE)" }}>
                        <Brain className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span style={{ fontWeight: 700, fontSize: "14px" }}>SWD Interview</span>
                </div>
                <p style={{ fontSize: "13px", color: "var(--muted-foreground)" }}>
                    © 2025 SWD Interview Platform. All rights reserved.
                </p>
            </footer>
        </div>
    );
}
