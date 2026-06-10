import { FormEvent, useState } from "react";
import { BriefcaseBusiness, Plus } from "lucide-react";
import { JobPosition } from "@/models/job-position.model";
import { Skill } from "@/models/skill.model";
import { getEntityId, getEntityLabel } from "@/lib/entity";
import {
  FieldLabel,
  Panel,
  StatusPill,
  inputClass,
  primaryButtonClass,
} from "./Panel";

interface JobPositionPanelProps {
  jobPositions: JobPosition[];
  skills: Skill[];
  selectedJobId: string;
  onSelectJob: (id: string) => void;
  onCreateJobPosition: (payload: {
    title: string;
    department: string;
    required_skills: string[];
  }) => Promise<void>;
  isCreating: boolean;
}

export function JobPositionPanel({
  jobPositions,
  skills,
  selectedJobId,
  onSelectJob,
  onCreateJobPosition,
  isCreating,
}: JobPositionPanelProps) {
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("Engineering");
  const [skillIds, setSkillIds] = useState<string[]>([]);

  const selectedJob = jobPositions.find((job) => job._id === selectedJobId);

  const toggleSkill = (id: string) => {
    setSkillIds((current) =>
      current.includes(id)
        ? current.filter((skillId) => skillId !== id)
        : [...current, id]
    );
  };

  const submitJob = async (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim()) return;
    await onCreateJobPosition({
      title: title.trim(),
      department: department.trim() || "Engineering",
      required_skills: skillIds,
    });
    setTitle("");
    setDepartment("Engineering");
    setSkillIds([]);
  };

  return (
    <Panel
      title="Job position"
      eyebrow="Step 1"
      actions={<StatusPill tone={selectedJob ? "green" : "neutral"}>{selectedJob ? "Selected" : "Required"}</StatusPill>}
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
        <form onSubmit={submitJob} className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="job-title">Title</FieldLabel>
              <input
                id="job-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Frontend Developer"
                className={inputClass}
              />
            </div>
            <div>
              <FieldLabel htmlFor="job-department">Department</FieldLabel>
              <input
                id="job-department"
                value={department}
                onChange={(event) => setDepartment(event.target.value)}
                placeholder="Engineering"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-medium text-white/65">
              Required skills
            </p>
            <div className="grid max-h-36 gap-2 overflow-y-auto rounded-lg border border-white/8 bg-black/15 p-2 sm:grid-cols-2">
              {skills.length === 0 && (
                <p className="px-1 py-2 text-xs text-white/35">No skills yet.</p>
              )}
              {skills.map((skill) => (
                <label
                  key={skill._id}
                  className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-white/70 hover:bg-white/6"
                >
                  <input
                    type="checkbox"
                    checked={skillIds.includes(skill._id)}
                    onChange={() => toggleSkill(skill._id)}
                    className="h-4 w-4 accent-blue-500"
                  />
                  <span className="truncate">{skill.name}</span>
                </label>
              ))}
            </div>
          </div>

          <button type="submit" disabled={isCreating} className={primaryButtonClass}>
            <Plus size={15} />
            Create job
          </button>
        </form>

        <div>
          <FieldLabel htmlFor="job-select">Use job position</FieldLabel>
          <select
            id="job-select"
            value={selectedJobId}
            onChange={(event) => onSelectJob(event.target.value)}
            className={inputClass}
          >
            <option value="">Select job</option>
            {jobPositions.map((job) => (
              <option key={job._id} value={job._id}>
                {job.title}
              </option>
            ))}
          </select>

          <div className="mt-3 max-h-48 overflow-y-auto rounded-lg border border-white/8">
            {jobPositions.map((job) => (
              <button
                key={job._id}
                type="button"
                onClick={() => onSelectJob(job._id)}
                className={`flex w-full items-start gap-3 border-b border-white/6 px-3 py-2 text-left last:border-0 ${
                  selectedJobId === job._id ? "bg-blue-500/10" : "hover:bg-white/5"
                }`}
              >
                <BriefcaseBusiness size={16} className="mt-0.5 text-blue-300" />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-white">
                    {job.title}
                  </span>
                  <span className="block truncate text-xs text-white/35">
                    {job.required_skills
                      .map((skill) => getEntityLabel(skill, getEntityId(skill)))
                      .join(", ") || job.department}
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
