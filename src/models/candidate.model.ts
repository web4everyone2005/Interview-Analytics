export interface CandidateOwner {
  _id: string;
  name: string;
  email: string;
}

export interface CandidateProfile {
  _id: string;
  owner_id: string | CandidateOwner;
  full_name: string;
  email: string;
  resume_url?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface CreateCandidatePayload {
  full_name: string;
  email: string;
  resume_url?: string;
}

export type UpdateCandidatePayload = Partial<CreateCandidatePayload>;
