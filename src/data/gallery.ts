import type { Photo } from "@/types/trek";
import { photos } from "@/data/images";

export type GalleryItem = Photo & { caption: string; shape: "tall" | "wide" | "square" };

export const gallery: GalleryItem[] = [
  { ...photos.sunriseRidge, caption: "First light on the ridge", shape: "wide" },
  { ...photos.hikerSnowPeaks, caption: "A pause above the snowline", shape: "tall" },
  { ...photos.tentSnow, caption: "Camp in the forest", shape: "square" },
  { ...photos.forestRiver, caption: "Forest trails and cold streams", shape: "square" },
  { ...photos.snowClimb, caption: "One step at a time", shape: "tall" },
  { ...photos.summitView, caption: "Peaks beyond peaks", shape: "wide" },
  { ...photos.twoWalkers, caption: "Above the clouds", shape: "square" },
  { ...photos.tentForest, caption: "Valleys under big skies", shape: "square" },
];
