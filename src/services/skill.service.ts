import axiosInstance from "@/lib/axios";
import { ApiResponse } from "@/models/common.model";
import { CreateSkillPayload, Skill } from "@/models/skill.model";

export const getSkills = async (): Promise<ApiResponse<Skill[]>> => {
  const { data } = await axiosInstance.get<ApiResponse<Skill[]>>("/skills");
  return data;
};

export const createSkill = async (
  payload: CreateSkillPayload
): Promise<ApiResponse<Skill>> => {
  const { data } = await axiosInstance.post<ApiResponse<Skill>>(
    "/skills",
    payload
  );
  return data;
};

export const deleteSkill = async (id: string): Promise<ApiResponse<null>> => {
  const { data } = await axiosInstance.delete<ApiResponse<null>>(`/skills/${id}`);
  return data;
};
