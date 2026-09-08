import { redirect } from "next/navigation";
import { MessageCircleMore } from "lucide-react";
import { getLeadsForList } from "@/lib/queries";

export default async function InboxIndexPage() {
  const leads = await getLeadsForList();
  if (leads.length > 0) {
    redirect(`/inbox/${leads[0].id}`);
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 text-neutral-400">
      <MessageCircleMore size={32} />
      <p className="text-sm">No leads yet. Add your first lead to get started.</p>
    </div>
  );
}
