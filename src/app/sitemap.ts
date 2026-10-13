import type { MetadataRoute } from "next";
import { getAllTreks } from "@/lib/treks";
import { getDestinations } from "@/lib/destinations";
import { getSiteSettings } from "@/lib/site-settings";

// Content-driven, so this is revalidated like the rest of the site (see
// revalidate in (frontend)/layout.tsx) rather than force-static.
export const revalidate = 3600;

/** Generated only when NEXT_PUBLIC_SITE_URL is set (sitemaps need absolute URLs). */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getSiteSettings();
  const base = settings.siteUrl?.replace(/\/$/, "");
  if (!base) return [];
  const [destinations, treks] = await Promise.all([getDestinations(), getAllTreks()]);
  const paths = [
    "/",
    "/treks",
    "/about",
    "/contact",
    "/privacy",
    ...(settings.policies.terms ? ["/terms"] : []),
    ...(settings.policies.cancellation ? ["/cancellation-policy"] : []),
    ...destinations.map((d) => `/destinations/${d.slug}`),
    ...treks.map((t) => `/treks/${t.slug}`),
  ];
  return paths.map((p) => ({ url: `${base}${p}`, changeFrequency: "weekly", priority: p === "/" ? 1 : p.startsWith("/treks/") ? 0.8 : 0.6 }));
}
