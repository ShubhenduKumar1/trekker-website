"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MessageCircle } from "lucide-react";
import { buildWhatsAppLink, generalEnquiryMessage } from "@/lib/whatsapp";

/**
 * Floating general-enquiry button. Hidden on trek pages (they have their own
 * booking bar) and on the contact page, and only shown after scrolling a little.
 */
export function FloatingWhatsApp({ whatsappNumber }: { whatsappNumber: string | null }) {
  const pathname = usePathname() ?? "/";
  const [visible, setVisible] = useState(false);
  const link = buildWhatsAppLink(generalEnquiryMessage(), whatsappNumber);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const hidden = pathname.startsWith("/treks/") || pathname === "/contact";
  if (!link.configured || hidden) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with us on WhatsApp (opens in a new tab)"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.25 }}
          className="fixed right-4 z-30 inline-flex size-14 items-center justify-center rounded-full bg-[#1f8f4e] text-white shadow-lg shadow-black/25 transition-colors hover:bg-[#1a7a43] sm:right-6"
          style={{ bottom: "max(1rem, calc(env(safe-area-inset-bottom) + 0.75rem))" }}
        >
          <MessageCircle aria-hidden className="size-6" strokeWidth={2.2} />
        </motion.a>
      )}
    </AnimatePresence>
  );
}
