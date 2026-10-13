import { describe, expect, it } from "vitest";
import { EMPTY_FILTERS, filterTreks, filtersFromParams, filtersToSearch, type TrekFilters } from "@/lib/filters";
import { treks } from "@/data/treks";
import type { Trek } from "@/types/trek";

const f = (patch: Partial<TrekFilters>): TrekFilters => ({ ...EMPTY_FILTERS, ...patch });

// Fixture with prices so price filters/sorts can be exercised independently of sample data.
const priced: Trek[] = treks.map((t, i) => ({ ...t, pricePerPerson: i === 0 ? undefined : 5000 * (i + 1) }));

describe("filterTreks", () => {
  it("returns everything with no filters", () => {
    expect(filterTreks(treks, EMPTY_FILTERS)).toHaveLength(treks.length);
  });
  it("searches by name and location, case-insensitively", () => {
    expect(filterTreks(treks, f({ q: "kedar" })).map((t) => t.slug)).toEqual(["kedarkantha-trek"]);
    expect(filterTreks(treks, f({ q: "MANALI" })).every((t) => t.location.includes("Manali"))).toBe(true);
    expect(filterTreks(treks, f({ q: "zzz" }))).toHaveLength(0);
  });
  it("filters by state", () => {
    const res = filterTreks(treks, f({ states: ["Uttarakhand"] }));
    expect(res.length).toBeGreaterThan(0);
    expect(res.every((t) => t.state === "Uttarakhand")).toBe(true);
  });
  it("combines filters", () => {
    const res = filterTreks(treks, f({ states: ["Uttarakhand"], difficulties: ["Easy"], seasons: ["Winter"] }));
    expect(res.map((t) => t.slug)).toEqual(["dayara-bugyal-trek"]);
  });
  it("filters by duration bucket", () => {
    expect(filterTreks(treks, f({ durations: ["short"] })).every((t) => t.durationDays <= 3)).toBe(true);
    expect(filterTreks(treks, f({ durations: ["long"] })).every((t) => t.durationDays >= 6)).toBe(true);
  });
  it("filters by price, including price-on-request", () => {
    expect(filterTreks(priced, f({ prices: ["on-request"] })).map((t) => t.id)).toEqual([priced[0].id]);
    expect(filterTreks(priced, f({ prices: ["under-10k"] })).every((t) => (t.pricePerPerson ?? 0) < 10000)).toBe(true);
  });
  it("sorts by price with unknown prices last", () => {
    const asc = filterTreks(priced, f({ sort: "price-asc" }));
    expect(asc.at(-1)!.pricePerPerson).toBeUndefined();
    expect(asc[0].pricePerPerson).toBe(10000);
    const desc = filterTreks(priced, f({ sort: "price-desc" }));
    expect(desc[0].pricePerPerson).toBe(30000);
    expect(desc.at(-1)!.pricePerPerson).toBeUndefined();
  });
  it("sorts by duration", () => {
    const res = filterTreks(treks, f({ sort: "duration-asc" }));
    expect(res[0].durationDays).toBeLessThanOrEqual(res.at(-1)!.durationDays);
  });
});

describe("URL params", () => {
  it("round-trips", () => {
    const filters = f({ q: "pass", states: ["Himachal Pradesh"], difficulties: ["Moderate"], durations: ["medium"], seasons: ["Summer"], sort: "duration-desc" });
    const search = filtersToSearch(filters);
    expect(filtersFromParams(new URLSearchParams(search))).toEqual(filters);
  });
  it("ignores unknown values", () => {
    const parsed = filtersFromParams(new URLSearchParams("state=mars,uttarakhand&difficulty=insane&sort=nope"));
    expect(parsed.states).toEqual(["Uttarakhand"]);
    expect(parsed.difficulties).toEqual([]);
    expect(parsed.sort).toBe("recommended");
  });
});

describe("catalog integrity", () => {
  it("has unique slugs and itineraries matching duration", () => {
    expect(new Set(treks.map((t) => t.slug)).size).toBe(treks.length);
    for (const t of treks) {
      expect(t.itinerary.length).toBe(t.durationDays);
      expect(t.itinerary.map((d) => d.day)).toEqual(t.itinerary.map((_, i) => i + 1));
      expect(t.packages.length).toBeGreaterThan(0);
    }
  });
});
