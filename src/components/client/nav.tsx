"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { logout } from "@/server/actions/auth";
import { Brand, cx } from "@/components/ui";
import { SessionPill, type TimerInfo } from "./session-timer";

export const PAGES = [
  { href: "/", label: "Overview", key: "1" },
  { href: "/today", label: "Today", key: "2" },
  { href: "/roadmap", label: "Roadmap", key: "3" },
  { href: "/projects", label: "Projects", key: "4" },
  { href: "/proof", label: "Proof of work", key: "5" },
  { href: "/calendar", label: "Calendar", key: "6" },
  { href: "/resources", label: "Resources", key: "7" },
  { href: "/progress", label: "Progress", key: "8" },
  { href: "/settings", label: "Settings", key: "9" },
];
const TABS = [
  { href: "/", label: "Home" },
  { href: "/today", label: "Today" },
  { href: "/roadmap", label: "Map" },
  { href: "/projects", label: "Build" },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export interface NavUser {
  name: string;
  initials: string;
  pathLabel: string;
  daysLeft: number;
}

export function AppShell({ user, timer, topics, children }: { user: NavUser; timer: TimerInfo | null; topics: { id: string; code: string; title: string }[]; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [cmdOpen, setCmdOpen] = useState(false);

  // ⌘K / Ctrl+K opens the command palette; 1–9 jump between pages (outside text fields).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if ((e.metaKey || e.ctrlKey) && k === "k") {
        e.preventDefault();
        setCmdOpen((o) => !o);
        return;
      }
      const tag = (e.target as HTMLElement | null)?.tagName?.toLowerCase() ?? "";
      if (tag === "input" || tag === "textarea" || tag === "select" || (e.target as HTMLElement | null)?.isContentEditable) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const page = PAGES.find((p) => p.key === e.key);
      if (page) router.push(page.href);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  return (
    <div className="min-h-dvh md:grid md:grid-cols-[228px_minmax(0,1fr)]">
      <a href="#main" className="sr-only z-50 rounded bg-ink px-3 py-2 text-on-ink focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
        Skip to content
      </a>

      {/* Desktop rail */}
      <aside className="sticky top-0 hidden h-dvh flex-col gap-[22px] border-r border-line px-3.5 py-6 md:flex">
        <Link href="/" className="px-2.5">
          <Brand />
        </Link>
        <button
          type="button"
          onClick={() => setCmdOpen(true)}
          className="flex h-[38px] items-center justify-between rounded-[10px] border border-line bg-panel px-2.5 text-[13px] text-ink-3 transition-colors hover:border-line-strong hover:text-ink"
        >
          <span>Jump to…</span>
          <span className="font-mono text-[11px]">⌘K</span>
        </button>
        <nav aria-label="Main" className="flex flex-col gap-0.5">
          {PAGES.map((p) => {
            const active = isActive(pathname, p.href) || (p.href === "/roadmap" && pathname.startsWith("/roadmap"));
            return (
              <Link
                key={p.href}
                href={p.href}
                aria-current={active ? "page" : undefined}
                className={cx("flex h-9 items-center justify-between rounded-lg px-2.5 text-[14px] transition-colors", active ? "bg-hover text-ink" : "text-ink-3 hover:text-ink")}
              >
                <span className="flex items-center gap-2.5">
                  <span aria-hidden="true" className={cx("size-1.5 rounded-full", active ? "bg-accent" : "bg-transparent")} />
                  {p.label}
                </span>
                <span className="font-mono text-[10px] text-ink-4" aria-hidden="true">
                  {p.key}
                </span>
              </Link>
            );
          })}
        </nav>
        <div className="flex-1" />
        <div className="flex items-baseline gap-2.5 px-2.5">
          <span className="numeral text-[56px] text-ink">{user.daysLeft}</span>
          <span className="font-mono text-[10px] leading-snug text-ink-3">
            DAYS TO
            <br />
            DEC 31
          </span>
        </div>
        <div className="flex items-center gap-2.5 border-t border-line px-2.5 pt-3">
          <span className="grid size-[34px] shrink-0 place-items-center rounded-full bg-accent text-[12px] font-semibold text-black">{user.initials}</span>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-[13px] font-medium">{user.name}</span>
            <span className="truncate text-[11px] text-ink-3">{user.pathLabel}</span>
          </div>
          <form autoComplete="off" action={logout}>
            <button type="submit" title="Sign out" aria-label="Sign out" className="p-1.5 font-mono text-[10px] text-ink-3 transition-colors hover:text-danger">
              EXIT
            </button>
          </form>
        </div>
      </aside>

      <main id="main" className="min-w-0 px-[18px] pt-[18px] pb-36 md:px-[clamp(24px,4vw,56px)] md:pt-9 md:pb-36">
        {/* Mobile header */}
        <div className="mb-7 flex items-center justify-between md:hidden">
          <Link href="/">
            <Brand round />
          </Link>
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-[11px] text-ink-3">{user.daysLeft}D</span>
            <button type="button" onClick={() => setCmdOpen(true)} className="h-10 rounded-full border-[1.5px] border-ink px-4 text-[13px] font-medium">
              Search
            </button>
          </div>
        </div>
        {children}
      </main>

      {/* Mobile pill tab bar */}
      <nav aria-label="Main" className="fixed inset-x-3 bottom-3 z-[15] grid h-16 grid-cols-5 items-center gap-1 rounded-full bg-ink px-2 shadow-[0_10px_30px_rgba(0,0,0,.25)] md:hidden">
        {TABS.map((t) => {
          const active = isActive(pathname, t.href);
          return (
            <Link
              key={t.href}
              href={t.href}
              aria-current={active ? "page" : undefined}
              className={cx("grid h-12 place-items-center rounded-full text-[12px] font-semibold", active ? "bg-accent text-black" : "text-[#cfccc6]")}
            >
              {t.label}
            </Link>
          );
        })}
        <button type="button" onClick={() => setCmdOpen(true)} className="h-12 rounded-full text-[12px] font-semibold text-[#cfccc6]">
          More
        </button>
      </nav>

      {timer && <SessionPill timer={timer} />}
      {cmdOpen && <CommandPalette topics={topics} onClose={() => setCmdOpen(false)} />}
    </div>
  );
}

function CommandPalette({ topics, onClose }: { topics: { id: string; code: string; title: string }[]; onClose: () => void }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const items = useMemo(() => {
    const query = q.trim().toLowerCase();
    const pages = [...PAGES.map((p) => ({ label: p.label, kind: "PAGE", href: p.href })), { label: "Sign out", kind: "ACTION", href: "#logout" }];
    const pageHits = pages.filter((p) => !query || p.label.toLowerCase().includes(query));
    const topicHits = query ? topics.filter((t) => `${t.code} ${t.title}`.toLowerCase().includes(query)).slice(0, 8).map((t) => ({ label: t.title, kind: `TOPIC ${t.code}`, href: `/roadmap/${t.id}` })) : [];
    return [...pageHits, ...topicHits].slice(0, 12);
  }, [q, topics]);

  const go = useCallback(
    (href: string) => {
      onClose();
      if (href === "#logout") void logout();
      else router.push(href);
    },
    [onClose, router],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-30 flex items-start justify-center bg-[var(--scrim)] pt-[14vh]" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onClick={(e) => e.stopPropagation()}
        className="w-[600px] max-w-[calc(100%-32px)] overflow-hidden rounded-[20px] border border-line-strong bg-raised shadow-[0_30px_80px_rgba(0,0,0,.45)]"
      >
        <form autoComplete="off"
          className="flex items-center gap-3 border-b border-line px-5"
          onSubmit={(e) => {
            e.preventDefault();
            if (items[active]) go(items[active].href);
          }}
        >
          <span className="font-mono text-accent-text" aria-hidden="true">
            ⌘
          </span>
          <input
            autoFocus
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setActive(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive((a) => Math.min(items.length - 1, a + 1));
              }
              if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((a) => Math.max(0, a - 1));
              }
            }}
            aria-label="Search pages and topics"
            placeholder="Jump to a page or topic…"
            className="h-[60px] flex-1 border-0 bg-transparent text-[18px] text-ink caret-accent-text outline-none"
          />
          <span className="font-mono text-[10px] text-ink-4">ESC</span>
        </form>
        <div ref={listRef} className="flex max-h-[50vh] flex-col overflow-y-auto p-2" role="listbox" aria-label="Results">
          {items.map((i, idx) => (
            <button
              key={i.href + i.label}
              type="button"
              role="option"
              aria-selected={idx === active}
              onMouseEnter={() => setActive(idx)}
              onClick={() => go(i.href)}
              className={cx("flex items-center justify-between gap-3 rounded-[10px] px-3.5 py-3 text-left text-[15px]", idx === active && "bg-hover")}
            >
              <span className="truncate">{i.label}</span>
              <span className="shrink-0 font-mono text-[11px] text-ink-3">{i.kind}</span>
            </button>
          ))}
          {!items.length && <div className="p-3.5 text-[14px] text-ink-3">No matches.</div>}
        </div>
      </div>
    </div>
  );
}
