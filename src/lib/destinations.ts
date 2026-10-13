import { cache } from "react";
import { getPayloadClient } from "@/lib/payload-client";
import { mediaToPhoto, toSeoMeta, unwrapTexts } from "@/lib/media";
import type { Photo, SeoMeta, StateName } from "@/types/trek";

export type Destination = {
  slug: "himachal-pradesh" | "uttarakhand";
  state: StateName;
  shortName: string;
  eyebrow: string;
  tagline: string;
  intro: string;
  longIntro: string[];
  image: Photo;
  secondaryImage: Photo;
  /** SEO title/description/image overrides, set via @payloadcms/plugin-seo in /admin. */
  meta?: SeoMeta;
};

const FALLBACK_PHOTO: Photo = { src: "", alt: "" };

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- placeholder for Payload's generated doc type
function toDestination(doc: Record<string, any>): Destination {
  return {
    slug: doc.slug,
    state: doc.state,
    shortName: doc.shortName,
    eyebrow: doc.eyebrow,
    tagline: doc.tagline,
    intro: doc.intro,
    longIntro: unwrapTexts(doc.longIntro),
    image: mediaToPhoto(doc.image) ?? FALLBACK_PHOTO,
    secondaryImage: mediaToPhoto(doc.secondaryImage) ?? FALLBACK_PHOTO,
    meta: toSeoMeta(doc.meta),
  };
}

export const getDestinations = cache(async (): Promise<Destination[]> => {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({ collection: "destinations", limit: 50, sort: "id" });
  return docs.map(toDestination);
});

/**
 * Looks up one destination directly (not via getDestinations()) so `draft`
 * can be passed through — pass `true` only from inside Next's Draft Mode
 * (see destinations/[slug]/page.tsx), never for a normal visitor fetch.
 */
export const getDestinationBySlug = cache(async (slug: string, draft = false): Promise<Destination | undefined> => {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({ collection: "destinations", where: { slug: { equals: slug } }, draft, limit: 1 });
  return docs[0] ? toDestination(docs[0]) : undefined;
});

export async function getDestinationByState(state: StateName): Promise<Destination> {
  const destinations = await getDestinations();
  const found = destinations.find((d) => d.state === state);
  if (!found) throw new Error(`No destination configured for state "${state}"`);
  return found;
}
