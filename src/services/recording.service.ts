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
  formData.append("question_id", payload.question_id);
  formData.append("speaker_role", payload.speaker_role);
  // append the audio file with a dummy filename, as the BE uses multer
  formData.append("audio_file", payload.audio_blob, `audio_${payload.speaker_role}_${Date.now()}.webm`);

  // Phải config headers là multipart/form-data
  const { data } = await axiosInstance.post<ApiResponse<any>>(
    "/api/v1/recordings/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return data;
};
