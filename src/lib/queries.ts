import { connection } from "next/server";
import { prisma } from "@/lib/prisma";

export async function getLeadsForList() {
  await connection();
  const leads = await prisma.lead.findMany({
    include: {
      messages: { orderBy: { sentAt: "desc" }, take: 1 },
      tags: { include: { tag: true } },
      _count: { select: { messages: { where: { read: false } } } },
    },
  });

  return leads
    .map((lead) => ({
      ...lead,
      lastMessage: lead.messages[0] ?? null,
      unreadCount: lead._count.messages,
    }))
    .sort((a, b) => {
      const aTime = a.lastMessage?.sentAt.getTime() ?? a.createdAt.getTime();
      const bTime = b.lastMessage?.sentAt.getTime() ?? b.createdAt.getTime();
      return bTime - aTime;
    });
}

export async function getLeadDetail(leadId: string) {
  await connection();
  return prisma.lead.findUnique({
    where: { id: leadId },
    include: {
      messages: { orderBy: { sentAt: "asc" } },
      notes: { orderBy: { createdAt: "desc" } },
      tags: { include: { tag: true } },
    },
  });
}

export async function getLeadsForTable() {
  await connection();
  const leads = await prisma.lead.findMany({
    include: {
      tags: { include: { tag: true } },
      messages: { select: { channel: true, sentAt: true } },
      _count: { select: { messages: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return leads.map((lead) => {
    const usedChannels = new Set(lead.messages.map((m) => m.channel));
    const lastActivity = lead.messages.reduce<Date | null>((latest, m) => {
      return !latest || m.sentAt > latest ? m.sentAt : latest;
    }, null);
    return {
      ...lead,
      usedChannels,
      messageCount: lead._count.messages,
      lastActivity: lastActivity ?? lead.createdAt,
    };
  });
}

export async function getChannelsUsedByLead(leadId: string) {
  await connection();
  const rows = await prisma.message.findMany({
    where: { leadId },
    distinct: ["channel"],
    select: { channel: true },
  });
  return rows.map((r) => r.channel);
}
