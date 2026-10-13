"use client";

import type { Faq } from "@/types/trek";
import { FaqCard } from "@/components/home/HomeFaq";

export function FaqList({ faqs }: { faqs: Faq[] }) {
  return <FaqCard faqs={faqs} defaultOpen={null} />;
}
