import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { getDestinations } from "@/lib/destinations";
import { getTreksByState } from "@/lib/treks";
import { SafeImage } from "@/components/ui/SafeImage";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { btn, arrowNudge } from "@/lib/ui";
import { cn, formatDurationShort } from "@/lib/format";

export async function DestinationsSection() {
  const destinations = await getDestinations();
  const treksByDestination = await Promise.all(destinations.map((d) => getTreksByState(d.state)));
  return (
    <section aria-labelledby="destinations-title" className="section-y">
      <div className="container-page">
        <SectionHeading
          id="destinations-title"
          eyebrow="Where we trek"
          title="Two states."
          titleMuted="Endless trails."
          intro="Choose a region to see its treks — from weekend ridge walks to multi-day crossings."
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-2">
          {destinations.map((d, i) => {
            const treks = treksByDestination[i];
            return (
              <Reveal as="article" key={d.slug} delay={i * 0.08} aria-labelledby={`dest-${d.slug}`} className="card flex flex-col p-2">
                <div className="relative aspect-[16/10] overflow-hidden rounded-[1.4rem] bg-canvas">
                  <SafeImage src={d.image.src} alt={d.image.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
                  <span className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink backdrop-blur">
                    {treks.length === 0 ? "Treks coming soon" : `${treks.length} ${treks.length === 1 ? "trek" : "treks"}`}
                  </span>
                </div>
                <div className="flex flex-1 flex-col px-4 pt-6 pb-4 sm:px-6">
                  <p className="eyebrow text-muted">{d.eyebrow}</p>
                  <h3 id={`dest-${d.slug}`} className="mt-2 font-display text-display-md">
                    {d.state}
                  </h3>
                  <p className="mt-3 leading-relaxed text-muted">{d.intro}</p>
                  {treks.length > 0 && (
                    <ul className="mt-5 space-y-1.5">
                      {treks.slice(0, 3).map((t) => (
                        <li key={t.id}>
                          <Link
                            href={`/treks/${t.slug}`}
                            className="group flex items-center justify-between gap-4 rounded-2xl bg-canvas px-4 py-3 transition-colors hover:bg-accent-soft"
                          >
                            <span className="font-medium">{t.name}</span>
                            <span className="flex shrink-0 items-center gap-2 text-xs text-muted">
                              {formatDurationShort(t.durationDays)} · {t.difficulty}
                              <ArrowUpRight aria-hidden className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="mt-auto flex flex-wrap gap-2 pt-6">
                    <Link href={`/treks?state=${d.slug}`} className={btn.primary}>
                      Explore {d.shortName} treks <ArrowRight aria-hidden className={cn("size-4", arrowNudge)} />
                    </Link>
                    <Link href={`/destinations/${d.slug}`} className={btn.secondary}>
                      About {d.shortName}
                    </Link>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
