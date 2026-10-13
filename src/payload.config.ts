import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import { seoPlugin } from "@payloadcms/plugin-seo";
import { redirectsPlugin } from "@payloadcms/plugin-redirects";
import { importExportPlugin } from "@payloadcms/plugin-import-export";
import { searchPlugin } from "@payloadcms/plugin-search";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Treks } from "./collections/Treks";
import { Destinations } from "./collections/Destinations";
import { Testimonials } from "./collections/Testimonials";
import { Faqs } from "./collections/Faqs";
import { GalleryItems } from "./collections/GalleryItems";
import { SiteSettings } from "./globals/SiteSettings";
import { generateSeoDescription, generateSeoImage, generateSeoTitle, generateSeoURL } from "./lib/seo-plugin-config";
import { revalidateOnChange, revalidateOnDelete } from "./hooks/revalidate";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
  },
  collections: [Users, Media, Treks, Destinations, Testimonials, Faqs, GalleryItems],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  // Required in production. Generate one with `npx payload secret` and set
  // PAYLOAD_SECRET in .env.local / your hosting provider.
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || "",
    },
  }),
  sharp,
  plugins: [
    // Uses Vercel Blob for uploads once BLOB_READ_WRITE_TOKEN is set (needed
    // in production — serverless filesystems don't persist files). Without
    // it, uploads fall back to local disk (fine for local development only).
    ...(process.env.BLOB_READ_WRITE_TOKEN
      ? [
          vercelBlobStorage({
            enabled: true,
            collections: { media: true },
            token: process.env.BLOB_READ_WRITE_TOKEN,
          }),
        ]
      : []),

    // Per-page meta title/description/image overrides, editable in /admin.
    // Wired into pageMetadata() via Trek.meta / Destination.meta — falls
    // back to the auto-generated title/description when left blank.
    seoPlugin({
      collections: ["treks", "destinations"],
      uploadsCollection: "media",
      tabbedUI: true,
      generateTitle: generateSeoTitle,
      generateDescription: generateSeoDescription,
      generateImage: generateSeoImage,
      generateURL: generateSeoURL,
      interfaceName: "SEOMeta",
    }),

    // Lets your admin manage URL redirects (e.g. after renaming a trek
    // slug) without a code change — see src/lib/redirects.ts for how the
    // frontend checks these before showing a 404.
    redirectsPlugin({
      collections: ["treks", "destinations"],
      redirectTypes: ["301", "302"],
      overrides: {
        hooks: {
          afterChange: [revalidateOnChange],
          afterDelete: [revalidateOnDelete],
        },
      },
    }),

    // Bulk CSV/JSON export & import for any collection, from its list view
    // in /admin. Useful for editing many treks at once in a spreadsheet.
    importExportPlugin({
      collections: [{ slug: "treks" }, { slug: "destinations" }, { slug: "faqs" }, { slug: "testimonials" }, { slug: "gallery-items" }],
    }),

    // Admin-only: a synced, indexed search collection so /admin's search
    // covers trek and destination content, not just titles. Doesn't affect
    // the frontend (src/lib/filters.ts already handles visitor-facing search
    // over the small catalog).
    searchPlugin({
      collections: ["treks", "destinations"],
      searchOverrides: {
        fields: ({ defaultFields }) => [
          ...defaultFields,
          { name: "excerpt", type: "textarea", admin: { position: "sidebar" } },
        ],
      },
      beforeSync: ({ originalDoc, searchDoc }) => ({
        ...searchDoc,
        excerpt: originalDoc?.summary ?? originalDoc?.intro ?? "",
      }),
    }),
  ],
});
