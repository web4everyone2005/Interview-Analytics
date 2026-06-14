import { Skill } from "./skill.model";

export type SkillRef = string | Pick<Skill, "_id" | "name">;

export interface JobPosition {
  _id: string;
  title: string;
  department: string;
  required_skills: SkillRef[];
  is_active: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface CreateJobPositionPayload {
  title: string;
  department?: string;
  required_skills?: string[];
}

export type UpdateJobPositionPayload = Partial<CreateJobPositionPayload>;
