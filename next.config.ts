import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  images: {
    // Remote photos are served through a custom loader (src/lib/image-loader.ts)
    // that requests correctly sized, modern-format images straight from the CDN.
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
