import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { photos } from "@/data/images";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/layout/PageHeader";
import { GuideSection } from "@/components/home/GuideSection";
import { WhyUs } from "@/components/home/WhyUs";
import { CtaCard, onAccent } from "@/components/ui/CtaCard";

export const metadata = pageMetadata({
  title: siteConfig.guide.name ? `About ${siteConfig.guide.name}` : "About Your Guide",
  description: `Meet the guide behind ${siteConfig.brandName} and learn how treks in Himachal Pradesh and Uttarakhand are planned.`,
  path: "/about",
  image: photos.sunriseRidge,
});

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="Personal, guide-led trekking."
        titleMuted="In the heart of the Himalaya."
        intro={`${siteConfig.brandName} is an independent trekking outfit planning small-group treks across Himachal Pradesh and Uttarakhand.`}
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
