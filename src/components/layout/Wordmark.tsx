import Image from "next/image";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/format";

export function Wordmark({ tone = "dark", className }: { tone?: "light" | "dark"; className?: string }) {
  if (siteConfig.logoSrc) {
    return <Image src={siteConfig.logoSrc} alt={siteConfig.brandName} width={140} height={32} className={cn("h-7 w-auto", className)} />;
  }
  return (
    <span className={cn("flex items-center gap-2 leading-none", className)}>
      <svg aria-hidden viewBox="0 0 28 20" className="h-[18px] w-[25px] text-accent">
        <path d="M1 19 10 3.5l4.2 7.2L17.5 6 27 19Z" fill="currentColor" />
        <path d="m10 3.5 2.8 4.8-2.8 1.8-2.4-1.7Z" fill="#fff" fillOpacity=".85" />
      </svg>
      <span className={cn("text-[1.05rem] font-semibold tracking-[-0.02em]", tone === "light" ? "text-white" : "text-ink")}>
        {siteConfig.wordmark.primary}
        <span className={tone === "light" ? "text-white/60" : "text-ink/45"}> {siteConfig.wordmark.secondary}</span>
      </span>
    </span>
  );
}
