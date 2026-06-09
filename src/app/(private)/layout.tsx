// ============================================================
// LAYOUT - Private (Authenticated)
//
// Layout này bọc TẤT CẢ các trang trong nhóm (private).
// Sidebar sẽ tự động xuất hiện trên mọi trang đã đăng nhập.
//
// Muốn thêm Header, Footer... chỉ cần thêm vào đây.
// ============================================================

import Sidebar from "@/components/shared/sidebar/index";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      {/* Vùng nội dung chính — children là trang hiện tại */}
      <main className="flex-1 bg-[#0d1117] p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
