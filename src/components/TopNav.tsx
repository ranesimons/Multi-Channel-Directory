"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Inbox, Table2, Handshake } from "lucide-react";

const TABS = [
  { href: "/inbox", label: "Inbox", icon: Inbox },
  { href: "/leads", label: "Leads", icon: Table2 },
  { href: "/offers", label: "Offers", icon: Handshake },
];

export function TopNav() {
  const pathname = usePathname();

  return (
    <header className="flex h-12 flex-none items-center gap-1 border-b border-neutral-200 bg-white px-3 dark:border-neutral-800 dark:bg-neutral-950">
      <span className="mr-2 flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
        <Inbox size={14} />
      </span>
      {TABS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium ${
              active
                ? "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100"
                : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
            }`}
          >
            <Icon size={14} />
            {label}
          </Link>
        );
      })}
    </header>
  );
}
