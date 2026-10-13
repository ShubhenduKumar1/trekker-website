import { cn } from "@/lib/format";

/** Compact closing call-to-action used at the bottom of inner pages. */
export function CtaCard({ title, text, children, className }: { title: string; text?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("pb-20 sm:pb-28", className)}>
      <div className="container-page">
        <div className="dots relative overflow-hidden rounded-[2rem] bg-accent px-6 py-12 text-white sm:px-12">
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-r from-accent via-accent/90 to-accent/40" />
          <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h2 className="font-display text-display-sm">{title}</h2>
              {text && <p className="mt-2 text-white/80">{text}</p>}
            </div>
            <div className="flex flex-wrap gap-2">{children}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Button styles that read well on the accent card. */
export const onAccent = {
  solid: "inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-accent transition-colors hover:bg-white/90 disabled:opacity-60",
  ghost: "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/40 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10",
};
