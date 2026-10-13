import type { MetadataRoute } from "next";
import { getSiteSettings } from "@/lib/site-settings";

export const revalidate = 3600;

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSiteSettings();
  const base = settings.siteUrl?.replace(/\/$/, "");
  return {
    rules: { userAgent: "*", allow: "/" },
    ...(base ? { sitemap: `${base}/sitemap.xml` } : {}),
  };
}
