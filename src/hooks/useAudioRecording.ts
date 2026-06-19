import { useState, useRef, useCallback } from "react";
import { uploadRecording } from "@/services/recording.service";

export const useAudioRecording = (
    sessionId: string,
    speakerRole: "HR" | "CANDIDATE"
) => {
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    const startRecording = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });

            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.start(1000); // chunk every 1s
            setIsRecording(true);
        } catch (error) {
            console.error("Error accessing microphone:", error);
            alert("Không thể truy cập Microphone. Vui lòng cấp quyền.");
        }
    }, []);

    const stopRecordingAndUpload = useCallback(
        async (questionId: string) => {
            if (!mediaRecorderRef.current) return;

            return new Promise<void>((resolve) => {
                const recorder = mediaRecorderRef.current!;

                recorder.onstop = async () => {
                    setIsRecording(false);

                    // Nhả Microphone
                    recorder.stream.getTracks().forEach(track => track.stop());

                    // Lấy Blob từ các chunk SAU KHI event dataavailable cuối cùng đã fired
                    const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
                    audioChunksRef.current = [];

                    try {
                        // Lấy token trên URL đính kèm để Candidate có quyền upload an toàn qua API bảo mật công cộng
                        const searchParams = new URLSearchParams(window.location.search);
                        const token = searchParams.get("token") || "";

                        await uploadRecording({
                            session_id: sessionId,
                            question_id: questionId,
                            speaker_role: speakerRole, // FIX: Đổi từ speaker_role sang user_role để khớp DB và validation Backend
                            audio_blob: audioBlob,
                            token: token // Bổ sung token nếu cần truyền xuống service axios
                        });
                        console.log(`Đã upload audio thành công cho câu hỏi ${questionId}`);
                    } catch (err) {
                        console.error("Lỗi upload audio:", err);
                    }
                    resolve();
                };

                recorder.stop();
            });
        },
        [sessionId, speakerRole]
    );

    // BỔ SUNG: Hàm giúp component bên ngoài có thể lấy thực thể MediaRecorder để phục vụ luồng Stream Socket
    const getMediaRecorder = useCallback(() => {
        return mediaRecorderRef.current;
    }, []);

    return {
        isRecording,
        startRecording,
        stopRecordingAndUpload,
        getMediaRecorder, // Export hàm này ra ngoài
    };
};