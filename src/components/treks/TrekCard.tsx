import Link from "next/link";
import { ArrowRight, CalendarDays, Clock, Mountain } from "lucide-react";
import type { Trek } from "@/types/trek";
import { SafeImage } from "@/components/ui/SafeImage";
import { DifficultyMeter } from "@/components/treks/DifficultyMeter";
import { formatAltitude, formatDuration, formatPrice, PRICE_FALLBACK, cn } from "@/lib/format";
import { getStartingPrice } from "@/lib/treks";

type Props = {
  trek: Trek;
  priority?: boolean;
  headingLevel?: "h2" | "h3";
  sizes?: string;
  className?: string;
};

/** Trek card: inset photo panel on top, details below. The whole card is one link. */
export function TrekCard({ trek, priority, headingLevel = "h3", sizes, className }: Props) {
  const H = headingLevel;
  const price = formatPrice(getStartingPrice(trek));
  const altitude = formatAltitude(trek.maxAltitudeM);

  return (
    <article
      className={cn(
        "card group relative flex h-full flex-col p-2 transition-[transform,box-shadow,border-color] duration-500 ease-out-soft focus-within:border-accent hover:-translate-y-1 hover:shadow-[0_24px_50px_-28px_rgb(15_23_42/0.35)] motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        className,
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-[1.4rem] bg-canvas">
        <SafeImage
          src={trek.coverImage.src}
          alt={trek.coverImage.alt}
          fill
          priority={priority}
          sizes={sizes ?? "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
          className="object-cover transition-transform duration-[1.2s] ease-out-soft group-hover:scale-[1.05] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
        <p className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-ink backdrop-blur">
          <Clock aria-hidden className="size-3.5 text-muted" />
          {formatDuration(trek.durationDays)}
        </p>
      </div>

      <div className="flex flex-1 flex-col px-4 pt-5 pb-4">
        <p className="eyebrow text-muted">
          {trek.state} <span aria-hidden>·</span> <span className="normal-case tracking-normal">{trek.location}</span>
        </p>
        <H className="mt-2 text-xl font-semibold tracking-tight text-ink">
          <Link href={`/treks/${trek.slug}`} className="outline-none after:absolute after:inset-0 after:z-10 after:rounded-[inherit] after:content-['']">
            {trek.name}
          </Link>
        </H>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">{trek.summary}</p>

        <dl className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.8125rem] font-medium text-ink">
          <div>
            <dt className="sr-only">Difficulty</dt>
            <dd>
              <DifficultyMeter difficulty={trek.difficulty} />
            </dd>
          </div>
          {trek.seasonLabel && (
            <div>
              <dt className="sr-only">Best season</dt>
              <dd className="flex items-center gap-1.5">
                <CalendarDays aria-hidden className="size-3.5 text-muted" />
                {trek.seasonLabel}
              </dd>
            </div>
          )}
          {altitude && (
            <div>
              <dt className="sr-only">Maximum altitude</dt>
              <dd className="flex items-center gap-1.5">
                <Mountain aria-hidden className="size-3.5 text-muted" /> {altitude}
              </dd>
            </div>
          )}
        </dl>

        <div aria-hidden className="min-h-5 flex-1" />
        <div className="flex items-end justify-between gap-4 border-t border-line pt-4">
          <p className="text-sm leading-tight">
            {price ? (
              <>
                <span className="block text-xs text-muted">From, per person</span>
                <span className="text-lg font-semibold tracking-tight text-ink">{price}</span>
              </>
            ) : (
              <span className="font-medium text-ink">{PRICE_FALLBACK}</span>
            )}
          </p>
          <span aria-hidden className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-accent">
            Explore Trek
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transition-none" />
          </span>
        </div>
      </div>
    </article>
  );
}
