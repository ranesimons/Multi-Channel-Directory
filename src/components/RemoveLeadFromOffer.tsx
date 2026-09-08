"use client";

import { useTransition } from "react";
import { X } from "lucide-react";
import { removeLeadFromOffer } from "@/lib/actions";

export function RemoveLeadFromOffer({
  offerId,
  leadId,
  leadName,
}: {
  offerId: string;
  leadId: string;
  leadName: string;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      title={`Remove ${leadName} from this offer`}
      aria-label={`Remove ${leadName} from this offer`}
      onClick={() => startTransition(() => removeLeadFromOffer(offerId, leadId))}
      className="flex h-6 w-6 flex-none items-center justify-center rounded-md text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 disabled:opacity-50 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
    >
      <X size={13} />
    </button>
  );
}
