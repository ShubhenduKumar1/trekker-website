import { getSiteSettings } from "@/lib/site-settings";
import { pageMetadata } from "@/lib/seo";
import { PolicyPage } from "@/components/layout/PolicyPage";

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return {
    ...pageMetadata({
      title: "Cancellation Policy",
      description: `Cancellation policy for treks with ${settings.brandName}.`,
      path: "/cancellation-policy",
      siteUrl: settings.siteUrl,
      brandName: settings.brandName,
    }),
    ...(settings.policies.cancellation ? {} : { robots: { index: false } }),
  };
}

export default async function CancellationPage() {
  const settings = await getSiteSettings();
  return <PolicyPage title="Cancellation Policy" paragraphs={settings.policies.cancellation} configKey="cancellation" />;
}
