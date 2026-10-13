"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { Trek, TrekPackage } from "@/types/trek";
import { buildWhatsAppLink, trekEnquiryMessage, type WhatsAppLink } from "@/lib/whatsapp";
import { getStartingPrice } from "@/lib/treks";

type BookingState = {
  trek: Trek;
  selectedPackage: TrekPackage | null;
  setPackageId: (id: string) => void;
  preferredDate: string;
  setPreferredDate: (v: string) => void;
  participants: number | null;
  setParticipants: (v: number | null) => void;
  /** Price for the current selection, if known. */
  price: number | undefined;
  whatsapp: WhatsAppLink;
};

const BookingCtx = createContext<BookingState | null>(null);

export function BookingProvider({ trek, children }: { trek: Trek; children: React.ReactNode }) {
  const [packageId, setPackageId] = useState(trek.packages[0]?.id ?? "");
  const [preferredDate, setPreferredDate] = useState("");
  const [participants, setParticipants] = useState<number | null>(null);

  const value = useMemo<BookingState>(() => {
    const selectedPackage = trek.packages.find((p) => p.id === packageId) ?? trek.packages[0] ?? null;
    const price = selectedPackage?.pricePerPerson ?? trek.pricePerPerson ?? getStartingPrice(trek);
    const message = trekEnquiryMessage({ trek, pkg: selectedPackage, preferredDate, participants });
    return {
      trek,
      selectedPackage,
      setPackageId,
      preferredDate,
      setPreferredDate,
      participants,
      setParticipants,
      price,
      whatsapp: buildWhatsAppLink(message),
    };
  }, [trek, packageId, preferredDate, participants]);

  return <BookingCtx.Provider value={value}>{children}</BookingCtx.Provider>;
}

export function useBooking(): BookingState {
  const ctx = useContext(BookingCtx);
  if (!ctx) throw new Error("useBooking must be used inside <BookingProvider>");
  return ctx;
}
