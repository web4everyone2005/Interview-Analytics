import useSWR, { SWRConfiguration } from "swr";
import { getCandidates } from "@/services/candidate.service";
import { Candidate } from "@/models/candidate.model";

const CANDIDATES_KEY = "/api/v1/candidates";

export const useCandidates = (swrConfig?: SWRConfiguration) => {
  const { data, error, isLoading, mutate } = useSWR<{ data: Candidate[] }>(
    CANDIDATES_KEY,
    () => getCandidates(),
    swrConfig
  );

  return {
    candidates: data?.data ?? [],
    isLoading,
    error,
    mutate,
  };
};
