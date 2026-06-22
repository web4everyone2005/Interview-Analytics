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

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-4 border-b">Tiêu đề</th>
              <th className="p-4 border-b">Ứng viên</th>
              <th className="p-4 border-b">Trạng thái</th>
              <th className="p-4 border-b">Ngày tạo</th>
              <th className="p-4 border-b w-64">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {sessions.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  Chưa có phiên phỏng vấn nào.
                </td>
              </tr>
            ) : (
              sessions.map((session) => {
                const sessionId = session.id || (session as any)._id;
                return (
                  <tr key={sessionId} className="hover:bg-gray-50 border-b">
                    <td className="p-4 font-medium">{session.job_position_id?.title || "N/A"}</td>
                    <td className="p-4">
                      {session.candidate_profile_id?.full_name || "Unknown"} <br />
                      <span className="text-sm text-gray-500">{session.candidate_profile_id?.email || ""}</span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          session.status === SessionStatus.SCHEDULED
                            ? "bg-yellow-100 text-yellow-800"
                            : session.status === SessionStatus.IN_PROGRESS
                            ? "bg-blue-100 text-blue-800"
                            : session.status === SessionStatus.COMPLETED
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {session.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {new Date(session.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="p-4 flex flex-wrap items-center gap-3">
                      {/* HR Control Room */}
                      <Link
                        href={`/dashboard/interviews/${session.room_code}`}
                        className="text-sm flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                        title="Vào phòng điều khiển"
                      >
                        <Video size={16} /> Vào phòng
                      </Link>
                      
                      {/* Send email */}
                      <button 
                        onClick={() => handleSendInvite(sessionId)} 
                        className="text-gray-600 hover:text-green-600"
                        title="Gửi Email Mời"
                      >
                        <Mail size={18} />
                      </button>

                      {/* Copy magic link */}
                      {session.magic_link_token && (
                        <button
                          onClick={() => handleCopyLink(session.magic_link_token!)}
                          className="text-gray-600 hover:text-indigo-600 hover:scale-105 transition-transform"
                          title="Sao chép Link phỏng vấn"
                        >
                          <Link2 size={18} />
                        </button>
                      )}

                      <button onClick={() => handleOpenForm(session)} className="text-gray-600 hover:text-blue-600">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDelete(sessionId)} className="text-gray-600 hover:text-red-600">
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
