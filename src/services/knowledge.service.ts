import axiosInstance from "@/lib/axios";
import { ApiResponse } from "@/models/common.model";
import {
  KnowledgeDocument,
  UploadKnowledgeResponseData,
} from "@/models/knowledge.model";

export const uploadKnowledgeDocument = async (payload: {
  file: File;
  title?: string;
  job_position_id: string;
}): Promise<ApiResponse<UploadKnowledgeResponseData>> => {
  const { data } = await axiosInstance.postForm<
    ApiResponse<UploadKnowledgeResponseData>
  >("/knowledge/upload", {
    file: payload.file,
    job_position_id: payload.job_position_id,
    title: payload.title ?? "",
  });
  return data;
};

export const getKnowledgeDocuments = async (): Promise<
  ApiResponse<KnowledgeDocument[]>
> => {
  const { data } =
    await axiosInstance.get<ApiResponse<KnowledgeDocument[]>>("/knowledge");
  return data;
};

export const getKnowledgeDocumentsByJob = async (
  jobId: string
): Promise<ApiResponse<KnowledgeDocument[]>> => {
  const { data } = await axiosInstance.get<ApiResponse<KnowledgeDocument[]>>(
    `/knowledge?job_position_id=${jobId}`
  );
  return data;
};

export const deleteKnowledgeDocument = async (
  id: string
): Promise<ApiResponse<void>> => {
  const { data } = await axiosInstance.delete<ApiResponse<void>>(
    `/knowledge/${id}`
  );
  return data;
};
