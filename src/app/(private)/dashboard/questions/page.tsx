"use client";

import { ChangeEvent, FormEvent, useCallback, useMemo, useState } from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import {
  Plus,
  Trash2,
  FileUp,
  Filter,
  BookOpen,
  ChevronDown,
  Loader2,
  CheckCircle2,
  XCircle,
  X,
  AlertTriangle,
} from "lucide-react";

import { getQuestions, createQuestion, deleteQuestion, importQuestionsFromPdf } from "@/services/question.service";
import { getCategories } from "@/services/category.service";
import { getSkills } from "@/services/skill.service";
import { getEntityLabel } from "@/lib/entity";
import type { CreateQuestionPayload, Question } from "@/models/question.model";

/* ------------------------------------------------------------------ */
/*  Shared style tokens (matching Panel.tsx conventions)               */
/* ------------------------------------------------------------------ */
const inputClass =
  "w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-blue-400/70";

const primaryBtnClass =
  "inline-flex min-h-9 items-center justify-center gap-2 rounded-xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-400 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50";

const ghostBtnClass =
  "inline-flex min-h-9 items-center justify-center gap-2 rounded-xl bg-white/7 px-3 py-2 text-sm font-semibold text-white/70 transition-all hover:bg-white/12 hover:text-white disabled:cursor-not-allowed disabled:opacity-50";

const dangerBtnClass =
  "inline-flex items-center justify-center rounded-lg p-1.5 text-white/30 transition-colors hover:bg-red-500/15 hover:text-red-400";

/* ------------------------------------------------------------------ */
/*  Toast notice                                                       */
/* ------------------------------------------------------------------ */
type ToastTone = "success" | "error";
interface Toast {
  id: number;
  tone: ToastTone;
  message: string;
}

let toastCounter = 0;

