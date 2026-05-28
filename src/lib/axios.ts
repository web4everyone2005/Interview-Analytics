// ============================================================
// LIB - Axios Setup (File duy nhất cấu hình Axios)
//
// Tất cả các Service đều import axiosInstance từ file này.
// KHÔNG gọi axios trực tiếp ở bất kỳ nơi nào khác.
// ============================================================

import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

// ─── Constants ────────────────────────────────────────────────
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api";

const API_TIMEOUT = Number(process.env.NEXT_PUBLIC_API_TIMEOUT) || 10000;

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

// ─── Helpers: LocalStorage ─────────────────────────────────────
export const tokenStorage = {
  getAccessToken: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },
  getRefreshToken: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },
  setTokens: (accessToken: string, refreshToken: string): void => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },
  clearTokens: (): void => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};

// ─── Tạo Axios Instance ────────────────────────────────────────
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ─── Request Interceptor ───────────────────────────────────────
// Tự động gắn Authorization header cho mỗi request
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenStorage.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// ─── Response Interceptor ─────────────────────────────────────
// Xử lý refresh token khi nhận 401 Unauthorized
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

/**
 * Xử lý hàng đợi các request đang chờ refresh token.
 */
const processQueue = (error: AxiosError | null, token: string | null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    // Nếu không phải 401 hoặc đã retry rồi → trả lỗi luôn
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Nếu đang refresh token → đưa request vào hàng đợi
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return axiosInstance(originalRequest);
        })
        .catch(Promise.reject);
    }

    // Bắt đầu refresh token
    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken = tokenStorage.getRefreshToken();

    if (!refreshToken) {
      // Không có refresh token → logout
      tokenStorage.clearTokens();
      window.location.href = "/login";
      return Promise.reject(error);
    }

    try {
      // ⚠️ Đổi endpoint này cho khớp với BE của bạn
      const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
        refreshToken,
      });

      const { accessToken, refreshToken: newRefreshToken } = data;
      tokenStorage.setTokens(accessToken, newRefreshToken);

      // Cập nhật header cho request gốc
      axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      }

      processQueue(null, accessToken);
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError as AxiosError, null);
      tokenStorage.clearTokens();
      window.location.href = "/login";
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosInstance;
