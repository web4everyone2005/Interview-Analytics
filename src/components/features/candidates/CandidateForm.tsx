"use client";

import React, { useState } from "react";
import { Candidate, CreateCandidatePayload, UpdateCandidatePayload } from "@/models/candidate.model";
import { createCandidate, updateCandidate } from "@/services/candidate.service";
import { X } from "lucide-react";

interface CandidateFormProps {
  candidate: Candidate | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CandidateForm({ candidate, onClose, onSuccess }: CandidateFormProps) {
  const isEditing = !!candidate;

  const [formData, setFormData] = useState<CreateCandidatePayload>({
    full_name: candidate?.full_name || "",
    email: candidate?.email || "",
    resume_url: candidate?.resume_url || "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const candidateId = candidate?._id || candidate?.id;
      if (isEditing && candidateId) {
        await updateCandidate(candidateId, formData as UpdateCandidatePayload);
      } else {
        await createCandidate(formData);
      }
      onSuccess();
    } catch (err: any) {
      // BR-01: Nếu update ứng viên đang có lịch phỏng vấn thì báo lỗi
      setErrorMsg(err.response?.data?.message || "Đã có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-bold mb-4">
          {isEditing ? "Cập nhật Ứng viên" : "Thêm Ứng viên mới"}
        </h2>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="full_name"
              required
              value={formData.full_name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              placeholder="Nhập họ và tên..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              placeholder="example@domain.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Link CV (Resume URL)
            </label>
            <input
              type="url"
              name="resume_url"
              value={formData.resume_url}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              placeholder="https://drive.google.com/..."
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
              {isLoading ? "Đang lưu..." : "Lưu ứng viên"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
