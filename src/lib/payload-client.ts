import { cache } from "react";
import { getPayload } from "payload";
import config from "@/payload.config";

/**
 * Shared Payload instance for Server Components, memoized per request with
 * React's cache() so multiple components on the same page share one client
 * instead of each re-initializing Payload.
 */
export const getPayloadClient = cache(async () => getPayload({ config }));
