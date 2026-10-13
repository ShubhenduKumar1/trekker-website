import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "./globals.css";
import { getSiteSettings } from "@/lib/site-settings";
import { photos } from "@/data/images";
import { ogImageUrl } from "@/lib/seo";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { MotionProvider } from "@/components/layout/MotionProvider";

// Pages under this layout are rendered with ISR: served from cache, refreshed
// in the background at most this often. Payload's revalidate hooks (see
// src/lib/revalidate.ts) additionally bust this immediately on content changes.
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const title = `${settings.brandName} — Guided Himalayan Treks in Himachal & Uttarakhand`;
  return {
    ...(settings.siteUrl ? { metadataBase: new URL(settings.siteUrl) } : {}),
    title: { default: title, template: `%s · ${settings.brandName}` },
    description: settings.description,
    applicationName: settings.brandName,
    openGraph: {
      siteName: settings.brandName,
      type: "website",
      locale: "en_IN",
      images: [{ url: ogImageUrl(photos.hero.src), width: 1200, height: 630, alt: photos.hero.alt }],
    },
    twitter: { card: "summary_large_image" },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// The actual <html>/<body> root layout is src/app/(payload)/layout.tsx —
// Payload's admin panel needs to own those tags, so this nested layout only
// wraps the frontend route tree and contributes metadata for it.
export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  return (
    <>
      {/* React 19 hoists this to <head> on its own, even rendered from a nested layout. */}
      <head>
        {/* Without JavaScript, scroll-reveal content must still be visible. */}
        <noscript>
          <style>{`[style*="opacity:0"]{opacity:1!important;transform:none!important;clip-path:none!important;filter:none!important}`}</style>
        </noscript>
      </head>
      <MotionProvider>
        <Navbar wordmark={{ logoSrc: settings.logoSrc, brandName: settings.brandName, wordmark: settings.wordmark }} />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer />
        <FloatingWhatsApp whatsappNumber={settings.whatsappNumber} />
      </MotionProvider>
    </>
  );
}
