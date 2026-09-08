import { format } from "date-fns";
import { ChannelIcon } from "@/components/ChannelBadge";
import { CHANNELS } from "@/lib/channels";
import type { Message } from "@/generated/prisma/client";

export function MessageBubble({ message }: { message: Message }) {
  const isOutbound = message.direction === "OUTBOUND";
  const meta = CHANNELS[message.channel];

  return (
    <div className={`flex ${isOutbound ? "justify-end" : "justify-start"}`}>
      <div className={`flex max-w-[70%] flex-col gap-1 ${isOutbound ? "items-end" : "items-start"}`}>
        <div
          className={`rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
            isOutbound
              ? "rounded-br-sm bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
              : `rounded-bl-sm ${meta.bg} text-neutral-800 dark:text-neutral-100`
          }`}
        >
          {message.body}
        </div>
        <div className="flex items-center gap-1.5 px-1 text-[11px] text-neutral-400">
          <ChannelIcon channel={message.channel} size={11} />
          <span>{meta.label}</span>
          <span>&middot;</span>
          <span>{format(message.sentAt, "MMM d, h:mm a")}</span>
        </div>
      </div>
    </div>
  );
}
