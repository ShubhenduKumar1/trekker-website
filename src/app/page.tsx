import { getAllTreks, getFeaturedTreks, getTrekBySlug, getTreksByState } from "@/lib/treks";
import { gallery } from "@/data/gallery";
import { destinations } from "@/data/destinations";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { FeaturedTreks } from "@/components/home/FeaturedTreks";
import { DestinationsSection } from "@/components/home/DestinationsSection";
import { WhyUs } from "@/components/home/WhyUs";
import { GuideSection } from "@/components/home/GuideSection";
import { Gallery } from "@/components/home/Gallery";
import { Testimonials } from "@/components/home/Testimonials";
import { FaqSection } from "@/components/home/FaqSection";
import { FinalCta } from "@/components/home/FinalCta";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";
import { photos } from "@/data/images";

const homeTitle = `${siteConfig.brandName} — Guided Himalayan Treks in Himachal & Uttarakhand`;

export const metadata = {
  ...pageMetadata({ title: homeTitle, description: siteConfig.description, path: "/", image: photos.hero }),
  title: { absolute: homeTitle },
};

export default function HomePage() {
  const featured = getFeaturedTreks(6);
  const heroTrek = getTrekBySlug(siteConfig.heroTrekSlug) ?? featured[0];
  const regions = destinations.map((d) => ({ slug: d.slug, name: d.state, count: getTreksByState(d.state).length }));

  return (
    <>
      <Hero featured={heroTrek} regions={regions} />
      <HowItWorks treks={getAllTreks()} featured={heroTrek} />
      <FeaturedTreks treks={featured} />
      <DestinationsSection />
      <WhyUs />
      <GuideSection />
      <Gallery items={gallery} />
      <Testimonials />
      <FaqSection />
      <FinalCta />
    </>
  );
}
