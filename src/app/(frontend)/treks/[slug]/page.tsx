import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BedDouble,
  CalendarDays,
  Check,
  Clock,
  Flag,
  Footprints,
  Gauge,
  Info,
  MapPin,
  Minus,
  Mountain,
  Route,
  Tag,
  Users,
} from "lucide-react";
import type { Trek } from "@/types/trek";
import { getAllTreks, getRelatedTreks, getStartingPrice, getTrekBySlug } from "@/lib/treks";
import { getDestinationByState } from "@/data/destinations";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import { formatAltitude, formatDistance, formatDuration, formatPrice, PRICE_FALLBACK, cn } from "@/lib/format";
import { siteConfig } from "@/config/site";
import { btn } from "@/lib/ui";
import { SafeImage } from "@/components/ui/SafeImage";
import { Reveal } from "@/components/ui/Reveal";
import { DifficultyMeter } from "@/components/treks/DifficultyMeter";
import { TrekGrid } from "@/components/treks/TrekGrid";
import { Itinerary } from "@/components/itinerary/Itinerary";
import { BookingProvider } from "@/components/booking/BookingContext";
import { BookingPanel } from "@/components/booking/BookingPanel";
import { BookingForm, MessagePreview } from "@/components/booking/BookingForm";
import { EnquireButton } from "@/components/booking/EnquireButton";
import { MobileBookingBar } from "@/components/booking/MobileBookingBar";
import { PackageSelector } from "@/components/booking/PackageSelector";
import { PackingList } from "@/components/trek/PackingList";
import { FaqList } from "@/components/trek/FaqList";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllTreks().map((t) => ({ slug: t.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const trek = getTrekBySlug(slug);
  if (!trek) return { title: "Trek not found" };
  return pageMetadata({
    title: `${trek.name} — ${trek.state}`,
    description: `${trek.summary} ${formatDuration(trek.durationDays)}, ${trek.difficulty.toLowerCase()} difficulty. View the itinerary and enquire on WhatsApp.`,
    path: `/treks/${trek.slug}`,
    image: trek.coverImage,
  });
}

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "itinerary", label: "Itinerary" },
  { id: "package", label: "Package & pricing" },
  { id: "packing", label: "Packing list" },
  { id: "safety", label: "Safety" },
  { id: "faq", label: "FAQ" },
];

