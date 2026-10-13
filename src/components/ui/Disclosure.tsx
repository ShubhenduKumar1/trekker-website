"use client";

import { ChevronDown } from "lucide-react";
import { useId } from "react";
import { cn } from "@/lib/format";

type Props = {
  open: boolean;
  onToggle: () => void;
  summary: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  buttonClassName?: string;
  headingLevel?: "h3" | "h4";
  /** "boxed" shows the chevron in a round button; "plain" shows just the chevron. */
  variant?: "boxed" | "plain";
};

/**
 * Accessible accordion item. Content stays in the HTML (good for SEO and
 * no-JS); collapsed panels are `inert` so they're skipped by keyboard and
 * screen readers. Height animates with a CSS grid transition.
 */
export function Disclosure({ open, onToggle, summary, children, className, buttonClassName, headingLevel = "h3", variant = "boxed" }: Props) {
  const id = useId();
  const H = headingLevel;
  return (
    <div className={className}>
      <H className="m-0">
        <button
          type="button"
          id={`${id}-btn`}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          onClick={onToggle}
          className={cn("group/disc flex w-full items-start justify-between gap-4 text-left", buttonClassName)}
        >
          <span className="min-w-0 flex-1">{summary}</span>
          {variant === "boxed" ? (
            <span
              aria-hidden
              className={cn(
                "mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full border transition-[transform,background-color,border-color] duration-300 motion-reduce:transition-none",
                open ? "rotate-180 border-accent bg-accent text-white" : "border-line bg-white text-ink/60 group-hover/disc:border-ink/25",
              )}
            >
              <ChevronDown className="size-4" />
            </span>
          ) : (
            <ChevronDown
              aria-hidden
              className={cn("mt-1 size-4 shrink-0 text-ink/45 transition-transform duration-300 motion-reduce:transition-none", open && "rotate-180")}
            />
          )}
        </button>
      </H>
      <div
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-btn`}
        inert={!open}
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-400 ease-out-soft motion-reduce:transition-none",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  );
}
