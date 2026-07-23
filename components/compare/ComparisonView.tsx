import Link from "next/link";
import { NavBar } from "@/components/layout/NavBar";
import { GlobalNavLinks } from "@/components/layout/GlobalNavLinks";
import { ComparisonHeader } from "@/components/compare/ComparisonHeader";
import { ExecutiveSummarySection } from "@/components/compare/ExecutiveSummarySection";
import { DimensionsSection } from "@/components/compare/DimensionsSection";
import { PolicyOverlapSection } from "@/components/compare/PolicyOverlapSection";
import { TradeoffsSection } from "@/components/compare/TradeoffsSection";
import { RelatedComparisonsSection, type RelatedComparisonInfo } from "@/components/compare/RelatedComparisonsSection";
import type { ComparisonData, CountryMeta } from "@/lib/types";

export function ComparisonView({
  comparison,
  countries,
  related,
}: {
  comparison: ComparisonData;
  countries: CountryMeta[];
  related: RelatedComparisonInfo[];
}) {
  return (
    <div className="page-surface min-h-dvh bg-page-bg">
      <NavBar
        variant="light"
        breadcrumb={`Compare · ${comparison.title}`}
        right={<GlobalNavLinks variant="light" />}
      />
      <div className="mx-auto max-w-[1240px] px-6 py-8">
        <Link
          href="/compare"
          className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-page-text-muted transition-colors hover:text-page-text"
        >
          ← All comparisons
        </Link>

        <ComparisonHeader comparison={comparison} countries={countries} />

        <div className="mt-8 grid grid-cols-1 gap-5">
          <ExecutiveSummarySection paragraphs={comparison.executiveSummary} />
          <DimensionsSection dimensions={comparison.dimensions} countries={countries} />
          <PolicyOverlapSection overlap={comparison.policyOverlap} countries={countries} />
          <TradeoffsSection paragraphs={comparison.strategicTradeoffs} />
          <RelatedComparisonsSection items={related} />
        </div>
      </div>
    </div>
  );
}
