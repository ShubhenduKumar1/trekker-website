import type { Photo, StateName } from "@/types/trek";
import { photos } from "@/data/images";

export type Destination = {
  slug: "himachal-pradesh" | "uttarakhand";
  state: StateName;
  shortName: string;
  eyebrow: string;
  /** Short second line for headings. */
  tagline: string;
  intro: string;
  longIntro: string[];
  image: Photo;
  secondaryImage: Photo;
};

export const destinations: Destination[] = [
  {
    slug: "himachal-pradesh",
    state: "Himachal Pradesh",
    shortName: "Himachal",
    eyebrow: "Valleys, passes & alpine lakes",
    tagline: "From cedar forests to high passes.",
    intro:
      "From cedar forests above Dharamshala to the high passes between Kullu and Lahaul, Himachal’s trails move from green valleys to stark mountain desert.",
    longIntro: [
      "Himachal Pradesh is home to some of India’s most varied trekking. In a single trek you can walk from apple orchards and deodar forest into high meadows, glacial streams and wind-carved passes.",
      "Treks here range from short weekend ridge walks to multi-day crossovers that connect completely different landscapes.",
    ],
    image: photos.himachalValley,
    secondaryImage: photos.riverValley,
  },
  {
    slug: "uttarakhand",
    state: "Uttarakhand",
    shortName: "Uttarakhand",
    eyebrow: "Meadows, ridges & winter summits",
    tagline: "Meadows, ridges and winter summits.",
    intro:
      "Uttarakhand’s Garhwal and Kumaon regions offer rolling bugyals, forested ridges and some of the country’s most loved winter treks.",
    longIntro: [
      "Uttarakhand’s high meadows — called bugyals — are among the most beautiful in the Himalaya, green in summer and deep in snow in winter.",
      "Many treks start from small mountain villages and climb through oak and rhododendron forest to campsites with wide views of the Garhwal peaks.",
    ],
    image: photos.cloudHillside,
    secondaryImage: photos.snowSummitGroup,
  },
];

export const getDestinationBySlug = (slug: string) => destinations.find((d) => d.slug === slug);
export const getDestinationByState = (state: StateName) => destinations.find((d) => d.state === state)!;
