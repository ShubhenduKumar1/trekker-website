import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { generalEnquiryMessage } from "@/lib/whatsapp";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { DevNotice } from "@/components/ui/DevNotice";
import { getSiteSettings } from "@/lib/site-settings";
import { btn, arrowNudge } from "@/lib/ui";
import { cn } from "@/lib/format";

/** Accent call-to-action band with a dotted pattern. */
export async function FinalCta() {
  const { whatsappNumber } = await getSiteSettings();
  return (
    <section id="plan" aria-labelledby="cta-title" className="pb-20 sm:pb-28">
      <div className="container-page">
        <Reveal className="dots relative overflow-hidden rounded-[2rem] bg-accent px-6 py-20 text-center text-white sm:px-12 sm:py-24">
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_45%,var(--color-accent)_30%,transparent_100%)]" />
          <div className="relative">
            <p className="eyebrow text-white/75">Let’s plan it together</p>
            <h2 id="cta-title" className="mx-auto mt-4 max-w-2xl font-display text-display-lg">
              The Mountains Are Calling.
            </h2>
            <p className="mx-auto mt-5 max-w-lg leading-relaxed text-white/85">
              Tell us what kind of adventure you are looking for. Let’s find your next trail.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/treks" className={cn(btn.light, "px-7")}>
                Explore All Treks <ArrowRight aria-hidden className={cn("size-4", arrowNudge)} />
              </Link>
              <WhatsAppButton
                message={generalEnquiryMessage()}
                whatsappNumber={whatsappNumber}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/40 px-7 text-sm font-semibold text-white transition-colors hover:bg-white/10 disabled:opacity-60"
              >
                Plan on WhatsApp
              </WhatsAppButton>
            </div>
          </div>
        </Reveal>
        {!whatsappNumber && (
          <DevNotice className="mx-auto mt-4 max-w-md">
            WhatsApp buttons are disabled until a WhatsApp number is set in /admin → Site Settings. In production they link to /contact instead.
          </DevNotice>
        )}
      </div>
    </section>
  );
}
