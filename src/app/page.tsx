// ============================================================
// Tầng APP - Page gốc
//
// Page chỉ làm nhiệm vụ layout và gọi các Components.
// Không chứa business logic, không biết về service hay hook.
// ============================================================

import { UserList } from "@/components/features/users/UserList";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            🏗️ NextJS 16 Boilerplate
          </h1>
          <p className="mt-2 text-gray-500">
            Kiến trúc phân tầng: Model → Service → Hook → Component → App
          </p>

          {/* Architecture legend */}
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            {[
              { label: "models/", color: "bg-purple-100 text-purple-700" },
              { label: "services/", color: "bg-blue-100 text-blue-700" },
              { label: "hooks/", color: "bg-green-100 text-green-700" },
              { label: "components/", color: "bg-orange-100 text-orange-700" },
              { label: "lib/axios.ts", color: "bg-red-100 text-red-700" },
            ].map(({ label, color }) => (
              <span
                key={label}
                className={`rounded-full px-2.5 py-1 font-mono font-medium ${color}`}
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Component — biết gì đâu, chỉ gọi thôi */}
        <UserList />
      </div>
    </div>
  );
}
