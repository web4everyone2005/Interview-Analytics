export enum SessionStatus {
  SCHEDULED = "SCHEDULED",
  ONGOING = "ONGOING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export interface SessionHR {
  _id?: string;
  id?: string;
  name: string;
  email: string;
}

export interface SessionJobPosition {
  _id: string;
  title: string;
}

export interface SessionCandidateProfile {
  _id: string;
  full_name: string;
  email: string;
}

export interface Session {
  id: string;
  conductor_id?: string | SessionHR;
  job_position_id?: string | SessionJobPosition;
  candidate_profile_id?: string | SessionCandidateProfile;
  title?: string;
  hr_id?: SessionHR;
  candidate_name?: string;
  candidate_email?: string;
  questions?: string[];
  status: SessionStatus | string;
  room_code: string;
  scheduled_at?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSessionPayload {
  job_position_id: string;
  candidate_profile_id: string;
  question_bank_ids?: string[];
  scheduled_at?: string;
}

export interface UpdateSessionStatusPayload {
  status: SessionStatus | string;
}

export interface CreateSessionResponse {
  message?: string;
  data: Session;
  magic_url?: string;
}
