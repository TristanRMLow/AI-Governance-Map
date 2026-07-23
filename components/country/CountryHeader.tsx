import type { CountryData } from "@/lib/types";
import { WatchlistStar } from "@/components/country/WatchlistStar";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function CountryHeader({ country }: { country: CountryData }) {
  return (
    <div className="hero-wash enter-up overflow-hidden rounded-3xl border border-page-border px-7 py-8 sm:px-9 sm:py-10">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="flex items-start gap-5">
          <span
            aria-hidden
            className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-page-card text-[34px] leading-none shadow-[0_1px_2px_rgba(23,23,15,0.06)]"
          >
            {country.flagEmoji}
          </span>
          <div>
            <span
              className="mb-2 inline-flex rounded-full px-2.5 py-0.5 font-mono text-[10.5px] uppercase tracking-[0.08em]"
              style={{ background: "var(--color-country-soft)", color: "var(--color-country)" }}
            >
              {country.jurisdictionType === "supranational" ? "Supranational" : "Nation state"}
            </span>
            <h1 className="text-[38px] font-bold leading-[1.05] tracking-[-0.02em] text-page-text text-balance">
              {country.name}
            </h1>
            <p className="mt-2 max-w-xl text-[15px] text-page-text-secondary">
              {country.governanceModel}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-start gap-3">
          <p className="font-mono text-[11px] tabular-nums text-page-text-muted">
            Reviewed {formatDate(country.lastUpdated)}
          </p>
          <WatchlistStar code={country.code} />
        </div>
      </div>
    </div>
  );
}
