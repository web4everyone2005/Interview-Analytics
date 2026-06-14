import React from "react";
import JobList from "@/components/features/jobs/JobList";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý Vị trí Tuyển dụng | Interview Analytics",
  description: "Trang quản lý các vị trí tuyển dụng và tài liệu AI",
};

export default function JobsPage() {
  return <JobList />;
}
