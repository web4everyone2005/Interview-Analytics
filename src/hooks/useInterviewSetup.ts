import useSWR, { SWRConfiguration } from "swr";
import useSWRMutation from "swr/mutation";
import { createCandidate, getCandidates } from "@/services/candidate.service";
import { createCategory, getCategories } from "@/services/category.service";
import {
  createJobPosition,
  getJobPositions,
} from "@/services/job-position.service";
import {
  getKnowledgeDocuments,
  uploadKnowledgeDocument,
  deleteKnowledgeDocument,
} from "@/services/knowledge.service";
import {
  createQuestion,
  getQuestions,
  importQuestionsFromPdf,
} from "@/services/question.service";
import { createSkill, getSkills } from "@/services/skill.service";
import {
  createSession,
  sendSessionInvitation,
} from "@/services/session.service";
import { CreateCandidatePayload } from "@/models/candidate.model";
import { CreateQuestionCategoryPayload } from "@/models/question-category.model";
import { CreateJobPositionPayload } from "@/models/job-position.model";
import {
  CreateQuestionPayload,
  QuestionFilterParams,
} from "@/models/question.model";
import { CreateSkillPayload } from "@/models/skill.model";
import { CreateSessionPayload } from "@/models/session.model";

export const SETUP_KEYS = {
  skills: "/skills",
  categories: "/categories",
  jobPositions: "/job-positions",
  candidates: "/candidates",
  knowledge: "/knowledge",
  questions: "/questions",
  sessions: "/sessions",
};

export const useSkills = (swrConfig?: SWRConfiguration) => {
  const { data, error, isLoading, mutate } = useSWR(
    SETUP_KEYS.skills,
    getSkills,
    swrConfig
  );

  return { skills: data?.data ?? [], error, isLoading, mutate };
};

export const useCreateSkill = () =>
  useSWRMutation(
    SETUP_KEYS.skills,
    (_key: string, { arg }: { arg: CreateSkillPayload }) => createSkill(arg)
  );

export const useCategories = (swrConfig?: SWRConfiguration) => {
  const { data, error, isLoading, mutate } = useSWR(
    SETUP_KEYS.categories,
    getCategories,
    swrConfig
  );

  return { categories: data?.data ?? [], error, isLoading, mutate };
};

export const useCreateCategory = () =>
  useSWRMutation(
    SETUP_KEYS.categories,
    (_key: string, { arg }: { arg: CreateQuestionCategoryPayload }) =>
      createCategory(arg)
  );

export const useJobPositions = (swrConfig?: SWRConfiguration) => {
  const { data, error, isLoading, mutate } = useSWR(
    SETUP_KEYS.jobPositions,
    getJobPositions,
    swrConfig
  );

  return { jobPositions: data?.data ?? [], error, isLoading, mutate };
};

export const useCreateJobPosition = () =>
  useSWRMutation(
    SETUP_KEYS.jobPositions,
    (_key: string, { arg }: { arg: CreateJobPositionPayload }) =>
      createJobPosition(arg)
  );

export const useCandidates = (swrConfig?: SWRConfiguration) => {
  const { data, error, isLoading, mutate } = useSWR(
    SETUP_KEYS.candidates,
    getCandidates,
    swrConfig
  );

  return { candidates: data?.data ?? [], error, isLoading, mutate };
};

export const useCreateCandidate = () =>
  useSWRMutation(
    SETUP_KEYS.candidates,
    (_key: string, { arg }: { arg: CreateCandidatePayload }) =>
      createCandidate(arg)
  );

export const useQuestions = (
  params?: QuestionFilterParams,
  swrConfig?: SWRConfiguration
) => {
  const key = params?.category_id
    ? [SETUP_KEYS.questions, params.category_id]
    : SETUP_KEYS.questions;
  const { data, error, isLoading, mutate } = useSWR(
    key,
    () => getQuestions(params),
    swrConfig
  );

  return {
    questions: data?.data ?? [],
    total: data?.total ?? 0,
    error,
    isLoading,
    mutate,
  };
};

export const useCreateQuestion = () =>
  useSWRMutation(
    SETUP_KEYS.questions,
    (_key: string, { arg }: { arg: CreateQuestionPayload }) =>
      createQuestion(arg)
  );

export const useImportQuestions = () =>
  useSWRMutation(
    `${SETUP_KEYS.questions}/import-pdf`,
    (_key: string, { arg }: { arg: { file: File; category_id: string } }) =>
      importQuestionsFromPdf(arg)
  );

export const useKnowledgeDocuments = (swrConfig?: SWRConfiguration) => {
  const { data, error, isLoading, mutate } = useSWR(
    SETUP_KEYS.knowledge,
    getKnowledgeDocuments,
    {
      // Poll mỗi 3s khi BE còn đang xử lý document, tự dừng khi xong hết
      refreshInterval: (latestData) => {
        const docs = latestData?.data ?? [];
        return docs.some((doc) => !doc.is_processed) ? 3000 : 0;
      },
      ...swrConfig,
    }
  );

  return { documents: data?.data ?? [], error, isLoading, mutate };
};

export const useUploadKnowledgeDocument = () =>
  useSWRMutation(
    `${SETUP_KEYS.knowledge}/upload`,
    (
      _key: string,
      { arg }: { arg: { file: File; title?: string; job_position_id: string } }
    ) => uploadKnowledgeDocument(arg)
  );

export const useDeleteKnowledgeDocument = () =>
  useSWRMutation(
    `${SETUP_KEYS.knowledge}/delete`,
    (_key: string, { arg }: { arg: { id: string } }) => deleteKnowledgeDocument(arg.id)
  );

export const useCreateSession = () =>
  useSWRMutation(
    SETUP_KEYS.sessions,
    (_key: string, { arg }: { arg: CreateSessionPayload }) => createSession(arg)
  );

export const useSendSessionInvitation = (sessionId: string | null) =>
  useSWRMutation(
    sessionId ? `${SETUP_KEYS.sessions}/${sessionId}/send-invitation` : null,
    () => sendSessionInvitation(sessionId!)
  );
