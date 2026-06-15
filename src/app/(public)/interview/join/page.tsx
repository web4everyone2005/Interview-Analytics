"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { tokenStorage } from "@/lib/axios";

function JoinInterviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setTimeout(() => setError("Thiếu tham số token trong URL."), 0);
      return;
    }

    try {
      tokenStorage.setTokens(token, "");

      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      
      const payload = JSON.parse(jsonPayload);
      const roomCode = payload.room_code;

      if (!roomCode) {
        throw new Error("Token không hợp lệ hoặc thiếu room_code");
      }

      router.push(`/room/${roomCode}`);
    } catch (err) {
      console.error(err);
      setError("Token không hợp lệ hoặc đã hết hạn.");
    }
  }, [searchParams, router]);

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="p-8 bg-white shadow-lg rounded-xl text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Lỗi tham gia</h1>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="p-8 bg-white shadow-lg rounded-xl text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-lg text-gray-700">Đang kiểm tra thông tin và chuyển hướng vào phòng...</p>
      </div>
    </div>
  );
}

export default function JoinInterviewPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <JoinInterviewContent />
    </Suspense>
  );
}
