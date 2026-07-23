import type { Metadata } from "next";
import { NavBar } from "@/components/layout/NavBar";
import { GlobalNavLinks } from "@/components/layout/GlobalNavLinks";
import { getAllDebatesWithCountry } from "@/lib/aggregateData";
import { TopicsView } from "@/components/topics/TopicsView";

export const metadata: Metadata = {
  title: "Topics — AI Governance World Map",
  description: "Every tracked debate, browsable across all jurisdictions by category — not siloed per country page.",
};

export default function TopicsPage() {
  const debates = getAllDebatesWithCountry();

  return (
    <div className="page-surface min-h-dvh bg-page-bg">
      <NavBar variant="light" breadcrumb="Topics" right={<GlobalNavLinks variant="light" />} />
      <div className="mx-auto max-w-[880px] px-6 py-8">
        <h1 className="text-[32px] font-bold tracking-[-0.02em] text-page-text text-balance">
          Topics
        </h1>
        <p className="mt-2 max-w-2xl text-[15px] text-page-text-secondary">
          Every debate across every jurisdiction, filterable by category — &ldquo;how are export
          controls playing out globally,&rdquo; not just what one country page happens to say.
        </p>

        <TopicsView debates={debates} />
      </div>
    </div>
  );
}
