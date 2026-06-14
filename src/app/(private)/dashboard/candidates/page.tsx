import React from "react";
import CandidateList from "@/components/features/candidates/CandidateList";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý Ứng viên | Interview Analytics",
  description: "Trang quản lý hồ sơ ứng viên phỏng vấn",
};

export default function CandidatesPage() {
  return <CandidateList />;
}
