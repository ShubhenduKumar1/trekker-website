import type { Trek } from "@/types/trek";
import { TrekCard } from "@/components/treks/TrekCard";
import { Reveal } from "@/components/ui/Reveal";

export function TrekGrid({ treks, columns = 3 }: { treks: Trek[]; columns?: 2 | 3 }) {
  if (!treks.length) {
    return (
      <p className="rounded-2xl border border-dashed border-line p-10 text-center text-muted">
        New treks for this region are being added soon.
      </p>
    );
  }
  return (
    <ul className={columns === 3 ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8" : "grid gap-6 sm:grid-cols-2 lg:gap-8"}>
      {treks.map((t, i) => (
        <Reveal as="li" key={t.id} delay={(i % 3) * 0.08}>
          <TrekCard trek={t} />
        </Reveal>
      ))}
    </ul>
  );
}
