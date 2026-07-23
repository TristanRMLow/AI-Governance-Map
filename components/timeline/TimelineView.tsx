"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CircleAlert, Star } from "lucide-react";
import type { DevelopmentWithCountry } from "@/lib/aggregateData";
import { SourceRefs } from "@/components/country/SourceRefs";
import { useWatchlist } from "@/lib/useWatchlist";

function MajorBadge() {
  return (
    <span
      className="inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.05em]"
      style={{ background: "var(--status-warning-soft)", color: "var(--status-warning)" }}
    >
      <CircleAlert size={10} strokeWidth={2.5} />
      Major
    </span>
  );
}

export function TimelineView({
  developments,
  regions,
}: {
  developments: DevelopmentWithCountry[];
  regions: string[];
}) {
  const [region, setRegion] = useState<string>("all");
  const [majorOnly, setMajorOnly] = useState(false);
  const [starredOnly, setStarredOnly] = useState(false);
  const { starred, toggle, isStarred, hydrated } = useWatchlist();

  const filtered = useMemo(() => {
    return developments.filter((d) => {
      if (region !== "all" && d.region !== region) return false;
      if (majorOnly && d.severity !== "major") return false;
      if (starredOnly && !starred.has(d.countryCode)) return false;
      return true;
    });
  }, [developments, region, majorOnly, starredOnly, starred]);

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="rounded-lg border border-page-border bg-page-card px-3 py-1.5 text-[12.5px] text-page-text"
        >
          <option value="all">All regions</option>
          {regions.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => setMajorOnly((v) => !v)}
          className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[12.5px] transition-colors"
          style={
            majorOnly
              ? { background: "var(--status-warning-soft)", borderColor: "var(--status-warning)", color: "var(--status-warning)" }
              : { borderColor: "var(--color-page-border)", color: "var(--color-page-text-muted)" }
          }
        >
          <CircleAlert size={13} strokeWidth={2.25} />
          Major only
        </button>

        {hydrated && starred.size > 0 && (
          <button
            type="button"
            onClick={() => setStarredOnly((v) => !v)}
            className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[12.5px] transition-colors"
            style={
              starredOnly
                ? { background: "var(--status-good-soft)", borderColor: "var(--status-good)", color: "var(--status-good)" }
                : { borderColor: "var(--color-page-border)", color: "var(--color-page-text-muted)" }
            }
          >
            <Star size={13} strokeWidth={2.25} fill={starredOnly ? "currentColor" : "none"} />
            Starred only ({starred.size})
          </button>
        )}

        <span className="ml-auto font-mono text-[11px] text-page-text-muted">
          {filtered.length} of {developments.length}
        </span>
      </div>

      <ul className="mt-5 space-y-4">
        {filtered.map((item, i) => (
          <li
            key={`${item.countryCode}-${item.date}-${i}`}
            className="rounded-xl border border-page-border bg-page-card p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <Link
                href={`/country/${item.countryCode}#recent-developments`}
                className="flex shrink-0 items-center gap-1.5 text-[12.5px] font-semibold"
                style={{ color: item.accentColor.light }}
              >
                <span aria-hidden>{item.flagEmoji}</span>
                {item.countryName}
              </Link>
              <button
                type="button"
                onClick={() => toggle(item.countryCode)}
                aria-label={isStarred(item.countryCode) ? "Remove from watchlist" : "Add to watchlist"}
                className="shrink-0 text-page-text-muted transition-colors hover:text-page-text"
              >
                <Star size={14} strokeWidth={2.25} fill={isStarred(item.countryCode) ? "currentColor" : "none"} />
              </button>
            </div>

            <div className="mt-2 flex flex-wrap items-start gap-x-2 gap-y-1">
              <p className="text-[14px] leading-snug text-page-text">{item.text}</p>
              {item.severity === "major" && <MajorBadge />}
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="font-mono text-[11px] text-page-text-muted">{item.date}</span>
              <SourceRefs sourceIds={item.sourceIds} sources={item.sources} />
            </div>
          </li>
        ))}
      </ul>

      {filtered.length === 0 && (
        <p className="mt-8 rounded-lg border border-dashed border-page-border-strong px-4 py-6 text-center text-[13.5px] text-page-text-muted">
          Nothing matches these filters.
        </p>
      )}
    </div>
  );
}
