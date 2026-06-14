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

export const useSessionDetail = (id: string | null, swrConfig?: SWRConfiguration) => {
  const { data, error, isLoading, mutate } = useSWR<{ data: Session }>(
    id ? `${SESSIONS_KEY}/${id}` : null,
    async () => {
      const { getSessionById } = await import("@/services/session.service");
      return getSessionById(id!);
    },
    swrConfig
  );

  return {
    session: data?.data,
    isLoading,
    error,
    mutate,
  };
};

export const useSessionByRoomCode = (roomCode: string | null, swrConfig?: SWRConfiguration) => {
  const { data, error, isLoading, mutate } = useSWR<{ data: Session }>(
    roomCode ? `${SESSIONS_KEY}/room/${roomCode}` : null,
    async () => {
      const { getSessionByRoomCode } = await import("@/services/session.service");
      return getSessionByRoomCode(roomCode!);
    },
    swrConfig
  );

  return {
    session: data?.data,
    isLoading,
    error,
    mutate,
  };
};
