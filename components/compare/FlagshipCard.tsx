import Link from "next/link";
import type { CountryMeta } from "@/lib/types";

export function FlagshipCard({
  slug,
  title,
  tagline,
  countries,
}: {
  slug: string;
  title: string;
  tagline: string;
  countries: CountryMeta[];
}) {
  return (
    <Link
      href={`/compare/${slug}`}
      className="card-lift rounded-2xl border border-page-border bg-page-card p-5"
    >
      <div className="mb-3 flex -space-x-1.5">
        {countries.map((c) => (
          <span
            key={c.code}
            aria-hidden
            className="grid h-9 w-9 place-items-center rounded-xl border-2 border-page-card bg-page-bg text-[18px] leading-none"
          >
            {c.flagEmoji}
          </span>
        ))}
      </div>
      <h3 className="text-[15.5px] font-bold text-page-text">{title}</h3>
      <p className="mt-1.5 text-[13px] leading-relaxed text-page-text-secondary">{tagline}</p>
    </Link>
  );
}
