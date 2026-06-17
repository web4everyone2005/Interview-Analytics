"use client";

import { useMemo, useState } from "react";
import { AxiosError } from "axios";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import {
  useCandidates,
  useCategories,
  useCreateCandidate,
  useCreateCategory,
  useCreateJobPosition,
  useCreateQuestion,
  useCreateSession,
  useCreateSkill,
  useImportQuestions,
  useJobPositions,
  useKnowledgeDocuments,
  useDeleteKnowledgeDocument,
  useQuestions,
  useSendSessionInvitation,
  useSkills,
  useUploadKnowledgeDocument,
} from "@/hooks/useInterviewSetup";
import { Session } from "@/models/session.model";
import { CandidatePanel } from "./CandidatePanel";
import { FlowHeader } from "./FlowHeader";
import { JobPositionPanel } from "./JobPositionPanel";
import { KnowledgeUploadPanel } from "./KnowledgeUploadPanel";
import { QuestionBankPanel } from "./QuestionBankPanel";
import { SelectionSummary } from "./SelectionSummary";
import { SessionComposer } from "./SessionComposer";
import { SkillCategoryPanel } from "./SkillCategoryPanel";

interface CreatedSession {
  session: Session;
  magicUrl?: string;
}

function getErrorMessage(error: unknown) {
  const axiosError = error as AxiosError<{ message?: string }>;
  return axiosError.response?.data?.message ?? "Request failed. Please retry.";
}

