// ============================================================
// Tầng SERVICE - Question
//
// Chỉ có tầng này biết URL endpoint, params, payload cho Question.
// Import axiosInstance từ lib/axios.
// ============================================================

import axiosInstance from "@/lib/axios";
import { ApiResponse } from "@/models/common.model";
import {
  CreateQuestionPayload,
  Question,
  QuestionListResponse,
  UpdateQuestionPayload,
} from "@/models/question.model";

/**
 * Lấy danh sách tất cả câu hỏi.
 * GET /questions → { data: Question[], total: number }
 */
export const getQuestions = async (): Promise<QuestionListResponse> => {
  const { data } = await axiosInstance.get<QuestionListResponse>("/questions");
  return data;
};

/**
 * Lấy thông tin chi tiết một câu hỏi theo ID.
 * GET /questions/:id
 */
export const getQuestionById = async (
  id: string
): Promise<ApiResponse<Question>> => {
  const { data } = await axiosInstance.get<ApiResponse<Question>>(
    `/questions/${id}`
  );
  return data;
};

/**
 * Tạo câu hỏi mới.
 * POST /questions
 */
export const createQuestion = async (
  payload: CreateQuestionPayload
): Promise<ApiResponse<Question>> => {
  const { data } = await axiosInstance.post<ApiResponse<Question>>(
    "/questions",
    payload
  );
  return data;
};

/**
 * Cập nhật câu hỏi theo ID.
 * PUT /questions/:id
 */
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

/**
 * Xóa câu hỏi theo ID.
 * DELETE /questions/:id
 */
export const deleteQuestion = async (
  id: string
): Promise<ApiResponse<null>> => {
  const { data } = await axiosInstance.delete<ApiResponse<null>>(
    `/questions/${id}`
  );
  return data;
};
