import axiosInstance from "@/lib/axios";
import { ApiResponse } from "@/models/common.model";
import { AxiosRequestConfig } from "axios";

export interface UploadRecordingPayload {
    session_id: string;
    question_id: string;
    user_role: "HR" | "CANDIDATE";
    audio_blob: Blob;
    token?: string;
}

// FIX: Thay <any> bằng <unknown> để vượt qua bộ lọc nghiêm ngặt của ESLint
export const uploadRecording = async (
    payload: UploadRecordingPayload
): Promise<ApiResponse<unknown>> => {
    const formData = new FormData();
    formData.append("session_id", payload.session_id);
    formData.append("session_question_id", payload.question_id);
    formData.append("question_id", payload.question_id);
    formData.append("user_role", payload.user_role);

    // append the audio file with a dummy filename, as the BE uses multer
    formData.append("audio", payload.audio_blob, `audio_${payload.user_role}_${Date.now()}.webm`);

    const config: AxiosRequestConfig = {};

    if (payload.token) {
        config.headers = {
            Authorization: `Bearer ${payload.token}`
        };
    }

    // FIX ở đây luôn: Thay <any> bằng <unknown> tương ứng
    const { data } = await axiosInstance.post<ApiResponse<unknown>>(
        "/recordings/upload",
        formData,
        config
    );
    return data;
};