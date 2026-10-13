"use client";

import { useId, useSyncExternalStore } from "react";
import { todayIso } from "@/lib/dom";
import { useBooking } from "@/components/booking/BookingContext";
import { cn } from "@/lib/format";

const noopSubscribe = () => () => {};

const fieldCls =
  "h-12 w-full rounded-xl border border-line bg-white px-4 text-[0.95rem] text-ink focus:border-accent focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

/** Optional preferences that are added to the WhatsApp message. Nothing here is a reservation. */
export function BookingForm({ compactPackages = true }: { compactPackages?: boolean }) {
  const { trek, selectedPackage, setPackageId, preferredDate, setPreferredDate, participants, setParticipants } = useBooking();
  const id = useId();
  // Client-only value (undefined during SSR) without a hydration mismatch.
  const today = useSyncExternalStore(noopSubscribe, todayIso, () => undefined);

  const dateInvalid = !!preferredDate && !!today && preferredDate < today;

  return (
    <div className="space-y-4">
      {compactPackages && trek.packages.length > 1 && (
        <div>
          <label htmlFor={`${id}-pkg`} className="mb-1.5 block text-sm font-semibold text-ink">
            Package
          </label>
          <select
            id={`${id}-pkg`}
            value={selectedPackage?.id ?? ""}
            onChange={(e) => setPackageId(e.target.value)}
            className={cn(fieldCls, "cursor-pointer")}
          >
            {trek.packages.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      )}
      <div>
        <label htmlFor={`${id}-date`} className="mb-1.5 block text-sm font-semibold text-ink">
          Preferred start date <span className="font-normal text-muted">(optional)</span>
        </label>
        <input
          id={`${id}-date`}
          type="date"
          min={today}
          value={preferredDate}
          onChange={(e) => setPreferredDate(e.target.value)}
          aria-invalid={dateInvalid || undefined}
          aria-describedby={`${id}-date-hint`}
          className={cn(fieldCls, dateInvalid && "border-red-600")}
        />
        <p id={`${id}-date-hint`} className={cn("mt-1.5 text-xs", dateInvalid ? "text-red-700" : "text-muted")}>
          {dateInvalid
            ? "That date has passed — please choose a future date or leave it empty."
            : "Departures aren’t fixed online — your guide will confirm availability."}
        </p>
      </div>
      <div>
        <label htmlFor={`${id}-pax`} className="mb-1.5 block text-sm font-semibold text-ink">
          Number of trekkers <span className="font-normal text-muted">(optional)</span>
        </label>
        <select
          id={`${id}-pax`}
          value={participants ?? ""}
          onChange={(e) => setParticipants(e.target.value ? Number(e.target.value) : null)}
          className={cn(fieldCls, "cursor-pointer")}
        >
          <option value="">Not sure yet</option>
          {Array.from({ length: 15 }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {n} {n === 1 ? "person" : "people"}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

/** Lets visitors see exactly what will be sent before WhatsApp opens. */
export function MessagePreview() {
  const { whatsapp } = useBooking();
  return (
    <details className="group rounded-xl bg-canvas/70 px-4 py-3 text-sm">
      <summary className="cursor-pointer font-semibold text-accent marker:text-accent">Preview your message</summary>
      <pre className="mt-3 font-sans text-[0.8rem] leading-relaxed whitespace-pre-wrap text-ink/80">{whatsapp.message}</pre>
    </details>
  );
}
