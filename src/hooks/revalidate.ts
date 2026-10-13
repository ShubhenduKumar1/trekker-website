import { revalidatePath } from "next/cache";
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from "payload";

/**
 * Busts the whole frontend's ISR cache (see `revalidate` in
 * (frontend)/layout.tsx) whenever content changes in /admin, so edits show
 * up immediately instead of waiting out the revalidate window. Revalidating
 * broadly rather than per-path is deliberately simple for a site this size.
 *
 * revalidatePath only works inside an active Next.js request (it needs the
 * static generation store next.js sets up per-request) — it throws when
 * Payload runs standalone, e.g. from a script via the Local API outside
 * Next's server. Since these hooks run inside the same DB transaction as the
 * write, an uncaught throw here would roll the write back, so this is
 * swallowed rather than left to crash unrelated scripts.
 */
function bustCache() {
  try {
    revalidatePath("/", "layout");
  } catch {
    // No active Next.js request (e.g. a standalone script) — nothing to bust.
  }
}

export const revalidateOnChange: CollectionAfterChangeHook = () => {
  bustCache();
};

export const revalidateOnDelete: CollectionAfterDeleteHook = () => {
  bustCache();
};

export const revalidateGlobalOnChange: GlobalAfterChangeHook = () => {
  bustCache();
};
