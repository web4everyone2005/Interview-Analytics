import axiosInstance from "@/lib/axios";
import { ApiResponse } from "@/models/common.model";

export interface UploadRecordingPayload {
  session_id: string;
  question_id: string;
  speaker_role: "HR" | "CANDIDATE";
  audio_blob: Blob;
}

export const uploadRecording = async (
  payload: UploadRecordingPayload
): Promise<ApiResponse<any>> => {
  const formData = new FormData();
  formData.append("session_id", payload.session_id);
  formData.append("session_question_id", payload.question_id);
  formData.append("question_id", payload.question_id);
  formData.append("user_role", payload.speaker_role);
  // append the audio file with a dummy filename, as the BE uses multer
  formData.append("audio", payload.audio_blob, `audio_${payload.speaker_role}_${Date.now()}.webm`);

  // Không set Content-Type thủ công để Axios tự sinh boundary
  const { data } = await axiosInstance.post<ApiResponse<any>>(
    "/recordings/upload",
    formData
  );
  return data;
};
