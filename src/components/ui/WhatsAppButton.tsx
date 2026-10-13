import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { isDev } from "@/config/site";
import { cn } from "@/lib/format";

type Props = {
  message: string;
  children: React.ReactNode;
  className?: string;
  /** Hide the chat icon. */
  noIcon?: boolean;
  /** Extra context for screen readers, e.g. the trek name. */
  ariaLabel?: string;
};

/**
 * Opens an official WhatsApp click-to-chat link with a prefilled message.
 *
 * When no number is configured:
 * - development: a disabled button with an explanation (no broken URL)
 * - production:  falls back to the /contact page
 */
export function WhatsAppButton({ message, children, className, noIcon, ariaLabel }: Props) {
  const link = buildWhatsAppLink(message);
  const icon = noIcon ? null : <MessageCircle aria-hidden className="size-[1.1em]" strokeWidth={2.2} />;

  if (link.configured) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        aria-label={ariaLabel ? `${ariaLabel} (opens WhatsApp in a new tab)` : undefined}
      >
        {icon}
        {children}
      </a>
    );
  }

  if (isDev) {
    return (
      <button
        type="button"
        disabled
        className={cn(className, "relative")}
        title="Set NEXT_PUBLIC_WHATSAPP_NUMBER (see README) to enable WhatsApp enquiries."
      >
        {icon}
        {children}
        <span className="sr-only"> (WhatsApp number not configured)</span>
      </button>
    );
  }

  return (
    <Link href="/contact" className={className}>
      {icon}
      {children}
    </Link>
  );
}
