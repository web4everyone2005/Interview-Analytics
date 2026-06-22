import axiosInstance from "@/lib/axios";
import { ApiResponse } from "@/models/common.model";
import {
  CreateQuestionPayload,
  Question,
  QuestionFilterParams,
  QuestionImportResponse,
  QuestionListResponse,
  UpdateQuestionPayload,
} from "@/models/question.model";

export const getQuestions = async (
  params?: QuestionFilterParams
): Promise<QuestionListResponse> => {
  const { data } = await axiosInstance.get<QuestionListResponse>("/questions", {
    params,
  });
  return data;
};

export const getQuestionById = async (
  id: string
): Promise<ApiResponse<Question>> => {
  const { data } = await axiosInstance.get<ApiResponse<Question>>(
    `/questions/${id}`
  );
  return data;
};

export const createQuestion = async (
  payload: CreateQuestionPayload
): Promise<ApiResponse<Question>> => {
  const { data } = await axiosInstance.post<ApiResponse<Question>>(
    "/questions",
    payload
  );
  return data;
};

export const updateQuestion = async (
  id: string,
  payload: UpdateQuestionPayload
): Promise<ApiResponse<Question>> => {
  const { data } = await axiosInstance.put<ApiResponse<Question>>(
    `/questions/${id}`,
    payload
  );
  return data;
};

export const deleteQuestion = async (
  id: string
): Promise<ApiResponse<null>> => {
  const { data } = await axiosInstance.delete<ApiResponse<null>>(
    `/questions/${id}`
  );
  return data;
};

export const importQuestionsFromPdf = async (payload: {
    file: File;
    category_id: string;
}): Promise<QuestionImportResponse> => {
    const { data } = await axiosInstance.postForm<QuestionImportResponse>(
        "/questions/import-pdf",
        {
            file: payload.file,
            category_id: payload.category_id,
        }
    );
    return data;
};
