import type { CollectionConfig } from "payload";
import { revalidateOnChange, revalidateOnDelete } from "@/hooks/revalidate";

/** Mirrors src/data/gallery.ts. Powers the homepage photo gallery. */
export const GalleryItems: CollectionConfig = {
  slug: "gallery-items",
  labels: { singular: "Gallery Item", plural: "Gallery Items" },
  admin: {
    useAsTitle: "caption",
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateOnChange],
    afterDelete: [revalidateOnDelete],
  },
  fields: [
    { name: "image", type: "upload", relationTo: "media", required: true },
    { name: "caption", type: "text", required: true },
    {
      name: "shape",
      type: "select",
      required: true,
      defaultValue: "square",
      options: ["tall", "wide", "square"],
    },
    {
      name: "order",
      type: "number",
      admin: { description: "Lower numbers show first in the gallery." },
    },
  ],
  defaultSort: "order",
};
