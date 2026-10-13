import type { CollectionConfig } from "payload";
import { revalidateOnChange, revalidateOnDelete } from "@/hooks/revalidate";

/** Mirrors src/data/faqs.ts (generalFaqs). Shown on the homepage FAQ section. */
export const Faqs: CollectionConfig = {
  slug: "faqs",
  admin: {
    useAsTitle: "question",
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateOnChange],
    afterDelete: [revalidateOnDelete],
  },
  fields: [
    { name: "question", type: "text", required: true },
    { name: "answer", type: "textarea", required: true },
    {
      name: "order",
      type: "number",
      admin: { description: "Lower numbers show first on the homepage." },
    },
  ],
  defaultSort: "order",
};
