import type { Difficulty } from "@/types/trek";
import { cn } from "@/lib/format";

const LEVEL: Record<Difficulty, { n: number; color: string }> = {
  Easy: { n: 1, color: "bg-easy" },
  Moderate: { n: 2, color: "bg-moderate" },
  Difficult: { n: 3, color: "bg-difficult" },
};

/** Three small bars plus the label, so difficulty never relies on colour alone. */
export function DifficultyMeter({ difficulty, tone = "dark", className }: { difficulty: Difficulty; tone?: "light" | "dark"; className?: string }) {
  const { n, color } = LEVEL[difficulty];
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span aria-hidden className="flex items-end gap-[3px]">
        {[1, 2, 3].map((i) => (
          <span
            key={i}
            style={{ height: `${4 + i * 3}px` }}
            className={cn("w-[4px] rounded-full", i <= n ? color : tone === "light" ? "bg-white/30" : "bg-ink/12")}
          />
        ))}
      </span>
      <span>{difficulty}</span>
    </span>
  );
}
