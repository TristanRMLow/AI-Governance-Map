import { CircleAlert } from "lucide-react";
import { EmptyState } from "@/components/country/SectionCard";
import { SourceRefs } from "@/components/country/SourceRefs";
import type { Development, SourceRef } from "@/lib/types";

function MajorBadge() {
  return (
    <span
      className="inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.05em]"
      style={{ background: "var(--status-warning-soft)", color: "var(--status-warning)" }}
      title="Flagged as a major development: binding legislation, a major court decision, landmark investment, or a significant international agreement."
    >
      <CircleAlert size={10} strokeWidth={2.5} />
      Major
    </span>
  );
}

export function DateFeed({
  items,
  sources,
  emptyLabel,
}: {
  items: Development[];
  sources: SourceRef[];
  emptyLabel: string;
}) {
  if (items.length === 0) return <EmptyState label={emptyLabel} />;

  const sorted = [...items].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <ul className="space-y-4">
      {sorted.map((item) => (
        <li key={`${item.date}-${item.text}`} className="flex gap-3">
          <span
            aria-hidden
            className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full"
            style={{ background: "var(--color-country)" }}
          />
          <div className="min-w-0">
            <div className="flex flex-wrap items-start gap-x-2 gap-y-1">
              <p className="text-[14px] leading-snug text-page-text">{item.text}</p>
              {item.severity === "major" && <MajorBadge />}
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className="font-mono text-[11px] text-page-text-muted">{item.date}</span>
              <SourceRefs sourceIds={item.sourceIds} sources={sources} />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
