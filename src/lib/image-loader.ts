type LoaderArgs = { src: string; width: number; quality?: number };

/**
 * next/image loader.
 * - Unsplash: request a correctly sized, auto-format (AVIF/WebP) image from the CDN.
 * - Anything else (files in /public, other hosts): served as-is; the width param
 *   is appended so each srcset candidate stays unique.
 */
export default function imageLoader({ src, width, quality }: LoaderArgs): string {
  if (src.startsWith("https://images.unsplash.com/")) {
    const url = new URL(src);
    url.searchParams.set("w", String(width));
    url.searchParams.set("q", String(quality ?? 72));
    url.searchParams.set("auto", "format");
    url.searchParams.set("fit", "crop");
    return url.toString();
  }
  const sep = src.includes("?") ? "&" : "?";
  return `${src}${sep}w=${width}`;
}
