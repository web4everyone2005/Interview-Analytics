import { ChangeEvent, useState } from "react";
import { FileCheck2, FileUp } from "lucide-react";
import { JobPosition } from "@/models/job-position.model";
import { KnowledgeDocument } from "@/models/knowledge.model";
import {
  FieldLabel,
  Panel,
  StatusPill,
  ghostButtonClass,
  inputClass,
} from "./Panel";

interface KnowledgeUploadPanelProps {
  jobPositions: JobPosition[];
  selectedJobId: string;
  documents: KnowledgeDocument[];
  onUpload: (payload: {
    file: File;
    title?: string;
    job_position_id: string;
  }) => Promise<void>;
  isUploading: boolean;
}

export function KnowledgeUploadPanel({
  jobPositions,
  selectedJobId,
  documents,
  onUpload,
  isUploading,
}: KnowledgeUploadPanelProps) {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const selectedDocuments = documents.filter(
    (document) => document.job_position_id === selectedJobId
  );
  const hasProcessedDocument = selectedDocuments.some(
    (document) => document.is_processed
  );

  const changeFile = (event: ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0] ?? null);
  };

  const submitUpload = async () => {
    if (!file || !selectedJobId) return;
    await onUpload({
      file,
      title: title.trim() || undefined,
      job_position_id: selectedJobId,
    });
    setFile(null);
    setTitle("");
  };

  return (
    <Panel
      title="Knowledge base"
      eyebrow="Step 4"
      actions={<StatusPill tone={hasProcessedDocument ? "green" : "amber"}>{hasProcessedDocument ? "Ready" : "Pending"}</StatusPill>}
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-3">
          <div>
            <FieldLabel htmlFor="knowledge-job">Job position</FieldLabel>
            <select
              id="knowledge-job"
              value={selectedJobId}
              disabled
              className={inputClass}
            >
              <option value="">Select job first</option>
              {jobPositions.map((job) => (
                <option key={job._id} value={job._id}>
                  {job.title}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="knowledge-title">Document title</FieldLabel>
              <input
                id="knowledge-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Frontend Handbook"
                className={inputClass}
              />
            </div>
            <div>
              <FieldLabel htmlFor="knowledge-file">File</FieldLabel>
              <input
                id="knowledge-file"
                type="file"
                accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                onChange={changeFile}
                className={inputClass}
              />
            </div>
          </div>

          <button
            type="button"
            disabled={!file || !selectedJobId || isUploading}
            onClick={submitUpload}
            className={ghostButtonClass}
          >
            <FileUp size={15} />
            Upload knowledge
          </button>
        </div>

        <div>
          <p className="mb-2 text-xs font-medium text-white/65">Documents</p>
          <div className="max-h-44 overflow-y-auto rounded-lg border border-white/8">
            {selectedDocuments.length === 0 && (
              <p className="px-3 py-4 text-xs text-white/35">
                No document for selected job.
              </p>
            )}
            {selectedDocuments.map((document) => (
              <div
                key={document.id}
                className="flex items-start gap-3 border-b border-white/6 px-3 py-2 last:border-0"
              >
                <FileCheck2
                  size={16}
                  className={
                    document.is_processed ? "text-emerald-300" : "text-amber-300"
                  }
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">
                    {document.title}
                  </p>
                  <p className="truncate text-xs text-white/35">
                    {document.is_processed ? "Processed" : "Processing"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Panel>
  );
}
