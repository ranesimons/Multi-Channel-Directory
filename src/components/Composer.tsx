"use client";

import { useRef, useState } from "react";
import { Send } from "lucide-react";
import { sendMessage } from "@/lib/actions";
import { CHANNELS, CHANNEL_LIST, channelContactValue } from "@/lib/channels";
import type { Channel } from "@/generated/prisma/enums";

type LeadContact = {
  email: string | null;
  phone: string | null;
  facebookHandle: string | null;
  instagramHandle: string | null;
  whatsappNumber: string | null;
};

export function Composer({
  leadId,
  lead,
  defaultChannel,
}: {
  leadId: string;
  lead: LeadContact;
  defaultChannel: Channel;
}) {
  const [channel, setChannel] = useState<Channel>(defaultChannel);
  const [pending, setPending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const contactValue = channelContactValue(channel, lead);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        setPending(true);
        await sendMessage(formData);
        formRef.current?.reset();
        setPending(false);
      }}
      className="border-t border-neutral-200 p-3 dark:border-neutral-800"
    >
      <input type="hidden" name="leadId" value={leadId} />
      <input type="hidden" name="channel" value={channel} />

      <div className="mb-2 flex flex-wrap items-center gap-1">
        {CHANNEL_LIST.map((c) => {
          const meta = CHANNELS[c];
          const Icon = meta.icon;
          const active = channel === c;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setChannel(c)}
              className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium transition-colors ${
                active ? `${meta.bg} ${meta.color}` : "text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              }`}
            >
              <Icon size={12} />
              {meta.label}
            </button>
          );
        })}
        <span className="ml-auto text-[11px] text-neutral-400">
          {contactValue ? `to ${contactValue}` : "no contact info on file for this channel"}
        </span>
      </div>

      <div className="flex items-end gap-2">
        <textarea
          name="body"
          required
          rows={1}
          placeholder={`Write a ${CHANNELS[channel].label} message...`}
          className="max-h-32 flex-1 resize-none rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm outline-none focus:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-900 dark:focus:border-neutral-600"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              formRef.current?.requestSubmit();
            }
          }}
        />
        <button
          type="submit"
          disabled={pending}
          className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-neutral-900 text-white disabled:opacity-50 dark:bg-white dark:text-neutral-900"
        >
          <Send size={15} />
        </button>
      </div>
    </form>
  );
}
