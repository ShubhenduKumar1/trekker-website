import { cache } from "react";
import { getPayloadClient } from "@/lib/payload-client";
import { mediaToPhoto, unwrapTexts, unwrapValues } from "@/lib/media";
import type { Photo, SocialLink } from "@/types/trek";

export type SiteSettings = {
  brandName: string;
  wordmark: { primary: string; secondary: string };
  logoSrc: string | null;
  tagline: string;
  description: string;
  siteUrl: string | null;
  whatsappNumber: string | null;
  /** Slug of the trek highlighted in the homepage hero, if one is set. */
  heroTrekSlug: string | null;
  email: string | null;
  phoneDisplay: string | null;
  baseLocation: string | null;
  social: SocialLink[];
  guide: {
    name: string | null;
    portrait: Photo | null;
    intro: string[];
    whyTrekking: string | null;
    philosophy: string | null;
    credentials: string[];
  };
  policies: {
    terms: string[] | null;
    cancellation: string[] | null;
    emergencyContact: string | null;
  };
};

const env = (value: string | undefined) => (value && value.trim() ? value.trim() : null);

/**
 * Site-wide settings (brand, contact, guide profile, policies), editable in
 * /admin. NEXT_PUBLIC_SITE_URL stays an env var since it's a deploy-time
 * concern, not editorial content.
 */
export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const payload = await getPayloadClient();
  const settings = await payload.findGlobal({ slug: "site-settings" });

  const heroTrek = settings.heroTrekSlug;
  const heroTrekSlug = typeof heroTrek === "object" && heroTrek ? heroTrek.slug : null;

  const terms = unwrapTexts(settings.policies?.terms);
  const cancellation = unwrapTexts(settings.policies?.cancellation);

  return {
    brandName: settings.brandName,
    wordmark: { primary: settings.wordmark?.primary ?? settings.brandName, secondary: settings.wordmark?.secondary ?? "" },
    logoSrc: mediaToPhoto(settings.logo)?.src ?? null,
    tagline: settings.tagline,
    description: settings.description,
    siteUrl: env(process.env.NEXT_PUBLIC_SITE_URL),
    whatsappNumber: settings.whatsappNumber ?? null,
    heroTrekSlug,
    email: settings.email ?? null,
    phoneDisplay: settings.phoneDisplay ?? null,
    baseLocation: settings.baseLocation ?? null,
    social: (settings.social ?? []).map((s: SocialLink) => ({ label: s.label, url: s.url })),
    guide: {
      name: settings.guide?.name ?? null,
      portrait: mediaToPhoto(settings.guide?.portrait),
      intro: unwrapTexts(settings.guide?.intro),
      whyTrekking: settings.guide?.whyTrekking ?? null,
      philosophy: settings.guide?.philosophy ?? null,
      credentials: unwrapValues(settings.guide?.credentials),
    },
    policies: {
      terms: terms.length ? terms : null,
      cancellation: cancellation.length ? cancellation : null,
      emergencyContact: settings.policies?.emergencyContact ?? null,
    },
  };
});
