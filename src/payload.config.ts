import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Treks } from "./collections/Treks";
import { Destinations } from "./collections/Destinations";
import { Testimonials } from "./collections/Testimonials";
import { Faqs } from "./collections/Faqs";
import { GalleryItems } from "./collections/GalleryItems";
import { SiteSettings } from "./globals/SiteSettings";

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
  ],
});
