// ============================================================
// Tầng SERVICE - Auth
//
// Chỉ có tầng này biết URL endpoint, params, payload.
// Import axiosInstance từ lib/axios — KHÔNG import axios trực tiếp.
// ============================================================

import axiosInstance, { tokenStorage } from "@/lib/axios";
import {
  LoginPayload,
  LoginResponse,
  LoginResponseData,
  RegisterPayload,
  RegisterResponse,
  RegisterResponseData,
} from "@/models/auth.model";

/**
 * Đăng nhập với email và password.
 * POST /auth/login
 *
 * Tự động lưu accessToken & refreshToken vào localStorage sau khi
 * đăng nhập thành công.
 *
 * @returns LoginResponseData - { user, accessToken, refreshToken }
 */
export const login = async (
  payload: LoginPayload
): Promise<LoginResponseData> => {
  const { data } = await axiosInstance.post<LoginResponse>(
    "/auth/login",
    payload
  );

  // Lưu token vào localStorage để các request tiếp theo tự động gắn Authorization header
  tokenStorage.setTokens(data.data.accessToken, data.data.refreshToken);

  return data.data;
};

/**
 * Đăng ký tài khoản mới.
 * POST /auth/register
 *
 * Tự động lưu accessToken sau khi đăng ký thành công.
 *
 * @returns RegisterResponseData - { user, accessToken }
 */
export const register = async (
  payload: RegisterPayload
): Promise<RegisterResponseData> => {
  const { data } = await axiosInstance.post<RegisterResponse>(
    "/auth/register",
    payload
  );

  // Lưu token vào localStorage (vì register không trả về refreshToken nên truyền rỗng)
  tokenStorage.setTokens(data.data.accessToken, "");

  return data.data;
};

export const logout = async (): Promise<void> => {
  try {
    await axiosInstance.post("/auth/logout");
  } catch (error) {
    console.error("Backend logout failed:", error);
  } finally {
    tokenStorage.clearTokens();
  }
};

