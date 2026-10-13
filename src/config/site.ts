/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  BUSINESS CONFIGURATION — the one place to edit business details.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  Anything set to `null` (or an empty string / empty array) is treated as
 *  "not provided yet": the site hides it or shows a neutral fallback, and in
 *  development a yellow notice reminds you to fill it in.
 *
 *  NEVER put made-up phone numbers, emails, credentials or URLs here.
 */

export type SocialLink = {
  label: "Instagram" | "YouTube" | "Facebook" | "X" | "LinkedIn";
  url: string;
};

const env = (value: string | undefined) => (value && value.trim() ? value.trim() : null);

export const siteConfig = {
  /** TODO(organizer): replace with your real brand name. */
  brandName: "Trekker Himalaya",
  /** Short wordmark split: first part regular, second part accented. */
  wordmark: { primary: "Trekker", secondary: "Himalaya" },
  /** Optional path to a logo in /public (e.g. "/logo.svg"). When null the wordmark is used. */
  logoSrc: null as string | null,
  tagline: "Guided Himalayan treks in Himachal Pradesh & Uttarakhand",
  description:
    "Small-group Himalayan treks in Himachal Pradesh and Uttarakhand, planned personally with your guide. Explore itineraries and enquire on WhatsApp.",

  /**
   * Production URL without trailing slash, e.g. "https://www.example.com".
   * Set NEXT_PUBLIC_SITE_URL in your hosting environment.
   */
  siteUrl: env(process.env.NEXT_PUBLIC_SITE_URL),

  /**
   * WhatsApp number in international digits-only format: country code + number,
   * no "+", spaces or dashes. Set NEXT_PUBLIC_WHATSAPP_NUMBER.
   */
  whatsappNumber: env(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER),

  /** Slug of the trek highlighted in the homepage hero panel (must exist in src/data/treks.ts). */
  heroTrekSlug: "kedarkantha-trek",

  /** TODO(organizer): public contact email, or leave null. */
  email: "shubhendukumarlal@gmail.com" as string | null,
  /** TODO(organizer): display phone number (e.g. "+91 …"), or leave null. */
  phoneDisplay: "+91 98703 85567" as string | null,
  /** TODO(organizer): base town / office, or leave null. */
  baseLocation: "Dehradun, Uttarakhand" as string | null,

  /** TODO(organizer): add real profile URLs only. Empty = no icons shown. */
  social: [
    { label: "Instagram", url: "https://www.instagram.com/shubhendu_0112/" },
  ] as SocialLink[],

  guide: {
    /** TODO(organizer): your name. */
    name: null as string | null,
    /** TODO(organizer): a path in /public or a full image URL of you on the trail. */
    portrait: null as { src: string; alt: string } | null,
    /** TODO(organizer): 1–2 short paragraphs introducing yourself. */
    intro: [] as string[],
    /** TODO(organizer): why you love trekking, in your own words. */
    whyTrekking: null as string | null,
    /** TODO(organizer): how you guide groups. */
    philosophy: null as string | null,
    /** TODO(organizer): only real, verifiable experience and certifications. */
    credentials: [] as string[],
  },

  /**
   * Policies. Leave null until you have the real text — the page will say
   * the policy is being finalised instead of inventing terms.
   */
  policies: {
    terms: null as string[] | null,
    cancellation: null as string[] | null,
    /** Emergency contact shown on trek pages. Only real, verified numbers. */
    emergencyContact: null as string | null,
  },
} as const;

export type SiteConfig = typeof siteConfig;

export const isDev = process.env.NODE_ENV !== "production";
