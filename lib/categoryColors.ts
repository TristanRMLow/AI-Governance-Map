import type { Category } from "./types";

export const CATEGORY_COLOR: Record<Category, { color: string; soft: string; label: string }> = {
  government: { color: "var(--color-cat-government)", soft: "var(--color-cat-government-soft)", label: "Government" },
  industry: { color: "var(--color-cat-industry)", soft: "var(--color-cat-industry-soft)", label: "Industry" },
  research: { color: "var(--color-cat-research)", soft: "var(--color-cat-research-soft)", label: "Research" },
  investment: { color: "var(--color-cat-investment)", soft: "var(--color-cat-investment-soft)", label: "Investment" },
  security: { color: "var(--color-cat-security)", soft: "var(--color-cat-security-soft)", label: "Security" },
  infrastructure: { color: "var(--color-cat-infrastructure)", soft: "var(--color-cat-infrastructure-soft)", label: "Infrastructure" },
  sources: { color: "var(--color-cat-sources)", soft: "var(--color-cat-sources-soft)", label: "Sources" },
};
