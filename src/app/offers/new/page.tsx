import Link from "next/link";
import { createOffer } from "@/lib/actions";
import { getLeadsForOfferPicker } from "@/lib/queries";

export default async function NewOfferPage() {
  const leads = await getLeadsForOfferPicker();

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-5 overflow-y-auto p-8">
      <div>
        <h1 className="text-lg font-semibold">New offer</h1>
        <p className="text-sm text-neutral-400">
          Give the offer a name, then attach the leads you&apos;re taking it to. Every channel
          you talk to them on shows up under the offer.
        </p>
      </div>

      <form action={createOffer} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-neutral-500">Name</span>
          <input
            name="name"
            required
            placeholder="e.g. Summer tour — Chicago, Aug 14"
            className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm outline-none focus:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-900 dark:focus:border-neutral-600"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-neutral-500">Description</span>
          <textarea
            name="description"
            rows={3}
            placeholder="Fee, venue, dates, anything worth remembering…"
            className="resize-none rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm outline-none focus:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-900 dark:focus:border-neutral-600"
          />
        </label>

        <div className="mt-2 border-t border-neutral-200 pt-4 dark:border-neutral-800">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-neutral-400">
            Leads on this offer
          </p>
          {leads.length === 0 ? (
            <p className="text-xs text-neutral-400">
              No leads yet — you can create the offer now and attach leads later.
            </p>
          ) : (
            <>
              <p className="mb-2 text-xs text-neutral-400">
                Optional — you can add more later.
              </p>
              <div className="flex max-h-64 flex-col gap-1 overflow-y-auto">
                {leads.map((lead) => (
                  <label
                    key={lead.id}
                    className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-900"
                  >
                    <input
                      type="checkbox"
                      name="leadIds"
                      value={lead.id}
                      className="h-3.5 w-3.5 accent-neutral-900 dark:accent-white"
                    />
                    <span>{lead.name}</span>
                    {lead.location && (
                      <span className="text-xs text-neutral-400">{lead.location}</span>
                    )}
                  </label>
                ))}
              </div>
            </>
          )}
        </div>

        <button
          type="submit"
          className="mt-2 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          Create offer
        </button>
      </form>

      <Link href="/offers" className="text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200">
        ← Back to offers
      </Link>
    </div>
  );
}
