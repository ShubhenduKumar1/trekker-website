import Link from "next/link";
import { ArrowUpRight, Award } from "lucide-react";
import { getSiteSettings } from "@/lib/site-settings";
import { photos } from "@/data/images";
import { SafeImage } from "@/components/ui/SafeImage";
import { Reveal } from "@/components/ui/Reveal";
import { PlanLink } from "@/components/ui/PlanLink";
import { DevNotice } from "@/components/ui/DevNotice";
import { btn } from "@/lib/ui";

/** Neutral copy used until the organizer adds their own introduction — makes no personal claims. */
const FALLBACK_INTRO = [
  "Every trek here is planned personally, from choosing the right route for your experience to the final day on the trail.",
  "Get in touch to talk through what kind of mountain experience you’re looking for.",
];

export async function GuideSection({
  headingLevel = "h2",
  showAboutLink = true,
}: {
  headingLevel?: "h1" | "h2";
  showAboutLink?: boolean;
}) {
  const { guide, social, whatsappNumber } = await getSiteSettings();
  const H = headingLevel;
  const intro = guide.intro.length ? guide.intro : FALLBACK_INTRO;
  const image = guide.portrait ?? photos.moonRange;
  const missing = [
    !guide.name && "name",
    !guide.portrait && "photo",
    !guide.intro.length && "introduction",
    !guide.whyTrekking && "why you trek",
    !guide.philosophy && "guiding philosophy",
  ].filter(Boolean);

  return (
    <section aria-labelledby="guide-title" className="section-y">
      <div className="container-page">
        <Reveal className="card grid gap-2 p-2 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.4rem] bg-canvas lg:aspect-auto lg:min-h-[32rem]">
            <SafeImage
              src={image.src}
              alt={guide.portrait ? image.alt : "Himalayan peaks at dusk"}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
            {guide.name && (
              <p className="absolute bottom-4 left-4 rounded-full bg-white/90 px-4 py-1.5 text-sm font-semibold text-ink backdrop-blur">{guide.name}</p>
            )}
          </div>

          <div className="flex flex-col justify-center px-4 py-8 sm:px-8 lg:px-12">
            <p className="eyebrow text-muted">Meet your guide</p>
            <H id="guide-title" className="mt-3 font-display text-display-lg">
              {guide.name ? <>Hi, I’m {guide.name}.</> : "Meet Your Guide."}
              <br />
              <span className="text-ink/45">Let’s plan your trek together.</span>
            </H>
            <div className="mt-6 max-w-xl space-y-4 leading-relaxed text-muted">
              {intro.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>

            {(guide.whyTrekking || guide.philosophy) && (
              <dl className="mt-8 grid gap-3 sm:grid-cols-2">
                {guide.whyTrekking && (
                  <div className="rounded-2xl bg-canvas p-5">
                    <dt className="eyebrow text-muted">Why I trek</dt>
                    <dd className="mt-2 text-sm leading-relaxed text-ink/80">{guide.whyTrekking}</dd>
                  </div>
                )}
                {guide.philosophy && (
                  <div className="rounded-2xl bg-canvas p-5">
                    <dt className="eyebrow text-muted">How I guide</dt>
                    <dd className="mt-2 text-sm leading-relaxed text-ink/80">{guide.philosophy}</dd>
                  </div>
                )}
              </dl>
            )}

            {guide.credentials.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-2">
                {guide.credentials.map((c) => (
                  <li key={c} className="inline-flex items-center gap-2 rounded-full border border-line px-3.5 py-1.5 text-sm font-medium">
                    <Award aria-hidden className="size-4 text-accent" /> {c}
                  </li>
                ))}
              </ul>
            )}

            {missing.length > 0 && (
              <DevNotice className="mt-6 max-w-xl">
                Add your {missing.join(", ")} in /admin → Site Settings → Guide. Visitors see neutral copy until then.
              </DevNotice>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-2">
              <PlanLink className={btn.primary} whatsappNumber={whatsappNumber}>
                Plan Your Trek With Me
              </PlanLink>
              {showAboutLink && (
                <Link href="/about" className={btn.secondary}>
                  More about me
                </Link>
              )}
            </div>
            {social.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-5 text-sm font-medium">
                {social.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-ink/70 hover:text-ink">
                      {s.label} <ArrowUpRight aria-hidden className="size-3.5" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
