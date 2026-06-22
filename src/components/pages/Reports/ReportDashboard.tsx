"use client";

import { useState } from "react";
import { useDashboardReports } from "@/hooks/useReport";
import { DashboardReport } from "@/models/report.model";
import Link from "next/link";
import {
  FileText,
  BarChart2,
  Calendar,
  Search,
  ArrowRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ReportDashboard() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { reports, isLoading, isError } = useDashboardReports(
    startDate,
    endDate
  );

  if (isError) {
    return (
      <div className="flex items-center justify-center h-[50vh] text-red-500">
        Đã có lỗi xảy ra khi tải dữ liệu báo cáo.
      </div>
    );
  }

  // Calculate Aggregates
  const totalSessions = reports.length;
  const evaluatedSessions = reports.filter((r) => r.metrics?.evaluated_questions > 0).length;
  const avgScoreAll =
    evaluatedSessions > 0
      ? Math.round(
          reports.reduce((sum, r) => sum + (r.metrics?.average_score || 0), 0) /
            evaluatedSessions
        )
      : 0;

  // Chart Data Preparation (Top 10 most recent)
  const chartData = [...reports]
    .slice(0, 10)
    .reverse()
    .map((r) => ({
      name: r.candidate?.full_name?.split(" ").pop() || "Unknown",
      score: r.metrics?.average_score || 0,
    }));

  return (
    <div className="flex flex-col h-full bg-[#0b0c10] text-white p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Analytics</h1>
          <p className="text-white/40 text-sm mt-1">
            Tổng quan hiệu suất ứng viên và chất lượng phỏng vấn
          </p>
        </div>

        {/* Date Filters */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white/5 border border-white/10 rounded-lg px-3 py-2">
            <Calendar size={16} className="text-white/40 mr-2" />
            <input
              type="date"
              className="bg-transparent text-sm text-white/80 focus:outline-none"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <span className="text-white/40">-</span>
          <div className="flex items-center bg-white/5 border border-white/10 rounded-lg px-3 py-2">
            <Calendar size={16} className="text-white/40 mr-2" />
            <input
              type="date"
              className="bg-transparent text-sm text-white/80 focus:outline-none"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-white/40 text-sm font-medium">Tổng số phiên</p>
            <p className="text-3xl font-bold">{totalSessions}</p>
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-500/20 text-green-400 flex items-center justify-center">
            <BarChart2 size={24} />
          </div>
          <div>
            <p className="text-white/40 text-sm font-medium">Đã chấm điểm</p>
            <p className="text-3xl font-bold">{evaluatedSessions}</p>
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
            <BarChart2 size={24} />
          </div>
          <div>
            <p className="text-white/40 text-sm font-medium">Điểm trung bình</p>
            <p className="text-3xl font-bold">{avgScoreAll}/10</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col">
          <h2 className="text-lg font-semibold mb-4">Điểm số 10 phiên gần nhất</h2>
          <div className="flex-1 w-full min-h-[300px]">
            {isLoading ? (
              <div className="w-full h-full flex items-center justify-center text-white/40">
                Đang tải biểu đồ...
              </div>
            ) : chartData.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center text-white/40">
                Chưa có dữ liệu chấm điểm
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff1a" vertical={false} />
                  <XAxis dataKey="name" stroke="#ffffff66" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#ffffff66" fontSize={12} tickLine={false} axisLine={false} domain={[0, 10]} />
                  <Tooltip
                    cursor={{ fill: "#ffffff0d" }}
                    contentStyle={{ backgroundColor: "#1e293b", borderColor: "#ffffff1a", borderRadius: "8px" }}
                    itemStyle={{ color: "#fff" }}
                  />
                  <Bar dataKey="score" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Recent Sessions List */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Báo cáo gần đây</h2>
            <Search size={16} className="text-white/40" />
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {isLoading ? (
              <div className="text-center text-white/40 mt-4">Đang tải danh sách...</div>
            ) : reports.length === 0 ? (
              <div className="text-center text-white/40 mt-4">Không có phiên phỏng vấn nào</div>
            ) : (
              reports.map((report: DashboardReport) => (
                <div
                  key={report.session_id}
                  className="bg-white/[0.02] border border-white/[0.05] hover:border-white/20 transition-all rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-sm text-white truncate max-w-[150px]">
                      {report.candidate?.full_name || "Unknown Candidate"}
                    </h3>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        report.metrics?.evaluated_questions > 0
                          ? "bg-green-500/20 text-green-400"
                          : report.status === "COMPLETED"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {report.metrics?.evaluated_questions > 0 
                        ? `${report.metrics?.average_score}/10` 
                        : report.status === "COMPLETED"
                        ? "0/10" 
                        : "Pending"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-white/40">
                    <span>Mã phòng: {report.room_code}</span>
                    <Link
                      href={`/reports/${report.session_id}`}
                      className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Chi tiết <ArrowRight size={12} className="ml-1" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
