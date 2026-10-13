import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { destinations } from "@/data/destinations";
import { buildWhatsAppLink, generalEnquiryMessage } from "@/lib/whatsapp";
import { Wordmark } from "@/components/layout/Wordmark";
import { CurrentYear } from "@/components/layout/CurrentYear";
import { DevNotice } from "@/components/ui/DevNotice";

const linkCls = "text-sm text-muted transition-colors hover:text-ink";

export function Footer() {
  const wa = buildWhatsAppLink(generalEnquiryMessage());
  const { email, phoneDisplay, baseLocation, social, policies } = siteConfig;

  const contact = [
    wa.configured && { label: "WhatsApp", href: wa.href, external: true },
    phoneDisplay && { label: phoneDisplay, href: `tel:${phoneDisplay.replace(/[^\d+]/g, "")}` },
    email && { label: email, href: `mailto:${email}` },
  ].filter(Boolean) as { label: string; href: string; external?: boolean }[];

  return (
    <footer className="bg-white">
      <div className="container-page">
        <div className="grid gap-12 border-t border-line pt-14 pb-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="max-w-xs">
            <Wordmark />
            <p className="mt-4 text-sm leading-relaxed text-muted">{siteConfig.tagline}.</p>
            {baseLocation && <p className="mt-2 text-sm text-muted">{baseLocation}</p>}
          </div>

          <div>
            <h2 className="eyebrow mb-4 text-ink/80">Treks</h2>
            <ul className="space-y-2.5">
              <li>
                <Link href="/treks" className={linkCls}>
                  All treks
                </Link>
              </li>
              {destinations.map((d) => (
                <li key={d.slug}>
                  <Link href={`/destinations/${d.slug}`} className={linkCls}>
                    {d.state}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="eyebrow mb-4 text-ink/80">Explore</h2>
            <ul className="space-y-2.5">
              <li>
                <Link href="/about" className={linkCls}>
                  About the guide
                </Link>
              </li>
              <li>
                <Link href="/contact" className={linkCls}>
                  Contact
                </Link>
              </li>
              {social.map((s) => (
                <li key={s.url}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className={`${linkCls} inline-flex items-center gap-1`}>
                    {s.label} <ArrowUpRight aria-hidden className="size-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="eyebrow mb-4 text-ink/80">Get in touch</h2>
            {contact.length ? (
              <ul className="space-y-2.5">
                {contact.map((c) => (
                  <li key={c.href}>
                    <a
                      href={c.href}
                      {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className={`${linkCls} break-all`}
                    >
                      {c.label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted">
                <Link href="/contact" className="underline underline-offset-4 hover:text-ink">
                  Contact options
                </Link>{" "}
                are being set up.
              </p>
            )}
            {!(wa.configured || email) && social.length === 0 && (
              <DevNotice className="mt-4">Add WhatsApp, email and social links in src/config/site.ts / .env.</DevNotice>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-line py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © <CurrentYear /> {siteConfig.brandName}
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            <li>
              <Link href="/privacy" className="hover:text-ink">
                Privacy
              </Link>
            </li>
            {policies.terms && (
              <li>
                <Link href="/terms" className="hover:text-ink">
                  Terms of service
                </Link>
              </li>
            )}
            {policies.cancellation && (
              <li>
                <Link href="/cancellation-policy" className="hover:text-ink">
                  Cancellation policy
                </Link>
              </li>
            )}
          </ul>
          <p>Himachal Pradesh &amp; Uttarakhand, India</p>
        </div>
      </div>
    </footer>
  );
}
