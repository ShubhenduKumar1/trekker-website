import { cn } from "@/lib/format";
import { Reveal } from "@/components/ui/Reveal";

type Props = {
  eyebrow?: string;
  /** First line, full strength. */
  title: React.ReactNode;
  /** Optional second line, shown in a softer tone. */
  titleMuted?: React.ReactNode;
  intro?: React.ReactNode;
  align?: "left" | "center";
  tone?: "dark" | "light";
  className?: string;
  id?: string;
  as?: "h1" | "h2";
};

/** Section header: small label, two-tone headline, short intro. */
export function SectionHeading({ eyebrow, title, titleMuted, intro, align = "center", tone = "dark", className, id, as = "h2" }: Props) {
  const H = as;
  const center = align === "center";
  return (
    <Reveal className={cn("max-w-3xl", center && "mx-auto text-center", className)}>
      {eyebrow && <p className={cn("eyebrow mb-4", tone === "light" ? "text-white/70" : "text-muted")}>{eyebrow}</p>}
      <H id={id} className={cn("font-display", as === "h1" ? "text-display-xl" : "text-display-lg", tone === "light" ? "text-white" : "text-ink")}>
        {title}
        {titleMuted && (
          <>
            <br />
            <span className={tone === "light" ? "text-white/65" : "text-ink/45"}>{titleMuted}</span>
          </>
        )}
      </H>
      {intro && (
        <p className={cn("mt-5 max-w-2xl text-base leading-relaxed sm:text-[1.0625rem]", center && "mx-auto", tone === "light" ? "text-white/80" : "text-muted")}>
          {intro}
        </p>
      )}
    </Reveal>
  );
}
