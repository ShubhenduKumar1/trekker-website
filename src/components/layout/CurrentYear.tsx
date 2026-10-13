"use client";

/** Renders the visitor's current year (stays correct on statically built pages). */
export function CurrentYear() {
  return <span suppressHydrationWarning>{new Date().getFullYear()}</span>;
}
