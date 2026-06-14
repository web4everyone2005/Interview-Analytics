export interface QuestionCategory {
  _id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface CreateQuestionCategoryPayload {
  name: string;
}
