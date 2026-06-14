"use client";

import React, { useState } from "react";
import { useJobs } from "@/hooks/useJob";
import { JobPosition } from "@/models/job.model";
import { Plus, Trash2, Edit } from "lucide-react";
import JobForm from "@/components/features/jobs/JobForm";
import KnowledgeUpload from "@/components/features/jobs/KnowledgeUpload";

export default function JobList() {
  const { jobs, isLoading, error, mutate } = useJobs();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobPosition | null>(null);
  const [uploadJobId, setUploadJobId] = useState<string | null>(null);

  const handleOpenForm = (job?: JobPosition) => {
    setEditingJob(job || null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingJob(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xoá vị trí này?")) return;
    try {
      const { deleteJob } = await import("@/services/job.service");
      await deleteJob(id);
      mutate();
      alert("Xoá thành công!");
    } catch (err: any) {
      alert(err.response?.data?.message || "Có lỗi xảy ra khi xoá.");
    }
  };

  if (isLoading) return <div className="p-4">Đang tải danh sách vị trí tuyển dụng...</div>;
  if (error) return <div className="p-4 text-red-500">Lỗi tải dữ liệu.</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Vị trí Tuyển dụng (Jobs)</h1>
        <button
          onClick={() => handleOpenForm()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          <Plus size={18} /> Tạo Vị trí mới
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-4 border-b">Tiêu đề (Title)</th>
              <th className="p-4 border-b">Phòng ban</th>
              <th className="p-4 border-b">Mô tả ngắn</th>
              <th className="p-4 border-b w-48">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {jobs.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  Chưa có vị trí tuyển dụng nào.
                </td>
              </tr>
            ) : (
              jobs.map((job) => {
                const jobId = job._id || job.id || "";
                return (
                <tr key={jobId} className="hover:bg-gray-50 border-b">
                  <td className="p-4 font-medium">{job.title}</td>
                  <td className="p-4">{job.department || "-"}</td>
                  <td className="p-4 truncate max-w-xs">{job.description || "-"}</td>
                  <td className="p-4 flex items-center gap-3">
                    <button
                      onClick={() => setUploadJobId(jobId)}
                      className="text-sm bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200"
                    >
                      Tài liệu AI
                    </button>
                    <button onClick={() => handleOpenForm(job)} className="text-gray-600 hover:text-blue-600">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(jobId)} className="text-gray-600 hover:text-red-600">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {isFormOpen && (
        <JobForm
          job={editingJob}
          onClose={handleCloseForm}
          onSuccess={() => {
            mutate();
            handleCloseForm();
          }}
        />
      )}

      {uploadJobId && (
        <KnowledgeUpload
          jobId={uploadJobId}
          onClose={() => setUploadJobId(null)}
        />
      )}
    </div>
  );
}
