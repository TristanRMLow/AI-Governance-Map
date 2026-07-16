import { TriangleAlert } from "lucide-react";

export function VerificationBadge() {
  return (
    <span
      className="inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.05em]"
      style={{ background: "var(--status-warning-soft)", color: "var(--status-warning)" }}
      title="This detail could not be confidently verified and should be checked before relying on it."
    >
      <TriangleAlert size={10} strokeWidth={2.5} />
      Verify
    </span>
  );
}
