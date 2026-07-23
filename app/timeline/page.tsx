import type { Metadata } from "next";
import { NavBar } from "@/components/layout/NavBar";
import { GlobalNavLinks } from "@/components/layout/GlobalNavLinks";
import { getAllDevelopments } from "@/lib/aggregateData";
import { TimelineView } from "@/components/timeline/TimelineView";

export const metadata: Metadata = {
  title: "Timeline — AI Governance World Map",
  description: "Every tracked AI governance development, across all jurisdictions, most recent first.",
};

export default function TimelinePage() {
  const developments = getAllDevelopments();
  const regions = Array.from(new Set(developments.map((d) => d.region))).sort();

  return (
    <div className="page-surface min-h-dvh bg-page-bg">
      <NavBar variant="light" breadcrumb="Timeline" right={<GlobalNavLinks variant="light" />} />
      <div className="mx-auto max-w-[880px] px-6 py-8">
        <h1 className="text-[32px] font-bold tracking-[-0.02em] text-page-text text-balance">
          Timeline
        </h1>
        <p className="mt-2 max-w-2xl text-[15px] text-page-text-secondary">
          Every tracked development across all jurisdictions, most recent first — the single feed for
          &ldquo;what changed&rdquo; instead of re-browsing 43 country pages.{" "}
          <a
            href="/feed.xml"
            className="underline decoration-page-border-strong underline-offset-2 hover:text-page-text"
          >
            Subscribe via RSS →
          </a>
        </p>

        <TimelineView developments={developments} regions={regions} />
      </div>
    </div>
  );
}
