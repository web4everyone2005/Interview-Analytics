import { CalendarClock, FileText, ListChecks, UserRound } from "lucide-react";
import { CandidateProfile } from "@/models/candidate.model";
import { JobPosition } from "@/models/job-position.model";
import { KnowledgeDocument } from "@/models/knowledge.model";
import { Panel, StatusPill } from "./Panel";

interface SelectionSummaryProps {
  selectedJob?: JobPosition;
  selectedCandidate?: CandidateProfile;
  selectedQuestionCount: number;
  selectedDocuments: KnowledgeDocument[];
}

export function SelectionSummary({
  selectedJob,
  selectedCandidate,
  selectedQuestionCount,
  selectedDocuments,
}: SelectionSummaryProps) {
  const hasReadyDocument = selectedDocuments.some((document) => document.is_processed);

  return (
    <Panel
      title="Preparation state"
      eyebrow="Review"
      actions={<StatusPill tone={hasReadyDocument ? "green" : "amber"}>{hasReadyDocument ? "RAG ready" : "RAG pending"}</StatusPill>}
    >
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryItem
          icon={<CalendarClock size={16} />}
          label="Job"
          value={selectedJob?.title ?? "Not selected"}
          complete={Boolean(selectedJob)}
        />
        <SummaryItem
          icon={<UserRound size={16} />}
          label="Candidate"
          value={selectedCandidate?.full_name ?? "Not selected"}
          complete={Boolean(selectedCandidate)}
        />
        <SummaryItem
          icon={<ListChecks size={16} />}
          label="Questions"
          value={`${selectedQuestionCount} selected`}
          complete={selectedQuestionCount > 0}
        />
        <SummaryItem
          icon={<FileText size={16} />}
          label="Documents"
          value={`${selectedDocuments.length} uploaded`}
          complete={hasReadyDocument}
        />
      </div>
    </Panel>
  );
}

function SummaryItem({
  icon,
  label,
  value,
  complete,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  complete: boolean;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-white/8 bg-black/15 px-3 py-2">
      <span className={complete ? "text-emerald-300" : "text-white/25"}>{icon}</span>
      <span className="min-w-0">
        <span className="block text-[11px] uppercase tracking-widest text-white/30">
          {label}
        </span>
        <span className="block truncate text-sm font-medium text-white/70">
          {value}
        </span>
      </span>
    </div>
  );
}
