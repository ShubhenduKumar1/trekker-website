import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { DevNotice } from "@/components/ui/DevNotice";

/** Renders organizer-supplied policy text, or an honest "being finalised" message. */
export function PolicyPage({ title, paragraphs, configKey }: { title: string; paragraphs: readonly string[] | null; configKey: string }) {
  return (
    <>
      <PageHeader eyebrow="Policies" title={title} />
      <section className="pb-24">
        <div className="container-narrow max-w-3xl space-y-5 text-lg leading-relaxed text-ink/85">
          {paragraphs?.length ? (
            paragraphs.map((p) => <p key={p}>{p}</p>)
          ) : (
            <>
              <p>
                This policy is being finalised. Before you book, the full terms for your trek will be shared with you directly.
              </p>
              <p>
                Questions in the meantime? <Link href="/contact" className="font-semibold text-accent underline underline-offset-4">Get in touch</Link>.
              </p>
              <DevNotice>Add the policy text to siteConfig.policies.{configKey} in src/config/site.ts.</DevNotice>
            </>
          )}
        </div>
      </section>
    </>
  );
}
