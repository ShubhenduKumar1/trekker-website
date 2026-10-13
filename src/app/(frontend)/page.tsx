import { getAllTreks, getFeaturedTreks, getTrekBySlug, getTreksByState } from "@/lib/treks";
import { getGalleryItems } from "@/lib/gallery";
import { getDestinations } from "@/lib/destinations";
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
import { getSiteSettings } from "@/lib/site-settings";
import { photos } from "@/data/images";

export async function generateMetadata() {
  const settings = await getSiteSettings();
  const homeTitle = `${settings.brandName} — Guided Himalayan Treks in Himachal & Uttarakhand`;
  return {
    ...pageMetadata({
      title: homeTitle,
      description: settings.description,
      path: "/",
      image: photos.hero,
      siteUrl: settings.siteUrl,
      brandName: settings.brandName,
    }),
    title: { absolute: homeTitle },
  };
}

export default async function HomePage() {
  const [settings, featured, allTreks, destinations, gallery] = await Promise.all([
    getSiteSettings(),
    getFeaturedTreks(6),
    getAllTreks(),
    getDestinations(),
    getGalleryItems(),
  ]);
  const heroTrek = (await getTrekBySlug(settings.heroTrekSlug)) ?? featured[0];
  const regions = await Promise.all(
    destinations.map(async (d) => ({ slug: d.slug, name: d.state, count: (await getTreksByState(d.state)).length })),
  );

  return (
    <>
      <Hero featured={heroTrek} regions={regions} whatsappNumber={settings.whatsappNumber} />
      <HowItWorks treks={allTreks} featured={heroTrek} />
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
