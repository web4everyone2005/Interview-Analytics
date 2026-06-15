"use client";

import { useState, useRef } from "react";
import { uploadKnowledgeDocument } from "@/services/knowledge.service";
import { useKnowledgeDocs } from "@/hooks/useKnowledge";
import { UploadCloud, FileText, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { KnowledgeDocument } from "@/models/knowledge.model";

interface Props {
  jobId: string;
  onClose?: () => void;
}

export default function KnowledgeUpload({ jobId, onClose }: Props) {
  const { documents, isLoading, error, mutate } = useKnowledgeDocs(jobId);
  const isError = !!error;
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (e.g. 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg("File quá lớn. Tối đa 10MB.");
      return;
    }

    try {
      setIsUploading(true);
      setErrorMsg("");
      await uploadKnowledgeDocument({
        file,
        job_position_id: jobId,
        title: file.name,
      });
      mutate();
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Lỗi khi tải lên file.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <FileText className="text-blue-500" size={20} />
            Kho Tài Liệu AI (RAG)
          </h2>
          <p className="text-sm text-gray-500 mt-1">Upload tài liệu (PDF, Word) để AI có thể tự động sinh câu hỏi</p>
        </div>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg mb-4 border border-red-100">
          <AlertCircle size={16} />
          {errorMsg}
        </div>
      )}

      {/* Upload Zone */}
      <div 
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition mb-8 
          ${isUploading ? "border-blue-300 bg-blue-50" : "border-gray-300 hover:bg-gray-50 hover:border-blue-400"}`}
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleUpload}
          className="hidden"
          accept=".pdf,.doc,.docx,.txt"
          disabled={isUploading}
        />
        {isUploading ? (
          <Loader2 className="mx-auto text-blue-500 mb-3 animate-spin" size={40} />
        ) : (
          <UploadCloud className="mx-auto text-gray-400 mb-3 group-hover:text-blue-500 transition-colors" size={40} />
        )}
        <p className="font-medium text-gray-700">
          {isUploading ? "Đang tải lên và xử lý..." : "Nhấn để chọn file (PDF, Word, TXT)"}
        </p>
        <p className="text-xs text-gray-500 mt-2">Dung lượng tối đa 10MB</p>
      </div>

      {/* Document List */}
      <h3 className="font-semibold text-gray-800 mb-3">Tài liệu đã tải lên ({documents?.length || 0})</h3>
      
      {isLoading ? (
        <div className="text-sm text-gray-500 flex items-center gap-2">
          <Loader2 size={14} className="animate-spin" /> Đang tải danh sách...
        </div>
      ) : isError ? (
        <div className="text-sm text-red-500">Lỗi khi tải danh sách tài liệu.</div>
      ) : documents?.length === 0 ? (
        <div className="text-sm text-gray-500 italic p-4 bg-gray-50 rounded-lg border border-gray-100 text-center">
          Chưa có tài liệu nào. AI chưa có context để hỏi.
        </div>
      ) : (
        <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
          {documents.map((doc: KnowledgeDocument) => (
            <div key={doc.id || doc._id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-white shadow-sm hover:border-blue-200 transition-colors">
              <div className="flex items-center gap-3 overflow-hidden">
                <FileText className="text-blue-400 shrink-0" size={24} />
                <div className="min-w-0">
                  <p className="font-medium text-sm text-gray-800 truncate" title={doc.title || doc.file_name}>
                    {doc.title || doc.file_name || "Tài liệu không tên"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(doc.uploaded_at || doc.createdAt || new Date()).toLocaleString('vi-VN')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-4">
                {doc.is_processed ? (
                  <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full border border-green-100">
                    <CheckCircle2 size={12} /> Đã học xong
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
                    <Loader2 size={12} className="animate-spin" /> Đang học...
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
