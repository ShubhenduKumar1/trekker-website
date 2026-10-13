import { cache } from "react";
import { getPayloadClient } from "@/lib/payload-client";

export type Redirect = { to: string; permanent: boolean };

/**
 * Looks up an admin-managed redirect (see @payloadcms/plugin-redirects in
 * payload.config.ts) for an exact path, e.g. "/treks/old-slug". Used right
 * before notFound() in the dynamic trek/destination pages, so renaming a
 * slug in /admin doesn't have to leave a dead link.
 */
export const getRedirectFor = cache(async (path: string): Promise<Redirect | null> => {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({ collection: "redirects", where: { from: { equals: path } }, limit: 1 });
  const found = docs[0] as
    | {
        type?: "301" | "302";
        to?: { type?: "reference" | "custom"; url?: string; reference?: { relationTo?: string; value?: unknown } };
      }
    | undefined;
  if (!found) return null;

  const permanent = found.type === "301";

  if (found.to?.type === "custom" && found.to.url) {
    return { to: found.to.url, permanent };
  }

  const ref = found.to?.reference;
  const value = ref?.value;
  if (value && typeof value === "object" && "slug" in value) {
    const slug = (value as { slug: string }).slug;
    if (ref.relationTo === "treks") return { to: `/treks/${slug}`, permanent };
    if (ref.relationTo === "destinations") return { to: `/destinations/${slug}`, permanent };
  }
  return null;
});
