import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/seo";
import { PolicyPage } from "@/components/layout/PolicyPage";

export const metadata = {
  ...pageMetadata({ title: "Cancellation Policy", description: `Cancellation policy for treks with ${siteConfig.brandName}.`, path: "/cancellation-policy" }),
  ...(siteConfig.policies.cancellation ? {} : { robots: { index: false } }),
};

export default function CancellationPage() {
  return <PolicyPage title="Cancellation Policy" paragraphs={siteConfig.policies.cancellation} configKey="cancellation" />;
}
