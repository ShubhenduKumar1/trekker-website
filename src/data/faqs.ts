import type { Faq } from "@/types/trek";

/**
 * General questions shown on the homepage. Answers describe how this website
 * works and avoid promising specific policies — edit them to match your own
 * terms (refunds, payments, age limits, etc.) once they're final.
 */
export const generalFaqs: Faq[] = [
  {
    question: "How do I book a trek?",
    answer:
      "Open a trek, choose a package and (optionally) a preferred date and group size, then tap “Enquire on WhatsApp”. Your guide replies with available dates, the final price and the booking steps. Nothing is booked until that’s confirmed with you.",
  },
  {
    question: "I’ve never trekked before. Where should I start?",
    answer:
      "Filter treks by “Easy” difficulty and read the fitness notes on each trek page. If you’re unsure, send a message with your experience and fitness level and you’ll get an honest suggestion.",
  },
  {
    question: "What’s included in the price?",
    answer:
      "It depends on the trek and package. Each trek page lists confirmed inclusions and exclusions; where they say “to be confirmed”, you’ll receive the full list when you enquire.",
  },
  {
    question: "What happens if the weather turns bad?",
    answer:
      "Mountain weather changes quickly. Your guide may adjust, shorten or pause a route for safety — summits and viewpoints are never guaranteed. Ask about the policy for your departure before you book.",
  },
  {
    question: "Can you plan a private trek for my group?",
    answer:
      "Many treks offer a private / custom group option. Pick it on the trek page or tell us your dates and group size on WhatsApp.",
  },
  {
    question: "What should I pack?",
    answer:
      "Every trek page has a suggested packing checklist you can tick off as you go. Your guide will confirm the final list for your season.",
  },
];
