"use client";

import { useRouter } from "next/navigation";
import { Star, X } from "lucide-react";
import type { CountryMeta } from "@/lib/types";
import { getFreshnessState } from "@/lib/dates";
import { navigateWithTransition } from "@/lib/viewTransition";
import { useWatchlist } from "@/lib/useWatchlist";

function CountryRow({
  c,
  onNavigate,
  starred,
  onToggleStar,
}: {
  c: CountryMeta;
  onNavigate: () => void;
  starred: boolean;
  onToggleStar: () => void;
}) {
  const freshness = getFreshnessState(c);
  return (
    <div className="group flex items-center gap-1 rounded-lg px-1 hover:bg-bg-elevated-hover">
      <button type="button" onClick={onNavigate} className="flex flex-1 items-center gap-2.5 py-2 text-left">
        <span aria-hidden className="text-[16px] leading-none">
          {c.flagEmoji}
        </span>
        <span className="flex-1 truncate text-[13px] text-text-muted group-hover:text-text">{c.name}</span>
        {freshness !== "stale" && (
          <span
            aria-hidden
            className="h-1.5 w-1.5 shrink-0 rounded-full"
            style={{ background: freshness === "major" ? "var(--status-warning)" : "var(--status-good)" }}
            title={freshness === "major" ? "Major development this cycle" : "Recent development this cycle"}
          />
        )}
      </button>
      <button
        type="button"
        onClick={onToggleStar}
        aria-label={starred ? "Remove from watchlist" : "Add to watchlist"}
        className="shrink-0 p-1.5 text-text-faint transition-colors hover:text-text"
      >
        <Star size={13} strokeWidth={2.25} fill={starred ? "currentColor" : "none"} />
      </button>
    </div>
  );
}

export function JurisdictionsDrawer({
  open,
  onClose,
  countries,
}: {
  open: boolean;
  onClose: () => void;
  countries: CountryMeta[];
}) {
  const router = useRouter();
  const { starred, toggle, hydrated } = useWatchlist();

  const byRegion = new Map<string, CountryMeta[]>();
  for (const c of countries) {
    if (!byRegion.has(c.region)) byRegion.set(c.region, []);
    byRegion.get(c.region)!.push(c);
  }
  const regions = Array.from(byRegion.keys()).sort();
  for (const list of byRegion.values()) list.sort((a, b) => a.name.localeCompare(b.name));

  const starredCountries = countries
    .filter((c) => starred.has(c.code))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      <div
        aria-hidden
        onClick={onClose}
        className={`absolute inset-0 z-30 bg-black/40 backdrop-blur-[2px] transition-opacity duration-200 ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <div
        role="dialog"
        aria-label="Covered jurisdictions"
        className={`absolute inset-y-0 right-0 z-40 flex w-[320px] max-w-[85vw] flex-col border-l border-border-strong bg-bg-elevated/95 backdrop-blur-md transition-transform duration-200 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-text-faint">
              Covered jurisdictions
            </span>
            <p className="mt-0.5 text-[13px] text-text-muted">{countries.length} tracked</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-bg-elevated-hover hover:text-text"
          >
            <X size={16} strokeWidth={2.25} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-3">
          {hydrated && starredCountries.length > 0 && (
            <div className="mb-4">
              <p className="px-2 pb-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-text-faint">
                Starred
              </p>
              <div className="flex flex-col gap-0.5">
                {starredCountries.map((c) => (
                  <CountryRow
                    key={c.code}
                    c={c}
                    starred
                    onToggleStar={() => toggle(c.code)}
                    onNavigate={() => {
                      onClose();
                      navigateWithTransition(router, `/country/${c.code}`);
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {regions.map((region) => (
            <div key={region} className="mb-4">
              <p className="px-2 pb-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-text-faint">
                {region}
              </p>
              <div className="flex flex-col gap-0.5">
                {byRegion.get(region)!.map((c) => (
                  <CountryRow
                    key={c.code}
                    c={c}
                    starred={starred.has(c.code)}
                    onToggleStar={() => toggle(c.code)}
                    onNavigate={() => {
                      onClose();
                      navigateWithTransition(router, `/country/${c.code}`);
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
