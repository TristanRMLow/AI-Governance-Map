"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { CountryMeta } from "@/lib/types";

const MAX_SELECTION = 3;

export function ComparePicker({
  countries,
  preselected,
}: {
  countries: CountryMeta[];
  preselected?: string;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>(preselected ? [preselected] : []);

  const slug = useMemo(() => selected.slice().sort().join("-"), [selected]);

  function toggle(code: string) {
    setSelected((prev) => {
      if (prev.includes(code)) return prev.filter((c) => c !== code);
      if (prev.length >= MAX_SELECTION) return prev;
      return [...prev, code];
    });
  }

  const canCompare = selected.length >= 2;

  return (
    <div className="rounded-2xl border border-page-border bg-page-card p-6 sm:p-7">
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <h2 className="text-[17px] font-bold tracking-[-0.01em] text-page-text">Build your own comparison</h2>
        <span className="font-mono text-[11px] tabular-nums text-page-text-muted">
          {selected.length}/{MAX_SELECTION} selected
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {countries.map((c) => {
          const active = selected.includes(c.code);
          const disabled = !active && selected.length >= MAX_SELECTION;
          return (
            <button
              key={c.code}
              type="button"
              disabled={disabled}
              onClick={() => toggle(c.code)}
              className="flex items-center gap-2 rounded-full border py-1.5 pl-2 pr-3.5 text-[12.5px] transition-all disabled:cursor-not-allowed disabled:opacity-40"
              style={{
                borderColor: active ? c.accentColor.light : "var(--page-border)",
                background: active ? `${c.accentColor.light}17` : "var(--page-bg)",
                color: active ? c.accentColor.light : "var(--page-text-secondary)",
              }}
            >
              <span aria-hidden className="text-[15px] leading-none">
                {c.flagEmoji}
              </span>
              <span className="font-medium">{c.shortName}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex items-center gap-3 border-t border-page-border pt-5">
        <button
          type="button"
          disabled={!canCompare}
          onClick={() => canCompare && router.push(`/compare/${slug}`)}
          className="rounded-lg px-4 py-2 text-[13.5px] font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
          style={{ background: "var(--status-blue)" }}
        >
          Compare {selected.length > 0 ? `(${selected.length})` : ""}
        </button>
        <p className="text-[12.5px] text-page-text-muted">
          {canCompare
            ? "Ready — pick up to one more, or compare now."
            : "Pick 2 or 3 countries to compare."}
        </p>
      </div>
    </div>
  );
}
