import axios, {
    AxiosError,
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from "axios";

// ─── Constants ────────────────────────────────────────────────
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";
const API_TIMEOUT = Number(process.env.NEXT_PUBLIC_API_TIMEOUT) || 120*60*1000;
const ACCESS_TOKEN_KEY = "access_token";    
const REFRESH_TOKEN_KEY = "refresh_token";
const ACCESS_TOKEN_COOKIE = "access_token";

// ─── Helpers: Cookie ──────────────────────────────────────────
const cookieHelper = {
    set: (name: string, value: string, days = 7): void => {
        if (typeof document === "undefined") return;
        const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
        document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
    },
    remove: (name: string): void => {
        if (typeof document === "undefined") return;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
    },
};

// ─── Helpers: LocalStorage + Cookie (Dành cho toàn bộ dự án import) ───
export const tokenStorage = {
    getAccessToken: (): string | null => {
        if (typeof window === "undefined") return null;
        return localStorage.getItem(ACCESS_TOKEN_KEY);
    },
    getRefreshToken: (): string | null => {
        if (typeof window === "undefined") return null;
        return localStorage.getItem(REFRESH_TOKEN_KEY);
    },
    setTokens: (accessToken: string, refreshToken?: string): void => {
        localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
        if (refreshToken) {
            localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        }
        cookieHelper.set(ACCESS_TOKEN_COOKIE, accessToken);
    },
    clearTokens: (): void => {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        cookieHelper.remove(ACCESS_TOKEN_COOKIE);
    },
};

// ─── Khởi tạo thực thể AxiosInstance dùng chung ───────────────────
const axiosInstance: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT,
    withCredentials: true,
    headers: {
        Accept: "application/json",
    },
});

// ─── Request Interceptor (Tự động đính kèm token đăng nhập) ───
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

// ─── Response Interceptor (Xử lý hàng đợi và Tự động làm mới Token 401) ───
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value: unknown) => void;
    reject: (reason?: unknown) => void;
}> = [];

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
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status !== 401 || originalRequest._retry) {
            return Promise.reject(error);
        }

        const url = originalRequest.url ?? "";
        if (url.includes("/auth/login") || url.includes("/auth/refresh")) {
            return Promise.reject(error);
        }

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

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            const { data } = await axios.post(
                `${API_BASE_URL}/auth/refresh`,
                undefined,
                { withCredentials: true }
            );

            const accessToken = data?.data?.accessToken ?? data?.accessToken;
            const newRefreshToken = data?.data?.refreshToken ?? data?.refreshToken;
            tokenStorage.setTokens(accessToken, newRefreshToken);

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