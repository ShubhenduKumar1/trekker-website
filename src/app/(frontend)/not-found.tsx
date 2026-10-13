import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { btn, arrowNudge } from "@/lib/ui";
import { cn } from "@/lib/format";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <section className="flex min-h-[80svh] items-center pt-32 pb-20">
      <div className="container-narrow text-center">
        <p className="inline-flex items-center gap-2 rounded-full border border-line px-3.5 py-1.5 text-xs font-medium text-ink/75">
          <span className="size-1.5 rounded-full bg-accent" aria-hidden /> 404 · Off the trail
        </p>
        <h1 className="mx-auto mt-6 max-w-2xl font-display text-display-xl">
          This path doesn’t lead anywhere.
          <br />
          <span className="text-ink/45">Let’s get you back on track.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-lg text-muted">The page or trek you’re looking for may have moved or no longer exists.</p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/treks" className={btn.primary}>
            Browse all treks <ArrowRight aria-hidden className={cn("size-4", arrowNudge)} />
          </Link>
          <Link href="/" className={btn.secondary}>
            Back to home
          </Link>
        </div>
      </div>
    </section>
  );
}
