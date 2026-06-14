// ============================================================
// Tầng MODEL - Common (Dùng chung cho tất cả các feature)
// Mô phỏng cấu trúc response chuẩn từ BE
// ============================================================

/**
 * Wrapper response chuẩn từ BE.
 * BE thường trả về dạng: { success, message, data }
 */
export interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data: T;
}

/**
 * Response có phân trang từ BE.
 */
export interface PaginatedResponse<T> {
  success?: boolean;
  message?: string;
  data: T[];
  pagination: Pagination;
}

/**
 * Thông tin phân trang.
 */
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Params phân trang khi gọi API.
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

/**
 * Cấu trúc lỗi từ BE.
 */
export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  statusCode: number;
}
