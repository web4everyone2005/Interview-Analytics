import { ReactNode } from "react";
import { Lock } from "lucide-react";

interface PanelProps {
  title: string;
  eyebrow?: string;
  actions?: ReactNode;
  locked?: boolean;
  lockedMessage?: string;
  children: ReactNode;
}

export function Panel({
  title,
  eyebrow,
  actions,
  locked = false,
  lockedMessage,
  children,
}: PanelProps) {
  return (
    <section className="rounded-lg border border-white/8 bg-white/[0.03] overflow-hidden">
      <div className="flex items-center justify-between gap-4 border-b border-white/8 px-4 py-3">
        <div className="min-w-0">
          {eyebrow && (
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30">
              {eyebrow}
            </p>
          )}
          <h2 className="mt-0.5 truncate text-sm font-semibold text-white">
            {title}
          </h2>
        </div>
        {actions}
      </div>
      {locked && (
        <div className="flex items-center gap-2 border-b border-white/8 bg-amber-500/10 px-4 py-2 text-xs font-medium text-amber-200">
          <Lock size={14} />
          <span>{lockedMessage ?? "Complete the previous step first."}</span>
        </div>
      )}
      <div className={`p-4 ${locked ? "pointer-events-none select-none opacity-45" : ""}`}>
        {children}
      </div>
    </section>
  );
}

interface StatusPillProps {
  tone?: "neutral" | "green" | "blue" | "red" | "amber";
  children: ReactNode;
}

const toneClass: Record<NonNullable<StatusPillProps["tone"]>, string> = {
  neutral: "bg-white/8 text-white/55",
  green: "bg-emerald-500/10 text-emerald-300",
  blue: "bg-blue-500/10 text-blue-300",
  red: "bg-red-500/10 text-red-300",
  amber: "bg-amber-500/10 text-amber-300",
};

export function StatusPill({ tone = "neutral", children }: StatusPillProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-1 text-[11px] font-medium ${toneClass[tone]}`}
    >
      {children}
    </span>
  );
}

interface FieldLabelProps {
  htmlFor: string;
  children: ReactNode;
}

export function FieldLabel({ htmlFor, children }: FieldLabelProps) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-medium text-white/65">
      {children}
    </label>
  );
}

export const inputClass =
  "w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-blue-400/70";

export const buttonClass =
  "inline-flex min-h-9 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50";

export const primaryButtonClass = `${buttonClass} bg-blue-500 text-white hover:bg-blue-400 active:scale-[0.98]`;

export const ghostButtonClass = `${buttonClass} bg-white/7 text-white/70 hover:bg-white/12 hover:text-white`;
