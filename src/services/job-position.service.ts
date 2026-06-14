import axiosInstance from "@/lib/axios";
import { ApiResponse } from "@/models/common.model";
import {
  CreateJobPositionPayload,
  JobPosition,
  UpdateJobPositionPayload,
} from "@/models/job-position.model";

export const getJobPositions = async (): Promise<
  ApiResponse<JobPosition[]>
> => {
  const { data } =
    await axiosInstance.get<ApiResponse<JobPosition[]>>("/job-positions");
  return data;
};

export const getJobPositionById = async (
  id: string
): Promise<ApiResponse<JobPosition>> => {
  const { data } = await axiosInstance.get<ApiResponse<JobPosition>>(
    `/job-positions/${id}`
  );
  return data;
};

export const createJobPosition = async (
  payload: CreateJobPositionPayload
): Promise<ApiResponse<JobPosition>> => {
  const { data } = await axiosInstance.post<ApiResponse<JobPosition>>(
    "/job-positions",
    payload
  );
  return data;
};

export const updateJobPosition = async (
  id: string,
  payload: UpdateJobPositionPayload
): Promise<ApiResponse<JobPosition>> => {
  const { data } = await axiosInstance.put<ApiResponse<JobPosition>>(
    `/job-positions/${id}`,
    payload
  );
  return data;
};

export const deleteJobPosition = async (
  id: string
): Promise<ApiResponse<null>> => {
  const { data } = await axiosInstance.delete<ApiResponse<null>>(
    `/job-positions/${id}`
  );
  return data;
};
