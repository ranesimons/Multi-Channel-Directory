"use client";

import { useRef } from "react";
import { addNote } from "@/lib/actions";

export function NoteForm({ leadId }: { leadId: string }) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await addNote(formData);
        formRef.current?.reset();
      }}
      className="flex gap-2"
    >
      <input type="hidden" name="leadId" value={leadId} />
      <input
        name="body"
        placeholder="Add a private note..."
        className="flex-1 rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 py-1.5 text-xs outline-none focus:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-900 dark:focus:border-neutral-600"
      />
      <button
        type="submit"
        className="rounded-lg bg-neutral-100 px-2.5 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
      >
        Add
      </button>
    </form>
  );
}
