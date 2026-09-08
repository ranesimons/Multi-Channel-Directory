import { formatDistanceToNow } from "date-fns";
import { StageSelect } from "@/components/StageSelect";
import { NoteForm } from "@/components/NoteForm";
import { ChannelIcon } from "@/components/ChannelBadge";
import { CHANNELS, CHANNEL_LIST, channelContactValue } from "@/lib/channels";
import type { getLeadDetail } from "@/lib/queries";

type LeadDetail = NonNullable<Awaited<ReturnType<typeof getLeadDetail>>>;

export function LeadDetailsPanel({ lead }: { lead: LeadDetail }) {
  return (
    <div className="flex h-full w-[300px] flex-none flex-col overflow-y-auto border-l border-neutral-200 dark:border-neutral-800">
      <div className="flex flex-col items-center gap-2 border-b border-neutral-200 p-5 dark:border-neutral-800">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-200 text-lg font-semibold text-neutral-600 dark:bg-neutral-700 dark:text-neutral-200">
          {lead.name
            .split(" ")
            .map((p) => p[0])
            .slice(0, 2)
            .join("")}
        </span>
        <p className="text-sm font-semibold">{lead.name}</p>
        {lead.location && <p className="text-xs text-neutral-400">{lead.location}</p>}
        <StageSelect leadId={lead.id} stage={lead.stage} />
      </div>

      {lead.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 border-b border-neutral-200 p-4 dark:border-neutral-800">
          {lead.tags.map(({ tag }) => (
            <span
              key={tag.id}
              className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}

      <div className="border-b border-neutral-200 p-4 dark:border-neutral-800">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-400">
          Contact channels
        </p>
        <ul className="flex flex-col gap-2">
          {CHANNEL_LIST.map((c) => {
            const value = channelContactValue(c, lead);
            return (
              <li key={c} className="flex items-center gap-2 text-xs">
                <ChannelIcon channel={c} size={13} />
                <span className={value ? "text-neutral-700 dark:text-neutral-200" : "text-neutral-300 dark:text-neutral-600"}>
                  {value ?? `No ${CHANNELS[c].label.toLowerCase()} on file`}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Notes</p>
        <NoteForm leadId={lead.id} />
        <div className="flex flex-col gap-2">
          {lead.notes.length === 0 && <p className="text-xs text-neutral-400">No notes yet.</p>}
          {lead.notes.map((note) => (
            <div
              key={note.id}
              className="rounded-lg bg-amber-50 p-2.5 text-xs text-neutral-700 dark:bg-amber-950/30 dark:text-neutral-200"
            >
              <p>{note.body}</p>
              <p className="mt-1 text-[10px] text-neutral-400">
                {formatDistanceToNow(note.createdAt, { addSuffix: true })}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
