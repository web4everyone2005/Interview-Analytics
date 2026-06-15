import useSWR from "swr";
import {
  getDashboardReports,
  getInterviewReport,
  reEvaluateSession,
  exportReportPdf,
} from "@/services/report.service";

export const useDashboardReports = (startDate?: string, endDate?: string) => {
  const query = [];
  if (startDate) query.push(`startDate=${startDate}`);
  if (endDate) query.push(`endDate=${endDate}`);
  const queryString = query.length > 0 ? `?${query.join("&")}` : "";

  const { data, error, mutate, isLoading } = useSWR(
    `/reports${queryString}`,
    () => getDashboardReports(startDate, endDate)
  );

  return {
    reports: data?.data || [],
    isLoading,
    isError: error,
    mutate,
  };
};

export const useInterviewReport = (sessionId: string) => {
  const { data, error, mutate, isLoading } = useSWR(
    sessionId ? `/reports/${sessionId}` : null,
    () => getInterviewReport(sessionId)
  );

  return {
    report: data?.data,
    isLoading,
    isError: error,
    mutate,
  };
};

export const useReportMutations = () => {
  const triggerReEvaluate = async (sessionId: string) => {
    return await reEvaluateSession(sessionId);
  };

  const downloadPdf = async (sessionId: string, fileName: string) => {
    const blob = await exportReportPdf(sessionId);
    const url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
  };

  return {
    triggerReEvaluate,
    downloadPdf,
  };
};