export default async function TrekPage({ params }: Props) {
  const { slug } = await params;
  const trek = getTrekBySlug(slug);
  if (!trek) notFound();

  const destination = getDestinationByState(trek.state);
  const price = formatPrice(getStartingPrice(trek));
  const altitude = formatAltitude(trek.maxAltitudeM);
  const related = getRelatedTreks(trek);
  const sections = SECTIONS.filter((s) => s.id !== "packing" || trek.packingList.length > 0).filter(
    (s) => s.id !== "faq" || trek.faqs.length > 0,
  );

  return (
    <BookingProvider trek={trek}>
      <BreadcrumbJsonLd trek={trek} />

      {/* ── A. Hero ─────────────────────────────────────────────────────── */}
      <section aria-labelledby="trek-title" className="relative isolate overflow-hidden pt-32 sm:pt-40">
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 -z-10 h-[50%] bg-[radial-gradient(60%_80%_at_15%_100%,#c7d7ff_0%,transparent_70%),radial-gradient(60%_80%_at_85%_100%,#c8efe0_0%,transparent_70%)]"
        />
        <div className="container-narrow text-center">
          <nav aria-label="Breadcrumb" className="rise text-sm text-muted">
            <ol className="flex flex-wrap items-center justify-center gap-2">
              <li>
                <Link href="/treks" className="inline-flex items-center gap-1.5 hover:text-ink">
                  <ArrowLeft aria-hidden className="size-4" /> All treks
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href={`/destinations/${destination.slug}`} className="hover:text-ink">
                  {trek.state}
                </Link>
              </li>
            </ol>
          </nav>
          <h1 id="trek-title" className="rise mx-auto mt-6 max-w-4xl font-display text-display-xl break-words" style={{ ["--d" as string]: "80ms" }}>
            {trek.name}
            <br />
            <span className="text-ink/45">{trek.location}</span>
          </h1>
          <p className="rise mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-[1.0625rem]" style={{ ["--d" as string]: "160ms" }}>
            {trek.summary}
          </p>
          <dl className="rise mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-2" style={{ ["--d" as string]: "240ms" }}>
            <HeroStat label="Duration" value={formatDuration(trek.durationDays)} />
            <HeroStat label="Difficulty" value={<DifficultyMeter difficulty={trek.difficulty} />} />
            <HeroStat label="From" value={price ? `${price} / person` : PRICE_FALLBACK} />
            {altitude && <HeroStat label="Max altitude" value={altitude} />}
          </dl>
          <div className="rise mt-8 flex flex-col justify-center gap-3 sm:flex-row" style={{ ["--d" as string]: "300ms" }}>
            <EnquireButton className={cn(btn.primary, "px-7")} />
            <a href="#itinerary" className={cn(btn.secondary, "px-7")}>
              View itinerary
            </a>
          </div>
        </div>
        <div className="container-page mt-12 pb-12 sm:mt-14 sm:pb-16">
          <div className="rise rounded-[2rem] border border-white/60 bg-white/60 p-2 shadow-[0_40px_80px_-40px_rgb(15_23_42/0.45)] backdrop-blur" style={{ ["--d" as string]: "360ms" }}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.6rem] bg-canvas sm:aspect-[21/9]">
              <SafeImage src={trek.coverImage.src} alt={trek.coverImage.alt} fill priority fetchPriority="high" sizes="(min-width: 1200px) 1150px, 100vw" className="object-cover" />
              <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-ink backdrop-blur">
                <MapPin aria-hidden className="size-3.5 text-accent" /> {trek.state}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Section navigation */}
      <nav aria-label="On this page" className="sticky top-[4.6rem] z-20 px-3">
        <ul className="mx-auto flex w-fit max-w-full gap-1 overflow-x-auto rounded-full border border-line/70 bg-white/85 p-1 backdrop-blur-xl [scrollbar-width:none]">
          {sections.map((s) => (
            <li key={s.id} className="shrink-0">
              <a href={`#${s.id}`} className="inline-flex min-h-9 items-center rounded-full px-4 text-sm font-medium text-ink/65 hover:bg-black/5 hover:text-ink">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="pb-28 lg:pb-24">
        <div className="container-page grid gap-12 pt-12 lg:grid-cols-12 lg:gap-14 lg:pt-16">
          <div className="min-w-0 space-y-20 lg:col-span-8 lg:space-y-24">
            {trek.status === "sample" && (
              <p role="note" className="flex gap-3 rounded-2xl border border-moderate/30 bg-tint-sand p-4 text-sm leading-relaxed text-ink">
                <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-moderate" />
                <span>
                  <strong className="font-semibold">Sample itinerary.</strong> The route and details on this page are an
                  illustrative outline and haven’t been confirmed yet. Your guide will share the final itinerary, dates,
                  inclusions and price when you enquire.
                </span>
              </p>
            )}

            {/* ── B. Overview + C. Quick facts ──────────────────────────── */}
            <section id="overview" aria-labelledby="overview-title" className="scroll-mt-36">
              <SectionTitle id="overview-title" eyebrow="Overview">
                About this trek
              </SectionTitle>
              <Reveal className="mt-6 space-y-4 text-lg leading-relaxed text-ink/85">
                {trek.description.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </Reveal>
              {trek.routeSummary && (
                <div className="mt-8 rounded-[1.4rem] bg-tint-sky p-6">
                  <p className="eyebrow flex items-center gap-2 text-muted">
                    <Route aria-hidden className="size-4" /> Route
                  </p>
                  <p className="mt-3 text-lg leading-snug font-semibold tracking-tight sm:text-xl">{trek.routeSummary}</p>
                </div>
              )}
              <QuickFacts trek={trek} />
              {(trek.difficultyNote || trek.fitnessNote) && (
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {trek.difficultyNote && (
                    <NoteCard icon={<Gauge className="size-5" />} title={`Why it’s rated ${trek.difficulty.toLowerCase()}`}>
                      {trek.difficultyNote}
                    </NoteCard>
                  )}
                  {trek.fitnessNote && (
                    <NoteCard icon={<Footprints className="size-5" />} title="Fitness needed">
                      {trek.fitnessNote}
                    </NoteCard>
                  )}
                </div>
              )}
            </section>

            {/* ── D. Itinerary ──────────────────────────────────────────── */}
            <section id="itinerary" aria-labelledby="itinerary-title" className="scroll-mt-36">
              <SectionTitle id="itinerary-title" eyebrow={`${trek.itinerary.length}-day plan`}>
                Day-by-day itinerary
              </SectionTitle>
              <div className="mt-8">
                <Itinerary days={trek.itinerary} />
              </div>
              <p className="mt-6 text-sm text-muted">
                Itineraries can change with weather, trail conditions and group pace. Your guide makes the final call on the day.
              </p>
            </section>

            {/* ── G. Packages, E. Inclusions, F. Exclusions ─────────────── */}
            <section id="package" aria-labelledby="package-title" className="scroll-mt-36">
              <SectionTitle id="package-title" eyebrow="Package & pricing">
                Choose how you’d like to go
              </SectionTitle>
              <div className="mt-8">
                <PackageSelector />
              </div>
              <div className="mt-10 grid gap-6 md:grid-cols-2">
                <IncludeList title="Included" items={trek.inclusions} kind="include" />
                <IncludeList title="Not included" items={trek.exclusions} kind="exclude" />
              </div>

              {/* Mobile / tablet enquiry form (desktop uses the sticky panel) */}
              <div id="enquire" className="mt-10 scroll-mt-36 card p-6 lg:hidden">
                <h3 className="font-display text-2xl text-ink">Your preferences</h3>
                <p className="mt-1 text-sm text-muted">Optional — added to your WhatsApp message.</p>
                <div className="mt-5">
                  <BookingForm />
                </div>
                <EnquireButton className={cn(btn.primary, "mt-6 w-full")} />
                <div className="mt-4">
                  <MessagePreview />
                </div>
              </div>
            </section>

            {/* ── H. Packing list ───────────────────────────────────────── */}
            {trek.packingList.length > 0 && (
              <section id="packing" aria-labelledby="packing-title" className="scroll-mt-36">
                <SectionTitle id="packing-title" eyebrow="Be prepared">
                  Suggested packing list
                </SectionTitle>
                <p className="mt-4 max-w-2xl text-muted">
                  A starting checklist for this trek. Confirm the final list with your guide — needs change with season and weather.
                </p>
                <div className="mt-8">
                  <PackingList groups={trek.packingList} />
                </div>
              </section>
            )}

            {/* ── I. Safety ─────────────────────────────────────────────── */}
            <section id="safety" aria-labelledby="safety-title" className="scroll-mt-36">
              <SectionTitle id="safety-title" eyebrow="Safety & preparation">
                Trek responsibly
              </SectionTitle>
              <p className="mt-4 max-w-2xl text-muted">
                Mountain trekking always carries some risk. Preparing well and following your guide’s instructions makes a real difference.
              </p>
              <ul className="mt-8 grid gap-4 sm:grid-cols-2">
                {SAFETY.map((s) => (
                  <li key={s.title} className="card rounded-[1.4rem] p-5">
                    <h3 className="font-semibold text-ink">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
                  </li>
                ))}
              </ul>
              {siteConfig.policies.emergencyContact && (
                <p className="mt-6 rounded-2xl bg-tint-rose p-5">
                  <span className="eyebrow block text-muted">Emergency contact</span>
                  <span className="mt-1 block font-semibold">{siteConfig.policies.emergencyContact}</span>
                </p>
              )}
            </section>

            {/* ── J. FAQ ────────────────────────────────────────────────── */}
            {trek.faqs.length > 0 && (
              <section id="faq" aria-labelledby="faq-title" className="scroll-mt-36">
                <SectionTitle id="faq-title" eyebrow="Questions">
                  Frequently asked
                </SectionTitle>
                <div className="mt-8">
                  <FaqList faqs={trek.faqs} />
                </div>
              </section>
            )}
          </div>

          {/* ── K. Sticky booking panel (desktop) ───────────────────────── */}
          <aside aria-label="Enquire about this trek" className="hidden lg:col-span-4 lg:block">
            <div className="sticky top-36">
              <BookingPanel />
            </div>
          </aside>
        </div>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="section-y bg-canvas">
          <div className="container-page">
            <h2 id="related-title" className="font-display text-display-md text-ink">
              You might also like
            </h2>
            <div className="mt-10">
              <TrekGrid treks={related} />
            </div>
          </div>
        </section>
      )}

      <MobileBookingBar />
    </BookingProvider>
  );
}

/* ── Local presentational helpers ─────────────────────────────────────────── */

const SAFETY = [
  { title: "Physical preparation", text: "Build stamina with regular walking, stair climbing or running for several weeks before your trek." },
  { title: "Weather can change quickly", text: "Expect cold, rain or snow at any time of year at altitude. Pack layers and waterproofs." },
  { title: "Altitude awareness", text: "Ascend gradually, drink water, and tell your guide immediately about headaches, nausea or dizziness." },
  { title: "Right equipment", text: "Good trekking shoes, warm layers and a headlamp matter more than anything else you carry." },
  { title: "Local rules & permits", text: "Some areas need permits or have camping restrictions. Your guide will confirm what applies to your route." },
  { title: "Listen to your guide", text: "Turnaround decisions are made for the group’s safety. Summits and viewpoints are never guaranteed." },
];

function HeroStat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm">
      <dt className="text-muted">{label}</dt>
      <dd className="font-semibold">{value}</dd>
    </div>
  );
}

