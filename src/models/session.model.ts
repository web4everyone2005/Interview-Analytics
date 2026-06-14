// ============================================================
// Tầng MODEL - Session
// Mô phỏng kiểu dữ liệu Session mà BE gửi về / FE gửi lên
// ============================================================

export enum SessionStatus {
  SCHEDULED = "SCHEDULED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export interface SessionHR {
  id: string;
  name: string;
  email: string;
}

export interface Session {
  id?: string;
  _id?: string;
  conductor_id?: any;
  job_position_id?: any;
  candidate_profile_id?: any;
  candidate_name?: string; // Tạm thời ánh xạ nếu cần thiết, thực tế từ populate
  candidate_email?: string;
  room_code: string;
  scheduled_at?: string;
  status: SessionStatus | string;
  questions?: any[]; // Chi tiết các câu hỏi trong phòng phỏng vấn
  createdAt: string;
  updatedAt: string;
}

export interface CreateSessionPayload {
  job_position_id: string;
  candidate_profile_id: string;
  question_bank_ids?: string[];
  scheduled_at?: string;
}

export interface UpdateSessionPayload {
  status?: string;
  scheduled_at?: string;
}
