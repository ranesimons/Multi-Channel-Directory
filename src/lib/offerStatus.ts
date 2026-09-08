import type { OfferStatus } from "@/generated/prisma/enums";

export const OFFER_STATUSES: OfferStatus[] = ["OPEN", "NEGOTIATING", "WON", "LOST"];

export const OFFER_STATUS_META: Record<OfferStatus, { label: string; color: string }> = {
  OPEN: { label: "Open", color: "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300" },
  NEGOTIATING: {
    label: "Negotiating",
    color: "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
  },
  WON: { label: "Won", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300" },
  LOST: { label: "Lost", color: "bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400" },
};
