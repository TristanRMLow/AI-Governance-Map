import { CircleAlert, CircleDot, CircleCheck } from "lucide-react";
import type { CountryData, Development } from "@/lib/types";
import { daysAgo, getFreshnessState } from "@/lib/dates";

function latestMajor(items: Development[]): Development | null {
  const majors = items.filter((d) => d.severity === "major");
  if (majors.length === 0) return null;
  return [...majors].sort((a, b) => (a.date < b.date ? 1 : -1))[0];
}

export function RecentUpdateBanner({ country }: { country: CountryData }) {
  const state = getFreshnessState(country);

  if (state === "stale") {
    return (
      <p className="enter-up flex items-center gap-2 px-1 text-[13px] text-page-text-muted">
        <CircleDot size={14} strokeWidth={2.25} className="shrink-0" />
        No significant developments in the past 30 days.
      </p>
    );
  }

  if (state === "major") {
    const major = latestMajor(country.recentDevelopments);
    return (
      <a
        href="#recent-developments"
        className="enter-up flex items-start gap-2.5 rounded-xl border px-4 py-3 text-[13.5px] transition-colors hover:brightness-[1.03]"
        style={{
          background: "var(--status-warning-soft)",
          borderColor: "color-mix(in srgb, var(--status-warning) 35%, transparent)",
          color: "var(--status-warning)",
        }}
      >
        <CircleAlert size={16} strokeWidth={2.25} className="mt-0.5 shrink-0" />
        <span className="leading-snug">
          <span className="font-semibold">Major development</span>
          {major ? <>: {major.text}</> : null}
        </span>
      </a>
    );
  }

  return (
    <a
      href="#recent-developments"
      className="enter-up flex items-center gap-2.5 rounded-xl border px-4 py-3 text-[13.5px] transition-colors hover:brightness-[1.03]"
      style={{
        background: "var(--status-good-soft)",
        borderColor: "color-mix(in srgb, var(--status-good) 30%, transparent)",
        color: "var(--status-good)",
      }}
    >
      <CircleCheck size={16} strokeWidth={2.25} className="shrink-0" />
      <span className="font-semibold">Recent development</span>
      <span className="opacity-80">({daysAgo(country.latestDevelopmentDate ?? country.lastUpdated)})</span>
    </a>
  );
}
