import type { CollectionConfig } from "payload";

/** Admin login. Your admin signs in at /admin with an account from this collection. */
export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: {
    useAsTitle: "email",
  },
  fields: [],
};
