// ============================================================
// Tầng SERVICE - Session
//
// Chỉ có tầng này biết URL endpoint, params, payload cho Session.
// Import axiosInstance từ lib/axios.
// ============================================================

import axiosInstance from "@/lib/axios";
import { ApiResponse } from "@/models/common.model";
import { CreateSessionPayload, Session, UpdateSessionPayload } from "@/models/session.model";

/**
 * Lấy danh sách các phiên phỏng vấn.
 * GET /sessions
 */
export const getSessions = async (): Promise<ApiResponse<Session[]>> => {
  const { data } = await axiosInstance.get<ApiResponse<Session[]>>("/sessions");
  return data;
};

/**
 * Lấy thông tin chi tiết một phiên phỏng vấn theo ID.
 * GET /sessions/:id
 */
export const getSessionById = async (id: string): Promise<ApiResponse<Session>> => {
  const { data } = await axiosInstance.get<ApiResponse<Session>>(`/sessions/${id}`);
  return data;
};

/**
 * Tạo mới một phiên phỏng vấn.
 * POST /sessions
 */
export const createSession = async (
  payload: CreateSessionPayload
): Promise<ApiResponse<Session>> => {
  const { data } = await axiosInstance.post<ApiResponse<Session>>("/sessions", payload);
  return data;
};

/**
 * Cập nhật thông tin phiên phỏng vấn theo ID.
 * PUT /sessions/:id
 */
export const updateSession = async (
  id: string,
  payload: UpdateSessionPayload
): Promise<ApiResponse<Session>> => {
  const { data } = await axiosInstance.put<ApiResponse<Session>>(`/sessions/${id}`, payload);
  return data;
};

/**
 * Xóa một phiên phỏng vấn theo ID.
 * DELETE /sessions/:id
 */
export const deleteSession = async (id: string): Promise<ApiResponse<null>> => {
  const { data } = await axiosInstance.delete<ApiResponse<null>>(`/sessions/${id}`);
  return data;
};
