import type { GlobalConfig } from "payload";
import { revalidateGlobalOnChange } from "@/hooks/revalidate";

/**
 * Brand, contact and guide-profile details, editable in /admin instead of
 * in code (this used to be src/config/site.ts, now removed).
 */
export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateGlobalOnChange],
  },
  fields: [
    { name: "brandName", type: "text", required: true },
    {
      name: "wordmark",
      type: "group",
      fields: [
        { name: "primary", type: "text", required: true },
        { name: "secondary", type: "text", required: true },
      ],
    },
    { name: "logo", type: "upload", relationTo: "media" },
    { name: "tagline", type: "text", required: true },
    { name: "description", type: "textarea", required: true },
    {
      name: "whatsappNumber",
      type: "text",
      admin: {
        description:
          "International digits only, country code + number, no +, spaces or dashes. e.g. 919870385567",
      },
    },
    { name: "email", type: "text" },
    { name: "phoneDisplay", type: "text", admin: { description: 'Shown as text, e.g. "+91 98703 85567"' } },
    { name: "baseLocation", type: "text" },
    {
      name: "heroTrekSlug",
      type: "relationship",
      relationTo: "treks",
      admin: { description: "Trek highlighted in the homepage hero panel." },
    },
    {
      name: "social",
      type: "array",
      fields: [
        {
          name: "label",
          type: "select",
          required: true,
          options: ["Instagram", "YouTube", "Facebook", "X", "LinkedIn"],
        },
        { name: "url", type: "text", required: true },
      ],
    },
    {
      name: "guide",
      type: "group",
      fields: [
        { name: "name", type: "text" },
        { name: "portrait", type: "upload", relationTo: "media" },
        {
          name: "intro",
          type: "array",
          labels: { singular: "Paragraph", plural: "Paragraphs" },
          fields: [{ name: "text", type: "textarea", required: true }],
        },
        { name: "whyTrekking", type: "textarea" },
        { name: "philosophy", type: "textarea" },
        {
          name: "credentials",
          type: "array",
          fields: [{ name: "value", type: "text", required: true }],
        },
      ],
    },
    {
      name: "policies",
      type: "group",
      fields: [
        {
          name: "terms",
          type: "array",
          fields: [{ name: "text", type: "textarea", required: true }],
        },
        {
          name: "cancellation",
          type: "array",
          fields: [{ name: "text", type: "textarea", required: true }],
        },
        { name: "emergencyContact", type: "text" },
      ],
    },
  ],
};
