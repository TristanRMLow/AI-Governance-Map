"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import type { DebateWithCountry } from "@/lib/aggregateData";
import { SourceRefs } from "@/components/country/SourceRefs";
import { CATEGORY_COLOR } from "@/lib/categoryColors";
import { useWatchlist } from "@/lib/useWatchlist";
import type { Category } from "@/lib/types";

const CATEGORIES = Object.keys(CATEGORY_COLOR).filter((c) => c !== "sources") as Category[];

export function TopicsView({ debates }: { debates: DebateWithCountry[] }) {
  const [category, setCategory] = useState<Category | "all">("all");
  const [query, setQuery] = useState("");
  const [starredOnly, setStarredOnly] = useState(false);
  const { starred, toggle, isStarred, hydrated } = useWatchlist();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return debates.filter((d) => {
      if (category !== "all" && d.category !== category) return false;
      if (starredOnly && !starred.has(d.countryCode)) return false;
      if (q && !`${d.topic} ${d.summary} ${d.countryName}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [debates, category, query, starredOnly, starred]);

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setCategory("all")}
          className="rounded-full px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.05em] transition-colors"
          style={
            category === "all"
              ? { background: "var(--color-page-text)", color: "var(--color-page-bg)" }
              : { background: "var(--color-page-border)", color: "var(--color-page-text-muted)" }
          }
        >
          All
        </button>
        {CATEGORIES.map((c) => {
          const cat = CATEGORY_COLOR[c];
          const active = category === c;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className="rounded-full px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.05em] transition-colors"
              style={active ? { background: cat.color, color: "var(--color-page-bg)" } : { background: cat.soft, color: cat.color }}
            >
              {cat.label}
            </button>
          );
        })}

        {hydrated && starred.size > 0 && (
          <button
            type="button"
            onClick={() => setStarredOnly((v) => !v)}
            className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] transition-colors"
            style={
              starredOnly
                ? { background: "var(--status-good-soft)", borderColor: "var(--status-good)", color: "var(--status-good)" }
                : { borderColor: "var(--color-page-border)", color: "var(--color-page-text-muted)" }
            }
          >
            <Star size={12} strokeWidth={2.25} fill={starredOnly ? "currentColor" : "none"} />
            Starred only
          </button>
        )}
      </div>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search topics, summaries, countries…"
        className="mt-3 w-full rounded-lg border border-page-border bg-page-card px-3.5 py-2.5 text-[13.5px] text-page-text placeholder:text-page-text-muted"
      />

      <p className="mt-3 font-mono text-[11px] text-page-text-muted">
        {filtered.length} of {debates.length} debates
      </p>

      <div className="mt-3 space-y-3">
        {filtered.map((debate, i) => {
          const cat = CATEGORY_COLOR[debate.category];
          return (
            <details
              key={`${debate.countryCode}-${debate.topic}-${i}`}
              className="group rounded-xl border border-page-border bg-page-card open:border-page-border-strong"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 px-4 py-3.5 [&::-webkit-details-marker]:hidden">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className="rounded-full px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.05em]"
                      style={{ background: cat.soft, color: cat.color }}
                    >
                      {cat.label}
                    </span>
                    <Link
                      href={`/country/${debate.countryCode}#debates`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1 text-[12px] font-semibold"
                      style={{ color: debate.accentColor.light }}
                    >
                      <span aria-hidden>{debate.flagEmoji}</span>
                      {debate.countryName}
                    </Link>
                  </div>
                  <h3 className="mt-1.5 text-[14px] font-medium text-page-text">{debate.topic}</h3>
                  <p className="mt-1 max-w-2xl text-[13px] leading-relaxed text-page-text-secondary">
                    {debate.summary}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggle(debate.countryCode);
                    }}
                    aria-label={isStarred(debate.countryCode) ? "Remove from watchlist" : "Add to watchlist"}
                    className="text-page-text-muted transition-colors hover:text-page-text"
                  >
                    <Star size={14} strokeWidth={2.25} fill={isStarred(debate.countryCode) ? "currentColor" : "none"} />
                  </button>
                  <span className="mt-0.5 text-page-text-muted transition-transform group-open:rotate-180">▾</span>
                </div>
              </summary>
              <div className="border-t border-page-border px-4 py-3.5">
                <p className="max-w-2xl text-[13.5px] leading-relaxed text-page-text-secondary">
                  {debate.expanded}
                </p>
                <SourceRefs sourceIds={debate.sourceIds} sources={debate.sources} />
              </div>
            </details>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="mt-8 rounded-lg border border-dashed border-page-border-strong px-4 py-6 text-center text-[13.5px] text-page-text-muted">
          Nothing matches these filters.
        </p>
      )}
    </div>
  );
}