export default function CreateInterview() {
  const [selectedJobId, setSelectedJobId] = useState("");
  const [selectedCandidateId, setSelectedCandidateId] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);
  const [scheduledAt, setScheduledAt] = useState("");
  const [createdSession, setCreatedSession] = useState<CreatedSession | null>(
    null
  );
  const [notice, setNotice] = useState<{
    tone: "success" | "error";
    message: string;
  } | null>(null);

  const { skills, mutate: mutateSkills } = useSkills();
  const { categories, mutate: mutateCategories } = useCategories();
  const { jobPositions, mutate: mutateJobPositions } = useJobPositions();
  const { candidates, mutate: mutateCandidates } = useCandidates();
  const effectiveCategoryId = selectedCategoryId || categories[0]?._id || "";
  const effectiveJobId = selectedJobId || jobPositions[0]?._id || "";
  const effectiveCandidateId = selectedCandidateId || candidates[0]?._id || "";
  const {
    questions,
    mutate: mutateQuestions,
    isLoading: questionsLoading,
  } = useQuestions(
    effectiveCategoryId ? { category_id: effectiveCategoryId } : undefined
  );
  const { documents, mutate: mutateDocuments } = useKnowledgeDocuments();

  const createSkillMutation = useCreateSkill();
  const createCategoryMutation = useCreateCategory();
  const createJobMutation = useCreateJobPosition();
  const createCandidateMutation = useCreateCandidate();
  const createQuestionMutation = useCreateQuestion();
  const importQuestionsMutation = useImportQuestions();
  const uploadKnowledgeMutation = useUploadKnowledgeDocument();
  const deleteKnowledgeMutation = useDeleteKnowledgeDocument();
  const createSessionMutation = useCreateSession();
  const sendInvitationMutation = useSendSessionInvitation(
    createdSession?.session.id ?? null
  );

  const selectedJob = useMemo(
    () => jobPositions.find((job) => job._id === effectiveJobId),
    [jobPositions, effectiveJobId]
  );
  const selectedCandidate = useMemo(
    () =>
      candidates.find((candidate) => candidate._id === effectiveCandidateId),
    [candidates, effectiveCandidateId]
  );
  const selectedDocuments = useMemo(
    () =>
      documents.filter((document) => document.job_position_id === effectiveJobId),
    [documents, effectiveJobId]
  );
  const hasSelectedJob = Boolean(selectedJob);
  const hasSelectedCandidate = Boolean(selectedCandidate);
  const hasSelectedQuestions = selectedQuestionIds.length > 0;
  const hasReadyKnowledge = selectedDocuments.some(
    (document) => document.is_processed
  );
  const candidateLocked = !hasSelectedJob;
  const questionLocked = !hasSelectedJob || !hasSelectedCandidate;
  const knowledgeLocked =
    !hasSelectedJob || !hasSelectedCandidate || !hasSelectedQuestions;
  const sessionLocked =
    !hasSelectedJob ||
    !hasSelectedCandidate ||
    !hasSelectedQuestions ||
    !hasReadyKnowledge;

  const showSuccess = (message: string) => {
    setNotice({ tone: "success", message });
  };

  const showError = (error: unknown) => {
    setNotice({ tone: "error", message: getErrorMessage(error) });
  };

  const handleCreateSkill = async (name: string) => {
    try {
      await createSkillMutation.trigger({ name });
      await mutateSkills();
      showSuccess("Skill created.");
    } catch (error) {
      showError(error);
    }
  };

  const handleCreateCategory = async (name: string) => {
    try {
      const response = await createCategoryMutation.trigger({ name });
      await mutateCategories();
      if (response.data?._id) {
        setSelectedCategoryId(response.data._id);
      }
      showSuccess("Category created.");
    } catch (error) {
      showError(error);
    }
  };

  const handleCreateJobPosition = async (payload: {
    title: string;
    department: string;
    required_skills: string[];
  }) => {
    try {
      const response = await createJobMutation.trigger(payload);
      await mutateJobPositions();
      if (response.data?._id) {
        setSelectedJobId(response.data._id);
      }
      showSuccess("Job position created.");
    } catch (error) {
      showError(error);
    }
  };

  const handleCreateCandidate = async (payload: {
    full_name: string;
    email: string;
    resume_url?: string;
  }) => {
    try {
      const response = await createCandidateMutation.trigger(payload);
      await mutateCandidates();
      if (response.data?._id) {
        setSelectedCandidateId(response.data._id);
      }
      showSuccess("Candidate created.");
    } catch (error) {
      showError(error);
    }
  };

  const handleCreateQuestion = async (payload: {
    category_id: string;
    assessed_skills: string[];
    content: string;
    expected_answer: string;
  }) => {
    try {
      const response = await createQuestionMutation.trigger(payload);
      await mutateQuestions();
      if (response.data?.id) {
        setSelectedQuestionIds((current) => [...current, response.data.id]);
      }
      showSuccess("Question created.");
    } catch (error) {
      showError(error);
    }
  };

  const handleImportQuestions = async (payload: {
    file: File;
    category_id: string;
  }) => {
    try {
      const response = await importQuestionsMutation.trigger(payload);
      await mutateQuestions();
      if (response.data?.length) {
        setSelectedQuestionIds((current) => [
          ...new Set([...current, ...response.data.map((question) => question.id)]),
        ]);
      }
      showSuccess(response.message || "Questions imported.");
    } catch (error) {
      showError(error);
    }
  };

  const handleUploadKnowledge = async (payload: {
    file: File;
    title?: string;
    job_position_id: string;
  }) => {
    try {
      await uploadKnowledgeMutation.trigger(payload);
      await mutateDocuments();
      showSuccess("Knowledge document uploaded.");
    } catch (error) {
      showError(error);
    }
  };

  const handleDeleteKnowledge = async (id: string) => {
    try {
      await deleteKnowledgeMutation.trigger({ id });
      showSuccess("Knowledge document deleted.");
    } catch (error) {
      showError(error);
    } finally {
      // Luôn refresh danh sách để dọn sạch document "ma" khỏi UI
      await mutateDocuments();
    }
  };

  const toggleQuestion = (id: string) => {
    setSelectedQuestionIds((current) =>
      current.includes(id)
        ? current.filter((questionId) => questionId !== id)
        : [...current, id]
    );
  };

  const handleCreateSession = async () => {
    if (!effectiveJobId || !effectiveCandidateId || selectedQuestionIds.length === 0) {
      setNotice({
        tone: "error",
        message: "Select job, candidate and at least one question.",
      });
      return;
    }

    if (!hasReadyKnowledge) {
      setNotice({
        tone: "error",
        message: "Upload and wait for a ready knowledge document before creating a session.",
      });
      return;
    }

    try {
      const response = await createSessionMutation.trigger({
        job_position_id: effectiveJobId,
        candidate_profile_id: effectiveCandidateId,
        question_bank_ids: selectedQuestionIds,
        scheduled_at: scheduledAt
          ? new Date(scheduledAt).toISOString()
          : undefined,
      });
      setCreatedSession({
        session: response.data,
        magicUrl: response.magic_url,
      });
      showSuccess("Interview session created.");
    } catch (error) {
      showError(error);
    }
  };

  const handleSendInvitation = async () => {
    if (!createdSession) return;
    try {
      const response = await sendInvitationMutation.trigger();
      showSuccess(response?.message || "Invitation sent.");
    } catch (error) {
      showError(error);
    }
  };

  const checks = [
    { label: "Job", complete: hasSelectedJob },
    { label: "Candidate", complete: hasSelectedCandidate },
    { label: "Questions", complete: hasSelectedQuestions },
    { label: "Knowledge", complete: hasReadyKnowledge },
    { label: "Session", complete: Boolean(createdSession) },
  ];

  return (
    <div className="mx-auto max-w-[1480px]">
      <FlowHeader checks={checks} />

      {notice && (
        <div
          className={`mb-4 flex items-center gap-2 rounded-lg border px-4 py-3 text-sm ${
            notice.tone === "success"
              ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-200"
              : "border-red-400/20 bg-red-500/10 text-red-200"
          }`}
        >
          {notice.tone === "success" ? (
            <CheckCircle2 size={16} />
          ) : (
            <AlertCircle size={16} />
          )}
          <span>{notice.message}</span>
        </div>
      )}

      <div className="grid gap-4">
        <SelectionSummary
          selectedJob={selectedJob}
          selectedCandidate={selectedCandidate}
          selectedQuestionCount={selectedQuestionIds.length}
          selectedDocuments={selectedDocuments}
        />

        <SkillCategoryPanel
          skills={skills}
          categories={categories}
          onCreateSkill={handleCreateSkill}
          onCreateCategory={handleCreateCategory}
          isCreatingSkill={createSkillMutation.isMutating}
          isCreatingCategory={createCategoryMutation.isMutating}
        />

        <div className="grid gap-4 2xl:grid-cols-2">
          <JobPositionPanel
            jobPositions={jobPositions}
            skills={skills}
            selectedJobId={effectiveJobId}
            onSelectJob={setSelectedJobId}
            onCreateJobPosition={handleCreateJobPosition}
            isCreating={createJobMutation.isMutating}
          />

          <CandidatePanel
            candidates={candidates}
            selectedCandidateId={effectiveCandidateId}
            locked={candidateLocked}
            lockedMessage="Select or create a job position before choosing a candidate."
            onSelectCandidate={setSelectedCandidateId}
            onCreateCandidate={handleCreateCandidate}
            isCreating={createCandidateMutation.isMutating}
          />
        </div>

        <QuestionBankPanel
          categories={categories}
          skills={skills}
          questions={questions}
          selectedCategoryId={effectiveCategoryId}
          selectedQuestionIds={selectedQuestionIds}
          locked={questionLocked}
          lockedMessage="Select a job position and candidate before preparing questions."
          onCategoryChange={setSelectedCategoryId}
          onToggleQuestion={toggleQuestion}
          onCreateQuestion={handleCreateQuestion}
          onImportQuestions={handleImportQuestions}
          isCreating={createQuestionMutation.isMutating}
          isImporting={importQuestionsMutation.isMutating}
          isLoading={questionsLoading}
        />

        <KnowledgeUploadPanel
          jobPositions={jobPositions}
          selectedJobId={effectiveJobId}
          documents={documents}
          locked={knowledgeLocked}
          lockedMessage="Select at least one question before uploading the knowledge base."
          onUpload={handleUploadKnowledge}
          onDelete={handleDeleteKnowledge}
          isUploading={uploadKnowledgeMutation.isMutating}
        />

        <SessionComposer
          selectedJob={selectedJob}
          selectedCandidate={selectedCandidate}
          selectedQuestionIds={selectedQuestionIds}
          knowledgeReady={hasReadyKnowledge}
          locked={sessionLocked}
          lockedMessage="Complete job, candidate, questions, and a ready knowledge document first."
          scheduledAt={scheduledAt}
          onScheduledAtChange={setScheduledAt}
          onCreateSession={handleCreateSession}
          onSendInvitation={handleSendInvitation}
          createdSession={createdSession}
          isCreating={createSessionMutation.isMutating}
          isSending={sendInvitationMutation.isMutating}
        />
      </div>
    </div>
  );
}
