import type { Stage } from "@/generated/prisma/enums";

export const STAGES: Stage[] = ["NEW", "CONTACTED", "QUALIFIED", "WON", "LOST"];

export const STAGE_META: Record<Stage, { label: string; color: string }> = {
  NEW: { label: "New", color: "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300" },
  CONTACTED: { label: "Contacted", color: "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300" },
  QUALIFIED: { label: "Qualified", color: "bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300" },
  WON: { label: "Won", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300" },
  LOST: { label: "Lost", color: "bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400" },
};
