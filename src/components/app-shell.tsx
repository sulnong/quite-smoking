import Link from "next/link";
import { clsx } from "clsx";

type Tab = {
  href: string;
  label: string;
};

const TABS: Tab[] = [
  { href: "/", label: "今日" },
  { href: "/records", label: "记录" },
  { href: "/progress", label: "进展" }
];

export function AppShell({
  pathname,
  children
}: {
  pathname: string;
  children: React.ReactNode;
}) {
  return (
    <div className="app-shell">
      <main className="app-shell__main">{children}</main>
      <nav className="app-shell__tabs" aria-label="Bottom tabs">
        {TABS.map((t) => {
          const active = pathname === t.href;
          return (
            <Link
              key={t.href}
              href={t.href}
              className={clsx("app-shell__tab", active && "is-active")}
              aria-current={active ? "page" : undefined}
            >
              {t.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

