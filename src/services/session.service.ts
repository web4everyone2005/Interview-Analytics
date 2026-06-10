import axiosInstance from "@/lib/axios";
import { ApiResponse } from "@/models/common.model";
import {
  CreateSessionPayload,
  CreateSessionResponse,
  Session,
  UpdateSessionStatusPayload,
} from "@/models/session.model";

export const getSessions = async (): Promise<ApiResponse<Session[]>> => {
  const { data } = await axiosInstance.get<ApiResponse<Session[]>>("/sessions");
  return data;
};

export const getSessionById = async (
  id: string
): Promise<ApiResponse<Session>> => {
  const { data } = await axiosInstance.get<ApiResponse<Session>>(
    `/sessions/${id}`
  );
  return data;
};

export const getSessionByRoomCode = async (
  roomCode: string
): Promise<ApiResponse<Session>> => {
  const { data } = await axiosInstance.get<ApiResponse<Session>>(
    `/sessions/room/${roomCode}`
  );
  return data;
};

export const createSession = async (
  payload: CreateSessionPayload
): Promise<CreateSessionResponse> => {
  const { data } = await axiosInstance.post<CreateSessionResponse>(
    "/sessions",
    payload
  );
  return data;
};

export const updateSessionStatus = async (
  id: string,
  payload: UpdateSessionStatusPayload
): Promise<ApiResponse<Session>> => {
  const { data } = await axiosInstance.put<ApiResponse<Session>>(
    `/sessions/${id}/status`,
    payload
  );
  return data;
};

export const sendSessionInvitation = async (
  id: string
): Promise<ApiResponse<null>> => {
  const { data } = await axiosInstance.post<ApiResponse<null>>(
    `/sessions/${id}/send-invitation`
  );
  return data;
};

export const deleteSession = async (id: string): Promise<ApiResponse<null>> => {
  const { data } = await axiosInstance.delete<ApiResponse<null>>(
    `/sessions/${id}`
  );
  return data;
};
