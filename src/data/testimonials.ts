/**
 * Real customer feedback only. Add an entry only with the person's permission,
 * using their own words. While this list is empty the testimonials section is
 * hidden from visitors (a reminder is shown in development).
 */
export type Testimonial = {
  name: string;
  trek?: string;
  quote: string;
  /** e.g. "Dec 2025" */
  date?: string;
};

export const testimonials: Testimonial[] = [];
