import Link from "next/link";

interface NavBarProps {
  variant?: "overlay" | "solid" | "light";
  right?: React.ReactNode;
  breadcrumb?: string;
}

export function NavBar({ variant = "overlay", right, breadcrumb }: NavBarProps) {
  const wrapperClass = {
    overlay:
      "pointer-events-none absolute inset-x-0 top-0 z-20 bg-gradient-to-b from-bg/90 via-bg/40 to-transparent",
    solid: "sticky top-0 z-20 border-b border-border bg-bg/95 backdrop-blur-md",
    light:
      "sticky top-0 z-20 border-b border-page-border bg-page-bg/90 backdrop-blur-md",
  }[variant];

  const isLight = variant === "light";

  return (
    <header className={wrapperClass}>
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="pointer-events-auto flex items-baseline gap-2">
          <span
            className={`font-mono text-[11px] tracking-[0.14em] ${isLight ? "text-[color:var(--color-country)]" : "text-accent"}`}
          >
            AI GOV
          </span>
          <span
            className={`text-[14.5px] font-semibold tracking-tight ${isLight ? "text-page-text" : "text-text"}`}
          >
            World Map
          </span>
        </Link>

        {breadcrumb && (
          <span
            className={`hidden truncate font-mono text-[12px] sm:block ${isLight ? "text-page-text-muted" : "text-text-faint"}`}
          >
            {breadcrumb}
          </span>
        )}

        <div className="pointer-events-auto flex items-center gap-4">{right}</div>
      </div>
    </header>
  );
}
