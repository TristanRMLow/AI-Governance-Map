import { getAllDevelopments } from "@/lib/aggregateData";

function escapeXml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toRfc822(dateStr: string): string {
  // recentDevelopments dates are sometimes month- or year-only (e.g. "2026-05"); pad so Date() parses.
  const parts = dateStr.split("-");
  const iso = parts.length === 1 ? `${parts[0]}-01-01` : parts.length === 2 ? `${dateStr}-01` : dateStr;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? new Date().toUTCString() : d.toUTCString();
}

export const revalidate = 3600;

export async function GET(request: Request) {
  const origin = new URL(request.url).origin;
  const developments = getAllDevelopments().slice(0, 150);

  const items = developments
    .map((d) => {
      const title = escapeXml(`${d.flagEmoji} ${d.countryName}: ${d.text.slice(0, 120)}${d.text.length > 120 ? "…" : ""}`);
      const link = `${origin}/country/${d.countryCode}#recent-developments`;
      const guid = `${d.countryCode}-${d.date}-${d.text.slice(0, 40)}`;
      return `    <item>
      <title>${title}</title>
      <link>${link}</link>
      <guid isPermaLink="false">${escapeXml(guid)}</guid>
      <pubDate>${toRfc822(d.date)}</pubDate>
      <description>${escapeXml(d.text)}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>AI Governance World Map — Timeline</title>
    <link>${origin}/timeline</link>
    <description>Every tracked AI governance development across all jurisdictions, most recent first.</description>
    <language>en</language>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
