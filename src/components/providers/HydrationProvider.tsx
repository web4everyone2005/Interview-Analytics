"use client";

// ============================================================
// PROVIDER - HydrationProvider
//
// Giải quyết lỗi "Hydration failed" cho toàn bộ app.
//
// Cách hoạt động:
//   - Lần render đầu tiên trên SERVER  → trả về null (không render gì)
//   - Sau khi CLIENT mount xong        → render children bình thường
//
// Nhờ vậy server HTML và client HTML luôn khớp nhau ở lần render đầu,
// tránh mọi mismatch phát sinh từ browser-only API như:
//   localStorage, sessionStorage, window, document, navigator...
// ============================================================

import { useSyncExternalStore } from "react";

interface HydrationProviderProps {
  children: React.ReactNode;
}

export default function HydrationProvider({ children }: HydrationProviderProps) {
  const isMounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false
  );

  // Trả về null để server và client đều render giống nhau ở lần đầu
  if (!isMounted) return null;

  return <>{children}</>;
}
