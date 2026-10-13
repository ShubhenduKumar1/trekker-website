"use client";

import { useState } from "react";
import Link from "next/link";
import type { Faq } from "@/types/trek";
import { Disclosure } from "@/components/ui/Disclosure";

/** FAQ list presented as one card with hairline dividers. */
export function FaqCard({ faqs, defaultOpen = 0 }: { faqs: Faq[]; defaultOpen?: number | null }) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  if (!faqs.length) return null;
  return (
    <div className="card divide-y divide-line overflow-hidden">
      {faqs.map((f, i) => (
        <Disclosure
          key={f.question}
          open={open === i}
          onToggle={() => setOpen(open === i ? null : i)}
          buttonClassName="px-5 py-4 sm:px-6"
          summary={<span className="block font-medium text-ink">{f.question}</span>}
          variant="plain"
        >
          <p className="max-w-2xl px-5 pb-5 text-sm leading-relaxed text-muted sm:px-6">{f.answer}</p>
        </Disclosure>
      ))}
    </div>
  );
}

export function HomeFaqFooter() {
  return (
    <p className="mt-6 text-center text-sm text-muted">
      Still have a question?{" "}
      <Link href="/contact" className="font-medium text-accent hover:underline">
        Get in touch
      </Link>
    </p>
  );
}
