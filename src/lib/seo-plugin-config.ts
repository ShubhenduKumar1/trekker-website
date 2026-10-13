/**
 * Generator functions for @payloadcms/plugin-seo, branching per collection
 * since Treks and Destinations have different field names. Loosely typed
 * for the same reason as src/lib/treks.ts — generate:types isn't runnable
 * yet (see payload.config.ts's comment near the db adapter).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- placeholder for Payload's generated doc type
type AnyDoc = Record<string, any>;

function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
}

export function generateSeoTitle({ doc, collectionSlug }: { doc: AnyDoc; collectionSlug?: string }): string {
  if (collectionSlug === "treks") return `${doc.name} — ${doc.state}`;
  if (collectionSlug === "destinations") return `Treks in ${doc.state}`;
  return doc.name ?? doc.state ?? "";
}

export function generateSeoDescription({ doc, collectionSlug }: { doc: AnyDoc; collectionSlug?: string }): string {
  if (collectionSlug === "treks") return doc.summary ?? "";
  if (collectionSlug === "destinations") return doc.intro ?? "";
  return "";
}

export function generateSeoImage({ doc, collectionSlug }: { doc: AnyDoc; collectionSlug?: string }) {
  if (collectionSlug === "treks") return doc.coverImage;
  if (collectionSlug === "destinations") return doc.image;
  return undefined;
}

export function generateSeoURL({ doc, collectionSlug }: { doc: AnyDoc; collectionSlug?: string }): string {
  if (collectionSlug === "treks") return `${siteUrl()}/treks/${doc?.slug}`;
  if (collectionSlug === "destinations") return `${siteUrl()}/destinations/${doc?.slug}`;
  return siteUrl();
}
