export interface Candidate {
  id?: string;
  _id?: string;
  owner_id?: string;
  full_name: string;
  email: string;
  resume_url?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCandidatePayload {
  full_name: string;
  email: string;
  resume_url?: string;
}

export interface UpdateCandidatePayload {
  full_name?: string;
  email?: string;
  resume_url?: string;
}
