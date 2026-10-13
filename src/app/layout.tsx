import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { photos } from "@/data/images";
import { ogImageUrl } from "@/lib/seo";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { MotionProvider } from "@/components/layout/MotionProvider";

export const metadata: Metadata = {
  ...(siteConfig.siteUrl ? { metadataBase: new URL(siteConfig.siteUrl) } : {}),
  title: {
    default: `${siteConfig.brandName} — Guided Himalayan Treks in Himachal & Uttarakhand`,
    template: `%s · ${siteConfig.brandName}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.brandName,
  openGraph: {
    siteName: siteConfig.brandName,
    type: "website",
    locale: "en_IN",
    images: [{ url: ogImageUrl(photos.hero.src), width: 1200, height: 630, alt: photos.hero.alt }],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN">
      <head>
        {/* Without JavaScript, scroll-reveal content must still be visible. */}
        <noscript>
          <style>{`[style*="opacity:0"]{opacity:1!important;transform:none!important;clip-path:none!important;filter:none!important}`}</style>
        </noscript>
      </head>
      <body>
        <MotionProvider>
          <Navbar />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
          <FloatingWhatsApp />
        </MotionProvider>
      </body>
    </html>
  );
}
