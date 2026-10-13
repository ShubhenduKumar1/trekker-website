export type Difficulty = "Easy" | "Moderate" | "Difficult";

export type StateName = "Himachal Pradesh" | "Uttarakhand";

export type Season = "Spring" | "Summer" | "Monsoon" | "Autumn" | "Winter";

/**
 * "sample"   – illustrative content shipped with the template. Must be reviewed
 *              by the organizer before launch. Shown with a visible notice.
 * "verified" – confirmed by the organizer. No notice is shown.
 */
export type DataStatus = "sample" | "verified";

export type Photo = {
  src: string;
  alt: string;
};

export type SocialLink = {
  label: "Instagram" | "YouTube" | "Facebook" | "X" | "LinkedIn";
  url: string;
};

export type TrekDay = {
  day: number;
  title: string;
  route?: string;
  startLocation?: string;
  endLocation?: string;
  description: string;
  distanceKm?: number;
  trekkingHours?: string;
  startAltitudeM?: number;
  endAltitudeM?: number;
  meals?: string[];
  accommodation?: string;
  image?: Photo;
};

export type TrekPackage = {
  id: string;
  name: string;
  summary?: string;
  pricePerPerson?: number;
  inclusions: string[];
  accommodation?: string;
  transportDetails?: string;
  groupSize?: string;
  requirements?: string;
};

export type PackingCategory =
  | "Clothing"
  | "Footwear"
  | "Equipment"
  | "Personal essentials"
  | "Documents";

export type PackingGroup = {
  category: PackingCategory;
  items: string[];
};

export type Faq = {
  question: string;
  answer: string;
};

export type Trek = {
  id: string;
  slug: string;
  name: string;
  state: StateName;
  location: string;
  /** One or two sentence summary for cards and metadata. */
  summary: string;
  /** Longer overview paragraphs for the detail page. */
  description: string[];
  routeSummary?: string;
  startPoint?: string;
  endPoint?: string;
  durationDays: number;
  difficulty: Difficulty;
  difficultyNote?: string;
  fitnessNote?: string;
  /** Starting price per person in INR. Leave undefined until confirmed. */
  pricePerPerson?: number;
  maxAltitudeM?: number;
  distanceKm?: number;
  accommodationType?: string;
  groupSize?: string;
  bestSeasons: Season[];
  /** Human friendly months, e.g. "Dec – Apr". */
  seasonLabel?: string;
  coverImage: Photo;
  gallery: Photo[];
  itinerary: TrekDay[];
  packages: TrekPackage[];
  inclusions: string[];
  exclusions: string[];
  packingList: PackingGroup[];
  faqs: Faq[];
  featured?: boolean;
  status: DataStatus;
  /** SEO title/description/image overrides, set via @payloadcms/plugin-seo in /admin. */
  meta?: SeoMeta;
};

export type SeoMeta = {
  title?: string;
  description?: string;
  image?: Photo;
};
