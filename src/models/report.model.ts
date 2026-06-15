export interface ReportMetrics {
  total_questions: number;
  evaluated_questions: number;
  average_score: number;
}

export interface DashboardReport {
  session_id: string;
  room_code: string;
  status: string;
  scheduled_at: string;
  candidate: any; // Mongoose populated CandidateProfile
  metrics: ReportMetrics;
}

export interface EvaluationDetail {
  score: number;
  feedback: string;
  strengths: string[];
  weaknesses: string[];
  version?: number;
}

export interface DetailedResult {
  question_id: string;
  question_content: string;
  expected_answer: string;
  candidate_transcript: string;
  audio_url?: string;
  evaluation: EvaluationDetail | null;
}

export interface InterviewReport {
  session_info: any; // Mongoose populated InterviewSession
  metrics: ReportMetrics;
  detailed_results: DetailedResult[];
}
