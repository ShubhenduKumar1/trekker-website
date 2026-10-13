import { Quote } from "lucide-react";
import { getTestimonials } from "@/lib/testimonials";
import { Reveal } from "@/components/ui/Reveal";
import { DevNotice } from "@/components/ui/DevNotice";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * Shows real testimonials only. With none configured, visitors see nothing;
 * developers see a reminder.
 */
export async function Testimonials() {
  const testimonials = await getTestimonials();
  if (!testimonials.length) {
    return (
      <div className="container-page">
        <DevNotice className="my-6">
          Testimonials are hidden until you add real, permitted customer feedback in /admin → Testimonials.
        </DevNotice>
      </div>
    );
  }

  return (
    <section aria-labelledby="testimonials-title" className="section-y bg-canvas">
      <div className="container-page">
        <SectionHeading id="testimonials-title" eyebrow="From fellow trekkers" title="Stories from the trail." />
        <ul className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal as="li" key={`${t.name}-${i}`} delay={(i % 3) * 0.08}>
              <figure className="card flex h-full flex-col p-7">
                <Quote aria-hidden className="size-6 text-accent" />
                <blockquote className="mt-4 flex-1 leading-relaxed text-ink">{t.quote}</blockquote>
                <figcaption className="mt-6 text-sm">
                  <span className="font-semibold">{t.name}</span>
                  {(t.trek || t.date) && <span className="block text-muted">{[t.trek, t.date].filter(Boolean).join(" · ")}</span>}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
