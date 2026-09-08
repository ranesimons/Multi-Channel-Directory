"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { importLeadsFromCsv, type ImportLeadsState } from "@/lib/actions";

const initialState: ImportLeadsState = { status: "idle", message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-60 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
    >
      {pending ? "Importing…" : "Import leads"}
    </button>
  );
}

export function ImportCsvForm() {
  const [state, formAction] = useActionState(importLeadsFromCsv, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1">
        <span className="text-xs font-medium text-neutral-500">CSV file</span>
        <input
          type="file"
          name="file"
          accept=".csv,text/csv"
          required
          className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm outline-none file:mr-3 file:rounded-md file:border-0 file:bg-neutral-200 file:px-2.5 file:py-1 file:text-xs file:font-medium file:text-neutral-700 focus:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-900 dark:file:bg-neutral-800 dark:file:text-neutral-200 dark:focus:border-neutral-600"
        />
      </label>

      {state.status === "success" && (
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
          {state.message}
          {state.skipped ? ` Skipped ${state.skipped} row${state.skipped === 1 ? "" : "s"} without a name.` : ""}
        </p>
      )}
      {state.status === "error" && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-950/30 dark:text-red-400">
          {state.message}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
