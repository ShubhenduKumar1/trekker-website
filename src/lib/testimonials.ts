import { cache } from "react";
import { getPayloadClient } from "@/lib/payload-client";

export type Testimonial = {
  name: string;
  trek?: string;
  quote: string;
  date?: string;
};

/** Real customer feedback, editable in /admin. Empty by design until added. */
export const getTestimonials = cache(async (): Promise<Testimonial[]> => {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({ collection: "testimonials", limit: 100, sort: "id" });
  return docs.map((d) => ({ name: d.name, trek: d.trek ?? undefined, quote: d.quote, date: d.date ?? undefined }));
});
