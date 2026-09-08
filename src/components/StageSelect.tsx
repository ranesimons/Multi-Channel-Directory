"use client";

import { useTransition } from "react";
import { updateStage } from "@/lib/actions";
import { STAGES, STAGE_META } from "@/lib/stage";
import type { Stage } from "@/generated/prisma/enums";

export function StageSelect({ leadId, stage }: { leadId: string; stage: Stage }) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      value={stage}
      disabled={isPending}
      onChange={(e) => {
        const next = e.target.value as Stage;
        startTransition(() => {
          updateStage(leadId, next);
        });
      }}
      className={`rounded-lg border-0 px-2 py-1 text-xs font-semibold outline-none ring-1 ring-inset ring-black/5 disabled:opacity-60 ${STAGE_META[stage].color}`}
    >
      {STAGES.map((s) => (
        <option key={s} value={s}>
          {STAGE_META[s].label}
        </option>
      ))}
    </select>
  );
}
