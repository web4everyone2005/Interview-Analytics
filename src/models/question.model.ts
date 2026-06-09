// ============================================================
// Tầng MODEL - Question
// Mô phỏng kiểu dữ liệu Question mà BE gửi về / FE gửi lên
// ============================================================

/**
 * Kiểu Question BE trả về (response).
 */
export interface Question {
  id: string;
  content: string;
  expected_answer: string;
  domain: string;
  keywords: string[];
  embedding: number[]; // Vector embedding — thường rỗng [] khi trả về FE
  createdAt: string;   // ISO 8601
  updatedAt: string;   // ISO 8601
}

/**
 * Response của GET /questions.
 * Không dùng ApiResponse chuẩn vì BE trả { data, total } trực tiếp.
 */
export interface QuestionListResponse {
  data: Question[];
  total: number;
}

/**
 * Payload khi tạo câu hỏi mới (POST /questions).
 */
export interface CreateQuestionPayload {
  content: string;
  expected_answer: string;
  domain: string;
  keywords?: string[];
}

/**
 * Payload khi cập nhật câu hỏi (PUT /questions/:id).
 * Tất cả field đều optional.
 */
export type UpdateQuestionPayload = Partial<CreateQuestionPayload>;
