// ============================================================
// Tầng APP - Page gốc
//
// Page chỉ làm nhiệm vụ layout và gọi các Components.
// Không chứa business logic, không biết về service hay hook.
// ============================================================

import { LandingPage } from "@/components/features/users/pages/LandingPage/page";
import { UserList } from "@/components/features/users/UserList";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <LandingPage />
    </div>
  );
}
