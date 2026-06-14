import useSWR, { SWRConfiguration } from "swr";
import { getJobs } from "@/services/job.service";
import { JobPosition } from "@/models/job.model";

const JOBS_KEY = "/api/v1/job-positions";

export const useJobs = (swrConfig?: SWRConfiguration) => {
  const { data, error, isLoading, mutate } = useSWR<{ data: JobPosition[] }>(
    JOBS_KEY,
    () => getJobs(),
    swrConfig
  );

  return {
    jobs: data?.data ?? [],
    isLoading,
    error,
    mutate,
  };
};
