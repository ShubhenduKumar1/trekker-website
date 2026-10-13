import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { destinations, getDestinationBySlug } from "@/data/destinations";
import { getTreksByState } from "@/lib/treks";
import { pageMetadata } from "@/lib/seo";
import { generalEnquiryMessage } from "@/lib/whatsapp";
import { PageHeader } from "@/components/layout/PageHeader";
import { TrekGrid } from "@/components/treks/TrekGrid";
import { SafeImage } from "@/components/ui/SafeImage";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CtaCard, onAccent } from "@/components/ui/CtaCard";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { btn, arrowNudge } from "@/lib/ui";
import { cn } from "@/lib/format";

export const dynamicParams = false;

export function generateStaticParams() {
  return destinations.map((d) => ({ slug: d.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const d = getDestinationBySlug(slug);
  if (!d) return {};
  return pageMetadata({
    title: `Treks in ${d.state}`,
    description: `${d.intro} Explore guided treks in ${d.state} and enquire on WhatsApp.`,
    path: `/destinations/${d.slug}`,
    image: d.image,
  });
}

export default async function DestinationPage({ params }: Props) {
  const { slug } = await params;
  const d = getDestinationBySlug(slug);
  if (!d) notFound();
  const treks = getTreksByState(d.state);
  const other = destinations.find((x) => x.slug !== d.slug);

  return (
    <>
      <PageHeader eyebrow={d.eyebrow} title={`Trekking in ${d.state}.`} titleMuted={d.tagline} intro={d.intro} image={d.image}>
        <p className="text-sm font-medium text-muted">
          {treks.length === 0 ? "Treks coming soon" : `${treks.length} ${treks.length === 1 ? "trek" : "treks"} in this region`}
        </p>
      </PageHeader>

      <section className="section-y bg-canvas">
        <div className="container-page">
          <Reveal className="card grid gap-2 p-2 lg:grid-cols-2">
            <div className="flex flex-col justify-center px-4 py-8 sm:px-8 lg:px-12">
              <p className="eyebrow text-muted">About the region</p>
              <h2 className="mt-3 font-display text-display-md">
                Why trek in {d.shortName}?
              </h2>
              <div className="mt-5 space-y-4 leading-relaxed text-muted">
                {d.longIntro.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.4rem] bg-canvas">
              <SafeImage src={d.secondaryImage.src} alt={d.secondaryImage.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            </div>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="region-treks" className="section-y">
        <div className="container-page">
          <SectionHeading id="region-treks" eyebrow={`${d.shortName} treks`} title="Choose your trail." titleMuted={`Every trek in ${d.state}.`} />
          <div className="mt-14">
            <TrekGrid treks={treks} />
          </div>
          {treks.length > 0 && (
            <div className="mt-12 flex justify-center">
              <Link href={`/treks?state=${d.slug}`} className={btn.outline}>
                Filter &amp; compare <ArrowRight aria-hidden className={cn("size-4", arrowNudge)} />
              </Link>
            </div>
          )}
        </div>
      </section>

      <CtaCard title="Not sure which trek suits you?" text="Share your experience and dates — we’ll help you choose.">
        <WhatsAppButton message={generalEnquiryMessage()} className={onAccent.solid}>
          Ask on WhatsApp
        </WhatsAppButton>
        {other && (
          <Link href={`/destinations/${other.slug}`} className={onAccent.ghost}>
            Explore {other.shortName}
          </Link>
        )}
      </CtaCard>
    </>
  );
}
