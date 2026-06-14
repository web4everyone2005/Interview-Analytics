import axiosInstance from "@/lib/axios";
import { ApiResponse } from "@/models/common.model";
import {
  CreateQuestionCategoryPayload,
  QuestionCategory,
} from "@/models/question-category.model";

export const getCategories = async (): Promise<
  ApiResponse<QuestionCategory[]>
> => {
  const { data } =
    await axiosInstance.get<ApiResponse<QuestionCategory[]>>("/categories");
  return data;
};

export const createCategory = async (
  payload: CreateQuestionCategoryPayload
): Promise<ApiResponse<QuestionCategory>> => {
  const { data } = await axiosInstance.post<ApiResponse<QuestionCategory>>(
    "/categories",
    payload
  );
  return data;
};

export const deleteCategory = async (
  id: string
): Promise<ApiResponse<null>> => {
  const { data } = await axiosInstance.delete<ApiResponse<null>>(
    `/categories/${id}`
  );
  return data;
};
