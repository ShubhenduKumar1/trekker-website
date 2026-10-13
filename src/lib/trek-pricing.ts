import type { Trek } from "@/types/trek";

/**
 * Pure, client-safe. Deliberately kept out of src/lib/treks.ts — that file
 * also holds the Payload data-fetching functions, and any Client Component
 * importing from it would drag the entire Payload/Postgres stack into the
 * browser bundle (which then fails to build — Payload's upload internals
 * use Node-only APIs that can't be bundled for the browser).
 *
 * Lowest known price across a trek's packages (or its base price).
 */
export const getStartingPrice = (trek: Trek): number | undefined => {
  const prices = [trek.pricePerPerson, ...trek.packages.map((p) => p.pricePerPerson)].filter(
    (p): p is number => typeof p === "number" && Number.isFinite(p) && p > 0,
  );
  return prices.length ? Math.min(...prices) : undefined;
};
