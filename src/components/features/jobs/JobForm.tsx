"use client";

import React, { useState } from "react";
import { JobPosition, CreateJobPayload, UpdateJobPayload } from "@/models/job.model";
import { createJob, updateJob } from "@/services/job.service";
import { X } from "lucide-react";

interface JobFormProps {
  job: JobPosition | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function JobForm({ job, onClose, onSuccess }: JobFormProps) {
  const isEditing = !!job;

  const [formData, setFormData] = useState<CreateJobPayload>({
    title: job?.title || "",
    department: job?.department || "",
    description: job?.description || "",
    requirements: job?.requirements || "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const jobId = job?._id || job?.id;
      if (isEditing && jobId) {
        await updateJob(jobId, formData as UpdateJobPayload);
      } else {
        await createJob(formData);
      }
      onSuccess();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Đã có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto pt-10 pb-10">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-bold mb-4">
          {isEditing ? "Cập nhật Vị trí Tuyển dụng" : "Thêm Vị trí mới"}
        </h2>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tiêu đề (Title) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                placeholder="VD: Senior Frontend Developer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phòng ban (Department)
              </label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                placeholder="VD: Engineering"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả công việc (Description)
            </label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              placeholder="Nhập mô tả..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Yêu cầu (Requirements)
            </label>
            <textarea
              name="requirements"
              rows={4}
              value={formData.requirements}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              placeholder="Nhập yêu cầu kỹ năng, kinh nghiệm..."
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
              {isLoading ? "Đang lưu..." : "Lưu Vị trí"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
