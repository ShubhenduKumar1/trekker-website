import { treks } from "@/data/treks";
import type { StateName, Trek } from "@/types/trek";

export const getAllTreks = (): Trek[] => treks;

export const getTrekBySlug = (slug: string): Trek | undefined => treks.find((t) => t.slug === slug);

export const getTreksByState = (state: StateName): Trek[] => treks.filter((t) => t.state === state);

export const getFeaturedTreks = (limit = 6): Trek[] => {
  const featured = treks.filter((t) => t.featured);
  return (featured.length ? featured : treks).slice(0, limit);
};

/** Lowest known price across a trek's packages (or its base price). */
export const getStartingPrice = (trek: Trek): number | undefined => {
  const prices = [trek.pricePerPerson, ...trek.packages.map((p) => p.pricePerPerson)].filter(
    (p): p is number => typeof p === "number" && Number.isFinite(p) && p > 0,
  );
  return prices.length ? Math.min(...prices) : undefined;
};

export const getRelatedTreks = (trek: Trek, limit = 3): Trek[] =>
  [...treks.filter((t) => t.id !== trek.id && t.state === trek.state), ...treks.filter((t) => t.state !== trek.state)].slice(
    0,
    limit,
  );
