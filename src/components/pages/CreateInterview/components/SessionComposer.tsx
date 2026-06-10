import { Clipboard, Copy, Mail, Plus } from "lucide-react";
import { CandidateProfile } from "@/models/candidate.model";
import { JobPosition } from "@/models/job-position.model";
import { Session } from "@/models/session.model";
import {
  FieldLabel,
  Panel,
  StatusPill,
  ghostButtonClass,
  inputClass,
  primaryButtonClass,
} from "./Panel";

interface CreatedSession {
  session: Session;
  magicUrl?: string;
}

interface SessionComposerProps {
  selectedJob?: JobPosition;
  selectedCandidate?: CandidateProfile;
  selectedQuestionIds: string[];
  scheduledAt: string;
  onScheduledAtChange: (value: string) => void;
  onCreateSession: () => Promise<void>;
  onSendInvitation: () => Promise<void>;
  createdSession: CreatedSession | null;
  isCreating: boolean;
  isSending: boolean;
}

export function SessionComposer({
  selectedJob,
  selectedCandidate,
  selectedQuestionIds,
  scheduledAt,
  onScheduledAtChange,
  onCreateSession,
  onSendInvitation,
  createdSession,
  isCreating,
  isSending,
}: SessionComposerProps) {
  const canCreate =
    Boolean(selectedJob) &&
    Boolean(selectedCandidate) &&
    selectedQuestionIds.length > 0;

  const copyMagicUrl = async () => {
    if (!createdSession?.magicUrl) return;
    await navigator.clipboard.writeText(createdSession.magicUrl);
  };

  return (
    <Panel
      title="Session & invitation"
      eyebrow="Step 5"
      actions={<StatusPill tone={createdSession ? "green" : "neutral"}>{createdSession ? "Created" : "Draft"}</StatusPill>}
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="session-job">Job</FieldLabel>
              <input
                id="session-job"
                value={selectedJob?.title ?? ""}
                readOnly
                placeholder="Select job"
                className={inputClass}
              />
            </div>
            <div>
              <FieldLabel htmlFor="session-candidate">Candidate</FieldLabel>
              <input
                id="session-candidate"
                value={selectedCandidate?.full_name ?? ""}
                readOnly
                placeholder="Select candidate"
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="session-schedule">Scheduled at</FieldLabel>
              <input
                id="session-schedule"
                type="datetime-local"
                value={scheduledAt}
                onChange={(event) => onScheduledAtChange(event.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <FieldLabel htmlFor="session-question-count">Questions</FieldLabel>
              <input
                id="session-question-count"
                value={`${selectedQuestionIds.length} questions`}
                readOnly
                className={inputClass}
              />
            </div>
          </div>

          <button
            type="button"
            disabled={!canCreate || isCreating}
            onClick={onCreateSession}
            className={primaryButtonClass}
          >
            <Plus size={15} />
            Create session
          </button>
        </div>

        <div className="rounded-lg border border-white/8 bg-black/15 p-3">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
            <Clipboard size={16} className="text-blue-300" />
            Result
          </div>

          {!createdSession && (
            <p className="text-sm text-white/35">No session created yet.</p>
          )}

          {createdSession && (
            <div className="space-y-3">
              <div>
                <p className="text-[11px] uppercase tracking-widest text-white/30">
                  Room code
                </p>
                <p className="mt-1 font-mono text-lg font-semibold text-white">
                  {createdSession.session.room_code}
                </p>
              </div>

              {createdSession.magicUrl && (
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-white/30">
                    Magic URL
                  </p>
                  <div className="mt-1 flex gap-2">
                    <input
                      value={createdSession.magicUrl}
                      readOnly
                      className={inputClass}
                    />
                    <button
                      type="button"
                      onClick={copyMagicUrl}
                      className={ghostButtonClass}
                      aria-label="Copy magic URL"
                    >
                      <Copy size={15} />
                    </button>
                  </div>
                </div>
              )}

              <button
                type="button"
                disabled={isSending}
                onClick={onSendInvitation}
                className={ghostButtonClass}
              >
                <Mail size={15} />
                Send invitation
              </button>
            </div>
          )}
        </div>
      </div>
    </Panel>
  );
}
