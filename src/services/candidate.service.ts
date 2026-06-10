import axiosInstance from "@/lib/axios";
import {
  CandidateProfile,
  CreateCandidatePayload,
} from "@/models/candidate.model";
import { ApiResponse } from "@/models/common.model";

export const getCandidates = async (): Promise<
  ApiResponse<CandidateProfile[]>
> => {
  const { data } =
    await axiosInstance.get<ApiResponse<CandidateProfile[]>>("/candidates");
  return data;
};

export const createCandidate = async (
  payload: CreateCandidatePayload
): Promise<ApiResponse<CandidateProfile>> => {
  const { data } = await axiosInstance.post<ApiResponse<CandidateProfile>>(
    "/candidates",
    payload
  );
  return data;
};
