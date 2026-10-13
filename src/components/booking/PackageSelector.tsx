"use client";

import { BedDouble, Bus, Check, ClipboardCheck, Users } from "lucide-react";
import { useBooking } from "@/components/booking/BookingContext";
import { formatPrice, PRICE_FALLBACK, cn } from "@/lib/format";

export function PackageSelector() {
  const { trek, selectedPackage, setPackageId } = useBooking();

  if (!trek.packages.length) {
    return (
      <p className="rounded-2xl border border-dashed border-line p-8 text-muted">
        Package options for this trek are being finalised. Ask on WhatsApp for current options and pricing.
      </p>
    );
  }

  const multiple = trek.packages.length > 1;

  return (
    <div className="space-y-6">
      {multiple && (
        <fieldset>
          <legend className="sr-only">Choose a package</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {trek.packages.map((p) => {
              const selected = selectedPackage?.id === p.id;
              const price = formatPrice(p.pricePerPerson ?? trek.pricePerPerson);
              return (
                <label
                  key={p.id}
                  className={cn(
                    "relative flex cursor-pointer flex-col rounded-2xl border-2 bg-white p-5 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent",
                    selected ? "border-accent" : "border-line hover:border-accent/40",
                  )}
                >
                  <input
                    type="radio"
                    name={`package-${trek.id}`}
                    value={p.id}
                    checked={selected}
                    onChange={() => setPackageId(p.id)}
                    className="sr-only"
                  />
                  <span className="flex items-start justify-between gap-3">
                    <span className="font-display text-xl text-ink">{p.name}</span>
                    <span
                      aria-hidden
                      className={cn(
                        "flex size-6 shrink-0 items-center justify-center rounded-full border-2",
                        selected ? "border-accent bg-accent text-white" : "border-ink/25",
                      )}
                    >
                      {selected && <Check className="size-3.5" strokeWidth={3} />}
                    </span>
                  </span>
                  <span className="mt-2 text-sm font-semibold text-accent">{price ? `${price} per person` : PRICE_FALLBACK}</span>
                  {p.summary && <span className="mt-2 text-sm leading-relaxed text-muted">{p.summary}</span>}
                </label>
              );
            })}
          </div>
        </fieldset>
      )}

      {selectedPackage && (
        <div className="card rounded-[1.4rem] p-6 sm:p-7" aria-live="polite">
          {!multiple && (
            <>
              <h3 className="font-display text-2xl text-ink">{selectedPackage.name}</h3>
              <p className="mt-1 text-sm font-semibold text-accent">
                {formatPrice(selectedPackage.pricePerPerson ?? trek.pricePerPerson)
                  ? `${formatPrice(selectedPackage.pricePerPerson ?? trek.pricePerPerson)} per person`
                  : PRICE_FALLBACK}
              </p>
              {selectedPackage.summary && <p className="mt-3 text-muted">{selectedPackage.summary}</p>}
            </>
          )}
          {multiple && <h3 className="eyebrow text-muted">{selectedPackage.name} — details</h3>}

          <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
            {[
              { icon: BedDouble, label: "Accommodation", value: selectedPackage.accommodation },
              { icon: Bus, label: "Transport", value: selectedPackage.transportDetails },
              { icon: Users, label: "Group size", value: selectedPackage.groupSize },
              { icon: ClipboardCheck, label: "Requirements", value: selectedPackage.requirements },
            ]
              .filter((f) => f.value)
              .map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex gap-3">
                  <Icon aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" />
                  <div>
                    <dt className="text-xs text-muted">{label}</dt>
                    <dd className="font-semibold">{value}</dd>
                  </div>
                </div>
              ))}
          </dl>

          {selectedPackage.inclusions.length > 0 ? (
            <div className="mt-5">
              <p className="text-sm font-semibold">This package includes</p>
              <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                {selectedPackage.inclusions.map((i) => (
                  <li key={i} className="flex gap-2 text-sm">
                    <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" /> {i}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="mt-5 text-sm text-muted">
              Package inclusions, accommodation and transport details are confirmed on enquiry.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
