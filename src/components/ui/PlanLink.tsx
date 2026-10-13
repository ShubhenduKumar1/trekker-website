import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { buildWhatsAppLink, generalEnquiryMessage } from "@/lib/whatsapp";

/**
 * "Plan your adventure" style CTA: opens a general WhatsApp enquiry when a
 * number is configured, otherwise scrolls/navigates to the planning section.
 */
type Props = { children: React.ReactNode; className?: string; fallbackHref?: string; whatsappNumber: string | null };

export function PlanLink({ children, className, fallbackHref = "/contact", whatsappNumber }: Props) {
  const link = buildWhatsAppLink(generalEnquiryMessage(), whatsappNumber);
  if (link.configured) {
    return (
      <a href={link.href} target="_blank" rel="noopener noreferrer" className={className}>
        <MessageCircle aria-hidden className="size-[1.1em]" strokeWidth={2.2} />
        {children}
        <span className="sr-only"> (opens WhatsApp in a new tab)</span>
      </a>
    );
  }
  return (
    <Link href={fallbackHref} className={className}>
      {children}
    </Link>
  );
}
