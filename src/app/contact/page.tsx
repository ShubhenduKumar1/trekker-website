import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/seo";
import { buildWhatsAppLink, generalEnquiryMessage } from "@/lib/whatsapp";
import { PageHeader } from "@/components/layout/PageHeader";
import { ContactPlanner } from "@/components/contact/ContactPlanner";
import { DevNotice } from "@/components/ui/DevNotice";

export const metadata = pageMetadata({
  title: "Contact & Plan Your Trek",
  description: `Get in touch with ${siteConfig.brandName} to plan a trek in Himachal Pradesh or Uttarakhand.`,
  path: "/contact",
});

export default function ContactPage() {
  const wa = buildWhatsAppLink(generalEnquiryMessage());
  const { email, phoneDisplay, baseLocation, social } = siteConfig;
  const methods = [
    wa.configured && { icon: MessageCircle, label: "WhatsApp", value: "Chat with us", href: wa.href, external: true },
    phoneDisplay && { icon: Phone, label: "Phone", value: phoneDisplay, href: `tel:${phoneDisplay.replace(/[^\d+]/g, "")}` },
    email && { icon: Mail, label: "Email", value: email, href: `mailto:${email}` },
    baseLocation && { icon: MapPin, label: "Based in", value: baseLocation },
  ].filter(Boolean) as { icon: typeof Mail; label: string; value: string; href?: string; external?: boolean }[];

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Let’s plan"
        titleMuted="your next trail."
        intro="Tell us a little about what you’re looking for — the region, timing and your experience — and we’ll help you choose a trek."
      />
      <section className="pb-24">
        <div className="container-page grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ContactPlanner />
          </div>
          <div className="lg:col-span-5">
            <h2 className="font-display text-display-sm text-ink">Other ways to reach us</h2>
            {methods.length ? (
              <ul className="card mt-6 divide-y divide-line px-5">
                {methods.map(({ icon: Icon, label, value, href, external }) => (
                  <li key={label} className="flex items-center gap-4 py-5">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent text-white">
                      <Icon aria-hidden className="size-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs text-muted">{label}</p>
                      {href ? (
                        <a
                          href={href}
                          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                          className="font-semibold break-all text-ink hover:underline"
                        >
                          {value}
                        </a>
                      ) : (
                        <p className="font-semibold">{value}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-muted">Contact details are being added. Please check back soon.</p>
            )}
            {social.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-4 text-sm font-semibold">
                {social.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
            <DevNotice className="mt-6">Contact methods come from src/config/site.ts and NEXT_PUBLIC_WHATSAPP_NUMBER.</DevNotice>
          </div>
        </div>
      </section>
    </>
  );
}
