import type { Photo } from "@/types/trek";
import { SafeImage } from "@/components/ui/SafeImage";

type Props = {
  eyebrow?: string;
  title: React.ReactNode;
  titleMuted?: React.ReactNode;
  intro?: React.ReactNode;
  image?: Photo;
  children?: React.ReactNode;
};

/** Centered page header (label pill, two-tone title, intro) with an optional framed photo panel below. */
export function PageHeader({ eyebrow, title, titleMuted, intro, image, children }: Props) {
  return (
    <section className="relative isolate overflow-hidden pt-32 sm:pt-40">
      {image && (
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 -z-10 h-[50%] bg-[radial-gradient(60%_80%_at_15%_100%,#c7d7ff_0%,transparent_70%),radial-gradient(60%_80%_at_85%_100%,#c8efe0_0%,transparent_70%)]"
        />
      )}
      <div className="container-narrow text-center">
        {eyebrow && (
          <p className="rise inline-flex items-center gap-2 rounded-full border border-line bg-white px-3.5 py-1.5 text-xs font-medium text-ink/75">
            <span className="size-1.5 rounded-full bg-accent" aria-hidden /> {eyebrow}
          </p>
        )}
        <h1 className="rise mx-auto mt-6 max-w-4xl font-display text-display-xl" style={{ ["--d" as string]: "80ms" }}>
          {title}
          {titleMuted && (
            <>
              <br />
              <span className="text-ink/45">{titleMuted}</span>
            </>
          )}
        </h1>
        {intro && (
          <div className="rise mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-[1.0625rem]" style={{ ["--d" as string]: "160ms" }}>
            {intro}
          </div>
        )}
        {children && (
          <div className="rise mt-8" style={{ ["--d" as string]: "240ms" }}>
            {children}
          </div>
        )}
      </div>
      {image ? (
        <div className="container-page mt-12 pb-16 sm:mt-14 sm:pb-20">
          <div className="rise rounded-[2rem] border border-white/60 bg-white/60 p-2 shadow-[0_40px_80px_-40px_rgb(15_23_42/0.45)] backdrop-blur" style={{ ["--d" as string]: "300ms" }}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.6rem] bg-canvas sm:aspect-[21/9]">
              <SafeImage src={image.src} alt={image.alt} fill priority sizes="(min-width: 1200px) 1150px, 100vw" className="object-cover" />
            </div>
          </div>
        </div>
      ) : (
        <div className="pb-12 sm:pb-16" />
      )}
    </section>
  );
}
