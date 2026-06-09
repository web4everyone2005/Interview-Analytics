// ============================================================
// Tầng SERVICE - Auth
//
// Chỉ có tầng này biết URL endpoint, params, payload.
// Import axiosInstance từ lib/axios — KHÔNG import axios trực tiếp.
// ============================================================

import axiosInstance, { tokenStorage } from "@/lib/axios";
import { LoginPayload, LoginResponse, LoginResponseData } from "@/models/auth.model";

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
 * Đăng xuất - xoá token khỏi localStorage.
 * Nếu BE có endpoint logout, gọi thêm ở đây.
 */
export const logout = (): void => {
  tokenStorage.clearTokens();
};
