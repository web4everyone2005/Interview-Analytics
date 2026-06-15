import axiosInstance from "@/lib/axios";
import { ApiResponse } from "@/models/common.model";
import { DashboardReport, InterviewReport } from "@/models/report.model";

export const getDashboardReports = async (
  startDate?: string,
  endDate?: string
): Promise<ApiResponse<DashboardReport[]>> => {
  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);

  const query = params.toString() ? `?${params.toString()}` : "";
  const { data } = await axiosInstance.get<ApiResponse<DashboardReport[]>>(
    `/reports${query}`
  );
  return data;
};

export const getInterviewReport = async (
  sessionId: string
): Promise<ApiResponse<InterviewReport>> => {
  const { data } = await axiosInstance.get<ApiResponse<InterviewReport>>(
    `/reports/${sessionId}`
  );
  return data;
};

export const reEvaluateSession = async (
  sessionId: string
): Promise<ApiResponse<any>> => {
  const { data } = await axiosInstance.post<ApiResponse<any>>(
    `/reports/${sessionId}/re-evaluate`
  );
  return data;
};

export const exportReportPdf = async (sessionId: string): Promise<Blob> => {
  const response = await axiosInstance.get(`/reports/${sessionId}/export-pdf`, {
    responseType: "blob",
  });
  return response.data;
};
