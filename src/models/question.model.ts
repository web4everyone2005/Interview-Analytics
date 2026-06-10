import { QuestionCategory } from "./question-category.model";
import { Skill } from "./skill.model";

export type QuestionCategoryRef = string | Pick<QuestionCategory, "_id" | "name">;
export type QuestionSkillRef = string | Pick<Skill, "_id" | "name">;

export interface Question {
  id: string;
  category_id: QuestionCategoryRef;
  assessed_skills: QuestionSkillRef[];
  content: string;
  expected_answer: string;
  embedding: number[];
  score?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface QuestionListResponse {
  data: Question[];
  total: number;
}

export interface CreateQuestionPayload {
  category_id: string;
  assessed_skills?: string[];
  content: string;
  expected_answer: string;
}

export type UpdateQuestionPayload = Partial<CreateQuestionPayload>;

export interface QuestionFilterParams {
  category_id?: string;
}

export interface QuestionImportResponse {
  message: string;
  data: Question[];
}
