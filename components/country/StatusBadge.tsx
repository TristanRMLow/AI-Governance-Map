import type { LegislationStatus } from "@/lib/types";

const STATUS_LABEL: Record<LegislationStatus, string> = {
  proposed: "Proposed",
  passed: "Passed",
  in_force: "In force",
  repealed: "Repealed",
};

const STATUS_CLASS: Record<LegislationStatus, string> = {
  proposed: "text-status-warning bg-status-warning-soft",
  passed: "text-status-blue bg-status-blue-soft",
  in_force: "text-status-good bg-status-good-soft",
  repealed: "text-page-text-muted bg-page-border/60",
};

export function StatusBadge({ status }: { status: LegislationStatus }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.06em] ${STATUS_CLASS[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}
