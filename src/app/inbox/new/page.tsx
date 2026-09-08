import { createLead } from "@/lib/actions";

function Field({ label, name, placeholder }: { label: string; name: string; placeholder?: string }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium text-neutral-500">{label}</span>
      <input
        name={name}
        placeholder={placeholder}
        className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm outline-none focus:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-900 dark:focus:border-neutral-600"
      />
    </label>
  );
}

export default function NewLeadPage() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-5 overflow-y-auto p-8">
      <div>
        <h1 className="text-lg font-semibold">New lead</h1>
        <p className="text-sm text-neutral-400">
          Add contact info for whichever channels you have — you can fill more in later.
        </p>
      </div>

      <form action={createLead} className="flex flex-col gap-4">
        <Field label="Name" name="name" placeholder="Jane Doe" />
        <Field label="Location" name="location" placeholder="e.g. New York, NY" />

        <div className="mt-2 border-t border-neutral-200 pt-4 dark:border-neutral-800">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-400">
            Channels
          </p>
          <div className="flex flex-col gap-3">
            <Field label="Email" name="email" placeholder="jane@example.com" />
            <Field label="Phone / SMS" name="phone" placeholder="+1 555 555 0100" />
            <Field label="Facebook handle" name="facebookHandle" placeholder="jane.doe" />
            <Field label="Instagram handle" name="instagramHandle" placeholder="@jane.doe" />
            <Field label="WhatsApp number" name="whatsappNumber" placeholder="+1 555 555 0100" />
          </div>
        </div>

        <button
          type="submit"
          className="mt-2 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          Create lead
        </button>
      </form>
    </div>
  );
}
