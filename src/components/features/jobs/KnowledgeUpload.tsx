"use client";

import React, { useState, useRef } from "react";
import { useKnowledgeDocs } from "@/hooks/useKnowledge";
import { uploadKnowledgeDocument } from "@/services/knowledge.service";
import { X, UploadCloud, FileText, CheckCircle, Clock } from "lucide-react";

interface KnowledgeUploadProps {
  jobId: string;
  onClose: () => void;
}

export default function KnowledgeUpload({ jobId, onClose }: KnowledgeUploadProps) {
  const { documents, isLoading, error, mutate } = useKnowledgeDocs(jobId);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type (PDF/Word)
    const validTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!validTypes.includes(file.type)) {
      setUploadError("Chỉ chấp nhận file PDF hoặc Word (.doc, .docx)");
      return;
    }

    setIsUploading(true);
    setUploadError("");

    try {
      await uploadKnowledgeDocument(jobId, file);
      mutate();
    } catch (err: any) {
      setUploadError(err.response?.data?.message || "Lỗi upload tài liệu.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-bold mb-4">Quản lý Tài liệu AI RAG</h2>
        <p className="text-sm text-gray-500 mb-6">
          Tải lên tài liệu chuyên môn, mô tả công việc hoặc sổ tay hướng dẫn để AI học và dùng làm cơ sở chấm điểm ứng viên.
        </p>

        {uploadError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
            {uploadError}
          </div>
        )}

        {/* Upload Zone */}
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 cursor-pointer transition mb-8"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf,.doc,.docx"
          />
          <UploadCloud className="mx-auto text-blue-500 mb-3" size={40} />
          <p className="font-medium text-gray-700">
            {isUploading ? "Đang tải lên..." : "Nhấn để chọn file (PDF, Word)"}
          </p>
          <p className="text-xs text-gray-500 mt-2">Dung lượng tối đa 10MB</p>
        </div>

        {/* Document List */}
        <h3 className="font-semibold text-gray-800 mb-3">Tài liệu đã tải lên</h3>
        
        {isLoading ? (
          <div className="text-sm text-gray-500">Đang tải danh sách...</div>
        ) : error ? (
          <div className="text-sm text-red-500">Lỗi lấy danh sách tài liệu.</div>
        ) : documents.length === 0 ? (
          <div className="text-sm text-gray-500 italic">Chưa có tài liệu nào.</div>
        ) : (
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
            {documents.map(doc => (
              <div key={doc.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex items-center gap-3 overflow-hidden">
                  <FileText className="text-gray-400 shrink-0" size={24} />
                  <div className="truncate">
                    <p className="font-medium text-sm text-gray-800 truncate" title={doc.file_name}>{doc.file_name}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(doc.uploaded_at).toLocaleString('vi-VN')}
                    </p>
                  </div>
                </div>
                
                <div className="shrink-0 ml-4">
                  {doc.is_processed ? (
                    <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                      <CheckCircle size={14} /> Đã học xong
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-100 px-2 py-1 rounded">
                      <Clock size={14} /> AI đang xử lý...
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
