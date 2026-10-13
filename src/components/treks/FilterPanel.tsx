"use client";

import { Check } from "lucide-react";
import type { Trek } from "@/types/trek";
import {
  DIFFICULTY_OPTIONS,
  DURATION_OPTIONS,
  PRICE_OPTIONS,
  SEASON_OPTIONS,
  STATE_OPTIONS,
  facetCount,
  type TrekFilters,
} from "@/lib/filters";
import { getStartingPrice } from "@/lib/treks";
import { cn } from "@/lib/format";

type Props = {
  catalog: Trek[];
  filters: TrekFilters;
  onChange: (patch: Partial<TrekFilters>) => void;
  idPrefix: string;
};

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export function FilterPanel({ catalog, filters, onChange, idPrefix }: Props) {
  const anyPriced = catalog.some((t) => getStartingPrice(t) !== undefined);

  return (
    <div className="space-y-8">
      <FilterGroup legend="Destination">
        {STATE_OPTIONS.map((o) => (
          <Chip
            key={o.id}
            id={`${idPrefix}-state-${o.id}`}
            label={o.label}
            checked={filters.states.includes(o.value)}
            count={facetCount(catalog, filters, { states: [o.value] })}
            onToggle={() => onChange({ states: toggle(filters.states, o.value) })}
          />
        ))}
      </FilterGroup>

      <FilterGroup legend="Difficulty">
        {DIFFICULTY_OPTIONS.map((d) => (
          <Chip
            key={d}
            id={`${idPrefix}-difficulty-${d}`}
            label={d}
            checked={filters.difficulties.includes(d)}
            count={facetCount(catalog, filters, { difficulties: [d] })}
            onToggle={() => onChange({ difficulties: toggle(filters.difficulties, d) })}
          />
        ))}
      </FilterGroup>

      <FilterGroup legend="Duration">
        {DURATION_OPTIONS.map((o) => (
          <Chip
            key={o.id}
            id={`${idPrefix}-duration-${o.id}`}
            label={o.label}
            checked={filters.durations.includes(o.id)}
            count={facetCount(catalog, filters, { durations: [o.id] })}
            onToggle={() => onChange({ durations: toggle(filters.durations, o.id) })}
          />
        ))}
      </FilterGroup>

      <FilterGroup legend="Season">
        {SEASON_OPTIONS.map((s) => (
          <Chip
            key={s}
            id={`${idPrefix}-season-${s}`}
            label={s}
            checked={filters.seasons.includes(s)}
            count={facetCount(catalog, filters, { seasons: [s] })}
            onToggle={() => onChange({ seasons: toggle(filters.seasons, s) })}
          />
        ))}
      </FilterGroup>

      <FilterGroup legend="Price per person">
        {anyPriced ? (
          PRICE_OPTIONS.map((o) => (
            <Chip
              key={o.id}
              id={`${idPrefix}-price-${o.id}`}
              label={o.label}
              checked={filters.prices.includes(o.id)}
              count={facetCount(catalog, filters, { prices: [o.id] })}
              onToggle={() => onChange({ prices: toggle(filters.prices, o.id) })}
            />
          ))
        ) : (
          <p className="text-sm leading-relaxed text-muted">
            Prices are shared on enquiry while departures are being finalised.
          </p>
        )}
      </FilterGroup>
    </div>
  );
}

function FilterGroup({ legend, children }: { legend: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="eyebrow mb-3 text-muted">{legend}</legend>
      <div className="flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}

function Chip({
  id,
  label,
  checked,
  count,
  onToggle,
}: {
  id: string;
  label: string;
  checked: boolean;
  count: number;
  onToggle: () => void;
}) {
  const disabled = !checked && count === 0;
  return (
    <span className="relative">
      <input
        id={id}
        type="checkbox"
        className="peer absolute inset-0 size-full cursor-pointer appearance-none rounded-full disabled:cursor-not-allowed"
        checked={checked}
        disabled={disabled}
        onChange={onToggle}
      />
      <label
        htmlFor={id}
        className={cn(
          "pointer-events-none inline-flex min-h-10 items-center gap-1.5 rounded-full border px-3.5 text-sm font-semibold transition-colors",
          "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent",
          checked
            ? "border-accent bg-accent text-white"
            : "border-line bg-white text-ink peer-hover:border-accent/50",
          disabled && "opacity-45",
        )}
      >
        {checked && <Check aria-hidden className="size-3.5" />}
        {label}
        <span className={cn("text-xs font-medium", checked ? "text-white/75" : "text-muted")}>
          <span className="sr-only">, </span>
          {count}
          <span className="sr-only"> {count === 1 ? "trek" : "treks"}</span>
        </span>
      </label>
    </span>
  );
}
