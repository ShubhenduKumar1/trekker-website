"use client";

import { RefreshRouteOnSave as PayloadLivePreview } from "@payloadcms/live-preview-react";
import { useRouter } from "next/navigation";

/**
 * Renders nothing visible. Inside Payload's Live Preview iframe, re-runs
 * this (Server Component) page's data fetch via router.refresh() whenever
 * the document is saved in /admin, so the preview reflects the latest save.
 * Outside the iframe (a normal visit), this is a harmless no-op.
 */
export function RefreshRouteOnSave() {
  const router = useRouter();

  return <PayloadLivePreview refresh={() => router.refresh()} serverURL={typeof window !== "undefined" ? window.location.origin : ""} />;
}
