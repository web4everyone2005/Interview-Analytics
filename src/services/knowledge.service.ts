import axiosInstance from "@/lib/axios";
import { ApiResponse } from "@/models/common.model";
import { KnowledgeDocument } from "@/models/knowledge.model";

export const uploadKnowledgeDocument = async (
  jobId: string,
  file: File
): Promise<ApiResponse<KnowledgeDocument>> => {
  const formData = new FormData();
  formData.append("job_position_id", jobId);
  formData.append("file", file);

  const { data } = await axiosInstance.post<ApiResponse<KnowledgeDocument>>(
    "/api/v1/knowledge/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return data;
};

export const getKnowledgeDocumentsByJob = async (
  jobId: string
): Promise<ApiResponse<KnowledgeDocument[]>> => {
  const { data } = await axiosInstance.get<ApiResponse<KnowledgeDocument[]>>(
    `/api/v1/knowledge?job_position_id=${jobId}`
  );
  return data;
};