function SectionTitle({ id, eyebrow, children }: { id: string; eyebrow: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="eyebrow text-muted">{eyebrow}</p>
      <h2 id={id} className="mt-3 font-display text-display-md text-ink">
        {children}
      </h2>
    </div>
  );
}

function NoteCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="card rounded-[1.4rem] p-5">
      <p className="flex items-center gap-2 font-semibold text-ink">
        <span aria-hidden className="text-accent">
          {icon}
        </span>
        {title}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-muted">{children}</p>
    </div>
  );
}

function QuickFacts({ trek }: { trek: Trek }) {
  const price = formatPrice(getStartingPrice(trek));
  const facts = [
    { icon: Clock, label: "Duration", value: formatDuration(trek.durationDays) },
    { icon: Gauge, label: "Difficulty", value: trek.difficulty },
    { icon: MapPin, label: "Region", value: `${trek.location}, ${trek.state}` },
    trek.startPoint && { icon: Flag, label: "Starts at", value: trek.startPoint },
    trek.endPoint && { icon: Flag, label: "Ends at", value: trek.endPoint },
    trek.accommodationType && { icon: BedDouble, label: "Accommodation", value: trek.accommodationType },
    trek.groupSize && { icon: Users, label: "Group size", value: trek.groupSize },
    { icon: Tag, label: "Price per person", value: price ? `From ${price}` : PRICE_FALLBACK },
    (trek.seasonLabel || trek.bestSeasons.length > 0) && {
      icon: CalendarDays,
      label: "Best season",
      value: [trek.bestSeasons.join(", "), trek.seasonLabel && `(${trek.seasonLabel})`].filter(Boolean).join(" "),
    },
    formatDistance(trek.distanceKm) && { icon: Footprints, label: "Total distance", value: formatDistance(trek.distanceKm)! },
    formatAltitude(trek.maxAltitudeM) && { icon: Mountain, label: "Max altitude", value: formatAltitude(trek.maxAltitudeM)! },
  ].filter(Boolean) as { icon: typeof Clock; label: string; value: string }[];

  return (
    <div className="mt-8">
      <h3 className="sr-only">Quick facts</h3>
      <dl className="grid overflow-hidden card rounded-[1.4rem] sm:grid-cols-2">
        {facts.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex gap-3 border-b border-line p-4 sm:odd:border-r">
            <Icon aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" />
            <div className="min-w-0">
              <dt className="text-xs text-muted">{label}</dt>
              <dd className="font-semibold break-words">{value}</dd>
            </div>
          </div>
        ))}
      </dl>
    </div>
  );
}

function IncludeList({ title, items, kind }: { title: string; items: string[]; kind: "include" | "exclude" }) {
  return (
    <div className="card rounded-[1.4rem] p-6">
      <h3 className="font-display text-xl text-ink">{title}</h3>
      {items.length ? (
        <ul className="mt-4 space-y-2.5">
          {items.map((i) => (
            <li key={i} className="flex gap-2.5 text-[0.95rem]">
              {kind === "include" ? (
                <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" />
              ) : (
                <Minus aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" />
              )}
              {i}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm leading-relaxed text-muted">
          To be confirmed. You’ll receive the full list {kind === "include" ? "of what’s included" : "of what isn’t included"} when you enquire.
        </p>
      )}
    </div>
  );
}

function BreadcrumbJsonLd({ trek }: { trek: Trek }) {
  const home = absoluteUrl("/");
  if (!home) return null; // Only emit structured data when the production domain is configured.
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: home },
      { "@type": "ListItem", position: 2, name: "Treks", item: absoluteUrl("/treks") },
      { "@type": "ListItem", position: 3, name: trek.name, item: absoluteUrl(`/treks/${trek.slug}`) },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
