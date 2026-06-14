import axiosInstance from "@/lib/axios";
import { ApiResponse } from "@/models/common.model";
import { Candidate, CreateCandidatePayload, UpdateCandidatePayload } from "@/models/candidate.model";

export const getCandidates = async (): Promise<ApiResponse<Candidate[]>> => {
  const { data } = await axiosInstance.get<ApiResponse<Candidate[]>>("/api/v1/candidates");
  return data;
};

export const getCandidateById = async (id: string): Promise<ApiResponse<Candidate>> => {
  const { data } = await axiosInstance.get<ApiResponse<Candidate>>(`/api/v1/candidates/${id}`);
  return data;
};

export const createCandidate = async (
  payload: CreateCandidatePayload
): Promise<ApiResponse<Candidate>> => {
  const { data } = await axiosInstance.post<ApiResponse<Candidate>>("/api/v1/candidates", payload);
  return data;
};

export const updateCandidate = async (
  id: string,
  payload: UpdateCandidatePayload
): Promise<ApiResponse<Candidate>> => {
  const { data } = await axiosInstance.put<ApiResponse<Candidate>>(`/api/v1/candidates/${id}`, payload);
  return data;
};

export const deleteCandidate = async (id: string): Promise<ApiResponse<null>> => {
  const { data } = await axiosInstance.delete<ApiResponse<null>>(`/api/v1/candidates/${id}`);
  return data;
};
