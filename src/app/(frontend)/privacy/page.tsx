import Link from "next/link";
import { getSiteSettings } from "@/lib/site-settings";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/layout/PageHeader";

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return pageMetadata({
    title: "Privacy Policy",
    description: `How ${settings.brandName} handles your information.`,
    path: "/privacy",
    siteUrl: settings.siteUrl,
    brandName: settings.brandName,
  });
}

/**
 * Describes what THIS codebase does as shipped. If you add analytics, forms,
 * cookies or other third-party services, update this page accordingly.
 */
export default function PrivacyPage() {
  return (
    <>
      <PageHeader eyebrow="Policies" title="Privacy Policy" />
      <section className="pb-24">
        <div className="container-narrow max-w-3xl space-y-8 leading-relaxed text-ink/85">
          <div className="space-y-3">
            <h2 className="font-display text-2xl text-ink">What this website collects</h2>
            <p>
              You can browse treks without creating an account or submitting a form. This website does not use advertising or
              analytics cookies. Selections you make on trek pages (such as a preferred date or group size) stay in your browser
              and are only used to prepare your WhatsApp message.
            </p>
            <p>
              Like most websites, our hosting provider may keep standard technical logs (such as IP address and browser type)
              to operate and secure the site.
            </p>
          </div>
          <div className="space-y-3">
            <h2 className="font-display text-2xl text-ink">WhatsApp enquiries</h2>
            <p>
              When you tap an enquiry button, WhatsApp opens with a message prepared for you. Nothing is sent until you press
              send in WhatsApp. Messages you send are handled by WhatsApp under its own privacy policy, and we use the details
              you share only to respond to your enquiry and plan your trek.
            </p>
          </div>
          <div className="space-y-3">
            <h2 className="font-display text-2xl text-ink">Photos and third-party content</h2>
            <p>Some images are loaded from a third-party image service (Unsplash), which may receive standard request information such as your IP address.</p>
          </div>
          <div className="space-y-3">
            <h2 className="font-display text-2xl text-ink">Questions</h2>
            <p>
              To ask about your information or request that we delete our conversation records, please{" "}
              <Link href="/contact" className="font-semibold text-accent underline underline-offset-4">
                contact us
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
