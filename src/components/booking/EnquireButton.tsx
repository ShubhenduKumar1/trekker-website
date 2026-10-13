"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { useBooking } from "@/components/booking/BookingContext";
import { isDev } from "@/lib/env";
import { cn } from "@/lib/format";

/** WhatsApp CTA that always reflects the visitor's current selections. */
export function EnquireButton({ className, children = "Enquire on WhatsApp" }: { className?: string; children?: React.ReactNode }) {
  const { whatsapp, trek } = useBooking();
  const content = (
    <>
      <MessageCircle aria-hidden className="size-[1.1em]" strokeWidth={2.2} />
      {children}
    </>
  );

  if (whatsapp.configured) {
    return (
      <a
        href={whatsapp.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        aria-label={`Enquire about the ${trek.name} on WhatsApp (opens in a new tab)`}
      >
        {content}
      </a>
    );
  }
  if (isDev) {
    return (
      <button
        type="button"
        disabled
        className={cn(className)}
        title="Set a WhatsApp number in /admin → Site Settings to enable WhatsApp enquiries."
      >
        {content}
        <span className="sr-only"> (WhatsApp number not configured)</span>
      </button>
    );
  }
  return (
    <Link href="/contact" className={className}>
      {content}
    </Link>
  );
}
