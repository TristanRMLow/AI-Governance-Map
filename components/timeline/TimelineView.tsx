"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CircleAlert, Star, Layers } from "lucide-react";
import type { DevelopmentWithCountry } from "@/lib/aggregateData";
import { SourceRefs } from "@/components/country/SourceRefs";
import { useWatchlist } from "@/lib/useWatchlist";

/** Human titles for shared cross-jurisdiction events, keyed by Development.eventGroup.
 * Falls back to the representative development's own text if a key isn't listed. */
const GROUP_TITLES: Record<string, string> = {
  "eu-ai-act-gpai-aug2026": "EU AI Act — GPAI enforcement powers and transparency duties take effect (2 August 2026)",
};

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

type TimelineEntry =
  | { kind: "single"; item: DevelopmentWithCountry }
  | { kind: "group"; key: string; primary: DevelopmentWithCountry; members: DevelopmentWithCountry[] };

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

  // Collapse developments that share an eventGroup into a single grouped card,
  // positioned where the group first appears (all members share the same date).
  const entries = useMemo(() => {
    const result: TimelineEntry[] = [];
    const groupAt = new Map<string, number>();
    for (const item of filtered) {
      if (item.eventGroup) {
        const at = groupAt.get(item.eventGroup);
        if (at === undefined) {
          groupAt.set(item.eventGroup, result.length);
          result.push({ kind: "group", key: item.eventGroup, primary: item, members: [item] });
        } else {
          const g = result[at] as Extract<TimelineEntry, { kind: "group" }>;
          g.members.push(item);
          // Prefer the supranational (EU) entry's neutral wording as the representative text.
          if (item.countryCode === "eu") g.primary = item;
        }
      } else {
        result.push({ kind: "single", item });
      }
    }
    return result;
  }, [filtered]);

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
        {entries.map((entry, i) =>
          entry.kind === "single" ? (
            <li
              key={`${entry.item.countryCode}-${entry.item.date}-${i}`}
              className="rounded-xl border border-page-border bg-page-card p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <Link
                  href={`/country/${entry.item.countryCode}#recent-developments`}
                  className="flex shrink-0 items-center gap-1.5 text-[12.5px] font-semibold"
                  style={{ color: entry.item.accentColor.light }}
                >
                  <span aria-hidden>{entry.item.flagEmoji}</span>
                  {entry.item.countryName}
                </Link>
                <button
                  type="button"
                  onClick={() => toggle(entry.item.countryCode)}
                  aria-label={isStarred(entry.item.countryCode) ? "Remove from watchlist" : "Add to watchlist"}
                  className="shrink-0 text-page-text-muted transition-colors hover:text-page-text"
                >
                  <Star size={14} strokeWidth={2.25} fill={isStarred(entry.item.countryCode) ? "currentColor" : "none"} />
                </button>
              </div>

              <div className="mt-2 flex flex-wrap items-start gap-x-2 gap-y-1">
                <p className="text-[14px] leading-snug text-page-text">{entry.item.text}</p>
                {entry.item.severity === "major" && <MajorBadge />}
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="font-mono text-[11px] text-page-text-muted">{entry.item.date}</span>
                <SourceRefs sourceIds={entry.item.sourceIds} sources={entry.item.sources} />
              </div>
            </li>
          ) : (
            <li key={`group-${entry.key}`} className="rounded-xl border border-page-border bg-page-card p-4">
              <div className="flex items-start justify-between gap-3">
                <span className="flex min-w-0 items-center gap-1.5 text-[12.5px] font-semibold text-page-text-secondary">
                  <Layers size={13} strokeWidth={2.25} className="shrink-0" />
                  <span className="break-words">{entry.members.length} jurisdictions</span>
                </span>
                {entry.members.some((m) => m.severity === "major") && <MajorBadge />}
              </div>

              <p className="mt-2 text-[14px] font-medium leading-snug text-page-text">
                {GROUP_TITLES[entry.key] ?? entry.primary.text}
              </p>
              {GROUP_TITLES[entry.key] && (
                <p className="mt-1 text-[13px] leading-snug text-page-text-secondary">{entry.primary.text}</p>
              )}

              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {entry.members.map((m) => (
                  <Link
                    key={m.countryCode}
                    href={`/country/${m.countryCode}#recent-developments`}
                    className="inline-flex items-center gap-1 rounded-full border border-page-border px-2 py-0.5 text-[11.5px] transition-colors hover:border-page-border-strong hover:text-page-text"
                    style={{ color: m.accentColor.light }}
                  >
                    <span aria-hidden>{m.flagEmoji}</span>
                    {m.countryName}
                  </Link>
                ))}
              </div>

              <div className="mt-2.5 flex flex-wrap items-center gap-2">
                <span className="font-mono text-[11px] text-page-text-muted">{entry.primary.date}</span>
                <SourceRefs sourceIds={entry.primary.sourceIds} sources={entry.primary.sources} />
              </div>
            </li>
          )
        )}
      </ul>

      {entries.length === 0 && (
        <p className="mt-8 rounded-lg border border-dashed border-page-border-strong px-4 py-6 text-center text-[13.5px] text-page-text-muted">
          Nothing matches these filters.
        </p>
      )}
    </div>
  );
}
