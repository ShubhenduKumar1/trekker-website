"use client";

import { useState } from "react";
import { BedDouble, Clock, Footprints, Mountain, Utensils } from "lucide-react";
import type { TrekDay } from "@/types/trek";
import { Disclosure } from "@/components/ui/Disclosure";
import { SafeImage } from "@/components/ui/SafeImage";
import { formatAltitude, formatDistance, cn } from "@/lib/format";

export function Itinerary({ days }: { days: TrekDay[] }) {
  const [open, setOpen] = useState<Set<number>>(() => new Set(days.length ? [days[0].day] : []));
  const allOpen = days.length > 0 && open.size === days.length;

  const toggle = (day: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(day)) next.delete(day);
      else next.add(day);
      return next;
    });

  if (!days.length) {
    return (
      <p className="rounded-2xl border border-dashed border-line p-8 text-muted">
        The day-by-day itinerary for this trek is being finalised. Ask on WhatsApp for the latest plan.
      </p>
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-end">
        <button
          type="button"
          onClick={() => setOpen(allOpen ? new Set() : new Set(days.map((d) => d.day)))}
          className="text-sm font-semibold text-accent underline-offset-4 hover:underline"
        >
          {allOpen ? "Collapse all days" : "Expand all days"}
        </button>
      </div>

      <ol className="relative">
        {/* Timeline spine */}
        <span aria-hidden className="absolute top-3 bottom-3 left-[1.15rem] w-px bg-gradient-to-b from-accent/40 via-accent/25 to-transparent sm:left-[1.4rem]" />
        {days.map((d) => {
          const isOpen = open.has(d.day);
          const facts = [
            formatDistance(d.distanceKm) && { icon: Footprints, label: "Distance", value: formatDistance(d.distanceKm)! },
            d.trekkingHours && { icon: Clock, label: "Trekking time", value: d.trekkingHours },
            (d.startAltitudeM || d.endAltitudeM) && {
              icon: Mountain,
              label: "Altitude",
              value: [formatAltitude(d.startAltitudeM), formatAltitude(d.endAltitudeM)].filter(Boolean).join(" → "),
            },
            d.meals?.length && { icon: Utensils, label: "Meals", value: d.meals.join(", ") },
            d.accommodation && { icon: BedDouble, label: "Stay", value: d.accommodation },
          ].filter(Boolean) as { icon: typeof Clock; label: string; value: string }[];

          return (
            <li key={d.day} className="relative pb-4 pl-12 last:pb-0 sm:pl-16">
              <span
                aria-hidden
                className={cn(
                  "absolute top-1 left-0 flex size-[2.3rem] items-center justify-center rounded-full border-2 font-display text-sm transition-colors duration-300 sm:size-[2.8rem] sm:text-base",
                  isOpen ? "border-accent bg-accent text-white" : "border-accent/30 bg-white text-accent",
                )}
              >
                {String(d.day).padStart(2, "0")}
              </span>
              <Disclosure
                open={isOpen}
                onToggle={() => toggle(d.day)}
                className={cn(
                  "rounded-2xl border bg-white transition-[border-color,box-shadow] duration-300",
                  isOpen ? "border-accent/20 shadow-[0_20px_40px_-30px_rgb(15_23_42/0.3)]" : "border-line",
                )}
                buttonClassName="p-5 sm:p-6"
                summary={
                  <>
                    <span className="eyebrow block text-muted">Day {d.day}</span>
                    <span className="mt-1 block font-display text-xl leading-snug text-ink sm:text-2xl">{d.title}</span>
                    {d.route && <span className="mt-1 block text-sm text-muted">{d.route}</span>}
                  </>
                }
              >
                <div className="px-5 pb-6 sm:px-6">
                  <p className="leading-relaxed text-ink/85">{d.description}</p>
                  {facts.length > 0 && (
                    <dl className="mt-5 grid gap-3 sm:grid-cols-2">
                      {facts.map(({ icon: Icon, label, value }) => (
                        <div key={label} className="flex items-start gap-2.5 rounded-xl bg-white px-3.5 py-2.5 text-sm">
                          <Icon aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" />
                          <div>
                            <dt className="text-xs text-muted">{label}</dt>
                            <dd className="font-semibold">{value}</dd>
                          </div>
                        </div>
                      ))}
                    </dl>
                  )}
                  {d.image && (
                    <div className="relative mt-5 aspect-[16/9] overflow-hidden rounded-xl">
                      <SafeImage src={d.image.src} alt={d.image.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
                    </div>
                  )}
                </div>
              </Disclosure>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
