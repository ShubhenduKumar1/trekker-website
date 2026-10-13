import { CheckCheck, Compass, MessageCircle, Route } from "lucide-react";
import type { Trek } from "@/types/trek";
import { trekEnquiryMessage } from "@/lib/whatsapp";
import { formatDurationShort, cn } from "@/lib/format";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

/** Three-step overview of the visitor journey, each with a small live "preview" built from real catalog data. */
export function HowItWorks({ treks, featured }: { treks: Trek[]; featured?: Trek }) {
  const sample = featured ?? treks[0];
  const message = sample ? trekEnquiryMessage({ trek: sample }).split("\n").slice(0, 5) : [];

  const steps = [
    {
      label: "Discover",
      title: "Find a trek that fits",
      text: "Browse treks across Himachal and Uttarakhand, filter by season, difficulty and duration, and read every day of the plan.",
      tint: "bg-tint-sky",
      visual: (
        <div className="w-full rounded-2xl border border-line/80 bg-white p-3 shadow-[0_12px_30px_-18px_rgb(0_0_0/0.25)]">
          <p className="flex items-center gap-2 px-1 pb-2 text-xs font-semibold text-ink">
            <Compass aria-hidden className="size-3.5 text-accent" /> Treks for you
          </p>
          <ul className="space-y-1.5">
            {treks.slice(0, 3).map((t, i) => (
              <li key={t.id} className={cn("flex items-center justify-between rounded-xl px-2.5 py-2 text-xs", i === 0 ? "bg-accent-soft" : "bg-canvas")}>
                <span className="min-w-0 truncate font-medium text-ink">{t.name}</span>
                <span className="ml-2 shrink-0 text-muted">
                  {formatDurationShort(t.durationDays)} · {t.difficulty}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ),
    },
    {
      label: "Connect",
      title: "Plan it together",
      text: "Pick a package, a preferred date and your group size. Your WhatsApp message is written for you — just press send.",
      tint: "bg-tint-sand",
      visual: (
        <div className="w-full rounded-2xl border border-line/80 bg-white p-3 shadow-[0_12px_30px_-18px_rgb(0_0_0/0.25)]">
          <p className="flex items-center justify-between px-1 pb-2 text-xs font-semibold text-ink">
            <span className="flex items-center gap-2">
              <MessageCircle aria-hidden className="size-3.5 text-accent" /> WhatsApp
            </span>
            <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[0.65rem] font-semibold text-accent">Ready to send</span>
          </p>
          <div className="rounded-xl rounded-tr-sm bg-[#e7f7e9] px-3 py-2.5 text-[0.7rem] leading-relaxed text-ink/80">
            {message.filter(Boolean).map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <p className="mt-2 flex items-center justify-end gap-1 text-[0.65rem] text-muted">
            <CheckCheck aria-hidden className="size-3" /> You review before sending
          </p>
        </div>
      ),
    },
    {
      label: "Explore",
      title: "Walk into the mountains",
      text: "Your guide confirms dates, final price and what’s included — then it’s just you, the trail and a small group.",
      tint: "bg-tint-mint",
      visual: sample ? (
        <div className="w-full rounded-2xl border border-line/80 bg-white p-3 shadow-[0_12px_30px_-18px_rgb(0_0_0/0.25)]">
          <p className="flex items-center gap-2 px-1 pb-2 text-xs font-semibold text-ink">
            <Route aria-hidden className="size-3.5 text-accent" /> {sample.name}
          </p>
          <ol className="relative space-y-1.5 pl-5">
            <span aria-hidden className="absolute top-2 bottom-2 left-[0.45rem] w-px bg-line" />
            {sample.itinerary.slice(0, 3).map((d) => (
              <li key={d.day} className="relative flex items-center justify-between rounded-xl bg-canvas px-2.5 py-2 text-xs">
                <span aria-hidden className="absolute top-1/2 -left-[1.05rem] size-2 -translate-y-1/2 rounded-full border-2 border-accent bg-white" />
                <span className="min-w-0 truncate font-medium text-ink">{d.title}</span>
                <span className="ml-2 shrink-0 text-muted">Day {d.day}</span>
              </li>
            ))}
          </ol>
        </div>
      ) : null,
    },
  ];

  return (
    <section id="discover" aria-labelledby="how-title" className="section-y">
      <div className="container-page">
        <SectionHeading
          id="how-title"
          eyebrow="How it works"
          title="From a first look"
          titleMuted="to your first summit."
          intro="Discover a trail, plan it with your guide on WhatsApp, and head into the Himalaya with everything clear."
        />
        <ol className="mt-14 grid gap-5 md:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal as="li" key={s.label} delay={i * 0.08} className="flex min-w-0 flex-col">
              <div className={cn("flex aspect-[5/4] items-center justify-center rounded-[1.75rem] p-4 sm:p-8", s.tint)}>{s.visual}</div>
              <div className="px-1 pt-6">
                <p className="text-xs font-medium text-muted">
                  {String(i + 1).padStart(2, "0")} · {s.label}
                </p>
                <h3 className="mt-2 text-lg font-semibold tracking-tight">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
