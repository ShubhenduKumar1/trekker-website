import { cache } from "react";
import { getPayloadClient } from "@/lib/payload-client";
import { mediaToPhoto, unwrapTexts } from "@/lib/media";
import type { Photo, StateName } from "@/types/trek";

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
  };
}

export const getDestinations = cache(async (): Promise<Destination[]> => {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({ collection: "destinations", limit: 50, sort: "id" });
  return docs.map(toDestination);
});

export async function getDestinationBySlug(slug: string): Promise<Destination | undefined> {
  const destinations = await getDestinations();
  return destinations.find((d) => d.slug === slug);
}

export async function getDestinationByState(state: StateName): Promise<Destination> {
  const destinations = await getDestinations();
  const found = destinations.find((d) => d.state === state);
  if (!found) throw new Error(`No destination configured for state "${state}"`);
  return found;
}
