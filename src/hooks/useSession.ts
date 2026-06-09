// ============================================================
// Tầng HOOKS - useSession
//
// Wrap tầng Service bằng SWR để có caching, revalidation,
// loading/error state tự động.
// Components chỉ cần gọi hook này — không biết gì về axios.
// ============================================================

import useSWR, { SWRConfiguration } from "swr";
import { getSessions } from "@/services/session.service";
import { Session } from "@/models/session.model";

// ─── SWR Keys ─────────────────────────────────────────────────
const SESSIONS_KEY = "/sessions";

// ─── Hooks ────────────────────────────────────────────────────

/**
 * Lấy danh sách tất cả phiên phỏng vấn.
 *
 * @example
 * const { sessions, isLoading, error } = useSessions();
 */
export const useSessions = (swrConfig?: SWRConfiguration) => {
  const { data, error, isLoading, mutate } = useSWR<{ data: Session[] }>(
    SESSIONS_KEY,
    () => getSessions(),
    swrConfig
  );

  return {
    sessions: data?.data ?? [],
    isLoading,
    error,
    mutate,
  };
};
