"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowRight, ArrowUpRight, CheckCircle2, Clock, MapPin } from "lucide-react";
import type { Trek } from "@/types/trek";
import { photos } from "@/data/images";
import { SafeImage } from "@/components/ui/SafeImage";
import { PlanLink } from "@/components/ui/PlanLink";
import { DifficultyMeter } from "@/components/treks/DifficultyMeter";
import { btn, arrowNudge } from "@/lib/ui";
import { formatDuration, cn } from "@/lib/format";

type RegionCount = { slug: string; name: string; count: number };

export function Hero({ featured, regions }: { featured?: Trek; regions: RegionCount[] }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [finePointer, setFinePointer] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine) and (min-width: 768px)");
    const update = () => setFinePointer(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-4%", "8%"]);
  const parallax = finePointer && !reduce;

  return (
    <section ref={ref} aria-labelledby="hero-title" className="relative isolate overflow-hidden pt-32 sm:pt-40">
      {/* Soft colour glow behind the photo panel */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 -z-10 h-[55%] bg-[radial-gradient(60%_80%_at_15%_100%,#c7d7ff_0%,transparent_70%),radial-gradient(60%_80%_at_85%_100%,#c8efe0_0%,transparent_70%)]"
      />

      <div className="container-narrow text-center">
        <p className="rise inline-flex items-center gap-2 rounded-full border border-line bg-white px-3.5 py-1.5 text-xs font-medium text-ink/75 shadow-[0_1px_2px_rgb(0_0_0/0.04)]">
          <span className="size-1.5 rounded-full bg-accent" aria-hidden /> Your next adventure starts here
        </p>
        <h1 id="hero-title" className="rise mx-auto mt-6 max-w-4xl font-display text-display-xl" style={{ ["--d" as string]: "80ms" }}>
          Find Your Trail.
          <br />
          <span className="text-ink/45">Discover Your Wild.</span>
        </h1>
        <p className="rise mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-[1.0625rem]" style={{ ["--d" as string]: "160ms" }}>
          Explore breathtaking Himalayan trails, meet fellow adventurers, and experience Himachal and Uttarakhand with a guide
          who knows the mountains.
        </p>
        <div className="rise mt-9 flex flex-col justify-center gap-3 sm:flex-row" style={{ ["--d" as string]: "240ms" }}>
          <Link href="/treks" className={cn(btn.primary, "px-7")}>
            Explore Treks <ArrowRight aria-hidden className={cn("size-4", arrowNudge)} />
          </Link>
          <PlanLink className={cn(btn.secondary, "px-7")} fallbackHref="#plan">
            Plan Your Adventure
          </PlanLink>
        </div>
        <ul className="rise mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs font-medium text-muted" style={{ ["--d" as string]: "320ms" }}>
          {["Small-group treks", "Personal trek planning", "Enquire on WhatsApp"].map((t) => (
            <li key={t} className="inline-flex items-center gap-1.5">
              <CheckCircle2 aria-hidden className="size-3.5" /> {t}
            </li>
          ))}
        </ul>
      </div>

      {/* Photo panel — the "product shot" of the page */}
      <div className="container-page mt-14 pb-16 sm:mt-16 sm:pb-24">
        <div className="rise relative rounded-[2rem] border border-white/60 bg-white/60 p-2 shadow-[0_40px_80px_-40px_rgb(15_23_42/0.45)] backdrop-blur" style={{ ["--d" as string]: "380ms" }}>
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.6rem] sm:aspect-[16/9] lg:aspect-[16/8]">
            <motion.div className="absolute -inset-y-[6%] inset-x-0" style={parallax ? { y } : undefined}>
              <SafeImage
                src={photos.hero.src}
                alt={photos.hero.alt}
                fill
                priority
                fetchPriority="high"
                sizes="(min-width: 1200px) 1150px, 100vw"
                quality={70}
                className="object-cover object-[50%_45%]"
              />
            </motion.div>
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/0 to-black/0" />

            {featured && (
              <Link
                href={`/treks/${featured.slug}`}
                className="group absolute bottom-3 left-3 w-[min(20rem,calc(100%-1.5rem))] rounded-3xl border border-white/60 bg-white/85 p-4 text-left backdrop-blur-xl transition-colors hover:bg-white sm:bottom-6 sm:left-6 sm:p-5"
              >
                <span className="flex items-center justify-between">
                  <span className="eyebrow text-muted">Featured trek</span>
                  <ArrowUpRight aria-hidden className="size-4 text-ink/50 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
                <span className="mt-2 block text-lg font-semibold tracking-tight text-ink">{featured.name}</span>
                <span className="mt-1 flex items-center gap-1.5 text-sm text-muted">
                  <MapPin aria-hidden className="size-3.5" /> {featured.location}
                </span>
                <span className="mt-4 flex items-center gap-4 border-t border-line pt-3 text-sm font-medium text-ink">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock aria-hidden className="size-4 text-muted" /> {formatDuration(featured.durationDays)}
                  </span>
                  <DifficultyMeter difficulty={featured.difficulty} />
                </span>
              </Link>
            )}

            <ul className="absolute top-6 right-6 hidden w-60 rounded-3xl border border-white/60 bg-white/85 p-2 backdrop-blur-xl md:block">
              <li className="px-3 pt-2 pb-1 eyebrow text-muted">Where we trek</li>
              {regions.map((r) => (
                <li key={r.slug}>
                  <Link href={`/destinations/${r.slug}`} className="flex items-center justify-between rounded-2xl px-3 py-2.5 text-sm font-medium text-ink hover:bg-black/5">
                    {r.name}
                    <span className="rounded-full bg-accent-soft px-2 py-0.5 text-xs font-semibold text-accent">
                      {r.count} {r.count === 1 ? "trek" : "treks"}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
