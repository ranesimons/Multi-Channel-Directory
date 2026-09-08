import Link from "next/link";
import { Plus } from "lucide-react";
import { getLeadsForList } from "@/lib/queries";
import { LeadListClient } from "@/components/LeadListClient";

export default async function InboxLayout({ children }: { children: React.ReactNode }) {
  const leads = await getLeadsForList();
  const totalUnread = leads.reduce((sum, l) => sum + l.unreadCount, 0);

  return (
    <div className="flex h-full w-full overflow-hidden bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <aside className="flex w-[320px] flex-none flex-col border-r border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
          <div>
            <p className="text-sm font-semibold leading-none">Conversations</p>
            {totalUnread > 0 && (
              <p className="mt-1 text-[11px] leading-none text-neutral-500">{totalUnread} unread</p>
            )}
          </div>
          <Link
            href="/inbox/new"
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
            title="Add new lead"
          >
            <Plus size={15} />
          </Link>
        </div>
        <LeadListClient leads={leads} />
      </aside>
      <main className="flex min-w-0 flex-1">{children}</main>
    </div>
  );
}
