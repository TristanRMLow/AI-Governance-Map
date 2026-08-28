"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Clock, Compass, Table2 } from "lucide-react";

const LINKS = [
  { href: "/timeline", label: "Timeline", icon: Clock },
  { href: "/topics", label: "Topics", icon: Compass },
  { href: "/matrix", label: "Matrix", icon: Table2 },
] as const;

export function GlobalNavLinks({ variant }: { variant: "overlay" | "light" }) {
  const pathname = usePathname();

  const base =
    variant === "overlay"
      ? "flex items-center gap-1.5 rounded-lg border border-border-strong bg-bg-elevated/80 px-3 py-2 text-[12.5px] text-text-muted backdrop-blur-md transition-colors hover:text-text"
      : "flex items-center gap-1.5 rounded-lg border border-page-border px-3 py-2 text-[12.5px] text-page-text-muted transition-colors hover:text-page-text";
  const activeStyle =
    variant === "overlay" ? "text-text border-accent/50" : "text-page-text border-page-border-strong";

  return (
    <>
      {LINKS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link key={href} href={href} className={`${base} ${active ? activeStyle : ""}`}>
            <Icon size={14} strokeWidth={2.25} />
            {label}
          </Link>
        );
      })}
    </>
  );
}
