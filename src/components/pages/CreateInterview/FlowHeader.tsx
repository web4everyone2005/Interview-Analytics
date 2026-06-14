import { CheckCircle2, Circle, DatabaseZap } from "lucide-react";

interface FlowHeaderProps {
  checks: Array<{ label: string; complete: boolean }>;
}

export function FlowHeader({ checks }: FlowHeaderProps) {
  const completeCount = checks.filter((item) => item.complete).length;

  return (
    <div className="mb-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-lg border border-blue-400/20 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-200">
            <DatabaseZap size={14} />
            Flow 1
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Interview Preparation & RAG Setup
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-white/45">
            Job position, candidate, question bank, knowledge document, session.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-5">
          {checks.map((item) => {
            const Icon = item.complete ? CheckCircle2 : Circle;
            return (
              <div
                key={item.label}
                className="flex items-center gap-2 rounded-lg border border-white/8 bg-white/[0.03] px-3 py-2"
              >
                <Icon
                  size={14}
                  className={item.complete ? "text-emerald-300" : "text-white/25"}
                />
                <span className="truncate text-xs text-white/60">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/8">
        <div
          className="h-full rounded-full bg-blue-400 transition-all"
          style={{ width: `${(completeCount / checks.length) * 100}%` }}
        />
      </div>
    </div>
  );
}
