import type { Metadata } from "next";
import { NavBar } from "@/components/layout/NavBar";
import { GlobalNavLinks } from "@/components/layout/GlobalNavLinks";
import { getMatrixRows } from "@/lib/aggregateData";
import { MatrixView } from "@/components/matrix/MatrixView";

export const metadata: Metadata = {
  title: "Matrix — AI Governance World Map",
  description:
    "Every tracked jurisdiction in one sortable table — policy direction, trend, regulatory approach, instruments, and frontier capability side by side.",
};

export default function MatrixPage() {
  const rows = getMatrixRows();

  return (
    <div className="page-surface min-h-dvh bg-page-bg">
      <NavBar variant="light" breadcrumb="Matrix" right={<GlobalNavLinks variant="light" />} />
      <div className="mx-auto max-w-[1100px] px-6 py-8">
        <h1 className="text-[32px] font-bold tracking-[-0.02em] text-page-text text-balance">
          Policy matrix
        </h1>
        <p className="mt-2 max-w-2xl text-[15px] text-page-text-secondary">
          Every jurisdiction side by side — direction, trend, approach, and tracked instruments —
          &ldquo;who stands where,&rdquo; without opening every country page.
        </p>

        <MatrixView rows={rows} />
      </div>
    </div>
  );
}
