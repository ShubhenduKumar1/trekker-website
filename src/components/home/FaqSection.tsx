import { generalFaqs } from "@/data/faqs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { FaqCard, HomeFaqFooter } from "@/components/home/HomeFaq";

export function FaqSection() {
  return (
    <section aria-labelledby="faq-title" className="section-y">
      <div className="container-page">
        <SectionHeading id="faq-title" eyebrow="FAQ" title="Good questions." titleMuted="Clear answers." />
        <Reveal className="mx-auto mt-12 max-w-2xl">
          <FaqCard faqs={generalFaqs} />
          <HomeFaqFooter />
        </Reveal>
      </div>
    </section>
  );
}
