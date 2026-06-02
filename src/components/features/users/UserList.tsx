// ============================================================
// Tầng COMPONENTS - UserList
//
// Component này chỉ biết về hook useUsers().
// Không biết gì về axios, service hay URL endpoint.
// ============================================================

"use client";

import { useUsers, useCreateUser } from "@/hooks/useUser";
import { User, UserRole } from "@/models/user.model";
import { PaginationParams } from "@/models/common.model";
import { useState } from "react";

// ─── Sub-components ───────────────────────────────────────────

const RoleBadge = ({ role }: { role: UserRole }) => {
  const styles: Record<UserRole, string> = {
    [UserRole.ADMIN]:
      "bg-red-100 text-red-700 border border-red-200",
    [UserRole.MODERATOR]:
      "bg-yellow-100 text-yellow-700 border border-yellow-200",
    [UserRole.USER]:
      "bg-blue-100 text-blue-700 border border-blue-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[role]}`}
    >
      {role}
    </span>
  );
};

const UserCard = ({ user }: { user: User }) => (
  <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md">
    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 font-semibold text-sm">
      {user.name.charAt(0).toUpperCase()}
    </div>
    <div className="flex-1 min-w-0">
      <p className="truncate font-medium text-gray-900">{user.name}</p>
      <p className="truncate text-sm text-gray-500">{user.email}</p>
    </div>
    <div className="flex flex-col items-end gap-1">
      <RoleBadge role={user.role} />
      <span
        className={`text-xs ${user.isActive ? "text-green-600" : "text-gray-400"
          }`}
      >
        {user.isActive ? "● Active" : "○ Inactive"}
      </span>
    </div>
  </div>
);

const LoadingSkeleton = () => (
  <div className="space-y-3">
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4"
      >
        <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-1/3 rounded bg-gray-200 animate-pulse" />
          <div className="h-3 w-1/2 rounded bg-gray-200 animate-pulse" />
        </div>
        <div className="h-5 w-16 rounded-full bg-gray-200 animate-pulse" />
      </div>
    ))}
  </div>
);

// ─── Main Component ────────────────────────────────────────────

export const UserList = () => {
    const [params, setParams] = useState<PaginationParams>({ page: 1, limit: 10 });
    const { users, pagination, isLoading, error } = useUsers(params);

    // Gọi hook tạo user
    const { trigger: createUser, isMutating } = useCreateUser();

    // Hàm tạo user test ngẫu nhiên
    const handleAddTestUser = async () => {
        try {
            const randomNum = Math.floor(Math.random() * 10000);
            await createUser({
                name: `User Test ${randomNum}`,
                email: `test${randomNum}@gmail.com`,
                password: "password123",
                role: "USER"
            });
        } catch (err) {
            alert("Lỗi khi tạo user!");
        }
    };

    if (error) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
                <p className="text-sm font-medium text-red-600">
                    ⚠️ Không thể tải danh sách user
                </p>
                <p className="mt-1 text-xs text-red-400">{error.message}</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Danh sách User</h2>
                    {pagination && (
                        <p className="mt-0.5 text-sm text-gray-500">
                            Tổng cộng <span className="font-medium text-gray-700">{pagination.total}</span> users
                        </p>
                    )}
                </div>

                {/* NÚT TEST THÊM MỚI CHÍNH LÀ CHỖ NÀY */}
                <button
                    onClick={handleAddTestUser}
                    disabled={isMutating}
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
                >
                    {isMutating ? "Đang tạo..." : "+ Thêm User Test"}
                </button>
            </div>

            {/* List */}
            {isLoading ? (
                <LoadingSkeleton />
            ) : users.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-200 py-12 text-center">
                    <p className="text-sm text-gray-400">Không có user nào</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {users.map((user) => (
                        <UserCard key={user.id} user={user} />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                    <p className="text-sm text-gray-500">
                        Trang {pagination.page} / {pagination.totalPages}
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setParams((p) => ({ ...p, page: Math.max(1, (p.page ?? 1) - 1) }))}
                            disabled={pagination.page <= 1}
                            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:opacity-40"
                        >
                            ← Trước
                        </button>
                        <button
                            onClick={() => setParams((p) => ({ ...p, page: Math.min(pagination.totalPages, (p.page ?? 1) + 1) }))}
                            disabled={pagination.page >= pagination.totalPages}
                            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:opacity-40"
                        >
                            Sau →
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};