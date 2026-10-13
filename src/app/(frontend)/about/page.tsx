import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getSiteSettings } from "@/lib/site-settings";
import { photos } from "@/data/images";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/layout/PageHeader";
import { GuideSection } from "@/components/home/GuideSection";
import { WhyUs } from "@/components/home/WhyUs";
import { CtaCard, onAccent } from "@/components/ui/CtaCard";

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return pageMetadata({
    title: settings.guide.name ? `About ${settings.guide.name}` : "About Your Guide",
    description: `Meet the guide behind ${settings.brandName} and learn how treks in Himachal Pradesh and Uttarakhand are planned.`,
    path: "/about",
    image: photos.sunriseRidge,
    siteUrl: settings.siteUrl,
    brandName: settings.brandName,
  });
}

export default async function AboutPage() {
  const settings = await getSiteSettings();
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="Personal, guide-led trekking."
        titleMuted="In the heart of the Himalaya."
        intro={`${settings.brandName} is an independent trekking outfit planning small-group treks across Himachal Pradesh and Uttarakhand.`}
        image={photos.sunriseRidge}
      />
      <GuideSection showAboutLink={false} />
      <WhyUs />
      <CtaCard title="Ready to find your trail?" text="Browse every trek, or tell us what you’re looking for.">
        <Link href="/treks" className={onAccent.solid}>
          Explore treks <ArrowRight aria-hidden className="size-4" />
        </Link>
        <Link href="/contact" className={onAccent.ghost}>
          Contact
        </Link>
      </CtaCard>
    </>
  );
}
