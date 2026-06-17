// ============================================================
// PROXY - Auth Guard (Next.js 16)
//
// Tên file là proxy.ts (không phải middleware.ts) theo convention
// của Next.js 16. Export function phải đặt tên là "proxy".
//
// Cơ chế hoạt động:
//   - Proxy chạy trên Edge Runtime (không có localStorage).
//   - Auth token được đọc từ cookie "access_token".
//   - tokenStorage trong axios.ts ghi cookie mỗi khi setTokens().
//
// Logic:
//   1. Nếu route là public (login, /) → cho qua.
//   2. Nếu route là private và KHÔNG có cookie access_token → redirect /login.
//   3. Nếu đã đăng nhập mà truy cập /login → redirect /dashboard.
// ============================================================

import { NextRequest, NextResponse } from "next/server";

// ─── Cấu hình routes ──────────────────────────────────────────
const PUBLIC_ROUTES = ["/login", "/register"];
const AUTH_REDIRECT_WHEN_LOGGED_IN = "/dashboard/user"; // Trang mặc định sau khi đăng nhập
const LOGIN_PAGE = "/login";
const COOKIE_NAME = "access_token";

// ─── Helper: kiểm tra route có public không ───────────────────
function isPublicRoute(pathname: string): boolean {
  return (
    PUBLIC_ROUTES.some((route) => pathname.startsWith(route)) ||
    pathname === "/"
  );
}

// ─── Helper: kiểm tra route có phải static asset không ────────
function isStaticAsset(pathname: string): boolean {
  return (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/public/") ||
    /\.\w+$/.test(pathname) // file có extension (.png, .svg, ...)
  );
}

// ─── Proxy Function ────────────────────────────────────────────
export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl; // Lấy path hiện tại, vd: "/dashboard"

  // Bỏ qua static assets để tránh overhead không cần thiết
  if (isStaticAsset(pathname)) {
    return NextResponse.next();
  }

  // Nếu truy cập đúng "/dashboard" hoặc "/dashboard/" thì redirect về "/dashboard/user" để tránh 404
  if (pathname === "/dashboard" || pathname === "/dashboard/") {
    return NextResponse.redirect(new URL("/dashboard/user", request.url));
  }

  const accessToken = request.cookies.get(COOKIE_NAME)?.value;
  const isLoggedIn = Boolean(accessToken);

  // Đã đăng nhập mà cố vào trang login → redirect về dashboard
  if (isLoggedIn && pathname.startsWith(LOGIN_PAGE)) {
    return NextResponse.redirect(
      new URL(AUTH_REDIRECT_WHEN_LOGGED_IN, request.url)
    );
  }

  // Chưa đăng nhập mà truy cập route private → redirect về login
  if (!isLoggedIn && !isPublicRoute(pathname)) {
    const loginUrl = new URL(LOGIN_PAGE, request.url);
    // Lưu lại URL gốc để sau khi login có thể redirect về đúng chỗ
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// ─── Config: Matcher ───────────────────────────────────────────
// Chạy proxy cho tất cả các route, trừ static files của Next.js
export const config = {
  matcher: [
    /*
     * Khớp tất cả paths TRỪ:
     *  - _next/static   (static files)
     *  - _next/image    (image optimization)
     *  - favicon.ico    (favicon)
     *  - public folder  (public assets)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
