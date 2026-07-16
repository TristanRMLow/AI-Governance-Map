import type { InfluenceNode } from "@/lib/types";

const TYPE_CLASS: Record<InfluenceNode["type"], string> = {
  government: "border-[color:var(--color-country)]/50 bg-[color:var(--color-country-soft)] text-[color:var(--color-country)]",
  agency: "border-page-border-strong bg-page-bg text-page-text",
  company: "border-status-warning/40 bg-status-warning-soft text-status-warning",
  research: "border-page-border-strong bg-page-bg text-page-text-secondary",
  think_tank: "border-page-border-strong bg-page-bg text-page-text-secondary",
};

export function InfluenceMap({ nodes }: { nodes: InfluenceNode[] }) {
  if (nodes.length === 0) return null;
  return (
    <div className="mb-6 flex flex-wrap items-center gap-x-2 gap-y-3 rounded-xl border border-page-border bg-page-bg/60 p-4">
      {nodes.map((node, i) => (
        <div key={node.label} className="flex items-center gap-2">
          <span
            className={`rounded-full border px-3 py-1 text-[12px] font-medium whitespace-nowrap ${TYPE_CLASS[node.type]}`}
          >
            {node.label}
          </span>
          {i < nodes.length - 1 && <span className="text-page-text-muted">→</span>}
        </div>
      ))}
    </div>
  );
}
