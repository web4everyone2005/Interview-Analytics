import axiosInstance from "@/lib/axios";
import { Candidate, CreateCandidatePayload, UpdateCandidatePayload } from "@/models/candidate.model";
import { ApiResponse } from "@/models/common.model";

export const getCandidates = async (): Promise<ApiResponse<Candidate[]>> => {
  const { data } = await axiosInstance.get<ApiResponse<Candidate[]>>("/candidates");
  return data;
};

export const getCandidateById = async (id: string): Promise<ApiResponse<Candidate>> => {
  const { data } = await axiosInstance.get<ApiResponse<Candidate>>(`/candidates/${id}`);
  return data;
};

export const createCandidate = async (
  payload: CreateCandidatePayload
): Promise<ApiResponse<Candidate>> => {
  const { data } = await axiosInstance.post<ApiResponse<Candidate>>("/candidates", payload);
  return data;
};

export const updateCandidate = async (
  id: string,
  payload: UpdateCandidatePayload
): Promise<ApiResponse<Candidate>> => {
  const { data } = await axiosInstance.put<ApiResponse<Candidate>>(`/candidates/${id}`, payload);
  return data;
};

export const deleteCandidate = async (id: string): Promise<ApiResponse<null>> => {
  const { data } = await axiosInstance.delete<ApiResponse<null>>(`/candidates/${id}`);
  return data;
};
