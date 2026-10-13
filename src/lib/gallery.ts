import { cache } from "react";
import { getPayloadClient } from "@/lib/payload-client";
import { mediaToPhoto } from "@/lib/media";
import type { Photo } from "@/types/trek";

export type GalleryItem = Photo & { caption: string; shape: "tall" | "wide" | "square" };

/** Homepage photo gallery, editable in /admin. */
export const getGalleryItems = cache(async (): Promise<GalleryItem[]> => {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({ collection: "gallery-items", limit: 100, sort: "order" });
  return docs
    .map((d) => {
      const photo = mediaToPhoto(d.image);
      return photo ? { ...photo, caption: d.caption, shape: d.shape } : null;
    })
    .filter((item): item is GalleryItem => item !== null);
});
