// ============================================================
// Tầng SERVICE - User
//
// Chỉ có tầng này biết URL endpoint, params, payload.
// Import axiosInstance từ lib/axios — KHÔNG import axios trực tiếp.
// ============================================================

import axiosInstance from "@/lib/axios";
import { ApiResponse, PaginatedResponse, PaginationParams } from "@/models/common.model";
import { CreateUserPayload, UpdateUserPayload, User } from "@/models/user.model";



export const getMe = async (): Promise<ApiResponse<User>> => {
  const { data } = await axiosInstance.get<ApiResponse<User>>("/auth/me");
  return data;
}


/**
 * Lấy danh sách users có phân trang.
 * GET /users?page=1&limit=10
 */
export const getUsers = async (
  params?: PaginationParams
): Promise<PaginatedResponse<User>> => {
  const { data } = await axiosInstance.get<PaginatedResponse<User>>("/users", {
    params,
  });
  return data;
};

/**
 * Lấy thông tin 1 user theo ID.
 * GET /users/:id
 */
export const getUserById = async (id: string): Promise<ApiResponse<User>> => {
  const { data } = await axiosInstance.get<ApiResponse<User>>(`/users/${id}`);
  return data;
};

/**
 * Tạo user mới.
 * POST /users
 */
export const createUser = async (
  payload: CreateUserPayload
): Promise<ApiResponse<User>> => {
  const { data } = await axiosInstance.post<ApiResponse<User>>(
    "/users",
    payload
  );
  return data;
};

/**
 * Cập nhật user theo ID.
 * PUT /users/:id
 */
export const updateUser = async (
  id: string,
  payload: UpdateUserPayload
): Promise<ApiResponse<User>> => {
  const { data } = await axiosInstance.put<ApiResponse<User>>(
    `/users/${id}`,
    payload
  );
  return data;
};

/**
 * Xoá user theo ID.
 * DELETE /users/:id
 */
export const deleteUser = async (
  id: string
): Promise<ApiResponse<null>> => {
  const { data } = await axiosInstance.delete<ApiResponse<null>>(
    `/users/${id}`
  );
  return data;
};
