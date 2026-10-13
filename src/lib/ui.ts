/** Shared class recipes so buttons look identical everywhere. */
const base =
  "group/btn inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold whitespace-nowrap transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-55";

export const btn = {
  /** Accent pill with a subtle inner highlight. */
  primary: `${base} border border-accent bg-accent text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.3)] hover:border-accent-hover hover:bg-accent-hover`,
  /** Neutral grey pill. */
  secondary: `${base} bg-black/[0.05] text-ink hover:bg-black/[0.09]`,
  /** Hairline outline pill. */
  outline: `${base} border border-line bg-white text-ink hover:border-ink/25 hover:bg-canvas`,
  /** White pill for use on the accent band or photos. */
  light: `${base} bg-white text-accent hover:bg-white/90`,
  /** Translucent pill for use on the accent band or photos. */
  ghostLight: `${base} border border-white/40 text-white hover:bg-white/10`,
};


export const arrowNudge = "transition-transform duration-300 ease-out-soft group-hover/btn:translate-x-0.5 motion-reduce:transition-none";
