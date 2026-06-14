// ============================================================
// Tầng MODEL - User
// Mô phỏng kiểu dữ liệu User mà BE gửi về / FE gửi lên
// ============================================================

/**
 * Kiểu User BE trả về (response).
 */
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string | null;
  isActive: boolean;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

/**
 * Enum role user - đồng bộ với BE.
 */
export enum UserRole {
  ADMIN = "ADMIN",
  CANDIDATE = "CANDIDATE",
  HR = "HR",
}

/**
 * Payload khi tạo user mới (POST /users).
 */
export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

/**
 * Payload khi cập nhật user (PUT /users/:id).
 * Dùng Partial để tất cả field đều optional.
 */
export type UpdateUserPayload = Partial<
  Pick<CreateUserPayload, "name" | "email" | "role">
>;
