export interface JobPosition {
  id?: string;
  _id?: string;
  owner_id?: string;
  title: string;
  department?: string;
  description?: string;
  requirements?: string;
  required_skills?: any[]; // Tạm thời dùng any[] hoặc định nghĩa Skill model sau
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateJobPayload {
  title: string;
  department?: string;
  description?: string;
  requirements?: string;
  required_skills?: string[];
}

export interface UpdateJobPayload {
  title?: string;
  department?: string;
  description?: string;
  requirements?: string;
  required_skills?: string[];
}
