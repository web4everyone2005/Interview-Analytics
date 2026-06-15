import useSWR, { SWRConfiguration } from "swr";
import { getKnowledgeDocumentsByJob } from "@/services/knowledge.service";
import { KnowledgeDocument } from "@/models/knowledge.model";

export const useKnowledgeDocs = (jobId: string | null, swrConfig?: SWRConfiguration) => {
  const KEY = jobId ? `/knowledge?job_position_id=${jobId}` : null;
  
  const { data, error, isLoading, mutate } = useSWR<{ data: KnowledgeDocument[] }>(
    KEY,
    () => (jobId ? getKnowledgeDocumentsByJob(jobId) : Promise.reject("No Job ID")),
    swrConfig
  );

  return {
    documents: data?.data ?? [],
    isLoading,
    error,
    mutate,
  };
};
