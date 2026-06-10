// ============================================================
// Tầng MODEL - Auth
// Mô phỏng kiểu dữ liệu liên quan đến xác thực (login, token...)
// ============================================================

import { User } from "./user.model";

/**
 * Payload gửi lên BE khi đăng nhập.
 * POST /auth/login
 */
export interface LoginPayload {
  email: string;
  password: string;
}

/**
 * Dữ liệu BE trả về khi đăng nhập thành công.
 * BE trả về dạng: { data: { user, accessToken, refreshToken } }
 */
export interface LoginResponseData {
  user: User;
  accessToken: string;
  refreshToken?: string;
}

/**
 * Wrapper response từ BE cho login.
 */
export interface LoginResponse {
  data: LoginResponseData;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  roleName?: string;
}

export interface RegisterResponseData {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
  };
  accessToken: string;
}

export interface RegisterResponse {
  data: RegisterResponseData;
}

