/**
 * Shared by server-side config (SEO plugin generators, admin.livePreview /
 * admin.preview URL functions) that needs an absolute site origin but can't
 * read NEXT_PUBLIC_SITE_URL the normal client-side way (these run in
 * payload.config.ts, not in a component).
 */
export function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
}

/**
 * Routes Live Preview / the "Preview" button through /next/preview instead
 * of straight at the page, so draft content (and autosaved edits) actually
 * show up — see that route's comment for why. Falls back to the plain page
 * URL (no draft support, but still a valid preview) if PREVIEW_SECRET isn't
 * set, so the feature degrades gracefully rather than breaking.
 */
export function previewUrl(path: string): string {
  const secret = process.env.PREVIEW_SECRET;
  if (!secret) return `${siteUrl()}${path}`;
  return `${siteUrl()}/next/preview?secret=${secret}&path=${encodeURIComponent(path)}`;
}
