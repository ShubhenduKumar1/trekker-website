/**
 * Shared by server-side config (SEO plugin generators, admin.livePreview /
 * admin.preview URL functions) that needs an absolute site origin but can't
 * read NEXT_PUBLIC_SITE_URL the normal client-side way (these run in
 * payload.config.ts, not in a component).
 */
export function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
}
