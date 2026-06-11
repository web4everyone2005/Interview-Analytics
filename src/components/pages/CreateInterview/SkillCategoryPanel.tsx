import { FormEvent, useState } from "react";
import { Plus, Tag } from "lucide-react";
import { QuestionCategory } from "@/models/question-category.model";
import { Skill } from "@/models/skill.model";
import {
  FieldLabel,
  Panel,
  primaryButtonClass,
  StatusPill,
  inputClass,
} from "./Panel";

interface SkillCategoryPanelProps {
  skills: Skill[];
  categories: QuestionCategory[];
  onCreateSkill: (name: string) => Promise<void>;
  onCreateCategory: (name: string) => Promise<void>;
  isCreatingSkill: boolean;
  isCreatingCategory: boolean;
}

export function SkillCategoryPanel({
  skills,
  categories,
  onCreateSkill,
  onCreateCategory,
  isCreatingSkill,
  isCreatingCategory,
}: SkillCategoryPanelProps) {
  const [skillName, setSkillName] = useState("");
  const [categoryName, setCategoryName] = useState("");

  const submitSkill = async (event: FormEvent) => {
    event.preventDefault();
    if (!skillName.trim()) return;
    await onCreateSkill(skillName.trim());
    setSkillName("");
  };

  const submitCategory = async (event: FormEvent) => {
    event.preventDefault();
    if (!categoryName.trim()) return;
    await onCreateCategory(categoryName.trim());
    setCategoryName("");
  };

  return (
    <Panel
      title="Skills & categories"
      eyebrow="Foundation"
      actions={<StatusPill tone="blue">{skills.length + categories.length} items</StatusPill>}
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <form onSubmit={submitSkill}>
          <FieldLabel htmlFor="skill-name">Skill</FieldLabel>
          <div className="flex gap-2">
            <input
              id="skill-name"
              value={skillName}
              onChange={(event) => setSkillName(event.target.value)}
              placeholder="React, Node.js, System Design"
              className={inputClass}
            />
            <button
              type="submit"
              disabled={isCreatingSkill}
              className={primaryButtonClass}
              aria-label="Create skill"
            >
              <Plus size={15} />
            </button>
          </div>
          <div className="mt-3 flex max-h-24 flex-wrap gap-1.5 overflow-y-auto">
            {skills.map((skill) => (
              <StatusPill key={skill._id}>{skill.name}</StatusPill>
            ))}
          </div>
        </form>

        <form onSubmit={submitCategory}>
          <FieldLabel htmlFor="category-name">Question category</FieldLabel>
          <div className="flex gap-2">
            <input
              id="category-name"
              value={categoryName}
              onChange={(event) => setCategoryName(event.target.value)}
              placeholder="Frontend, Backend, Culture"
              className={inputClass}
            />
            <button
              type="submit"
              disabled={isCreatingCategory}
              className={primaryButtonClass}
              aria-label="Create category"
            >
              <Tag size={15} />
            </button>
          </div>
          <div className="mt-3 flex max-h-24 flex-wrap gap-1.5 overflow-y-auto">
            {categories.map((category) => (
              <StatusPill key={category._id}>{category.name}</StatusPill>
            ))}
          </div>
        </form>
      </div>
    </Panel>
  );
}
