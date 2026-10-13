"use client";

import { useEffect, useState } from "react";
import { PriceTag } from "@/components/booking/BookingPanel";
import { EnquireButton } from "@/components/booking/EnquireButton";
import { btn } from "@/lib/ui";
import { cn } from "@/lib/format";

/**
 * Compact sticky enquiry bar for small screens. It hides while the footer is
 * on screen so it never covers footer links, and the page reserves space for it.
 */
export function MobileBookingBar() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const io = new IntersectionObserver(([entry]) => setHidden(entry.isIntersecting), { threshold: 0 });
    io.observe(footer);
    return () => io.disconnect();
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 backdrop-blur-md transition-transform duration-300 lg:hidden motion-reduce:transition-none",
        hidden && "translate-y-full",
      )}
      aria-hidden={hidden || undefined}
      inert={hidden}
    >
      <div className="container-page flex items-center justify-between gap-4 pt-3 pb-safe">
        <div className="min-w-0 [&_p]:text-lg [&_span.font-display]:text-2xl">
          <PriceTag />
        </div>
        <EnquireButton className={cn(btn.primary, "shrink-0 px-5")}>Enquire</EnquireButton>
      </div>
    </div>
  );
}
