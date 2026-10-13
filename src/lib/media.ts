import type { Photo } from "@/types/trek";

/** Shape of a populated Media doc, as returned by Payload once the relationship is resolved. */
type PopulatedMedia = { url?: string | null; alt?: string | null };

type MediaRef = number | string | PopulatedMedia | null | undefined;

/** Converts a populated Payload upload relationship into the site's plain Photo shape. */
export function mediaToPhoto(media: MediaRef): Photo | null {
  if (!media || typeof media === "number" || typeof media === "string") return null;
  if (!media.url) return null;
  return { src: media.url, alt: media.alt ?? "" };
}

/** Same as mediaToPhoto, but falls back to a Photo instead of null (for required image fields). */
export function mediaToPhotoOrFallback(media: MediaRef, fallback: Photo): Photo {
  return mediaToPhoto(media) ?? fallback;
}

/** Unwraps Payload's `{ value: string }[]` shape (used for array-of-text fields) back to string[]. */
export function unwrapValues(items: { value: string }[] | null | undefined): string[] {
  return (items ?? []).map((i) => i.value);
}

/** Unwraps Payload's `{ text: string }[]` shape (used for array-of-paragraph fields) back to string[]. */
export function unwrapTexts(items: { text: string }[] | null | undefined): string[] {
  return (items ?? []).map((i) => i.text);
}
