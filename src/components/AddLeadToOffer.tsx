"use client";

import { useRef, useTransition } from "react";
import { addLeadToOffer } from "@/lib/actions";

type PickerLead = { id: string; name: string; location: string | null };

export function AddLeadToOffer({ offerId, leads }: { offerId: string; leads: PickerLead[] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  if (leads.length === 0) {
    return <span className="text-xs text-neutral-400">All leads added</span>;
  }

  return (
    <form ref={formRef} action={addLeadToOffer}>
      <input type="hidden" name="offerId" value={offerId} />
      <select
        name="leadId"
        defaultValue=""
        disabled={isPending}
        onChange={(e) => {
          if (!e.target.value) return;
          startTransition(() => formRef.current?.requestSubmit());
        }}
        className="rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 py-1.5 text-xs outline-none focus:border-neutral-400 disabled:opacity-60 dark:border-neutral-800 dark:bg-neutral-900 dark:focus:border-neutral-600"
      >
        <option value="">+ Add lead…</option>
        {leads.map((lead) => (
          <option key={lead.id} value={lead.id}>
            {lead.name}
            {lead.location ? ` — ${lead.location}` : ""}
          </option>
        ))}
      </select>
    </form>
  );
}
