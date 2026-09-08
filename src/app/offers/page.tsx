import Link from "next/link";
import { formatDistanceToNowStrict } from "date-fns";
import { Plus, Handshake } from "lucide-react";
import { getOffersForList } from "@/lib/queries";
import { CHANNEL_LIST, CHANNELS } from "@/lib/channels";
import { OFFER_STATUSES, OFFER_STATUS_META } from "@/lib/offerStatus";
import type { OfferStatus } from "@/generated/prisma/enums";

export default async function OffersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const statusFilter = OFFER_STATUSES.includes(status as OfferStatus)
    ? (status as OfferStatus)
    : null;

  const allOffers = await getOffersForList();
  const offers = statusFilter ? allOffers.filter((o) => o.status === statusFilter) : allOffers;

  return (
    <div className="flex h-full flex-col overflow-hidden bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-3 dark:border-neutral-800">
        <div>
          <p className="text-sm font-semibold">Offers</p>
          <p className="text-xs text-neutral-400">
            {offers.length} offer{offers.length === 1 ? "" : "s"} &middot; who you&apos;re talking to and where each one stands
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Link
              href="/offers"
              className={`rounded-lg px-2.5 py-1.5 text-xs font-medium ${
                !statusFilter
                  ? "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100"
                  : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
              }`}
            >
              All
            </Link>
            {OFFER_STATUSES.map((s) => (
              <Link
                key={s}
                href={`/offers?status=${s}`}
                className={`rounded-lg px-2.5 py-1.5 text-xs font-medium ${
                  statusFilter === s
                    ? "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100"
                    : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
                }`}
              >
                {OFFER_STATUS_META[s].label}
              </Link>
            ))}
          </div>
          <Link
            href="/offers/new"
            className="flex items-center gap-1.5 rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            <Plus size={13} />
            New offer
          </Link>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {offers.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 p-16 text-neutral-400">
            <Handshake size={32} />
            <p className="text-sm">
              {statusFilter
                ? `No ${OFFER_STATUS_META[statusFilter].label.toLowerCase()} offers.`
                : "No offers yet. Create one to start tracking conversations against it."}
            </p>
          </div>
        ) : (
          <table className="w-full min-w-215 border-collapse text-sm">
            <thead className="sticky top-0 z-10 bg-white dark:bg-neutral-950">
              <tr className="border-b border-neutral-200 text-left text-xs uppercase tracking-wide text-neutral-400 dark:border-neutral-800">
                <th className="px-5 py-2.5 font-medium">Offer</th>
                <th className="px-3 py-2.5 font-medium">Status</th>
                <th className="px-3 py-2.5 font-medium">Leads</th>
                <th className="px-3 py-2.5 font-medium">Channels in play</th>
                <th className="px-3 py-2.5 font-medium">Messages</th>
                <th className="px-5 py-2.5 font-medium">Last activity</th>
              </tr>
            </thead>
            <tbody>
              {offers.map((offer) => (
                <tr
                  key={offer.id}
                  className="border-b border-neutral-100 hover:bg-neutral-50 dark:border-neutral-900 dark:hover:bg-neutral-900/60"
                >
                  <td className="px-5 py-3">
                    <Link href={`/offers/${offer.id}`} className="flex flex-col">
                      <span className="font-medium text-neutral-900 hover:underline dark:text-neutral-100">
                        {offer.name}
                      </span>
                      {offer.description && (
                        <span className="text-xs text-neutral-400">{offer.description}</span>
                      )}
                    </Link>
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${OFFER_STATUS_META[offer.status].color}`}
                    >
                      {OFFER_STATUS_META[offer.status].label}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-xs text-neutral-500">
                    {offer.leadCount === 0 ? "—" : offer.leadCount}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1.5">
                      {CHANNEL_LIST.map((channel) => {
                        const active = offer.channels.has(channel);
                        const meta = CHANNELS[channel];
                        const Icon = meta.icon;
                        return (
                          <span
                            key={channel}
                            title={active ? meta.label : `Not in play on ${meta.label.toLowerCase()}`}
                            className={`flex h-6 w-6 items-center justify-center rounded-md ${
                              active ? meta.bg : "bg-transparent"
                            }`}
                          >
                            <Icon
                              size={13}
                              className={active ? meta.color : "text-neutral-200 dark:text-neutral-800"}
                            />
                          </span>
                        );
                      })}
                    </div>
                  </td>
                  <td className="px-3 py-3 text-xs text-neutral-500">{offer.messageCount}</td>
                  <td className="px-5 py-3 text-xs text-neutral-500">
                    {formatDistanceToNowStrict(offer.lastActivity, { addSuffix: true })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
