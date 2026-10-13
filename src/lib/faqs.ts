import { cache } from "react";
import { getPayloadClient } from "@/lib/payload-client";
import type { Faq } from "@/types/trek";

/** General homepage FAQs, editable in /admin. */
export const getGeneralFaqs = cache(async (): Promise<Faq[]> => {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({ collection: "faqs", limit: 100, sort: "order" });
  return docs.map((d) => ({ question: d.question, answer: d.answer }));
});
