import type { CollectionConfig } from "payload";

/**
 * Uploaded images (trek covers, gallery photos, guide portrait, logo, …).
 * Replaces the Unsplash stock placeholders in src/data/images.ts.
 * Storage is local disk in dev; in production the Vercel Blob plugin in
 * payload.config.ts takes over when BLOB_READ_WRITE_TOKEN is set.
 */
export const Media: CollectionConfig = {
  slug: "media",
  access: {
    read: () => true,
  },
  upload: {
    staticDir: "media",
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      admin: {
        description: "Describes the image for screen readers and SEO.",
      },
    },
  ],
};
