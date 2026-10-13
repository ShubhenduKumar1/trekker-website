import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Trek } from "@/types/trek";
import { TrekCard } from "@/components/treks/TrekCard";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { btn, arrowNudge } from "@/lib/ui";
import { cn } from "@/lib/format";

export function FeaturedTreks({ treks }: { treks: Trek[] }) {
  return (
    <section aria-labelledby="featured-title" className="section-y bg-canvas">
      <div className="container-page">
        <SectionHeading
          id="featured-title"
          eyebrow="Featured treks"
          title="Your Next Mountain Story."
          titleMuted="Chosen for every kind of trekker."
          intro="From forest trails to high-altitude adventures, find the journey that feels right for you."
        />

        {treks.length ? (
          <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {treks.map((trek, i) => (
              <Reveal as="li" key={trek.id} delay={(i % 3) * 0.08}>
                <TrekCard trek={trek} />
              </Reveal>
            ))}
          </ul>
        ) : (
          <p className="card mt-12 p-10 text-center text-muted">New treks are being added. Check back soon or get in touch to plan one together.</p>
        )}

        <div className="mt-12 flex justify-center">
          <Link href="/treks" className={btn.outline}>
            View all treks <ArrowRight aria-hidden className={cn("size-4", arrowNudge)} />
          </Link>
        </div>
      </div>
    </section>
  );
}
