"use client";

import React, { useState } from "react";
import { CreateSessionPayload, Session } from "@/models/session.model";
import { createSession, updateSession } from "@/services/session.service";
import { X } from "lucide-react";
import { useJobs } from "@/hooks/useJob";
import { useCandidates } from "@/hooks/useCandidate";

interface SessionFormProps {
  session: Session | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function SessionForm({ session, onClose, onSuccess }: SessionFormProps) {
  const isEditing = !!session;
  
  const { jobs } = useJobs();
  const { candidates } = useCandidates();

  const [formData, setFormData] = useState<Partial<CreateSessionPayload>>({
    job_position_id: session?.job_position_id?._id || "",
    candidate_profile_id: session?.candidate_profile_id?._id || "",
    scheduled_at: session?.scheduled_at ? new Date(session.scheduled_at).toISOString().slice(0, 16) : "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const sessionId = session?._id || session?.id;
      if (isEditing && sessionId) {
        // Chỉ hỗ trợ update status hoặc scheduled_at
        await updateSession(sessionId, { scheduled_at: formData.scheduled_at });
      } else {
        await createSession(formData as CreateSessionPayload);
      }
      onSuccess();
    } catch (err: any) {
      // BR-05: RAG Prerequisite Gatekeeper sẽ được Backend bắn ra lỗi 403 nếu Knowledge chưa học xong
      setErrorMsg(err.response?.data?.message || "Đã có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto pt-10 pb-10">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-bold mb-4">
          {isEditing ? "Cập nhật Phiên Phỏng vấn" : "Lên lịch Phỏng vấn mới"}
        </h2>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vị trí tuyển dụng <span className="text-red-500">*</span>
            </label>
            <select
              name="job_position_id"
              required
              value={formData.job_position_id}
              onChange={handleChange}
              disabled={isEditing}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
            >
              <option value="">-- Chọn Vị trí --</option>
              {jobs.map((job) => {
                const jobId = job._id || job.id;
                return (
                  <option key={jobId} value={jobId}>
                    {job.title} ({job.department})
                  </option>
                );
              })}
            </select>
            <p className="text-xs text-gray-500 mt-1">Lưu ý: Không thể chọn vị trí đang được AI học tài liệu RAG.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ứng viên <span className="text-red-500">*</span>
            </label>
            <select
              name="candidate_profile_id"
              required
              value={formData.candidate_profile_id}
              onChange={handleChange}
              disabled={isEditing}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
            >
              <option value="">-- Chọn Ứng viên --</option>
              {candidates.map((cand) => {
                const candId = cand._id || cand.id;
                return (
                  <option key={candId} value={candId}>
                    {cand.full_name} ({cand.email})
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thời gian dự kiến
            </label>
            <input
              type="datetime-local"
              name="scheduled_at"
              value={formData.scheduled_at}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
              disabled={isLoading}
            >
              Huỷ
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Đang lưu..." : "Lưu Phiên"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
