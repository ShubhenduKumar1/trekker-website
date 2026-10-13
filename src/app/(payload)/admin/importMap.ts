// Payload's dev server regenerates this map as a sibling importMap.js on
// every start (gitignored). This .ts file is the one actually imported by
// the admin routes — keep it in sync if the generated .js content changes
// (e.g. after adding custom admin UI components).
import { CollectionCards as CollectionCards_f9c02e79a4aed9a3924487c0cd4cafb1 } from "@payloadcms/next/rsc";

export const importMap = {
  "@payloadcms/next/rsc#CollectionCards": CollectionCards_f9c02e79a4aed9a3924487c0cd4cafb1,
};
