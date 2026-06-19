import axios, { AxiosRequestConfig } from "axios"; 
import { ApiResponse } from "@/models/common.model";

export interface UploadRecordingPayload {
    session_id: string;
    question_id: string;
    user_role: "HR" | "CANDIDATE";
    audio_blob: Blob;
    token?: string;
}

export const uploadRecording = async (
    payload: UploadRecordingPayload
): Promise<ApiResponse<unknown>> => {
    const formData = new FormData();
    formData.append("session_id", payload.session_id);
    formData.append("session_question_id", payload.question_id);
    formData.append("question_id", payload.question_id);
    formData.append("user_role", payload.user_role);

   
    formData.append("audio", payload.audio_blob, `audio_${payload.user_role}_${Date.now()}.webm`);

   
    const hostUrl = process.env.NEXT_PUBLIC_API_BASE_URL
        ? process.env.NEXT_PUBLIC_API_BASE_URL.replace("/api/v1", "")
        : "http://localhost:5000"; 

   
    const uploadUrl = `${hostUrl}/api/v1/recordings/upload`;

    const config: AxiosRequestConfig = {
        withCredentials: true,
        headers: {}
    };

    if (payload.token && config.headers) {
        config.headers.Authorization = `Bearer ${payload.token}`;
    }

   
    const { data } = await axios.post<ApiResponse<unknown>>(
        uploadUrl,
        formData,
        config
    );
    return data;
};