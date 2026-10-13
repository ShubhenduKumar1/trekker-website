import type { Difficulty, Season, StateName, Trek } from "@/types/trek";
import { getStartingPrice } from "@/lib/trek-pricing";

/* ── Filter vocabulary ────────────────────────────────────────────────────── */

export const STATE_OPTIONS: { id: string; label: string; value: StateName }[] = [
  { id: "himachal-pradesh", label: "Himachal Pradesh", value: "Himachal Pradesh" },
  { id: "uttarakhand", label: "Uttarakhand", value: "Uttarakhand" },
];

export const DIFFICULTY_OPTIONS: Difficulty[] = ["Easy", "Moderate", "Difficult"];

export const SEASON_OPTIONS: Season[] = ["Spring", "Summer", "Monsoon", "Autumn", "Winter"];

export const DURATION_OPTIONS = [
  { id: "short", label: "1–3 days", min: 1, max: 3 },
  { id: "medium", label: "4–5 days", min: 4, max: 5 },
  { id: "long", label: "6+ days", min: 6, max: Infinity },
] as const;

export const PRICE_OPTIONS = [
  { id: "under-10k", label: "Under ₹10,000", min: 0, max: 9999 },
  { id: "10k-20k", label: "₹10,000 – ₹20,000", min: 10000, max: 20000 },
  { id: "over-20k", label: "Over ₹20,000", min: 20001, max: Infinity },
  { id: "on-request", label: "Price on request", min: null, max: null },
] as const;

export const SORT_OPTIONS = [
  { id: "recommended", label: "Recommended" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "duration-asc", label: "Duration: shortest first" },
  { id: "duration-desc", label: "Duration: longest first" },
] as const;

export type DurationId = (typeof DURATION_OPTIONS)[number]["id"];
export type PriceId = (typeof PRICE_OPTIONS)[number]["id"];
export type SortId = (typeof SORT_OPTIONS)[number]["id"];

export type TrekFilters = {
  q: string;
  states: StateName[];
  difficulties: Difficulty[];
  durations: DurationId[];
  prices: PriceId[];
  seasons: Season[];
  sort: SortId;
};

export const EMPTY_FILTERS: TrekFilters = {
  q: "",
  states: [],
  difficulties: [],
  durations: [],
  prices: [],
  seasons: [],
  sort: "recommended",
};

/* ── Matching ─────────────────────────────────────────────────────────────── */

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .trim();

function matchesQuery(trek: Trek, q: string): boolean {
  const query = normalize(q);
  if (!query) return true;
  const haystack = normalize([trek.name, trek.location, trek.state, trek.routeSummary ?? ""].join(" "));
  return query.split(/\s+/).every((word) => haystack.includes(word));
}

function matchesPrice(trek: Trek, prices: PriceId[]): boolean {
  if (!prices.length) return true;
  const price = getStartingPrice(trek);
  return prices.some((id) => {
    const opt = PRICE_OPTIONS.find((o) => o.id === id);
    if (!opt) return false;
    if (opt.min === null) return price === undefined;
    return price !== undefined && price >= opt.min && price <= opt.max;
  });
}

function matchesDuration(trek: Trek, durations: DurationId[]): boolean {
  if (!durations.length) return true;
  return durations.some((id) => {
    const opt = DURATION_OPTIONS.find((o) => o.id === id);
    return !!opt && trek.durationDays >= opt.min && trek.durationDays <= opt.max;
  });
}

export function filterTreks(list: Trek[], f: TrekFilters): Trek[] {
  const result = list.filter(
    (t) =>
      matchesQuery(t, f.q) &&
      (!f.states.length || f.states.includes(t.state)) &&
      (!f.difficulties.length || f.difficulties.includes(t.difficulty)) &&
      matchesDuration(t, f.durations) &&
      matchesPrice(t, f.prices) &&
      (!f.seasons.length || t.bestSeasons.some((s) => f.seasons.includes(s))),
  );
  return sortTreks(result, f.sort);
}

export function sortTreks(list: Trek[], sort: SortId): Trek[] {
  if (sort === "recommended") return list;
  const copy = [...list];
  if (sort === "duration-asc") return copy.sort((a, b) => a.durationDays - b.durationDays);
  if (sort === "duration-desc") return copy.sort((a, b) => b.durationDays - a.durationDays);
  // Price sorts: treks without a confirmed price always go last.
  const dir = sort === "price-asc" ? 1 : -1;
  return copy.sort((a, b) => {
    const pa = getStartingPrice(a);
    const pb = getStartingPrice(b);
    if (pa === undefined && pb === undefined) return 0;
    if (pa === undefined) return 1;
    if (pb === undefined) return -1;
    return (pa - pb) * dir;
  });
}

export function countActiveFilters(f: TrekFilters): number {
  return (
    (f.q.trim() ? 1 : 0) +
    f.states.length +
    f.difficulties.length +
    f.durations.length +
    f.prices.length +
    f.seasons.length
  );
}

/* ── URL (de)serialisation ────────────────────────────────────────────────── */

type ParamSource = { get(name: string): string | null };

const list = (params: ParamSource, key: string) =>
  (params.get(key) ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

function pick<T extends string>(values: string[], allowed: readonly T[]): T[] {
  const lower = new Map(allowed.map((a) => [a.toLowerCase(), a] as const));
  return Array.from(new Set(values.map((v) => lower.get(v.toLowerCase())).filter((v): v is T => !!v)));
}

export function filtersFromParams(params: ParamSource): TrekFilters {
  const stateIds = pick(list(params, "state"), STATE_OPTIONS.map((s) => s.id));
  const sort = pick([params.get("sort") ?? ""], SORT_OPTIONS.map((s) => s.id))[0] ?? "recommended";
  return {
    q: (params.get("q") ?? "").slice(0, 80),
    states: stateIds.map((id) => STATE_OPTIONS.find((s) => s.id === id)!.value),
    difficulties: pick(list(params, "difficulty"), DIFFICULTY_OPTIONS),
    durations: pick(list(params, "duration"), DURATION_OPTIONS.map((d) => d.id)),
    prices: pick(list(params, "price"), PRICE_OPTIONS.map((p) => p.id)),
    seasons: pick(list(params, "season"), SEASON_OPTIONS),
    sort,
  };
}

export function filtersToSearch(f: TrekFilters): string {
  const p = new URLSearchParams();
  if (f.q.trim()) p.set("q", f.q.trim());
  if (f.states.length)
    p.set("state", f.states.map((s) => STATE_OPTIONS.find((o) => o.value === s)!.id).join(","));
  if (f.difficulties.length) p.set("difficulty", f.difficulties.map((d) => d.toLowerCase()).join(","));
  if (f.durations.length) p.set("duration", f.durations.join(","));
  if (f.prices.length) p.set("price", f.prices.join(","));
  if (f.seasons.length) p.set("season", f.seasons.map((s) => s.toLowerCase()).join(","));
  if (f.sort !== "recommended") p.set("sort", f.sort);
  const s = p.toString();
  return s ? `?${s}` : "";
}

/* ── Facet counts (derived from the catalog, never hard-coded) ────────────── */

export function facetCount(list: Trek[], f: TrekFilters, patch: Partial<TrekFilters>): number {
  return filterTreks(list, { ...f, ...patch, sort: "recommended" }).length;
}
