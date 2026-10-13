import type { CollectionConfig } from "payload";
import { revalidateOnChange, revalidateOnDelete } from "@/hooks/revalidate";

/**
 * Mirrors src/data/testimonials.ts. Real customer feedback only — the
 * testimonials section on the homepage stays hidden while this is empty.
 */
export const Testimonials: CollectionConfig = {
  slug: "testimonials",
  admin: {
    useAsTitle: "name",
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateOnChange],
    afterDelete: [revalidateOnDelete],
  },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "trek", type: "text" },
    { name: "quote", type: "textarea", required: true },
    { name: "date", type: "text", admin: { description: 'e.g. "Dec 2025"' } },
  ],
};
