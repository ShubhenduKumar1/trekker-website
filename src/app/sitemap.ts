import type { MetadataRoute } from "next";
import { getAllTreks } from "@/lib/treks";
import { destinations } from "@/data/destinations";
import { siteConfig } from "@/config/site";

export const dynamic = "force-static";

/** Generated only when NEXT_PUBLIC_SITE_URL is set (sitemaps need absolute URLs). */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.siteUrl?.replace(/\/$/, "");
  if (!base) return [];
  const paths = [
    "/",
    "/treks",
    "/about",
    "/contact",
    "/privacy",
    ...(siteConfig.policies.terms ? ["/terms"] : []),
    ...(siteConfig.policies.cancellation ? ["/cancellation-policy"] : []),
    ...destinations.map((d) => `/destinations/${d.slug}`),
    ...getAllTreks().map((t) => `/treks/${t.slug}`),
  ];
  return paths.map((p) => ({ url: `${base}${p}`, changeFrequency: "weekly", priority: p === "/" ? 1 : p.startsWith("/treks/") ? 0.8 : 0.6 }));
}
