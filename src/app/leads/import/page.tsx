import Link from "next/link";
import { ImportCsvForm } from "@/components/ImportCsvForm";

const COLUMNS = ["Name", "Location", "Phone", "Whatsapp", "Email", "Insta", "Fbook"];

export default function ImportLeadsPage() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-5 overflow-y-auto p-8">
      <div>
        <h1 className="text-lg font-semibold">Import leads</h1>
        <p className="text-sm text-neutral-400">
          Upload a CSV with a header row. Only <span className="font-medium">Name</span> is required — leave
          other cells blank if you don&apos;t have them.
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {COLUMNS.map((c) => (
          <span
            key={c}
            className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
          >
            {c}
          </span>
        ))}
      </div>

      <ImportCsvForm />

      <Link href="/leads" className="text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200">
        ← Back to all leads
      </Link>
    </div>
  );
}
