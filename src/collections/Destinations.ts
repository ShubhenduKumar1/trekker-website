import type { CollectionConfig } from "payload";
import { revalidateOnChange, revalidateOnDelete } from "@/hooks/revalidate";
import { previewUrl } from "@/lib/site-url";

/** Mirrors src/data/destinations.ts. Powers /destinations/[slug]. */
export const Destinations: CollectionConfig = {
  slug: "destinations",
  admin: {
    useAsTitle: "state",
    livePreview: {
      url: ({ data }) => previewUrl(`/destinations/${data.slug}`),
    },
    preview: (data) => previewUrl(`/destinations/${data.slug}`),
  },
  versions: {
    drafts: {
      autosave: { interval: 1000 },
    },
  },
  access: {
    read: ({ req }) => {
      if (req.user) return true;
      return { _status: { equals: "published" } };
    },
  },
  hooks: {
    afterChange: [revalidateOnChange],
    afterDelete: [revalidateOnDelete],
  },
  fields: [
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: { description: 'e.g. "himachal-pradesh" — used in the page URL.' },
    },
    {
      name: "state",
      type: "select",
      required: true,
      options: ["Himachal Pradesh", "Uttarakhand"],
    },
    { name: "shortName", type: "text", required: true },
    { name: "eyebrow", type: "text", required: true },
    { name: "tagline", type: "text", required: true },
    { name: "intro", type: "textarea", required: true },
    {
      name: "longIntro",
      type: "array",
      labels: { singular: "Paragraph", plural: "Paragraphs" },
      fields: [{ name: "text", type: "textarea", required: true }],
    },
    { name: "image", type: "upload", relationTo: "media", required: true },
    { name: "secondaryImage", type: "upload", relationTo: "media", required: true },
  ],
};
