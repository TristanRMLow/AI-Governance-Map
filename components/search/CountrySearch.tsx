"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import type { CountryMeta } from "@/lib/types";
import { TERRITORY_CENTERS, type SearchEntry } from "@/lib/searchTypes";

export interface SearchSelection {
  iso3: string[];
  centers: [number, number][];
  singleCountry?: CountryMeta;
}

type ResultGroup = "country" | SearchEntry["type"];

interface SearchResult {
  key: string;
  group: ResultGroup;
  label: string;
  subtitle: string;
  selection: SearchSelection;
}

const GROUP_LABEL: Record<ResultGroup, string> = {
  country: "Countries",
  debate: "Debates",
  legislation: "Legislation",
  person: "People",
  institution: "Institutions",
  company: "Companies",
};

const ENTRY_TYPE_ORDER: SearchEntry["type"][] = [
  "debate",
  "legislation",
  "person",
  "institution",
  "company",
];

interface CountrySearchProps {
  countries: CountryMeta[];
  searchIndex: SearchEntry[];
  onSelect: (selection: SearchSelection) => void;
  placeholder?: string;
}

export function CountrySearch({
  countries,
  searchIndex,
  onSelect,
  placeholder,
}: CountrySearchProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  const codeToMeta = useMemo(() => {
    const map = new Map<string, CountryMeta>();
    for (const c of countries) map.set(c.code, c);
    return map;
  }, [countries]);

  const toSelection = useCallback(
    (dashboardCountries: string[], highlightIso3: string[]): SearchSelection => {
      if (dashboardCountries.length === 1) {
        const meta = codeToMeta.get(dashboardCountries[0]);
        if (meta && meta.isoA3.length === highlightIso3.length) {
          return { iso3: highlightIso3, centers: [meta.center], singleCountry: meta };
        }
      }

      const coveredIso3 = new Set(
        dashboardCountries.flatMap((code) => codeToMeta.get(code)?.isoA3 ?? [])
      );
      const centers = [
        ...dashboardCountries
          .map((code) => codeToMeta.get(code)?.center)
          .filter((c): c is [number, number] => Boolean(c)),
        ...highlightIso3
          .filter((iso) => !coveredIso3.has(iso) && TERRITORY_CENTERS[iso])
          .map((iso) => TERRITORY_CENTERS[iso]),
      ];
      return { iso3: highlightIso3, centers };
    },
    [codeToMeta]
  );

  const results = useMemo<SearchResult[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return countries.map((c) => ({
        key: `country-${c.code}`,
        group: "country" as const,
        label: c.name,
        subtitle: c.governanceModel,
        selection: { iso3: c.isoA3, centers: [c.center], singleCountry: c },
      }));
    }

    const countryMatches: SearchResult[] = countries
      .filter((c) => c.name.toLowerCase().includes(q) || c.shortName.toLowerCase().includes(q))
      .map((c) => ({
        key: `country-${c.code}`,
        group: "country" as const,
        label: c.name,
        subtitle: c.governanceModel,
        selection: { iso3: c.isoA3, centers: [c.center], singleCountry: c },
      }));

    const matchedByType = new Map<SearchEntry["type"], SearchEntry[]>();
    for (const e of searchIndex) {
      if (!e.label.toLowerCase().includes(q)) continue;
      if (!matchedByType.has(e.type)) matchedByType.set(e.type, []);
      matchedByType.get(e.type)!.push(e);
    }

    const entryMatches: SearchResult[] = ENTRY_TYPE_ORDER.flatMap((type) =>
      (matchedByType.get(type) ?? []).slice(0, 5).map((e) => {
        const names = e.dashboardCountries
          .map((code) => codeToMeta.get(code)?.name)
          .filter((n): n is string => Boolean(n));
        return {
          key: e.id,
          group: type,
          label: type === "debate" ? capitalize(e.label) : e.label,
          subtitle: names.join(", ") || "Unmapped",
          selection: toSelection(e.dashboardCountries, e.highlightIso3),
        };
      })
    );

    return [...countryMatches, ...entryMatches];
  }, [query, countries, searchIndex, codeToMeta, toSelection]);

  const groupedResults = useMemo(() => {
    const groups: { group: ResultGroup; items: { result: SearchResult; index: number }[] }[] = [];
    results.forEach((result, index) => {
      const last = groups[groups.length - 1];
      if (last && last.group === result.group) {
        last.items.push({ result, index });
      } else {
        groups.push({ group: result.group, items: [{ result, index }] });
      }
    });
    return groups;
  }, [results]);

  function commit(result: SearchResult) {
    onSelect(result.selection);
    setQuery(result.label);
    setOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const pick = results[activeIndex];
      if (pick) commit(pick);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div
      ref={rootRef}
      className="relative w-full max-w-sm sm:max-w-md"
      onBlur={(e) => {
        if (!rootRef.current?.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <div className="relative">
        <svg
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-faint"
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          value={query}
          placeholder={placeholder ?? "Search countries, people, companies, legislation…"}
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveIndex(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          className="w-full rounded-lg border border-border-strong bg-bg-elevated/90 py-2 pl-9 pr-3 text-[13.5px] text-text placeholder:text-text-faint backdrop-blur-md transition-colors focus:border-accent focus:outline-none focus:shadow-[0_0_0_3px_var(--color-accent-soft)]"
        />
      </div>
      {open && results.length > 0 && (
        <ul className="absolute left-0 right-0 top-[calc(100%+6px)] z-10 max-h-[26rem] overflow-y-auto rounded-lg border border-border-strong bg-bg-elevated/95 shadow-2xl shadow-black/40 backdrop-blur-md">
          {groupedResults.map(({ group, items }) => (
            <li key={group}>
              <span className="block px-3 pb-1 pt-2.5 font-mono text-[10px] uppercase tracking-[0.08em] text-text-faint">
                {GROUP_LABEL[group]}
              </span>
              <ul>
                {items.map(({ result: r, index: i }) => (
                  <li key={r.key}>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => commit(r)}
                      title={`${r.label} — ${r.subtitle}`}
                      className={`flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-[13.5px] transition-colors ${
                        i === activeIndex
                          ? "bg-accent-soft text-accent-strong"
                          : "text-text hover:bg-bg-elevated-hover"
                      }`}
                    >
                      <span className="min-w-0 flex-1 truncate">{r.label}</span>
                      <span className="max-w-[40%] shrink-0 truncate font-mono text-[10.5px] tracking-wide text-text-faint">
                        {r.subtitle}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
