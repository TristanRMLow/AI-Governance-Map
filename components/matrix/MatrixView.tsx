"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUp } from "lucide-react";
import type { MatrixRow } from "@/lib/aggregateData";
import { formatEventDate, sortableDate } from "@/lib/dates";

const SENTIMENT_DOT: Record<string, string> = {
  green: "var(--status-good)",
  amber: "var(--status-warning)",
  red: "var(--status-critical)",
  blue: "var(--status-blue)",
};

const TREND_LABEL: Record<MatrixRow["trend"], string> = {
  tightening: "Tightening",
  loosening: "Loosening",
  stable: "Stable",
};

const FRONTIER_LABEL: Record<string, string> = {
  domestic: "Domestic",
  emerging: "Emerging",
  none: "—",
};

type SortKey = "name" | "trend" | "instruments" | "frontier" | "latest";

const TREND_ORDER: Record<MatrixRow["trend"], number> = { tightening: 0, stable: 1, loosening: 2 };
const FRONTIER_ORDER: Record<string, number> = { domestic: 0, emerging: 1, none: 2 };

function compare(a: MatrixRow, b: MatrixRow, key: SortKey): number {
  switch (key) {
    case "name":
      return a.name.localeCompare(b.name);
    case "trend":
      return TREND_ORDER[a.trend] - TREND_ORDER[b.trend];
    case "instruments":
      return b.instruments.inForce - a.instruments.inForce || b.instruments.proposed - a.instruments.proposed;
    case "frontier":
      return (FRONTIER_ORDER[a.frontierDeveloper ?? "none"] ?? 2) - (FRONTIER_ORDER[b.frontierDeveloper ?? "none"] ?? 2);
    case "latest":
      // Newest first; countries with no dated developments sink to the bottom.
      if (!a.latestDevelopmentDate) return b.latestDevelopmentDate ? 1 : 0;
      if (!b.latestDevelopmentDate) return -1;
      return sortableDate(b.latestDevelopmentDate).localeCompare(sortableDate(a.latestDevelopmentDate));
  }
}

function instrumentsSummary(i: MatrixRow["instruments"]): string {
  const parts = [];
  if (i.inForce) parts.push(`${i.inForce} in force`);
  if (i.passed) parts.push(`${i.passed} passed`);
  if (i.proposed) parts.push(`${i.proposed} proposed`);
  return parts.length ? parts.join(", ") : "—";
}

function HeaderCell({
  label,
  sortKey,
  active,
  ascending,
  onSort,
  className = "",
}: {
  label: string;
  sortKey?: SortKey;
  active: boolean;
  ascending: boolean;
  onSort?: (key: SortKey) => void;
  className?: string;
}) {
  if (!sortKey || !onSort) {
    return (
      <th className={`px-3 py-2.5 text-left font-mono text-[10.5px] font-normal uppercase tracking-[0.08em] text-page-text-muted ${className}`}>
        {label}
      </th>
    );
  }
  return (
    <th className={`px-3 py-2.5 text-left ${className}`}>
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={`flex items-center gap-1 font-mono text-[10.5px] uppercase tracking-[0.08em] transition-colors ${
          active ? "text-page-text" : "text-page-text-muted hover:text-page-text"
        }`}
      >
        {label}
        {active && (ascending ? <ArrowUp size={11} strokeWidth={2.5} /> : <ArrowDown size={11} strokeWidth={2.5} />)}
      </button>
    </th>
  );
}

export function MatrixView({ rows }: { rows: MatrixRow[] }) {
  const [region, setRegion] = useState<string | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [ascending, setAscending] = useState(true);

  const regions = useMemo(() => Array.from(new Set(rows.map((r) => r.region))).sort(), [rows]);

  const visible = useMemo(() => {
    const filtered = region === "all" ? rows : rows.filter((r) => r.region === region);
    const sorted = [...filtered].sort((a, b) => compare(a, b, sortKey) || a.name.localeCompare(b.name));
    return ascending ? sorted : sorted.reverse();
  }, [rows, region, sortKey, ascending]);

  function onSort(key: SortKey) {
    if (key === sortKey) {
      setAscending((v) => !v);
    } else {
      setSortKey(key);
      setAscending(true);
    }
  }

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center gap-2">
        {["all", ...regions].map((r) => {
          const active = region === r;
          return (
            <button
              key={r}
              type="button"
              onClick={() => setRegion(r as string | "all")}
              className="rounded-full px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.05em] transition-colors"
              style={
                active
                  ? { background: "var(--color-page-text)", color: "var(--color-page-bg)" }
                  : { background: "var(--color-page-border)", color: "var(--color-page-text-muted)" }
              }
            >
              {r === "all" ? "All regions" : r}
            </button>
          );
        })}
      </div>

      <p className="mt-3 font-mono text-[11px] text-page-text-muted">
        {visible.length} of {rows.length} jurisdictions
      </p>

      <div className="mt-3 overflow-x-auto rounded-xl border border-page-border bg-page-card">
        <table className="w-full min-w-[900px] border-collapse text-[13px]">
          <thead>
            <tr className="border-b border-page-border">
              <HeaderCell label="Jurisdiction" sortKey="name" active={sortKey === "name"} ascending={ascending} onSort={onSort} className="pl-4" />
              <HeaderCell label="Direction" active={false} ascending={false} />
              <HeaderCell label="Trend" sortKey="trend" active={sortKey === "trend"} ascending={ascending} onSort={onSort} />
              <HeaderCell label="Approach" active={false} ascending={false} />
              <HeaderCell label="Instruments" sortKey="instruments" active={sortKey === "instruments"} ascending={ascending} onSort={onSort} />
              <HeaderCell label="Frontier dev" sortKey="frontier" active={sortKey === "frontier"} ascending={ascending} onSort={onSort} />
              <HeaderCell label="Latest development" sortKey="latest" active={sortKey === "latest"} ascending={ascending} onSort={onSort} />
            </tr>
          </thead>
          <tbody>
            {visible.map((row) => {
              const dot = SENTIMENT_DOT[row.policyDirection.sentiment];
              return (
                <tr key={row.code} className="border-b border-page-border last:border-b-0 hover:bg-page-bg/60">
                  <td className="py-2.5 pl-4 pr-3">
                    <Link
                      href={`/country/${row.code}`}
                      className="flex items-center gap-2 font-medium text-page-text hover:underline"
                    >
                      <span aria-hidden>{row.flagEmoji}</span>
                      <span className="whitespace-nowrap">{row.name}</span>
                    </Link>
                  </td>
                  <td className="min-w-[180px] max-w-[260px] px-3 py-2.5">
                    <span className="flex items-baseline gap-1.5 text-page-text-secondary">
                      <span aria-hidden className="h-1.5 w-1.5 shrink-0 self-center rounded-full" style={{ background: dot }} />
                      <span className="leading-snug">{row.policyDirection.label}</span>
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-page-text-secondary">{TREND_LABEL[row.trend]}</td>
                  <td className="max-w-[220px] truncate px-3 py-2.5 text-page-text-secondary" title={row.regulatoryApproach}>
                    {row.regulatoryApproach}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-page-text-secondary">
                    {instrumentsSummary(row.instruments)}
                  </td>
                  <td className="px-3 py-2.5 text-page-text-secondary">
                    {FRONTIER_LABEL[row.frontierDeveloper ?? "none"]}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-page-text-secondary">
                    {formatEventDate(row.latestDevelopmentDate) ?? "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
