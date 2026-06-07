// ============================================================
// Tầng HOOKS - useUser
//
// Wrap tầng Service bằng SWR để có caching, revalidation,
// loading/error state tự động.
// Components chỉ cần gọi hook này — không biết gì về axios.
// ============================================================

import useSWR, { SWRConfiguration } from "swr";
import useSWRMutation from "swr/mutation";
import {
  createUser,
  deleteUser,
  getMe,
  getUserById,
  getUsers,
  updateUser,
} from "@/services/user.service";
import { PaginationParams } from "@/models/common.model";
import { CreateUserPayload, UpdateUserPayload } from "@/models/user.model";

// ─── SWR Keys ─────────────────────────────────────────────────
// Dùng string prefix giúp dễ invalidate cache theo nhóm
const USERS_KEY = "/users";
const GET_ME_KEY = "/api/auth/me";
const userKey = (id: string) => `/users/${id}`;

// ─── Hooks ────────────────────────────────────────────────────



export const useMe = (swrConfig?: SWRConfiguration) => {
  const { data, error, isLoading, mutate } = useSWR(
    GET_ME_KEY,
    () => getMe(),
    swrConfig
  );
  return {
    data: data?.data ?? null,
    isLoading,
    error,
    mutate,
  };
};

/**
 * Lấy danh sách users với phân trang.
 *
 * @example
 * const { users, pagination, isLoading, error } = useUsers({ page: 1, limit: 10 });
 */
export const useUsers = (
  params?: PaginationParams,
  swrConfig?: SWRConfiguration
) => {
  const key = params
    ? [USERS_KEY, params.page, params.limit]
    : USERS_KEY;

  const { data, error, isLoading, mutate } = useSWR(
    key,
    () => getUsers(params),
    swrConfig
  );

  return {
    users: data?.data ?? [],
    pagination: data?.pagination,
    isLoading,
    error,
    mutate,
  };
};

/**
 * Lấy thông tin 1 user theo ID.
 * Truyền null để tạm dừng fetch (conditional fetching).
 *
 * @example
 * const { user, isLoading } = useUserById("abc123");
 */
export const useUserById = (
  id: string | null,
  swrConfig?: SWRConfiguration
) => {
  const { data, error, isLoading, mutate } = useSWR(
    id ? userKey(id) : null,
    () => getUserById(id!),
    swrConfig
  );

  return {
    user: data?.data ?? null,
    isLoading,
    error,
    mutate,
  };
};

/**
 * Mutation hook để tạo user mới.
 *
 * @example
 * const { trigger, isMutating } = useCreateUser();
 * await trigger({ name: "John", email: "john@example.com", password: "123456" });
 */
export const useCreateUser = () => {
  const { trigger, isMutating, error } = useSWRMutation(
    USERS_KEY,
    (_key: string, { arg }: { arg: CreateUserPayload }) => createUser(arg)
  );

  return { trigger, isMutating, error };
};

/**
 * Mutation hook để cập nhật user.
 *
 * @example
 * const { trigger, isMutating } = useUpdateUser("abc123");
 * await trigger({ name: "Jane" });
 */
export const useUpdateUser = (id: string) => {
  const { trigger, isMutating, error } = useSWRMutation(
    userKey(id),
    (_key: string, { arg }: { arg: UpdateUserPayload }) => updateUser(id, arg)
  );

  return { trigger, isMutating, error };
};

/**
 * Mutation hook để xoá user.
 *
 * @example
 * const { trigger, isMutating } = useDeleteUser("abc123");
 * await trigger();
 */
export const useDeleteUser = (id: string) => {
  const { trigger, isMutating, error } = useSWRMutation(
    userKey(id),
    () => deleteUser(id)
  );

  return { trigger, isMutating, error };
};
