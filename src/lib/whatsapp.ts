import { siteConfig } from "@/config/site";
import type { Trek, TrekPackage } from "@/types/trek";
import { formatDate, formatDuration } from "@/lib/format";

/** Digits only, 8–15 long (E.164 without the "+"). */
export function normalizeWhatsAppNumber(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const digits = raw.replace(/\D/g, "");
  if (digits.length < 8 || digits.length > 15) return null;
  return digits;
}

export type WhatsAppLink =
  | { configured: true; href: string; message: string }
  | { configured: false; href: null; message: string };

/** Builds an official click-to-chat link. Returns `configured: false` instead of a broken URL. */
export function buildWhatsAppLink(
  message: string,
  rawNumber: string | null | undefined = siteConfig.whatsappNumber,
): WhatsAppLink {
  const number = normalizeWhatsAppNumber(rawNumber);
  if (!number) return { configured: false, href: null, message };
  return {
    configured: true,
    href: `https://wa.me/${number}?text=${encodeURIComponent(message)}`,
    message,
  };
}

export function generalEnquiryMessage(): string {
  return "Hi! I found your trekking website and would like to plan a Himalayan trekking experience. Could you help me choose a suitable trek?";
}

export type TrekEnquiry = {
  trek: Pick<Trek, "name" | "state" | "durationDays">;
  pkg?: Pick<TrekPackage, "name"> | null;
  /** ISO date string (yyyy-mm-dd). */
  preferredDate?: string | null;
  participants?: number | null;
};

export function trekEnquiryMessage({ trek, pkg, preferredDate, participants }: TrekEnquiry): string {
  const lines: string[] = [];
  lines.push(`Hi! I'm interested in the ${trek.name}.`);
  lines.push("");
  lines.push(`Trek: ${trek.name}`);
  lines.push(`Destination: ${trek.state}`);
  if (trek.durationDays > 0) lines.push(`Duration: ${formatDuration(trek.durationDays)}`);
  if (pkg?.name) lines.push(`Selected package: ${pkg.name}`);

  const dateLabel = preferredDate ? formatDate(preferredDate) : null;
  if (dateLabel) lines.push(`Preferred date: ${dateLabel}`);
  if (participants && Number.isFinite(participants) && participants > 0) {
    lines.push(`Number of participants: ${participants}`);
  }

  lines.push("");
  lines.push(
    dateLabel
      ? "Please share the complete itinerary, final pricing, inclusions, and booking process, and let me know if this date works."
      : "Please share the complete itinerary, upcoming available dates, final pricing, inclusions, and booking process.",
  );
  return lines.join("\n");
}

export type PlanningEnquiry = {
  region?: string;
  month?: string;
  groupSize?: string;
  experience?: string;
  notes?: string;
};

/** General enquiry enriched with optional planning preferences. Unselected fields are omitted. */
export function planningEnquiryMessage(p: PlanningEnquiry): string {
  const details = [
    p.region && `Region: ${p.region}`,
    p.month && `When: ${p.month}`,
    p.groupSize && `Group size: ${p.groupSize}`,
    p.experience && `Trekking experience: ${p.experience}`,
    p.notes?.trim() && `Notes: ${p.notes.trim().slice(0, 500)}`,
  ].filter(Boolean);
  if (!details.length) return generalEnquiryMessage();
  return [generalEnquiryMessage(), "", ...details].join("\n");
}
