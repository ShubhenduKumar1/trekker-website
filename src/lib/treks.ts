import { cache } from "react";
import { getPayloadClient } from "@/lib/payload-client";
import { mediaToPhoto, toSeoMeta, unwrapValues, unwrapTexts } from "@/lib/media";
import type { Faq, Photo, StateName, Trek, TrekDay, TrekPackage } from "@/types/trek";

const FALLBACK_PHOTO: Photo = { src: "", alt: "" };

/** Payload's find() return type for the treks collection — kept local since generate:types isn't runnable yet (see payload.config.ts). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- placeholder for Payload's generated doc type
type TrekDoc = Record<string, any>;

function toTrekDay(day: TrekDoc): TrekDay {
  return {
    day: day.day,
    title: day.title,
    route: day.route ?? undefined,
    startLocation: day.startLocation ?? undefined,
    endLocation: day.endLocation ?? undefined,
    description: day.description,
    distanceKm: day.distanceKm ?? undefined,
    trekkingHours: day.trekkingHours ?? undefined,
    startAltitudeM: day.startAltitudeM ?? undefined,
    endAltitudeM: day.endAltitudeM ?? undefined,
    meals: unwrapValues(day.meals),
    accommodation: day.accommodation ?? undefined,
    image: mediaToPhoto(day.image) ?? undefined,
  };
}

function toTrekPackage(pkg: TrekDoc): TrekPackage {
  return {
    id: String(pkg.id),
    name: pkg.name,
    summary: pkg.summary ?? undefined,
    pricePerPerson: pkg.pricePerPerson ?? undefined,
    inclusions: unwrapValues(pkg.inclusions),
    accommodation: pkg.accommodation ?? undefined,
    transportDetails: pkg.transportDetails ?? undefined,
    groupSize: pkg.groupSize ?? undefined,
    requirements: pkg.requirements ?? undefined,
  };
}

function toTrek(doc: TrekDoc): Trek {
  return {
    id: String(doc.id),
    slug: doc.slug,
    name: doc.name,
    state: doc.state,
    location: doc.location,
    summary: doc.summary,
    description: unwrapTexts(doc.description),
    routeSummary: doc.routeSummary ?? undefined,
    startPoint: doc.startPoint ?? undefined,
    endPoint: doc.endPoint ?? undefined,
    durationDays: doc.durationDays,
    difficulty: doc.difficulty,
    difficultyNote: doc.difficultyNote ?? undefined,
    fitnessNote: doc.fitnessNote ?? undefined,
    pricePerPerson: doc.pricePerPerson ?? undefined,
    maxAltitudeM: doc.maxAltitudeM ?? undefined,
    distanceKm: doc.distanceKm ?? undefined,
    accommodationType: doc.accommodationType ?? undefined,
    groupSize: doc.groupSize ?? undefined,
    bestSeasons: doc.bestSeasons ?? [],
    seasonLabel: doc.seasonLabel ?? undefined,
    coverImage: mediaToPhoto(doc.coverImage) ?? FALLBACK_PHOTO,
    gallery: (doc.gallery ?? []).map((g: TrekDoc) => mediaToPhoto(g.image)).filter((p: Photo | null): p is Photo => p !== null),
    itinerary: (doc.itinerary ?? []).map(toTrekDay),
    packages: (doc.packages ?? []).map(toTrekPackage),
    inclusions: unwrapValues(doc.inclusions),
    exclusions: unwrapValues(doc.exclusions),
    packingList: (doc.packingList ?? []).map((g: TrekDoc) => ({ category: g.category, items: unwrapValues(g.items) })),
    faqs: (doc.faqs ?? []) as Faq[],
    featured: doc.featured ?? false,
    status: doc.contentStatus,
    meta: toSeoMeta(doc.meta),
  };
}

/** All treks, in catalog order. Cached per request. */
export const getAllTreks = cache(async (): Promise<Trek[]> => {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({ collection: "treks", limit: 200, sort: "id" });
  return docs.map(toTrek);
});

/**
 * Looks up one trek directly (not via getAllTreks()) so `draft` can be
 * passed through — pass `true` only from inside Next's Draft Mode (see
 * treks/[slug]/page.tsx), never for a normal visitor-facing fetch.
 */
export const getTrekBySlug = cache(async (slug: string | null | undefined, draft = false): Promise<Trek | undefined> => {
  if (!slug) return undefined;
  const payload = await getPayloadClient();
  const { docs } = await payload.find({ collection: "treks", where: { slug: { equals: slug } }, draft, limit: 1 });
  return docs[0] ? toTrek(docs[0]) : undefined;
});

export async function getTreksByState(state: StateName): Promise<Trek[]> {
  const treks = await getAllTreks();
  return treks.filter((t) => t.state === state);
}

export async function getFeaturedTreks(limit = 6): Promise<Trek[]> {
  const treks = await getAllTreks();
  const featured = treks.filter((t) => t.featured);
  return (featured.length ? featured : treks).slice(0, limit);
}

export async function getRelatedTreks(trek: Trek, limit = 3): Promise<Trek[]> {
  const treks = await getAllTreks();
  return [...treks.filter((t) => t.id !== trek.id && t.state === trek.state), ...treks.filter((t) => t.state !== trek.state)].slice(
    0,
    limit,
  );
}
