"use client";

import { useTransition } from "react";
import { updateOfferStatus } from "@/lib/actions";
import { OFFER_STATUSES, OFFER_STATUS_META } from "@/lib/offerStatus";
import type { OfferStatus } from "@/generated/prisma/enums";

export function OfferStatusSelect({ offerId, status }: { offerId: string; status: OfferStatus }) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      value={status}
      disabled={isPending}
      onChange={(e) => {
        const next = e.target.value as OfferStatus;
        startTransition(() => {
          updateOfferStatus(offerId, next);
        });
      }}
      className={`rounded-lg border-0 px-2 py-1 text-xs font-semibold outline-none ring-1 ring-inset ring-black/5 disabled:opacity-60 ${OFFER_STATUS_META[status].color}`}
    >
      {OFFER_STATUSES.map((s) => (
        <option key={s} value={s}>
          {OFFER_STATUS_META[s].label}
        </option>
      ))}
    </select>
  );
}
