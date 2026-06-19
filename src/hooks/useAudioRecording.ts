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
        (questionId: string) => { 
            if (!mediaRecorderRef.current) return Promise.resolve();

            // Khóa chặt giá trị ID câu hỏi vào biến local của scope này để không bị ảnh hưởng bởi State bên ngoài
            const targetQuestionId = questionId;

            return new Promise<void>((resolve) => {
                const recorder = mediaRecorderRef.current!;

                recorder.onstop = async () => {
                    setIsRecording(false);

                    // Nhả Microphone ngay lập tức để tắt đèn báo ghi âm trên trình duyệt
                    recorder.stream.getTracks().forEach(track => track.stop());

                    // Gom toàn bộ chunk âm thanh thu được
                    const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
                    audioChunksRef.current = []; // Reset bộ nhớ đệm chunk

                    try {
                        // Lấy token trên URL đính kèm
                        const searchParams = new URLSearchParams(window.location.search);
                        const token = searchParams.get("token") || "";

                        console.log(`[useAudioRecording] Bắt đầu đẩy dữ liệu lên API. ID câu hỏi đích: ${targetQuestionId}`);

                        // Gọi Service với biến targetQuestionId đã được bảo vệ hoàn toàn
                        await uploadRecording({
                            session_id: sessionId,
                            question_id: targetQuestionId,
                            user_role: speakerRole,
                            audio_blob: audioBlob,
                            token: token
                        });

                        console.log(`Đã upload audio thành công cho câu hỏi ${targetQuestionId}`);
                    } catch (err) {
                        console.error("Lỗi upload audio:", err);
                    } finally {
                        // Đảm bảo dù upload thành công hay thất bại thì Promise cũng phải được giải phóng (resolve)
                        resolve();
                    }
                };

                // Bật lệnh dừng MediaRecorder vật lý
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