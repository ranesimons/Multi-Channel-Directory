import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDistanceToNowStrict } from "date-fns";
import { ArrowLeft, MessageCircleMore } from "lucide-react";
import { getOfferDetail, getLeadsForOfferPicker } from "@/lib/queries";
import { MessageBubble } from "@/components/MessageBubble";
import { OfferStatusSelect } from "@/components/OfferStatusSelect";
import { AddLeadToOffer } from "@/components/AddLeadToOffer";
import { RemoveLeadFromOffer } from "@/components/RemoveLeadFromOffer";
import { CHANNEL_LIST, CHANNELS } from "@/lib/channels";
import { STAGE_META } from "@/lib/stage";

export default async function OfferDetailPage({
  params,
}: {
  params: Promise<{ offerId: string }>;
}) {
  const { offerId } = await params;
  const offer = await getOfferDetail(offerId);
  if (!offer) notFound();

  const allLeads = await getLeadsForOfferPicker();
  const linkedIds = new Set(offer.leads.map((l) => l.lead.id));
  const availableLeads = allLeads.filter((l) => !linkedIds.has(l.id));

  return (
    <div className="flex h-full flex-col overflow-hidden bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <div className="flex items-start justify-between gap-4 border-b border-neutral-200 px-5 py-3 dark:border-neutral-800">
        <div className="flex min-w-0 items-start gap-3">
          <Link
            href="/offers"
            className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
            aria-label="Back to offers"
          >
            <ArrowLeft size={15} />
          </Link>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{offer.name}</p>
            <p className="text-xs text-neutral-400">
              {offer.description ? `${offer.description} · ` : ""}
              {offer.leads.length} lead{offer.leads.length === 1 ? "" : "s"} in play
            </p>
          </div>
        </div>
        <div className="flex flex-none items-center gap-2">
          <AddLeadToOffer offerId={offer.id} leads={availableLeads} />
          <OfferStatusSelect offerId={offer.id} status={offer.status} />
        </div>
      </div>

      {offer.leads.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 text-neutral-400">
          <MessageCircleMore size={32} />
          <p className="text-sm">No leads on this offer yet. Add one to pull their conversation in.</p>
        </div>
      ) : (
        <div className="flex flex-1 gap-4 overflow-x-auto p-4">
          {offer.leads.map(({ lead, channels }) => (
            <section
              key={lead.id}
              className="flex w-[380px] flex-none flex-col overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800"
            >
              <div className="flex items-start justify-between gap-2 border-b border-neutral-200 p-3 dark:border-neutral-800">
                <div className="min-w-0">
                  <Link
                    href={`/inbox/${lead.id}`}
                    className="truncate text-sm font-medium hover:underline"
                  >
                    {lead.name}
                  </Link>
                  <div className="mt-0.5 flex items-center gap-1.5">
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${STAGE_META[lead.stage].color}`}
                    >
                      {STAGE_META[lead.stage].label}
                    </span>
                    {lead.location && (
                      <span className="truncate text-[11px] text-neutral-400">{lead.location}</span>
                    )}
                  </div>
                </div>
                <RemoveLeadFromOffer offerId={offer.id} leadId={lead.id} leadName={lead.name} />
              </div>

              <div className="flex items-center gap-1.5 border-b border-neutral-200 px-3 py-2 dark:border-neutral-800">
                {CHANNEL_LIST.map((channel) => {
                  const active = channels.has(channel);
                  const meta = CHANNELS[channel];
                  const Icon = meta.icon;
                  return (
                    <span
                      key={channel}
                      title={active ? meta.label : `No ${meta.label.toLowerCase()} on file`}
                      className={`flex h-6 w-6 items-center justify-center rounded-md ${
                        active ? meta.bg : "bg-transparent"
                      }`}
                    >
                      <Icon
                        size={12}
                        className={active ? meta.color : "text-neutral-200 dark:text-neutral-800"}
                      />
                    </span>
                  );
                })}
              </div>

              <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-3">
                {lead.messages.length === 0 ? (
                  <p className="m-auto text-xs text-neutral-400">No messages yet.</p>
                ) : (
                  lead.messages.map((message) => (
                    <MessageBubble key={message.id} message={message} />
                  ))
                )}
              </div>

              <div className="border-t border-neutral-200 px-3 py-2 text-[11px] text-neutral-400 dark:border-neutral-800">
                {lead.messages.length > 0
                  ? `Last activity ${formatDistanceToNowStrict(lead.messages[lead.messages.length - 1].sentAt, { addSuffix: true })}`
                  : "No activity yet"}
                {" · "}
                <Link href={`/inbox/${lead.id}`} className="hover:underline">
                  Open thread
                </Link>
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
