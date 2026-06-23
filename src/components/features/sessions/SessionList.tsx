"use client";

import React, { useState } from "react";
import { useSessions } from "@/hooks/useSession";
import { Session, SessionStatus } from "@/models/session.model";
import { Plus, Trash2, Edit, Video, Mail, Link2 } from "lucide-react";
import SessionForm from "./SessionForm";
import Link from "next/link";
import { deleteSession, sendInvitation } from "@/services/session.service";

export default function SessionList() {
  const { sessions, isLoading, error, mutate } = useSessions();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);

  const handleOpenForm = (session?: Session) => {
    setEditingSession(session || null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingSession(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xoá phiên phỏng vấn này?")) return;
    try {
      await deleteSession(id);
      mutate();
      alert("Xoá thành công!");
    } catch (err: any) {
      alert(err.response?.data?.message || "Có lỗi xảy ra khi xoá.");
    }
  };

  const handleSendInvite = async (id: string) => {
    try {
      alert("Đang gửi email mời...");
      await sendInvitation(id);
      alert("Đã gửi email thành công!");
    } catch (err: any) {
      alert(err.response?.data?.message || "Có lỗi khi gửi email.");
    }
  };

  const handleCopyLink = async (token: string) => {
    try {
      const magicUrl = `${window.location.origin}/interview/join?token=${token}`;
      await navigator.clipboard.writeText(magicUrl);
      alert("Đã sao chép đường dẫn phỏng vấn ứng viên!");
    } catch (err) {
      alert("Lỗi khi sao chép link.");
    }
  };

  if (isLoading) return <div className="p-4">Đang tải danh sách phiên phỏng vấn...</div>;
  if (error) return <div className="p-4 text-red-500">Lỗi tải dữ liệu.</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Lịch Phỏng Vấn (Sessions)</h1>
        <button
          onClick={() => handleOpenForm()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          <Plus size={18} /> Tạo Phiên mới
        </button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 text-white/90 border-b border-white/10">
              <th className="p-4 font-semibold text-sm">Tiêu đề</th>
              <th className="p-4 font-semibold text-sm">Ứng viên</th>
              <th className="p-4 font-semibold text-sm">Trạng thái</th>
              <th className="p-4 font-semibold text-sm">Ngày tạo</th>
              <th className="p-4 font-semibold text-sm w-64">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {sessions.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-white/40">
                  Chưa có phiên phỏng vấn nào.
                </td>
              </tr>
            ) : (
              sessions.map((session) => {
                const sessionId = session.id || (session as any)._id;
                return (
                  <tr key={sessionId} className="hover:bg-white/[0.02] border-b border-white/5 transition-colors">
                    <td className="p-4 font-medium text-white">{session.job_position_id?.title || "N/A"}</td>
                    <td className="p-4">
                      <span className="font-semibold text-white">{session.candidate_profile_id?.full_name || "Unknown"}</span>
                      <div className="text-xs text-white/50 mt-1">{session.candidate_profile_id?.email || ""}</div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                          session.status === SessionStatus.SCHEDULED
                            ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                            : session.status === SessionStatus.IN_PROGRESS
                            ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                            : session.status === SessionStatus.COMPLETED
                            ? "bg-green-500/10 text-green-400 border border-green-500/20"
                            : "bg-red-500/10 text-red-400 border border-red-500/20"
                        }`}
                      >
                        {session.status}
                      </span>
                    </td>
                    <td className="p-4 text-white/70">
                      {new Date(session.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="p-4 flex flex-wrap items-center gap-3">
                      {/* HR Control Room */}
                      <Link
                        href={`/dashboard/interviews/${session.room_code}`}
                        className="text-xs flex items-center gap-1.5 bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2.5 py-1.5 rounded-lg hover:bg-blue-500/30 transition-all font-medium"
                        title="Vào phòng điều khiển"
                      >
                        <Video size={14} /> Vào phòng
                      </Link>
                      
                      {/* Send email */}
                      <button 
                        onClick={() => handleSendInvite(sessionId)} 
                        className="p-1.5 rounded-lg text-white/60 hover:text-green-400 hover:bg-white/5 transition-all"
                        title="Gửi Email Mời"
                      >
                        <Mail size={16} />
                      </button>

                      {/* Copy magic link */}
                      {session.magic_link_token && (
                        <button
                          onClick={() => handleCopyLink(session.magic_link_token!)}
                          className="p-1.5 rounded-lg text-white/60 hover:text-indigo-400 hover:bg-white/5 transition-all"
                          title="Sao chép Link phỏng vấn"
                        >
                          <Link2 size={16} />
                        </button>
                      )}

                      <button 
                        onClick={() => handleOpenForm(session)} 
                        className="p-1.5 rounded-lg text-white/60 hover:text-blue-400 hover:bg-white/5 transition-all"
                        title="Chỉnh sửa"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(sessionId)} 
                        className="p-1.5 rounded-lg text-white/60 hover:text-red-400 hover:bg-white/5 transition-all"
                        title="Xóa"
                      >
                        <Trash2 size={16} />
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
        <SessionForm
          session={editingSession}
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
