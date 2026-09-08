import Link from "next/link";
import { formatDistanceToNowStrict } from "date-fns";
import { Plus, Upload } from "lucide-react";
import { getLeadsForTable } from "@/lib/queries";
import { CHANNEL_LIST, CHANNELS, channelContactValue } from "@/lib/channels";
import { STAGE_META } from "@/lib/stage";
import { LocationFilter } from "@/components/LocationFilter";

export default async function LeadsTablePage({
  searchParams,
}: {
  searchParams: Promise<{ location?: string }>;
}) {
  const { location: locationFilter } = await searchParams;
  const allLeads = await getLeadsForTable();
  const locations = [...new Set(allLeads.map((l) => l.location).filter((l): l is string => Boolean(l)))].sort();
  const leads = locationFilter ? allLeads.filter((l) => l.location === locationFilter) : allLeads;

  return (
    <div className="flex h-full flex-col overflow-hidden bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-3 dark:border-neutral-800">
        <div>
          <p className="text-sm font-semibold">All leads</p>
          <p className="text-xs text-neutral-400">
            {leads.length} lead{leads.length === 1 ? "" : "s"} &middot; which channels each one is reachable on
          </p>
        </div>
        <div className="flex items-center gap-2">
          <LocationFilter locations={locations} />
          <Link
            href="/leads/import"
            className="flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-900"
          >
            <Upload size={13} />
            Import CSV
          </Link>
          <Link
            href="/inbox/new"
            className="flex items-center gap-1.5 rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            <Plus size={13} />
            New lead
          </Link>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full min-w-215 border-collapse text-sm">
          <thead className="sticky top-0 z-10 bg-white dark:bg-neutral-950">
            <tr className="border-b border-neutral-200 text-left text-xs uppercase tracking-wide text-neutral-400 dark:border-neutral-800">
              <th className="px-5 py-2.5 font-medium">Lead</th>
              <th className="px-3 py-2.5 font-medium">Stage</th>
              <th className="px-3 py-2.5 font-medium">Channels</th>
              <th className="px-3 py-2.5 font-medium">Tags</th>
              <th className="px-3 py-2.5 font-medium">Location</th>
              <th className="px-3 py-2.5 font-medium">Messages</th>
              <th className="px-5 py-2.5 font-medium">Last activity</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr
                key={lead.id}
                className="border-b border-neutral-100 hover:bg-neutral-50 dark:border-neutral-900 dark:hover:bg-neutral-900/60"
              >
                <td className="px-5 py-3">
                  <Link href={`/inbox/${lead.id}`} className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-neutral-200 text-xs font-semibold text-neutral-600 dark:bg-neutral-700 dark:text-neutral-200">
                      {lead.name
                        .split(" ")
                        .map((p) => p[0])
                        .slice(0, 2)
                        .join("")}
                    </span>
                    <span className="font-medium text-neutral-900 hover:underline dark:text-neutral-100">
                      {lead.name}
                    </span>
                  </Link>
                </td>
                <td className="px-3 py-3">
                  <span className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${STAGE_META[lead.stage].color}`}>
                    {STAGE_META[lead.stage].label}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-1.5">
                    {CHANNEL_LIST.map((channel) => {
                      const onChannel =
                        Boolean(channelContactValue(channel, lead)) || lead.usedChannels.has(channel);
                      const meta = CHANNELS[channel];
                      const Icon = meta.icon;
                      return (
                        <span
                          key={channel}
                          title={onChannel ? meta.label : `No ${meta.label.toLowerCase()} on file`}
                          className={`flex h-6 w-6 items-center justify-center rounded-md ${
                            onChannel ? meta.bg : "bg-transparent"
                          }`}
                        >
                          <Icon size={13} className={onChannel ? meta.color : "text-neutral-200 dark:text-neutral-800"} />
                        </span>
                      );
                    })}
                  </div>
                </td>
                <td className="px-3 py-3">
                  <div className="flex flex-wrap gap-1">
                    {lead.tags.length === 0 && <span className="text-xs text-neutral-300">—</span>}
                    {lead.tags.map(({ tag }) => (
                      <span
                        key={tag.id}
                        className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-3 py-3 text-xs text-neutral-500">{lead.location ?? "—"}</td>
                <td className="px-3 py-3 text-xs text-neutral-500">{lead.messageCount}</td>
                <td className="px-5 py-3 text-xs text-neutral-500">
                  {formatDistanceToNowStrict(lead.lastActivity, { addSuffix: true })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {leads.length === 0 && (
          <p className="p-8 text-center text-sm text-neutral-400">
            {locationFilter ? `No leads in ${locationFilter}.` : "No leads yet."}
          </p>
        )}
      </div>
    </div>
  );
}
