"use client";

import { useId, useMemo, useState } from "react";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { buildWhatsAppLink, planningEnquiryMessage, type PlanningEnquiry } from "@/lib/whatsapp";
import { isDev } from "@/lib/env";
import { btn } from "@/lib/ui";
import { cn } from "@/lib/format";

const fieldCls =
  "h-12 w-full cursor-pointer rounded-xl border border-line bg-white px-4 text-[0.95rem] focus:border-accent focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "Flexible"];

/** Builds a WhatsApp planning message from a few optional choices. No data is sent anywhere by this page. */
export function ContactPlanner({ whatsappNumber }: { whatsappNumber: string | null }) {
  const id = useId();
  const [form, setForm] = useState<PlanningEnquiry>({});
  const set = (k: keyof PlanningEnquiry) => (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value || undefined }));
  const link = useMemo(() => buildWhatsAppLink(planningEnquiryMessage(form), whatsappNumber), [form, whatsappNumber]);

  const select = (key: keyof PlanningEnquiry, label: string, options: string[], placeholder = "No preference") => (
    <div>
      <label htmlFor={`${id}-${key}`} className="mb-1.5 block text-sm font-semibold">
        {label}
      </label>
      <select id={`${id}-${key}`} value={form[key] ?? ""} onChange={set(key)} className={fieldCls}>
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="card p-6 sm:p-8">
      <h2 className="font-display text-display-sm text-ink">Plan your trek</h2>
      <p className="mt-2 text-muted">All optional. Your choices are added to a WhatsApp message you can edit before sending.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {select("region", "Region", ["Himachal Pradesh", "Uttarakhand", "Either"])}
        {select("month", "When", MONTHS)}
        {select("groupSize", "Group size", ["Just me", "2 people", "3–5 people", "6–10 people", "More than 10"])}
        {select("experience", "Trekking experience", ["First trek", "A few treks", "Experienced"])}
        <div className="sm:col-span-2">
          <label htmlFor={`${id}-notes`} className="mb-1.5 block text-sm font-semibold">
            Anything else? <span className="font-normal text-muted">(optional)</span>
          </label>
          <textarea
            id={`${id}-notes`}
            rows={3}
            maxLength={500}
            value={form.notes ?? ""}
            onChange={set("notes")}
            className="w-full rounded-xl border border-line bg-white px-4 py-3 text-[0.95rem] focus:border-accent focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          />
        </div>
      </div>
      {link.configured ? (
        <a href={link.href} target="_blank" rel="noopener noreferrer" className={cn(btn.primary, "mt-6 w-full sm:w-auto")}>
          <MessageCircle aria-hidden className="size-[1.1em]" /> Continue on WhatsApp
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      ) : (
        <div className="mt-6 rounded-xl bg-canvas p-4 text-sm text-ink/80">
          {isDev ? (
            <>WhatsApp isn’t configured yet. Set a number in <code>/admin → Site Settings</code> to enable this button.</>
          ) : (
            <>
              WhatsApp enquiries are being set up. In the meantime, browse the{" "}
              <Link href="/treks" className="font-semibold text-accent underline underline-offset-4">
                trek catalogue
              </Link>
              .
            </>
          )}
        </div>
      )}
    </div>
  );
}
