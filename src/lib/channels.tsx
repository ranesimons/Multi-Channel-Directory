import {
  Mail,
  MessageSquare,
  Camera,
  MessageCircle,
  Smartphone,
  type LucideIcon,
} from "lucide-react";
import type { Channel } from "@/generated/prisma/enums";

type ChannelMeta = {
  label: string;
  icon: LucideIcon;
  color: string; // text/icon color
  bg: string; // soft background chip color
  dot: string; // solid dot color
};

export const CHANNELS: Record<Channel, ChannelMeta> = {
  EMAIL: {
    label: "Email",
    icon: Mail,
    color: "text-sky-600 dark:text-sky-400",
    bg: "bg-sky-50 dark:bg-sky-950/40",
    dot: "bg-sky-500",
  },
  FACEBOOK: {
    label: "Facebook",
    icon: MessageSquare,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950/40",
    dot: "bg-blue-600",
  },
  INSTAGRAM: {
    label: "Instagram",
    icon: Camera,
    color: "text-pink-600 dark:text-pink-400",
    bg: "bg-pink-50 dark:bg-pink-950/40",
    dot: "bg-pink-500",
  },
  WHATSAPP: {
    label: "WhatsApp",
    icon: MessageCircle,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    dot: "bg-emerald-500",
  },
  SMS: {
    label: "Text (SMS)",
    icon: Smartphone,
    color: "text-slate-600 dark:text-slate-300",
    bg: "bg-slate-100 dark:bg-slate-800/60",
    dot: "bg-slate-500",
  },
};

export const CHANNEL_LIST = Object.keys(CHANNELS) as Channel[];

export function channelContactValue(
  channel: Channel,
  lead: {
    email: string | null;
    phone: string | null;
    facebookHandle: string | null;
    instagramHandle: string | null;
    whatsappNumber: string | null;
  }
): string | null {
  switch (channel) {
    case "EMAIL":
      return lead.email;
    case "FACEBOOK":
      return lead.facebookHandle;
    case "INSTAGRAM":
      return lead.instagramHandle;
    case "WHATSAPP":
      return lead.whatsappNumber;
    case "SMS":
      return lead.phone;
  }
}
