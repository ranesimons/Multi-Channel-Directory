"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function LocationFilter({ locations }: { locations: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("location") ?? "";

  return (
    <select
      value={current}
      onChange={(e) => {
        const params = new URLSearchParams(searchParams);
        if (e.target.value) {
          params.set("location", e.target.value);
        } else {
          params.delete("location");
        }
        const query = params.toString();
        router.push(query ? `/leads?${query}` : "/leads");
      }}
      className="rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 py-1.5 text-xs outline-none focus:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-900 dark:focus:border-neutral-600"
    >
      <option value="">All locations</option>
      {locations.map((location) => (
        <option key={location} value={location}>
          {location}
        </option>
      ))}
    </select>
  );
}
