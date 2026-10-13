"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import type { PackingGroup } from "@/types/trek";
import { cn } from "@/lib/format";

/** A personal checklist to help visitors prepare. Ticks are local to the visitor and aren't a safety check. */
export function PackingList({ groups }: { groups: PackingGroup[] }) {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const total = groups.reduce((n, g) => n + g.items.length, 0);

  const toggle = (key: string) =>
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line" aria-hidden>
          <div className="h-full rounded-full bg-accent transition-[width] duration-500" style={{ width: `${total ? (checked.size / total) * 100 : 0}%` }} />
        </div>
        <p className="shrink-0 text-sm font-semibold text-muted" aria-live="polite">
          {checked.size} of {total} packed
        </p>
      </div>
      <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
        {groups.map((g) => (
          <fieldset key={g.category}>
            <legend className="eyebrow mb-3 text-muted">{g.category}</legend>
            <ul className="space-y-1">
              {g.items.map((item) => {
                const key = `${g.category}:${item}`;
                const isChecked = checked.has(key);
                const id = `pack-${key.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`;
                return (
                  <li key={key}>
                    <label htmlFor={id} className="flex cursor-pointer items-start gap-3 rounded-lg py-1.5">
                      <input id={id} type="checkbox" className="peer sr-only" checked={isChecked} onChange={() => toggle(key)} />
                      <span
                        aria-hidden
                        className={cn(
                          "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent",
                          isChecked ? "border-accent bg-accent text-white" : "border-ink/25 bg-white",
                        )}
                      >
                        {isChecked && <Check className="size-3.5" strokeWidth={3} />}
                      </span>
                      <span className={cn("leading-snug transition-colors", isChecked ? "text-muted line-through" : "text-ink")}>
                        {item}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </fieldset>
        ))}
      </div>
    </div>
  );
}
