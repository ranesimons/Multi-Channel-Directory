"use client";

import { useEffect } from "react";
import { markLeadRead } from "@/lib/actions";

export function MarkLeadRead({ leadId, hasUnread }: { leadId: string; hasUnread: boolean }) {
  useEffect(() => {
    if (hasUnread) {
      markLeadRead(leadId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leadId, hasUnread]);

  return null;
}
