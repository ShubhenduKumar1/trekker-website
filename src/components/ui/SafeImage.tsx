"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { MountainSnow } from "lucide-react";
import { cn } from "@/lib/format";

type SafeImageProps = Omit<ImageProps, "src" | "alt"> & {
  src?: string | null;
  alt: string;
  /** Classes for the fallback panel (defaults fill the parent). */
  fallbackClassName?: string;
};

/**
 * next/image with a graceful fallback: if the photo is missing or fails to
 * load, a quiet panel is shown instead of a broken-image icon.
 */
export function SafeImage({ src, alt, className, fallbackClassName, ...props }: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn(
          "absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#dfe7f5] via-[#e9eef3] to-[#dcebe3] text-ink/25",
          fallbackClassName,
        )}
      >
        <MountainSnow aria-hidden className="size-9" strokeWidth={1.25} />
      </div>
    );
  }

  return <Image src={src} alt={alt} className={className} onError={() => setFailed(true)} {...props} />;
}
