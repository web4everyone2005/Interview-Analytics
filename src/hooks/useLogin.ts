// ============================================================
// Tầng HOOKS - useLogin
//
// Wrap tầng Service bằng useSWRMutation để quản lý trạng thái
// loading/error tự động khi đăng nhập.
// Components chỉ cần gọi hook này — không biết gì về axios.
// ============================================================

import useSWRMutation from "swr/mutation";
import { login } from "@/services/auth.service";
import { LoginPayload } from "@/models/auth.model";

// ─── SWR Key ──────────────────────────────────────────────────
const LOGIN_KEY = "/auth/login";

/**
 * Hook đăng nhập.
 * Gọi `trigger({ email, password })` để thực hiện login.
 * Token sẽ được tự động lưu vào localStorage sau khi thành công.
 *
 * @example
 * const { trigger, isMutating, error, data } = useLogin();
 *
 * // Trong form submit:
 * const result = await trigger({ email: "user@example.com", password: "123456" });
 * // result.user        → thông tin user
 * // result.accessToken → JWT access token
 */
export const useLogin = () => {
  const { trigger, isMutating, error, data } = useSWRMutation(
    LOGIN_KEY,
    (_key: string, { arg }: { arg: LoginPayload }) => login(arg)
  );

  return {
    /** Gọi hàm này để thực hiện đăng nhập */
    trigger,
    /** true khi đang chờ response từ BE */
    isMutating,
    /** Lỗi trả về nếu login thất bại (AxiosError) */
    error,
    /** Dữ liệu trả về sau khi login thành công: { user, accessToken, refreshToken } */
    data,
  };
};
