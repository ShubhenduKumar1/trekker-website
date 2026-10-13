"use client";

import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { RotateCcw, Search, SlidersHorizontal, X } from "lucide-react";
import type { Trek } from "@/types/trek";
import {
  SORT_OPTIONS,
  countActiveFilters,
  filterTreks,
  filtersFromParams,
  filtersToSearch,
  type SortId,
  type TrekFilters,
} from "@/lib/filters";
import { FilterPanel } from "@/components/treks/FilterPanel";
import { TrekCard } from "@/components/treks/TrekCard";
import { btn } from "@/lib/ui";
import { cn } from "@/lib/format";
import { setScrollLock } from "@/lib/dom";

export function TrekExplorer({ catalog }: { catalog: Trek[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL is the source of truth for shareable filter state.
  const filters = useMemo(() => filtersFromParams(searchParams), [searchParams]);

  // The search box keeps local state so typing stays instant; it syncs to the URL after a pause.
  const [query, setQuery] = useState(filters.q);
  const [urlQ, setUrlQ] = useState(filters.q);
  const [pushedQ, setPushedQ] = useState(filters.q);
  if (urlQ !== filters.q) {
    setUrlQ(filters.q);
    // Only follow the URL when it changed from elsewhere (back/forward, links) — not from our own typing.
    if (filters.q !== pushedQ) setQuery(filters.q);
  }
  const deferredQuery = useDeferredValue(query);

  const update = useCallback(
    (patch: Partial<TrekFilters>) => {
      const next = { ...filters, q: query, ...patch };
      router.replace(`${pathname}${filtersToSearch(next)}`, { scroll: false });
    },
    [filters, query, pathname, router],
  );

  useEffect(() => {
    if (query === filters.q) return;
    const t = window.setTimeout(() => {
      setPushedQ(query);
      router.replace(`${pathname}${filtersToSearch({ ...filters, q: query })}`, { scroll: false });
    }, 300);
    return () => window.clearTimeout(t);
  }, [query, filters, pathname, router]);

  const effective = useMemo(() => ({ ...filters, q: deferredQuery }), [filters, deferredQuery]);
  const results = useMemo(() => filterTreks(catalog, effective), [catalog, effective]);
  const active = countActiveFilters(effective);
  const advancedActive = active - (effective.q.trim() ? 1 : 0);

  const reset = () => {
    setQuery("");
    setPushedQ("");
    router.replace(pathname, { scroll: false });
  };

  /* ── Mobile drawer ───────────────────────────────────────────────────── */
  const drawerRef = useRef<HTMLDialogElement>(null);
  const openDrawer = () => {
    drawerRef.current?.showModal();
    setScrollLock(true);
  };
  const closeDrawer = () => drawerRef.current?.close();
  useEffect(() => {
    const d = drawerRef.current;
    if (!d) return;
    const onClose = () => {
      setScrollLock(false);
    };
    d.addEventListener("close", onClose);
    const mq = window.matchMedia("(min-width: 1024px)");
    const onResize = () => mq.matches && d.open && d.close();
    mq.addEventListener("change", onResize);
    return () => {
      d.removeEventListener("close", onClose);
      mq.removeEventListener("change", onResize);
    };
  }, []);

  return (
    <div className="grid gap-10 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-12">
      {/* Desktop sidebar */}
      <aside aria-label="Trek filters" className="hidden lg:block">
        <div className="card sticky top-[4.6rem] max-h-[calc(100vh-6rem)] overflow-y-auto p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">Filters</h2>
            {advancedActive > 0 && (
              <button type="button" onClick={reset} className="text-sm font-semibold text-accent underline-offset-4 hover:underline">
                Clear all
              </button>
            )}
          </div>
          <FilterPanel catalog={catalog} filters={effective} onChange={update} idPrefix="desk" />
        </div>
      </aside>

      <div>
        {/* Toolbar */}
        <div className="sticky top-[4.6rem] z-20 mb-8 rounded-[1.75rem] border border-line/70 bg-white/85 p-2 backdrop-blur-xl sm:rounded-full">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <label htmlFor="trek-search" className="sr-only">
                Search treks by name or location
              </label>
              <Search aria-hidden className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted" />
              <input
                id="trek-search"
                type="search"
                inputMode="search"
                autoComplete="off"
                placeholder="Search treks or places — e.g. Manali, Kedarkantha"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-11 w-full rounded-full border border-transparent bg-canvas pr-11 pl-11 text-[0.95rem] placeholder:text-muted/80 focus:border-accent focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent [&::-webkit-search-cancel-button]:hidden"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute top-1/2 right-2 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full text-muted hover:bg-ink/5"
                  aria-label="Clear search"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={openDrawer}
                className={cn(btn.secondary, "flex-1 px-5 lg:hidden")}
                aria-haspopup="dialog"
              >
                <SlidersHorizontal aria-hidden className="size-4" />
                Filters
                {advancedActive > 0 && (
                  <span className="inline-flex size-6 items-center justify-center rounded-full bg-accent text-xs text-white">
                    {advancedActive}
                  </span>
                )}
              </button>
              <div className="relative flex-1 sm:flex-none">
                <label htmlFor="trek-sort" className="sr-only">
                  Sort treks
                </label>
                <select
                  id="trek-sort"
                  value={filters.sort}
                  onChange={(e) => update({ sort: e.target.value as SortId })}
                  className="h-11 w-full cursor-pointer appearance-none rounded-full border border-transparent bg-canvas bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2320251F%22 stroke-width=%222%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[length:1rem] bg-[right_1rem_center] bg-no-repeat pr-10 pl-5 text-sm font-semibold focus:border-accent focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-semibold text-muted" aria-live="polite" aria-atomic="true">
            Showing <span className="text-ink">{results.length}</span> of {catalog.length}{" "}
            {catalog.length === 1 ? "trek" : "treks"}
            {active > 0 && " matching your filters"}
          </p>
          {active > 0 && (
            <button type="button" onClick={reset} className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline">
              <RotateCcw aria-hidden className="size-3.5" /> Reset filters
            </button>
          )}
        </div>

        {results.length > 0 ? (
          <ul className="grid gap-5 sm:grid-cols-2">
            {results.map((trek, i) => (
              <li key={trek.id}>
                <TrekCard trek={trek} priority={i < 2} sizes="(min-width: 1024px) 34vw, (min-width: 640px) 45vw, 100vw" />
              </li>
            ))}
          </ul>
        ) : (
          <div className="card px-6 py-16 text-center">
            <h2 className="font-display text-display-sm text-ink">No treks match these filters</h2>
            <p className="mx-auto mt-3 max-w-md text-muted">
              {catalog.length === 0
                ? "New treks are being added soon."
                : `Try removing a filter${effective.q.trim() ? ` or searching for something other than “${effective.q.trim()}”` : ""}. Combining several filters narrows the results to treks that match all of them.`}
            </p>
            {active > 0 && (
              <button type="button" onClick={reset} className={cn(btn.primary, "mt-8")}>
                <RotateCcw aria-hidden className="size-4" /> Reset all filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Mobile filter drawer */}
      <dialog
        ref={drawerRef}
        aria-labelledby="filter-drawer-title"
        onClick={(e) => e.target === e.currentTarget && closeDrawer()}
        className="m-0 mt-auto h-[88dvh] max-h-none w-full max-w-none rounded-t-[1.75rem] bg-white p-0 text-ink backdrop:bg-black/50 lg:hidden"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 id="filter-drawer-title" className="text-lg font-semibold tracking-tight">
              Filters
            </h2>
            <button
              type="button"
              onClick={closeDrawer}
              className="inline-flex size-11 items-center justify-center rounded-full hover:bg-ink/5"
              aria-label="Close filters"
            >
              <X className="size-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-6">
            <FilterPanel catalog={catalog} filters={effective} onChange={update} idPrefix="mob" />
          </div>
          <div className="flex gap-3 border-t border-line px-5 pt-4 pb-safe">
            <button type="button" onClick={reset} className={cn(btn.outline, "flex-1")} disabled={advancedActive === 0}>
              Clear
            </button>
            <button type="button" onClick={closeDrawer} className={cn(btn.primary, "flex-[2]")}>
              Show {results.length} {results.length === 1 ? "trek" : "treks"}
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}

