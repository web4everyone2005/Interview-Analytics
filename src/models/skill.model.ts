export interface Skill {
  _id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface CreateSkillPayload {
  name: string;
}
