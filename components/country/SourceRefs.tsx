import type { SourceRef } from "@/lib/types";

interface SourceRefsProps {
  sourceIds: string[];
  sources: SourceRef[];
}

export function SourceRefs({ sourceIds, sources }: SourceRefsProps) {
  const matched = sourceIds
    .map((id) => sources.find((s) => s.id === id))
    .filter((s): s is SourceRef => Boolean(s));

  if (matched.length === 0) return null;

  return (
    <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
      <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-page-text-muted">
        Source
      </span>
      {matched.map((s) => (
        <a
          key={s.id}
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          title={`${s.title} — ${s.publisher}`}
          className="rounded border border-page-border px-1.5 py-0.5 font-mono text-[10.5px] text-page-text-secondary transition-colors hover:border-page-border-strong hover:text-page-text"
          style={{ borderColor: "var(--color-page-border)" }}
        >
          {s.publisher}
        </a>
      ))}
    </div>
  );
}
