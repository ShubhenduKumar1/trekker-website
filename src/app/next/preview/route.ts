import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

/**
 * Enables Next.js Draft Mode (sets the __prerender_bypass cookie), then
 * redirects into the actual page. Treks/Destinations' admin.livePreview.url
 * and admin.preview point here instead of straight at the page, so the
 * Live Preview iframe (and the "Preview" button) can see unpublished drafts
 * and autosaved edits — without this, they'd always show the last-published
 * version, same as any public visitor.
 *
 * Gated by PREVIEW_SECRET so Draft Mode can't be enabled by just guessing
 * a URL; only /admin's generated preview links carry the right secret.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const secret = searchParams.get("secret");
  const path = searchParams.get("path");

  if (!process.env.PREVIEW_SECRET || secret !== process.env.PREVIEW_SECRET) {
    return new Response("Invalid preview secret", { status: 401 });
  }
  if (!path || !path.startsWith("/")) {
    return new Response("Missing or invalid path", { status: 400 });
  }

  const draft = await draftMode();
  draft.enable();

  redirect(path);
}
