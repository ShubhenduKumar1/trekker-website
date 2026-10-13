"use client";

import { Clock, Info } from "lucide-react";
import { useBooking } from "@/components/booking/BookingContext";
import { BookingForm, MessagePreview } from "@/components/booking/BookingForm";
import { EnquireButton } from "@/components/booking/EnquireButton";
import { DifficultyMeter } from "@/components/treks/DifficultyMeter";
import { formatDuration, formatPrice, PRICE_FALLBACK, cn } from "@/lib/format";
import { btn } from "@/lib/ui";

export function PriceTag({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const { price, trek } = useBooking();
  const formatted = formatPrice(price);
  if (!formatted) {
    return <p className={cn("font-display text-2xl", tone === "light" ? "text-white" : "text-ink")}>{PRICE_FALLBACK}</p>;
  }
  return (
    <p className="leading-tight">
      <span className={cn("block text-xs font-medium", tone === "light" ? "text-white/70" : "text-muted")}>
        {trek.packages.length > 1 ? "From, per person" : "Per person"}
      </span>
      <span className={cn("font-display text-3xl", tone === "light" ? "text-white" : "text-ink")}>{formatted}</span>
    </p>
  );
}

/** Desktop sticky enquiry panel. */
export function BookingPanel() {
  const { trek, selectedPackage } = useBooking();
  return (
    <div className="card p-6 shadow-[0_30px_60px_-34px_rgb(15_23_42/0.3)]">
      <PriceTag />
      <dl className="mt-5 grid grid-cols-2 gap-3 border-y border-line py-4 text-sm">
        <div>
          <dt className="text-xs text-muted">Duration</dt>
          <dd className="mt-0.5 flex items-center gap-1.5 font-semibold">
            <Clock aria-hidden className="size-4 text-accent" /> {formatDuration(trek.durationDays)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Difficulty</dt>
          <dd className="mt-0.5 font-semibold">
            <DifficultyMeter difficulty={trek.difficulty} />
          </dd>
        </div>
        {selectedPackage && (
          <div className="col-span-2">
            <dt className="text-xs text-muted">Selected package</dt>
            <dd className="mt-0.5 font-semibold">{selectedPackage.name}</dd>
          </div>
        )}
      </dl>
      <div className="mt-5">
        <BookingForm />
      </div>
      <EnquireButton className={cn(btn.primary, "mt-6 w-full")} />
      <div className="mt-4">
        <MessagePreview />
      </div>
      <p className="mt-4 flex gap-2 text-xs leading-relaxed text-muted">
        <Info aria-hidden className="mt-0.5 size-3.5 shrink-0" />
        This opens WhatsApp with your details filled in. It isn’t a booking — your guide will reply with dates, final price and next steps.
      </p>
    </div>
  );
}
