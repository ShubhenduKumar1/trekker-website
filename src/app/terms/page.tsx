import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/seo";
import { PolicyPage } from "@/components/layout/PolicyPage";

export const metadata = {
  ...pageMetadata({ title: "Terms & Conditions", description: `Terms and conditions for treks with ${siteConfig.brandName}.`, path: "/terms" }),
  ...(siteConfig.policies.terms ? {} : { robots: { index: false } }),
};

export default function TermsPage() {
  return <PolicyPage title="Terms & Conditions" paragraphs={siteConfig.policies.terms} configKey="terms" />;
}
