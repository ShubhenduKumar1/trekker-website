import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

/** Absolute URL helper — returns null when no production domain is configured. */
export function absoluteUrl(path = "/"): string | null {
  if (!siteConfig.siteUrl) return null;
  return `${siteConfig.siteUrl.replace(/\/$/, "")}${path}`;
}

type PageMeta = {
  title: string;
  description: string;
  path: string;
  image?: { src: string; alt: string };
};

export function pageMetadata({ title, description, path, image }: PageMeta): Metadata {
  const canonical = absoluteUrl(path);
  const ogImage = image ? [{ url: ogImageUrl(image.src), alt: image.alt, width: 1200, height: 630 }] : undefined;
  return {
    title,
    description,
    ...(canonical ? { alternates: { canonical } } : {}),
    openGraph: {
      title,
      description,
      type: "website",
      siteName: siteConfig.brandName,
      locale: "en_IN",
      ...(canonical ? { url: canonical } : {}),
      ...(ogImage ? { images: ogImage } : {}),
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title,
      description,
      ...(ogImage ? { images: ogImage.map((i) => i.url) } : {}),
    },
  };
}

/** 1200×630 crop for social cards. Unsplash URLs are cropped by the CDN. */
export function ogImageUrl(src: string): string {
  if (src.startsWith("https://images.unsplash.com/")) {
    return `${src}?w=1200&h=630&fit=crop&auto=format&q=75`;
  }
  return src;
}
