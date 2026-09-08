"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { formatDistanceToNowStrict } from "date-fns";
import { Search } from "lucide-react";
import { ChannelDot } from "@/components/ChannelBadge";
import { STAGE_META } from "@/lib/stage";
import { CHANNELS, CHANNEL_LIST } from "@/lib/channels";
import type { Channel } from "@/generated/prisma/enums";
import type { getLeadsForList } from "@/lib/queries";

type LeadRow = Awaited<ReturnType<typeof getLeadsForList>>[number];

export function LeadListClient({ leads }: { leads: LeadRow[] }) {
  const [query, setQuery] = useState("");
  const [channelFilter, setChannelFilter] = useState<Channel | "ALL">("ALL");
  const pathname = usePathname();

  const filtered = useMemo(() => {
    return leads.filter((lead) => {
      const matchesQuery = lead.name.toLowerCase().includes(query.toLowerCase());
      const matchesChannel =
        channelFilter === "ALL" || lead.lastMessage?.channel === channelFilter;
      return matchesQuery && matchesChannel;
    });
  }, [leads, query, channelFilter]);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-neutral-200 p-3 dark:border-neutral-800">
        <div className="relative">
          <Search
            size={15}
            className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search leads..."
            className="w-full rounded-lg border border-neutral-200 bg-neutral-50 py-1.5 pl-8 pr-2 text-sm outline-none focus:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-900 dark:focus:border-neutral-600"
          />
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          <button
            onClick={() => setChannelFilter("ALL")}
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              channelFilter === "ALL"
                ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
            }`}
          >
            All
          </button>
          {CHANNEL_LIST.map((c) => {
            const meta = CHANNELS[c];
            const Icon = meta.icon;
            const active = channelFilter === c;
            return (
              <button
                key={c}
                onClick={() => setChannelFilter(active ? "ALL" : c)}
                title={meta.label}
                className={`rounded-full p-1 ${
                  active ? meta.bg : "bg-neutral-100 dark:bg-neutral-800"
                }`}
              >
                <Icon size={13} className={active ? meta.color : "text-neutral-400"} />
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 && (
          <p className="p-4 text-center text-sm text-neutral-400">No leads found</p>
        )}
        {filtered.map((lead) => {
          const isActive = pathname === `/inbox/${lead.id}`;
          return (
            <Link
              key={lead.id}
              href={`/inbox/${lead.id}`}
              className={`block border-b border-neutral-100 px-3 py-3 dark:border-neutral-900 ${
                isActive
                  ? "bg-neutral-100 dark:bg-neutral-800"
                  : "hover:bg-neutral-50 dark:hover:bg-neutral-900"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-neutral-200 text-xs font-semibold text-neutral-600 dark:bg-neutral-700 dark:text-neutral-200">
                    {lead.name
                      .split(" ")
                      .map((p) => p[0])
                      .slice(0, 2)
                      .join("")}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      {lead.name}
                    </p>
                    <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                      {lead.lastMessage ? lead.lastMessage.body : "No messages yet"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-none flex-col items-end gap-1">
                  {lead.lastMessage && (
                    <span className="text-[11px] text-neutral-400">
                      {formatDistanceToNowStrict(lead.lastMessage.sentAt, { addSuffix: false })}
                    </span>
                  )}
                  {lead.unreadCount > 0 && (
                    <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                      {lead.unreadCount}
                    </span>
                  )}
                </div>
              </div>
              <div className="mt-2 flex items-center gap-2 pl-10">
                <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${STAGE_META[lead.stage].color}`}>
                  {STAGE_META[lead.stage].label}
                </span>
                {lead.lastMessage && (
                  <span className="flex items-center gap-1">
                    <ChannelDot channel={lead.lastMessage.channel} />
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
