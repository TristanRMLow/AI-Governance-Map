const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "at-a-glance", label: "At a Glance" },
  { id: "current-direction", label: "Current Direction" },
  { id: "recent-developments", label: "Recent Developments" },
  { id: "policy-regulation", label: "Policy & Regulation" },
  { id: "research-ecosystem", label: "Research Ecosystem" },
  { id: "companies", label: "AI Companies" },
  { id: "cloud-infrastructure", label: "Cloud Infrastructure" },
  { id: "universities", label: "Universities" },
  { id: "think-tanks", label: "Think Tanks" },
  { id: "government-institutions", label: "Government" },
  { id: "notable-gaps", label: "Notable Gaps" },
  { id: "key-people", label: "Key People" },
  { id: "people-to-follow", label: "People to Follow" },
  { id: "debates", label: "Current Debates" },
  { id: "knowledge-hub", label: "Knowledge Hub" },
  { id: "sources", label: "Sources" },
];

export function CountryToc() {
  return (
    <nav className="hidden lg:block">
      <div className="sticky top-10 flex max-h-[calc(100vh-5rem)] flex-col gap-0.5 overflow-y-auto border-l border-page-border pl-4">
        {SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="rounded py-1 text-[12.5px] text-page-text-muted transition-colors hover:text-page-text"
          >
            {s.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
