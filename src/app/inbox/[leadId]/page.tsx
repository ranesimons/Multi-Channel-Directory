import { notFound } from "next/navigation";
import { getLeadDetail } from "@/lib/queries";
import { MessageBubble } from "@/components/MessageBubble";
import { Composer } from "@/components/Composer";
import { LeadDetailsPanel } from "@/components/LeadDetailsPanel";
import { MarkLeadRead } from "@/components/MarkLeadRead";

export default async function LeadConversationPage({
  params,
}: {
  params: Promise<{ leadId: string }>;
}) {
  const { leadId } = await params;
  const lead = await getLeadDetail(leadId);
  if (!lead) notFound();

  const hasUnread = lead.messages.some((m) => !m.read);
  const lastChannel = lead.messages.at(-1)?.channel ?? "EMAIL";

  return (
    <div className="flex min-w-0 flex-1">
      <MarkLeadRead leadId={lead.id} hasUnread={hasUnread} />
      <section className="flex min-w-0 flex-1 flex-col">
        <div className="border-b border-neutral-200 px-5 py-3 dark:border-neutral-800">
          <p className="text-sm font-semibold">{lead.name}</p>
          <p className="text-xs text-neutral-400">
            {lead.messages.length} message{lead.messages.length === 1 ? "" : "s"} across all channels
          </p>
        </div>

        <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-5">
          {lead.messages.length === 0 && (
            <p className="m-auto text-sm text-neutral-400">No conversation yet — send the first message.</p>
          )}
          {lead.messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </div>

        <Composer leadId={lead.id} lead={lead} defaultChannel={lastChannel} />
      </section>

      <LeadDetailsPanel lead={lead} />
    </div>
  );
}
