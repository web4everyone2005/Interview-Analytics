"use client";

import React, { useState } from "react";
import { useCandidates } from "@/hooks/useCandidate";
import { Candidate } from "@/models/candidate.model";
import { Plus, Trash2, Edit } from "lucide-react";
import CandidateForm from "@/components/features/candidates/CandidateForm";

export default function CandidateList() {
  const { candidates, isLoading, error, mutate } = useCandidates();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);

  const handleOpenForm = (candidate?: Candidate) => {
    setEditingCandidate(candidate || null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingCandidate(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xoá ứng viên này? (Nếu ứng viên đã có lịch phỏng vấn sẽ không thể xoá)")) return;
    
    try {
      const { deleteCandidate } = await import("@/services/candidate.service");
      await deleteCandidate(id);
      mutate();
      alert("Xoá thành công!");
    } catch (err: any) {
      // BR-01: Bắt lỗi không thể xoá nếu đã có Session
      alert(err.response?.data?.message || "Có lỗi xảy ra khi xoá ứng viên.");
    }
  };

  if (isLoading) return <div className="p-4">Đang tải danh sách ứng viên...</div>;
  if (error) return <div className="p-4 text-red-500">Lỗi tải dữ liệu.</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý Ứng viên</h1>
        <button
          onClick={() => handleOpenForm()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          <Plus size={18} /> Thêm Ứng viên
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-4 border-b">Họ và tên</th>
              <th className="p-4 border-b">Email</th>
              <th className="p-4 border-b">Link CV (Resume)</th>
              <th className="p-4 border-b w-32">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {candidates.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  Chưa có dữ liệu ứng viên.
                </td>
              </tr>
            ) : (
              candidates.map((candidate) => {
                const candidateId = candidate._id || candidate.id || "";
                return (
                <tr key={candidateId} className="hover:bg-gray-50 border-b">
                  <td className="p-4 font-medium">{candidate.full_name}</td>
                  <td className="p-4">{candidate.email}</td>
                  <td className="p-4">
                    {candidate.resume_url ? (
                      <a href={candidate.resume_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                        Xem CV
                      </a>
                    ) : (
                      <span className="text-gray-400">Không có</span>
                    )}
                  </td>
                  <td className="p-4 flex items-center gap-3">
                    <button onClick={() => handleOpenForm(candidate)} className="text-gray-600 hover:text-blue-600">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(candidateId)} className="text-gray-600 hover:text-red-600">
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
        <CandidateForm
          candidate={editingCandidate}
          onClose={handleCloseForm}
          onSuccess={() => {
            mutate();
            handleCloseForm();
          }}
        />
      )}
    </div>
  );
}
