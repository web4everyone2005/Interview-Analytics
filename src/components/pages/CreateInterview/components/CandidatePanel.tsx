import { FormEvent, useState } from "react";
import { Plus, UserRound } from "lucide-react";
import { CandidateProfile } from "@/models/candidate.model";
import {
  FieldLabel,
  Panel,
  StatusPill,
  inputClass,
  primaryButtonClass,
} from "./Panel";

interface CandidatePanelProps {
  candidates: CandidateProfile[];
  selectedCandidateId: string;
  onSelectCandidate: (id: string) => void;
  onCreateCandidate: (payload: {
    full_name: string;
    email: string;
    resume_url?: string;
  }) => Promise<void>;
  isCreating: boolean;
}

export function CandidatePanel({
  candidates,
  selectedCandidateId,
  onSelectCandidate,
  onCreateCandidate,
  isCreating,
}: CandidatePanelProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const selectedCandidate = candidates.find(
    (candidate) => candidate._id === selectedCandidateId
  );

  const submitCandidate = async (event: FormEvent) => {
    event.preventDefault();
    if (!fullName.trim() || !email.trim()) return;
    await onCreateCandidate({
      full_name: fullName.trim(),
      email: email.trim(),
      resume_url: resumeUrl.trim() || undefined,
    });
    setFullName("");
    setEmail("");
    setResumeUrl("");
  };

  return (
    <Panel
      title="Candidate"
      eyebrow="Step 2"
      actions={<StatusPill tone={selectedCandidate ? "green" : "neutral"}>{selectedCandidate ? "Selected" : "Required"}</StatusPill>}
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
        <form onSubmit={submitCandidate} className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="candidate-name">Full name</FieldLabel>
              <input
                id="candidate-name"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Nguyen Van A"
                className={inputClass}
              />
            </div>
            <div>
              <FieldLabel htmlFor="candidate-email">Email</FieldLabel>
              <input
                id="candidate-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="candidate@example.com"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <FieldLabel htmlFor="candidate-resume">Resume URL</FieldLabel>
            <input
              id="candidate-resume"
              value={resumeUrl}
              onChange={(event) => setResumeUrl(event.target.value)}
              placeholder="https://..."
              className={inputClass}
            />
          </div>

          <button type="submit" disabled={isCreating} className={primaryButtonClass}>
            <Plus size={15} />
            Create candidate
          </button>
        </form>

        <div>
          <FieldLabel htmlFor="candidate-select">Use candidate</FieldLabel>
          <select
            id="candidate-select"
            value={selectedCandidateId}
            onChange={(event) => onSelectCandidate(event.target.value)}
            className={inputClass}
          >
            <option value="">Select candidate</option>
            {candidates.map((candidate) => (
              <option key={candidate._id} value={candidate._id}>
                {candidate.full_name}
              </option>
            ))}
          </select>

          <div className="mt-3 max-h-48 overflow-y-auto rounded-lg border border-white/8">
            {candidates.map((candidate) => (
              <button
                key={candidate._id}
                type="button"
                onClick={() => onSelectCandidate(candidate._id)}
                className={`flex w-full items-start gap-3 border-b border-white/6 px-3 py-2 text-left last:border-0 ${
                  selectedCandidateId === candidate._id
                    ? "bg-blue-500/10"
                    : "hover:bg-white/5"
                }`}
              >
                <UserRound size={16} className="mt-0.5 text-cyan-300" />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-white">
                    {candidate.full_name}
                  </span>
                  <span className="block truncate text-xs text-white/35">
                    {candidate.email}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Panel>
  );
}
