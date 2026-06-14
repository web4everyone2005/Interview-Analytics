import axiosInstance from "@/lib/axios";
import { ApiResponse } from "@/models/common.model";
import { JobPosition, CreateJobPayload, UpdateJobPayload } from "@/models/job.model";

export const getJobs = async (): Promise<ApiResponse<JobPosition[]>> => {
  const { data } = await axiosInstance.get<ApiResponse<JobPosition[]>>("/api/v1/job-positions");
  return data;
};

export const getJobById = async (id: string): Promise<ApiResponse<JobPosition>> => {
  const { data } = await axiosInstance.get<ApiResponse<JobPosition>>(`/api/v1/job-positions/${id}`);
  return data;
};

export const createJob = async (
  payload: CreateJobPayload
): Promise<ApiResponse<JobPosition>> => {
  const { data } = await axiosInstance.post<ApiResponse<JobPosition>>("/api/v1/job-positions", payload);
  return data;
};

export const updateJob = async (
  id: string,
  payload: UpdateJobPayload
): Promise<ApiResponse<JobPosition>> => {
  const { data } = await axiosInstance.put<ApiResponse<JobPosition>>(`/api/v1/job-positions/${id}`, payload);
  return data;
};

export const deleteJob = async (id: string): Promise<ApiResponse<null>> => {
  const { data } = await axiosInstance.delete<ApiResponse<null>>(`/api/v1/job-positions/${id}`);
  return data;
};
