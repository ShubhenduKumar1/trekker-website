/**
 * Split out of src/config/site.ts so client components can keep importing a
 * trivial, build-time-inlined flag without pulling in anything Payload-related.
 */
export const isDev = process.env.NODE_ENV !== "production";
