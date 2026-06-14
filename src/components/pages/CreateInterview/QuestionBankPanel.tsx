import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { FileUp, ListChecks, Plus } from "lucide-react";
import { QuestionCategory } from "@/models/question-category.model";
import { Question } from "@/models/question.model";
import { Skill } from "@/models/skill.model";
import { getEntityId, getEntityLabel } from "@/lib/entity";
import {
  FieldLabel,
  Panel,
  StatusPill,
  ghostButtonClass,
  inputClass,
  primaryButtonClass,
} from "./Panel";

interface QuestionBankPanelProps {
  categories: QuestionCategory[];
  skills: Skill[];
  questions: Question[];
  selectedCategoryId: string;
  selectedQuestionIds: string[];
  locked?: boolean;
  lockedMessage?: string;
  onCategoryChange: (id: string) => void;
  onToggleQuestion: (id: string) => void;
  onCreateQuestion: (payload: {
    category_id: string;
    assessed_skills: string[];
    content: string;
    expected_answer: string;
  }) => Promise<void>;
  onImportQuestions: (payload: {
    file: File;
    category_id: string;
  }) => Promise<void>;
  isCreating: boolean;
  isImporting: boolean;
  isLoading: boolean;
}

export function QuestionBankPanel({
  categories,
  skills,
  questions,
  selectedCategoryId,
  selectedQuestionIds,
  locked,
  lockedMessage,
  onCategoryChange,
  onToggleQuestion,
  onCreateQuestion,
  onImportQuestions,
  isCreating,
  isImporting,
  isLoading,
}: QuestionBankPanelProps) {
  const [content, setContent] = useState("");
  const [expectedAnswer, setExpectedAnswer] = useState("");
  const [skillIds, setSkillIds] = useState<string[]>([]);
  const [importFile, setImportFile] = useState<File | null>(null);

  const skillNameById = useMemo(
    () => new Map(skills.map((skill) => [skill._id, skill.name])),
    [skills]
  );

  const activeCategoryId = selectedCategoryId;

  const toggleSkill = (id: string) => {
    setSkillIds((current) =>
      current.includes(id)
        ? current.filter((skillId) => skillId !== id)
        : [...current, id]
    );
  };

  const submitQuestion = async (event: FormEvent) => {
    event.preventDefault();
    if (!activeCategoryId || !content.trim() || !expectedAnswer.trim()) return;
    await onCreateQuestion({
      category_id: activeCategoryId,
      assessed_skills: skillIds,
      content: content.trim(),
      expected_answer: expectedAnswer.trim(),
    });
    setContent("");
    setExpectedAnswer("");
    setSkillIds([]);
  };

  const changeImportFile = (event: ChangeEvent<HTMLInputElement>) => {
    setImportFile(event.target.files?.[0] ?? null);
  };

  const submitImport = async () => {
    if (!importFile || !activeCategoryId) return;
    await onImportQuestions({ file: importFile, category_id: activeCategoryId });
    setImportFile(null);
  };

  return (
    <Panel
      title="Question bank"
      eyebrow="Step 3"
      locked={locked}
      lockedMessage={lockedMessage}
      actions={<StatusPill tone={selectedQuestionIds.length ? "green" : "neutral"}>{selectedQuestionIds.length} selected</StatusPill>}
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <form onSubmit={submitQuestion} className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="question-category">Category</FieldLabel>
              <select
                id="question-category"
                value={activeCategoryId}
                onChange={(event) => {
                  onCategoryChange(event.target.value);
                }}
                className={inputClass}
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <FieldLabel htmlFor="question-import">Import PDF</FieldLabel>
              <div className="flex gap-2">
                <input
                  id="question-import"
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={changeImportFile}
                  className={inputClass}
                />
                <button
                  type="button"
                  disabled={!importFile || !activeCategoryId || isImporting}
                  onClick={submitImport}
                  className={ghostButtonClass}
                  aria-label="Import questions"
                >
                  <FileUp size={15} />
                </button>
              </div>
            </div>
          </div>

          <div>
            <FieldLabel htmlFor="question-content">Question</FieldLabel>
            <textarea
              id="question-content"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              rows={3}
              placeholder="Explain React hooks"
              className={inputClass}
            />
          </div>

          <div>
            <FieldLabel htmlFor="question-answer">Expected answer</FieldLabel>
            <textarea
              id="question-answer"
              value={expectedAnswer}
              onChange={(event) => setExpectedAnswer(event.target.value)}
              rows={4}
              placeholder="A good answer should mention..."
              className={inputClass}
            />
          </div>

          <div>
            <p className="mb-2 text-xs font-medium text-white/65">
              Assessed skills
            </p>
            <div className="grid max-h-28 gap-2 overflow-y-auto rounded-lg border border-white/8 bg-black/15 p-2 sm:grid-cols-2">
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
            Create question
          </button>
        </form>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-medium text-white/65">Questions</p>
            <span className="text-[11px] text-white/30">
              {isLoading ? "Loading" : `${questions.length} items`}
            </span>
          </div>
          <div className="max-h-[520px] overflow-y-auto rounded-lg border border-white/8">
            {questions.length === 0 && (
              <div className="flex items-center gap-2 px-3 py-4 text-xs text-white/35">
                <ListChecks size={15} />
                No questions for this filter.
              </div>
            )}
            {questions.map((question) => {
              const selected = selectedQuestionIds.includes(question.id);
              const skillsLabel =
                question.assessed_skills
                  ?.map((skill) =>
                    typeof skill === "string"
                      ? skillNameById.get(skill) ?? skill
                      : getEntityLabel(skill, getEntityId(skill))
                  )
                  .join(", ") || "No skill";
              return (
                <button
                  key={question.id}
                  type="button"
                  onClick={() => onToggleQuestion(question.id)}
                  className={`w-full border-b border-white/6 px-3 py-3 text-left last:border-0 ${
                    selected ? "bg-blue-500/10" : "hover:bg-white/5"
                  }`}
                >
                  <span className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => onToggleQuestion(question.id)}
                      onClick={(event) => event.stopPropagation()}
                      className="mt-1 h-4 w-4 accent-blue-500"
                    />
                    <span className="min-w-0">
                      <span className="line-clamp-2 text-sm font-medium text-white">
                        {question.content}
                      </span>
                      <span className="mt-1 block truncate text-xs text-white/35">
                        {skillsLabel}
                      </span>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </Panel>
  );
}
