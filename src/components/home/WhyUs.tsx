import { Check, MapPin, MessageCircle, ShieldCheck, Users } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/format";

/* Small decorative compositions for each card. They illustrate ideas — they don't show real data. */

function Bubble({ children, className, accent }: { children: React.ReactNode; className?: string; accent?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-2xl border px-3 py-2 text-xs shadow-[0_10px_24px_-16px_rgb(0_0_0/0.3)]",
        accent ? "border-accent bg-accent text-white" : "border-line/80 bg-white",
        className,
      )}
    >
      {children}
    </div>
  );
}

const VISUALS = {
  group: (
    <div className="flex flex-col items-center gap-3">
      <div className="flex -space-x-2">
        {["bg-[#c7d7ff]", "bg-[#ffd9a8]", "bg-[#bfe8d3]", "bg-[#f6c9d2]"].map((c) => (
          <span key={c} className={cn("flex size-10 items-center justify-center rounded-full border-2 border-white", c)}>
            <Users className="size-4 text-ink/50" />
          </span>
        ))}
      </div>
      <Bubble className="font-medium">Small group · plenty of time to talk</Bubble>
    </div>
  ),
  guidance: (
    <div className="w-full max-w-[15rem] space-y-2">
      <Bubble className="mr-8">Which trek suits a first-timer in winter?</Bubble>
      <Bubble accent className="ml-8">Let’s look at your fitness and dates together.</Bubble>
    </div>
  ),
  local: (
    <div className="relative flex w-full max-w-[15rem] items-center justify-between">
      <span aria-hidden className="absolute inset-x-4 top-1/2 h-px -translate-y-1/2 border-t border-dashed border-ink/25" />
      {["Base", "Camp", "Ridge"].map((s, i) => (
        <span key={s} className="relative flex flex-col items-center gap-1.5">
          <span className={cn("flex size-9 items-center justify-center rounded-full border border-line bg-white", i === 2 && "border-accent")}>
            <MapPin className={cn("size-4", i === 2 ? "text-accent" : "text-ink/50")} />
          </span>
          <span className="text-[0.7rem] font-medium text-muted">{s}</span>
        </span>
      ))}
    </div>
  ),
  clear: (
    <div className="w-full max-w-[14rem] space-y-1.5">
      {["Day-by-day itinerary", "What’s included", "What’s not included"].map((r) => (
        <Bubble key={r} className="flex items-center justify-between">
          {r}
          <Check className="size-3.5 text-easy" />
        </Bubble>
      ))}
    </div>
  ),
  support: (
    <div className="flex flex-col items-center gap-3">
      <span className="flex size-14 items-center justify-center rounded-2xl border border-line bg-white shadow-[0_10px_24px_-16px_rgb(0_0_0/0.3)]">
        <MessageCircle className="size-6 text-accent" />
      </span>
      <Bubble className="font-medium">Questions before you go? Just ask.</Bubble>
    </div>
  ),
  safety: (
    <div className="relative flex items-center justify-center">
      <span aria-hidden className="absolute size-28 rounded-full border border-accent/15" />
      <span aria-hidden className="absolute size-20 rounded-full border border-accent/25" />
      <span className="relative flex size-14 items-center justify-center rounded-2xl border border-line bg-white shadow-[0_10px_24px_-16px_rgb(0_0_0/0.3)]">
        <ShieldCheck className="size-6 text-accent" />
      </span>
    </div>
  ),
};

const FEATURES = [
  { key: "group", label: "Small groups", title: "Trek with a few, not a crowd", text: "Groups are kept small so the pace stays comfortable and everyone gets attention on the trail." },
  { key: "guidance", label: "Personal guidance", title: "Help choosing the right trek", text: "Share your experience and goals and get an honest recommendation — not a sales pitch." },
  { key: "local", label: "Local knowledge", title: "Routes planned with care", text: "Campsites, seasons and route choices planned by someone who spends time on these trails." },
  { key: "clear", label: "Clear packages", title: "Know what to expect", text: "Itineraries, inclusions and exclusions laid out plainly, so there are no surprises later." },
  { key: "support", label: "Planning support", title: "Answers on WhatsApp", text: "Ask about fitness, gear or travel directly — before you book and while you prepare." },
  { key: "safety", label: "Safety first", title: "Decisions made for the group", text: "Weather and trail conditions come first. Your guide may adjust the plan to keep everyone safe." },
] as const;

const TINTS = ["bg-tint-sky", "bg-tint-sand", "bg-tint-mint", "bg-canvas", "bg-tint-rose", "bg-tint-sky"];

export function WhyUs() {
  return (
    <section aria-labelledby="why-title" className="section-y bg-canvas">
      <div className="container-page">
        <SectionHeading
          id="why-title"
          eyebrow="Why trek with us"
          title="Personal, guide-led treks."
          titleMuted="Planned with care, start to finish."
          intro="An independent way to experience the Himalaya — small groups, clear information and a guide you can talk to."
        />
        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal as="li" key={f.key} delay={(i % 3) * 0.08} className="card flex flex-col p-2">
              <div aria-hidden className={cn("flex aspect-[16/10] items-center justify-center overflow-hidden rounded-[1.4rem] p-6", TINTS[i])}>
                {VISUALS[f.key]}
              </div>
              <div className="px-4 pt-5 pb-4">
                <p className="eyebrow text-muted">{f.label}</p>
                <h3 className="mt-2 text-lg font-semibold tracking-tight">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{f.text}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

