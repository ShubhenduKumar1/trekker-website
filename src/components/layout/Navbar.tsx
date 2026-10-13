"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, Menu, X } from "lucide-react";
import { Wordmark } from "@/components/layout/Wordmark";
import { btn } from "@/lib/ui";
import { cn } from "@/lib/format";
import { setScrollLock } from "@/lib/dom";

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/treks", label: "Explore Treks" },
  { href: "/destinations/himachal-pradesh", label: "Himachal" },
  { href: "/destinations/uttarakhand", label: "Uttarakhand" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

const isActive = (path: string, href: string) => (href === "/" ? path === "/" : path === href || path.startsWith(`${href}/`));

/** Floating pill navigation. Narrows slightly once the page is scrolled. */
export function Navbar() {
  const pathname = usePathname() ?? "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  const reduce = useReducedMotion();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close the mobile menu whenever the route changes.
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mobile menu: lock scroll, trap focus, close on Escape, restore focus.
  useEffect(() => {
    if (!open) return;
    const trigger = menuButtonRef.current;
    setScrollLock(true);
    const panel = panelRef.current;
    const focusables = () => [
      ...(trigger ? [trigger] : []),
      ...Array.from(panel?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? []),
    ];
    panel?.querySelector<HTMLElement>("a[href]")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables();
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      setScrollLock(false);
      document.removeEventListener("keydown", onKey);
      trigger?.focus();
    };
  }, [open]);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-ink focus:shadow"
      >
        Skip to content
      </a>
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5">
        <nav
          aria-label="Main"
          className={cn(
            "mx-auto flex h-14 items-center justify-between gap-4 rounded-full border border-line/70 bg-white/85 pr-2 pl-5 backdrop-blur-xl transition-[max-width,box-shadow] duration-500 ease-out-soft",
            scrolled || open ? "max-w-[50rem] shadow-[0_8px_30px_-12px_rgb(0_0_0/0.15)]" : "max-w-[56rem]",
          )}
        >
          <Link href="/" className="shrink-0 rounded-md" aria-label="Home">
            <Wordmark />
          </Link>

          <ul className="hidden items-center lg:flex xl:gap-1">
            {NAV_LINKS.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "rounded-full px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors",
                      active ? "text-ink" : "text-ink/60 hover:text-ink",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-1">
            <span className="hidden sm:block">
              <Link href="/treks" className={cn(btn.primary, "min-h-10 px-5")}>
                Find Your Trek
              </Link>
            </span>
            <button
              ref={menuButtonRef}
              type="button"
              className="inline-flex size-10 items-center justify-center rounded-full text-ink hover:bg-black/5 lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {open && (
            <motion.div
              id="mobile-menu"
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
              className="card mx-auto mt-2 max-w-[50rem] overflow-hidden p-2 shadow-[0_20px_50px_-20px_rgb(0_0_0/0.25)] lg:hidden"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: reduce ? 0.12 : 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <ul>
                {NAV_LINKS.map((link) => {
                  const active = isActive(pathname, link.href);
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        aria-current={active ? "page" : undefined}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center justify-between rounded-2xl px-4 py-3.5 text-base font-medium",
                          active ? "bg-canvas text-ink" : "text-ink/75 hover:bg-canvas",
                        )}
                      >
                        {link.label}
                        <ArrowRight aria-hidden className="size-4 opacity-40" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <Link href="/treks" onClick={() => setOpen(false)} className={cn(btn.primary, "mt-2 w-full")}>
                Find Your Trek
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      {/* Dims the page behind the open mobile menu */}
      {open && <div aria-hidden className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] lg:hidden" onClick={() => setOpen(false)} />}
    </>
  );
}
