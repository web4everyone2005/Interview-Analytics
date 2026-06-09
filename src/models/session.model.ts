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

/**
 * Kiểu Session BE trả về (response).
 */
export interface Session {
  id: string;
  title: string;
  hr_id: SessionHR;
  candidate_name: string;
  candidate_email: string;
  questions: string[]; // Danh sách ID câu hỏi
  status: SessionStatus | string;
  room_code: string;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

/**
 * Payload khi tạo phiên phỏng vấn mới (POST /sessions).
 */
export interface CreateSessionPayload {
  title: string;
  candidate_name: string;
  candidate_email: string;
  questions?: string[];
  status?: SessionStatus | string;
}

/**
 * Payload khi cập nhật phiên phỏng vấn (PUT /sessions/:id).
 */
export type UpdateSessionPayload = Partial<CreateSessionPayload>;
