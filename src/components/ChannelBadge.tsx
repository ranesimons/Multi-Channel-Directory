import { CHANNELS } from "@/lib/channels";
import type { Channel } from "@/generated/prisma/enums";

export function ChannelIcon({
  channel,
  size = 14,
  className = "",
}: {
  channel: Channel;
  size?: number;
  className?: string;
}) {
  const meta = CHANNELS[channel];
  const Icon = meta.icon;
  return <Icon size={size} className={`${meta.color} ${className}`} />;
}

export function ChannelBadge({ channel }: { channel: Channel }) {
  const meta = CHANNELS[channel];
  const Icon = meta.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${meta.bg} ${meta.color}`}
    >
      <Icon size={12} />
      {meta.label}
    </span>
  );
}

export function ChannelDot({ channel }: { channel: Channel }) {
  const meta = CHANNELS[channel];
  return (
    <span
      className={`inline-block h-2 w-2 rounded-full ring-2 ring-white dark:ring-neutral-900 ${meta.dot}`}
      title={meta.label}
    />
  );
}
