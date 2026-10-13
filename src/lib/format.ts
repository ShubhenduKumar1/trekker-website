const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export const PRICE_FALLBACK = "Contact us for pricing";

export function formatPrice(value: number | null | undefined): string | null {
  if (value == null || !Number.isFinite(value) || value <= 0) return null;
  return inr.format(value);
}

export function formatDuration(days: number): string {
  if (!Number.isFinite(days) || days <= 0) return "";
  const nights = days - 1;
  if (nights <= 0) return "1 day";
  return `${days} days / ${nights} ${nights === 1 ? "night" : "nights"}`;
}

export function formatDurationShort(days: number): string {
  if (!Number.isFinite(days) || days <= 0) return "";
  return `${days}D/${Math.max(days - 1, 0)}N`;
}

export function formatAltitude(m: number | null | undefined): string | null {
  if (m == null || !Number.isFinite(m) || m <= 0) return null;
  return `${new Intl.NumberFormat("en-IN").format(Math.round(m))} m`;
}

export function formatDistance(km: number | null | undefined): string | null {
  if (km == null || !Number.isFinite(km) || km <= 0) return null;
  return `${km} km`;
}

/** Formats a yyyy-mm-dd string without timezone shifts. Returns null for invalid input. */
export function formatDate(iso: string): string | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return null;
  const [, y, m, d] = match.map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  if (date.getUTCMonth() !== m - 1) return null;
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
