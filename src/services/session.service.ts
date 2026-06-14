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
  const { data } = await axiosInstance.get<ApiResponse<Session[]>>("/api/v1/sessions");
  return data;
};

export const getSessionById = async (id: string): Promise<ApiResponse<Session>> => {
  const { data } = await axiosInstance.get<ApiResponse<Session>>(`/api/v1/sessions/${id}`);
  return data;
};

export const createSession = async (
  payload: CreateSessionPayload
): Promise<ApiResponse<Session>> => {
  const { data } = await axiosInstance.post<ApiResponse<Session>>("/api/v1/sessions", payload);
  return data;
};

export const updateSession = async (
  id: string,
  payload: UpdateSessionPayload
): Promise<ApiResponse<Session>> => {
  const { data } = await axiosInstance.put<ApiResponse<Session>>(`/api/v1/sessions/${id}`, payload);
  return data;
};

export const deleteSession = async (id: string): Promise<ApiResponse<null>> => {
  const { data } = await axiosInstance.delete<ApiResponse<null>>(`/api/v1/sessions/${id}`);
  return data;
};

export const sendInvitation = async (id: string): Promise<ApiResponse<any>> => {
  const { data } = await axiosInstance.post<ApiResponse<any>>(`/api/v1/sessions/${id}/send-invitation`);
  return data;
};

export const getSessionByRoomCode = async (roomCode: string): Promise<ApiResponse<Session>> => {
  const { data } = await axiosInstance.get<ApiResponse<Session>>(`/api/v1/sessions/room/${roomCode}`);
  return data;
};

export const updateSessionStatus = async (id: string, status: string): Promise<ApiResponse<Session>> => {
  const { data } = await axiosInstance.put<ApiResponse<Session>>(`/api/v1/sessions/${id}/status`, { status });
  return data;
};
