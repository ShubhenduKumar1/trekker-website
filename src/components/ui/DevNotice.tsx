import { TriangleAlert } from "lucide-react";
import { isDev } from "@/config/site";
import { cn } from "@/lib/format";

/** A configuration reminder that only renders in development builds. */
export function DevNotice({ children, className }: { children: React.ReactNode; className?: string }) {
  if (!isDev) return null;
  return (
    <p
      className={cn(
        "flex items-start gap-2 rounded-lg border border-dashed border-amber-500/70 bg-amber-50 px-3 py-2 text-left text-xs leading-relaxed font-medium text-amber-900",
        className,
      )}
    >
      <TriangleAlert aria-hidden className="mt-0.5 size-3.5 shrink-0" />
      <span>
        <span className="font-bold">Setup:</span> {children}
      </span>
    </p>
  );
}
