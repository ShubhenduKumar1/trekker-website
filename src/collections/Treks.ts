import type { CollectionConfig } from "payload";
import { revalidateOnChange, revalidateOnDelete } from "@/hooks/revalidate";

/** Mirrors src/types/trek.ts (Trek) and src/data/treks.ts. */
export const Treks: CollectionConfig = {
  slug: "treks",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "state", "difficulty", "status"],
  },
  access: {
    read: () => true,
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
      admin: { description: "Used in the page URL, e.g. /treks/kedarkantha-trek" },
    },
    { name: "name", type: "text", required: true },
    { name: "state", type: "select", required: true, options: ["Himachal Pradesh", "Uttarakhand"] },
    { name: "location", type: "text", required: true },
    {
      name: "summary",
      type: "textarea",
      required: true,
      admin: { description: "One or two sentences, used on cards and metadata." },
    },
    {
      name: "description",
      type: "array",
      labels: { singular: "Paragraph", plural: "Paragraphs" },
      fields: [{ name: "text", type: "textarea", required: true }],
      admin: { description: "Longer overview paragraphs for the trek detail page." },
    },
    { name: "routeSummary", type: "textarea" },
    { name: "startPoint", type: "text" },
    { name: "endPoint", type: "text" },
    { name: "durationDays", type: "number", required: true, min: 1 },
    { name: "difficulty", type: "select", required: true, options: ["Easy", "Moderate", "Difficult"] },
    { name: "difficultyNote", type: "textarea" },
    { name: "fitnessNote", type: "textarea" },
    {
      name: "pricePerPerson",
      type: "number",
      admin: { description: "In INR. Leave empty to show \"Contact us for pricing\"." },
    },
    { name: "maxAltitudeM", type: "number" },
    { name: "distanceKm", type: "number" },
    { name: "accommodationType", type: "text" },
    { name: "groupSize", type: "text" },
    {
      name: "bestSeasons",
      type: "select",
      hasMany: true,
      required: true,
      options: ["Spring", "Summer", "Monsoon", "Autumn", "Winter"],
    },
    { name: "seasonLabel", type: "text", admin: { description: 'e.g. "Dec – Apr"' } },
    { name: "coverImage", type: "upload", relationTo: "media", required: true },
    {
      name: "gallery",
      type: "array",
      fields: [{ name: "image", type: "upload", relationTo: "media", required: true }],
    },
    {
      name: "itinerary",
      type: "array",
      labels: { singular: "Day", plural: "Days" },
      fields: [
        { name: "day", type: "number", required: true },
        { name: "title", type: "text", required: true },
        { name: "route", type: "text" },
        { name: "startLocation", type: "text" },
        { name: "endLocation", type: "text" },
        { name: "description", type: "textarea", required: true },
        { name: "distanceKm", type: "number" },
        { name: "trekkingHours", type: "text" },
        { name: "startAltitudeM", type: "number" },
        { name: "endAltitudeM", type: "number" },
        {
          name: "meals",
          type: "array",
          fields: [{ name: "value", type: "text", required: true }],
        },
        { name: "accommodation", type: "text" },
        { name: "image", type: "upload", relationTo: "media" },
      ],
    },
    {
      name: "packages",
      type: "array",
      fields: [
        { name: "name", type: "text", required: true },
        { name: "summary", type: "textarea" },
        { name: "pricePerPerson", type: "number" },
        {
          name: "inclusions",
          type: "array",
          fields: [{ name: "value", type: "text", required: true }],
        },
        { name: "accommodation", type: "text" },
        { name: "transportDetails", type: "text" },
        { name: "groupSize", type: "text" },
        { name: "requirements", type: "text" },
      ],
    },
    {
      name: "inclusions",
      type: "array",
      fields: [{ name: "value", type: "text", required: true }],
    },
    {
      name: "exclusions",
      type: "array",
      fields: [{ name: "value", type: "text", required: true }],
    },
    {
      name: "packingList",
      type: "array",
      labels: { singular: "Packing group", plural: "Packing groups" },
      fields: [
        {
          name: "category",
          type: "select",
          required: true,
          options: ["Clothing", "Footwear", "Equipment", "Personal essentials", "Documents"],
        },
        {
          name: "items",
          type: "array",
          fields: [{ name: "value", type: "text", required: true }],
        },
      ],
    },
    {
      name: "faqs",
      type: "array",
      fields: [
        { name: "question", type: "text", required: true },
        { name: "answer", type: "textarea", required: true },
      ],
    },
    { name: "featured", type: "checkbox", defaultValue: false },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "sample",
      options: ["sample", "verified"],
      admin: {
        description:
          '"sample" shows a visible "Sample itinerary" notice on the trek page until you switch it to "verified".',
      },
    },
  ],
};
