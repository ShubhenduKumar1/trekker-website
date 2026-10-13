import { getSiteSettings } from "@/lib/site-settings";
import { pageMetadata } from "@/lib/seo";
import { PolicyPage } from "@/components/layout/PolicyPage";

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return {
    ...pageMetadata({
      title: "Terms & Conditions",
      description: `Terms and conditions for treks with ${settings.brandName}.`,
      path: "/terms",
      siteUrl: settings.siteUrl,
      brandName: settings.brandName,
    }),
    ...(settings.policies.terms ? {} : { robots: { index: false } }),
  };
}

export default async function TermsPage() {
  const settings = await getSiteSettings();
  return <PolicyPage title="Terms & Conditions" paragraphs={settings.policies.terms} configKey="terms" />;
}
