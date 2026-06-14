// ============================================================
// Tầng HOOKS - useRegister
//
// Wrap tầng Service bằng useSWRMutation để quản lý trạng thái
// loading/error tự động khi đăng ký.
// ============================================================

import useSWRMutation from "swr/mutation";
import { register } from "@/services/auth.service";
import { RegisterPayload } from "@/models/auth.model";

// ─── SWR Key ──────────────────────────────────────────────────
const REGISTER_KEY = "/auth/register";

/**
 * Hook đăng ký tài khoản mới.
 * Gọi `trigger({ name, email, password, roleName })` để đăng ký.
 * Token sẽ tự động lưu vào localStorage và cookie sau khi thành công.
 */
export const useRegister = () => {
  const { trigger, isMutating, error, data } = useSWRMutation(
    REGISTER_KEY,
    (_key: string, { arg }: { arg: RegisterPayload }) => register(arg)
  );

  return {
    /** Gọi hàm này để thực hiện đăng ký */
    trigger,
    /** true khi đang chờ response từ BE */
    isMutating,
    /** Lỗi trả về nếu đăng ký thất bại (AxiosError) */
    error,
    /** Dữ liệu trả về sau khi đăng ký thành công: { user, accessToken } */
    data,
  };
};