function ToastBar({ toast, onDismiss }: { toast: Toast; onDismiss: (id: number) => void }) {
  const Icon = toast.tone === "success" ? CheckCircle2 : XCircle;
  const colors =
    toast.tone === "success"
      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
      : "border-red-500/30 bg-red-500/10 text-red-300";

  return (
    <div className={`flex items-start gap-2 rounded-xl border px-4 py-3 text-sm ${colors}`}>
      <Icon size={16} className="mt-0.5 shrink-0" />
      <span className="flex-1">{toast.message}</span>
      <button onClick={() => onDismiss(toast.id)} className="shrink-0 opacity-60 hover:opacity-100">
        <X size={14} />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page component                                                     */
/* ------------------------------------------------------------------ */
export default function QuestionsPage() {
  /* ---- filter state ---- */
  const [filterCategoryId, setFilterCategoryId] = useState("");

  /* ---- form state ---- */
  const [formCategoryId, setFormCategoryId] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formExpectedAnswer, setFormExpectedAnswer] = useState("");
  const [formSkillIds, setFormSkillIds] = useState<string[]>([]);

  /* ---- import state ---- */
  const [importCategoryId, setImportCategoryId] = useState("");
  const [importFile, setImportFile] = useState<File | null>(null);

  /* ---- toasts ---- */
  const [toasts, setToasts] = useState<Toast[]>([]);
  const pushToast = useCallback((tone: ToastTone, message: string) => {
    const id = ++toastCounter;
    setToasts((prev) => [...prev, { id, tone, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 5000);
  }, []);
  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  /* ---- data fetching ---- */
  const {
    data: categoriesRes,
    isLoading: catLoading,
  } = useSWR("categories", () => getCategories());

  const {
    data: skillsRes,
    isLoading: skillLoading,
  } = useSWR("skills", () => getSkills());

  const {
    data: questionsRes,
    isLoading: qLoading,
    mutate: mutateQuestions,
  } = useSWR(
    ["questions", filterCategoryId],
    () => getQuestions(filterCategoryId ? { category_id: filterCategoryId } : undefined)
  );

  const categories = categoriesRes?.data ?? [];
  const skills = skillsRes?.data ?? [];
  const questions: Question[] = questionsRes?.data ?? [];

  /* ---- derived maps ---- */
  const categoryNameById = useMemo(
    () => new Map(categories.map((c) => [c._id, c.name])),
    [categories]
  );
  const skillNameById = useMemo(
    () => new Map(skills.map((s) => [s._id, s.name])),
    [skills]
  );

  /* ---- mutations ---- */
  const { trigger: triggerCreate, isMutating: isCreating } = useSWRMutation(
    "createQuestion",
    async (_key: string, { arg }: { arg: CreateQuestionPayload }) => {
      return createQuestion(arg);
    }
  );

  const { trigger: triggerDelete, isMutating: isDeleting } = useSWRMutation(
    "deleteQuestion",
    async (_key: string, { arg }: { arg: string }) => {
      return deleteQuestion(arg);
    }
  );

  const { trigger: triggerImport, isMutating: isImporting } = useSWRMutation(
    "importQuestions",
    async (_key: string, { arg }: { arg: { file: File; category_id: string } }) => {
      return importQuestionsFromPdf(arg);
    }
  );

  /* ---- handlers ---- */
  const toggleSkill = (id: string) => {
    setFormSkillIds((cur) =>
      cur.includes(id) ? cur.filter((s) => s !== id) : [...cur, id]
    );
  };

  const handleCreateQuestion = async (e: FormEvent) => {
    e.preventDefault();
    if (!formCategoryId || !formContent.trim() || !formExpectedAnswer.trim()) return;
    try {
      await triggerCreate({
        category_id: formCategoryId,
        assessed_skills: formSkillIds,
        content: formContent.trim(),
        expected_answer: formExpectedAnswer.trim(),
      });
      setFormContent("");
      setFormExpectedAnswer("");
      setFormSkillIds([]);
      pushToast("success", "Tạo câu hỏi thành công!");
      mutateQuestions();
    } catch (err: any) {
      pushToast("error", err?.response?.data?.message || "Không thể tạo câu hỏi.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xoá câu hỏi này?")) return;
    try {
      await triggerDelete(id);
      pushToast("success", "Đã xoá câu hỏi.");
      mutateQuestions();
    } catch (err: any) {
      pushToast("error", err?.response?.data?.message || "Không thể xoá câu hỏi.");
    }
  };

  const handleImport = async () => {
    if (!importFile || !importCategoryId) return;
    try {
      const res = await triggerImport({ file: importFile, category_id: importCategoryId });
      const count = res?.data?.length ?? 0;
      pushToast("success", `Import thành công ${count} câu hỏi từ PDF!`);
      setImportFile(null);
      mutateQuestions();
    } catch (err: any) {
      pushToast("error", err?.response?.data?.message || "Import PDF thất bại.");
    }
  };

  const handleImportFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setImportFile(e.target.files?.[0] ?? null);
  };

  /* ---- helpers ---- */
  const getCategoryName = (ref: Question["category_id"]) => {
    if (typeof ref === "string") return categoryNameById.get(ref) ?? ref;
    return ref?.name ?? "—";
  };

  const getSkillNames = (refs: Question["assessed_skills"]) =>
    refs
      ?.map((s) =>
        typeof s === "string" ? skillNameById.get(s) ?? s : getEntityLabel(s, s._id)
      )
      .join(", ") || "Không có";

  const isPageLoading = catLoading || skillLoading;

  /* ================================================================ */
  /*  RENDER                                                           */
  /* ================================================================ */
  return (
    <div className="min-h-screen bg-[#0a0b10] text-white">
      {/* ---- header ---- */}
      <div className="border-b border-white/8 bg-white/[0.02] px-6 py-5">
        <div className="mx-auto flex max-w-7xl flex-col gap-1">
          <h1 className="flex items-center gap-2.5 text-xl font-bold tracking-tight">
            <BookOpen size={22} className="text-blue-400" />
            Ngân hàng câu hỏi
          </h1>
          <p className="text-sm text-white/40">
            Quản lý, tạo mới và import câu hỏi phỏng vấn theo danh mục.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-6 px-6 py-6">
        {/* ---- toasts ---- */}
        {toasts.length > 0 && (
          <div className="space-y-2">
            {toasts.map((t) => (
              <ToastBar key={t.id} toast={t} onDismiss={dismissToast} />
            ))}
          </div>
        )}

        {/* ================================================================ */}
        {/*  TOP ROW: Create form + Import                                    */}
        {/* ================================================================ */}
        <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
          {/* ---- create question form ---- */}
          <section className="rounded-xl border border-white/8 bg-white/[0.03] overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/8 px-5 py-3.5">
              <h2 className="text-sm font-semibold text-white">Tạo câu hỏi mới</h2>
              <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2.5 py-1 text-[11px] font-medium text-blue-300">
                <Plus size={12} className="mr-1" /> Thêm mới
              </span>
            </div>
            <form onSubmit={handleCreateQuestion} className="space-y-4 p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                {/* category */}
                <div>
                  <label htmlFor="form-category" className="mb-1.5 block text-xs font-medium text-white/65">
                    Danh mục <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="form-category"
                      value={formCategoryId}
                      onChange={(e) => setFormCategoryId(e.target.value)}
                      className={`${inputClass} appearance-none pr-8`}
                    >
                      <option value="">— Chọn danh mục —</option>
                      {categories.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/30" />
                  </div>
                </div>

                {/* skills multi-select */}
                <div>
                  <p className="mb-1.5 text-xs font-medium text-white/65">Kỹ năng đánh giá</p>
                  <div className="grid max-h-28 gap-1 overflow-y-auto rounded-lg border border-white/10 bg-black/20 p-2 sm:grid-cols-2">
                    {skills.length === 0 && (
                      <p className="col-span-2 px-1 py-2 text-xs text-white/35">Chưa có kỹ năng nào.</p>
                    )}
                    {skills.map((skill) => (
                      <label
                        key={skill._id}
                        className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-white/70 hover:bg-white/6 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formSkillIds.includes(skill._id)}
                          onChange={() => toggleSkill(skill._id)}
                          className="h-3.5 w-3.5 accent-blue-500"
                        />
                        <span className="truncate">{skill.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* content */}
              <div>
                <label htmlFor="form-content" className="mb-1.5 block text-xs font-medium text-white/65">
                  Nội dung câu hỏi <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="form-content"
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  rows={3}
                  placeholder="Nhập nội dung câu hỏi..."
                  className={inputClass}
                />
              </div>

              {/* expected answer */}
              <div>
                <label htmlFor="form-answer" className="mb-1.5 block text-xs font-medium text-white/65">
                  Câu trả lời mong đợi <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="form-answer"
                  value={formExpectedAnswer}
                  onChange={(e) => setFormExpectedAnswer(e.target.value)}
                  rows={3}
                  placeholder="Câu trả lời tốt cần đề cập..."
                  className={inputClass}
                />
              </div>

              <button
                type="submit"
                disabled={isCreating || !formCategoryId || !formContent.trim() || !formExpectedAnswer.trim()}
                className={primaryBtnClass}
              >
                {isCreating ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
                Tạo câu hỏi
              </button>
            </form>
          </section>

          {/* ---- import from PDF ---- */}
          <section className="rounded-xl border border-white/8 bg-white/[0.03] overflow-hidden self-start">
            <div className="flex items-center justify-between border-b border-white/8 px-5 py-3.5">
              <h2 className="text-sm font-semibold text-white">Import từ PDF</h2>
              <FileUp size={16} className="text-white/30" />
            </div>
            <div className="space-y-4 p-5">
              <div>
                <label htmlFor="import-category" className="mb-1.5 block text-xs font-medium text-white/65">
                  Danh mục <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <select
                    id="import-category"
                    value={importCategoryId}
                    onChange={(e) => setImportCategoryId(e.target.value)}
                    className={`${inputClass} appearance-none pr-8`}
                  >
                    <option value="">— Chọn danh mục —</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/30" />
                </div>
              </div>

              <div>
                <label htmlFor="import-file" className="mb-1.5 block text-xs font-medium text-white/65">
                  Tệp PDF
                </label>
                <input
                  id="import-file"
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={handleImportFileChange}
                  className={`${inputClass} file:mr-3 file:rounded-md file:border-0 file:bg-blue-500/20 file:px-3 file:py-1 file:text-xs file:font-medium file:text-blue-300 file:cursor-pointer`}
                />
              </div>

              {importFile && (
                <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-xs text-white/50">
                  <FileUp size={14} className="text-blue-400" />
                  <span className="truncate">{importFile.name}</span>
                  <span className="ml-auto text-white/25">{(importFile.size / 1024).toFixed(0)} KB</span>
                </div>
              )}

              <button
                type="button"
                disabled={!importFile || !importCategoryId || isImporting}
                onClick={handleImport}
                className={`${primaryBtnClass} w-full`}
              >
                {isImporting ? <Loader2 size={15} className="animate-spin" /> : <FileUp size={15} />}
                {isImporting ? "Đang import..." : "Import câu hỏi"}
              </button>
            </div>
          </section>
        </div>

        {/* ================================================================ */}
        {/*  QUESTION LIST                                                     */}
        {/* ================================================================ */}
        <section className="rounded-xl border border-white/8 bg-white/[0.03] overflow-hidden">
          {/* header */}
          <div className="flex flex-col gap-3 border-b border-white/8 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-white">Danh sách câu hỏi</h2>
              <span className="inline-flex items-center rounded-full bg-white/8 px-2 py-0.5 text-[11px] font-medium text-white/55">
                {qLoading ? "…" : questions.length} câu hỏi
              </span>
            </div>

            {/* filter */}
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-white/30" />
              <div className="relative">
                <select
                  value={filterCategoryId}
                  onChange={(e) => setFilterCategoryId(e.target.value)}
                  className={`${inputClass} min-w-[200px] appearance-none pr-8 text-xs`}
                >
                  <option value="">Tất cả danh mục</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/30" />
              </div>
            </div>
          </div>

          {/* loading state */}
          {(qLoading || isPageLoading) && (
            <div className="flex items-center justify-center gap-2 py-16 text-sm text-white/30">
              <Loader2 size={18} className="animate-spin" />
              Đang tải câu hỏi...
            </div>
          )}

          {/* empty state */}
          {!qLoading && !isPageLoading && questions.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <AlertTriangle size={28} className="text-white/15" />
              <p className="text-sm text-white/35">Chưa có câu hỏi nào{filterCategoryId ? " trong danh mục này" : ""}.</p>
            </div>
          )}

          {/* question cards */}
          {!qLoading && questions.length > 0 && (
            <div className="divide-y divide-white/6">
              {questions.map((q) => (
                <div key={q.id} className="group relative px-5 py-4 transition-colors hover:bg-white/[0.02]">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1 space-y-2">
                      {/* content */}
                      <p className="text-sm font-medium leading-relaxed text-white">
                        {q.content}
                      </p>

                      {/* expected answer */}
                      <div className="rounded-lg bg-white/[0.04] px-3 py-2">
                        <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-widest text-white/25">
                          Câu trả lời mong đợi
                        </p>
                        <p className="line-clamp-3 text-xs leading-relaxed text-white/50">
                          {q.expected_answer}
                        </p>
                      </div>

                      {/* meta pills */}
                      <div className="flex flex-wrap items-center gap-2">
                        {/* category pill */}
                        <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2.5 py-1 text-[11px] font-medium text-blue-300">
                          {getCategoryName(q.category_id)}
                        </span>

                        {/* skill pills */}
                        {q.assessed_skills?.map((skill, idx) => {
                          const name = typeof skill === "string" ? skillNameById.get(skill) ?? skill : skill.name;
                          return (
                            <span
                              key={idx}
                              className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-300"
                            >
                              {name}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {/* delete button */}
                    <button
                      type="button"
                      disabled={isDeleting}
                      onClick={() => handleDelete(q.id)}
                      title="Xoá câu hỏi"
                      className={`${dangerBtnClass} opacity-0 group-hover:opacity-100`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
