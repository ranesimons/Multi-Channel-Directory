"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { Channel, Stage } from "@/generated/prisma/enums";
import { parseLeadCsv } from "@/lib/leadCsv";

export async function sendMessage(formData: FormData) {
  const leadId = String(formData.get("leadId") ?? "");
  const channel = String(formData.get("channel") ?? "") as Channel;
  const body = String(formData.get("body") ?? "").trim();

  if (!leadId || !channel || !body) return;

  await prisma.message.create({
    data: { leadId, channel, direction: "OUTBOUND", body, read: true },
  });
  await prisma.lead.update({ where: { id: leadId }, data: { updatedAt: new Date() } });

  revalidatePath(`/inbox/${leadId}`);
  revalidatePath("/inbox");
}

export async function markLeadRead(leadId: string) {
  if (!leadId) return;
  await prisma.message.updateMany({
    where: { leadId, read: false },
    data: { read: true },
  });
  revalidatePath(`/inbox/${leadId}`);
  revalidatePath("/inbox");
}

export async function updateStage(leadId: string, stage: Stage) {
  if (!leadId) return;
  await prisma.lead.update({ where: { id: leadId }, data: { stage } });
  revalidatePath(`/inbox/${leadId}`);
  revalidatePath("/inbox");
}

export async function addNote(formData: FormData) {
  const leadId = String(formData.get("leadId") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  if (!leadId || !body) return;

  await prisma.note.create({ data: { leadId, body } });
  revalidatePath(`/inbox/${leadId}`);
}

export async function createLead(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  const email = String(formData.get("email") ?? "").trim() || null;
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const facebookHandle = String(formData.get("facebookHandle") ?? "").trim() || null;
  const instagramHandle = String(formData.get("instagramHandle") ?? "").trim() || null;
  const whatsappNumber = String(formData.get("whatsappNumber") ?? "").trim() || null;
  const location = String(formData.get("location") ?? "").trim() || null;

  const lead = await prisma.lead.create({
    data: { name, email, phone, facebookHandle, instagramHandle, whatsappNumber, location },
  });

  revalidatePath("/inbox");
  redirect(`/inbox/${lead.id}`);
}

export type ImportLeadsState = {
  status: "idle" | "success" | "error";
  message: string;
  created?: number;
  skipped?: number;
};

export async function importLeadsFromCsv(
  _prevState: ImportLeadsState,
  formData: FormData
): Promise<ImportLeadsState> {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { status: "error", message: "Choose a CSV file to upload." };
  }

  const text = await file.text();
  const { leads, skipped, error } = parseLeadCsv(text);

  if (error) {
    return { status: "error", message: error };
  }
  if (leads.length === 0) {
    return { status: "error", message: "No valid rows found — every row needs at least a name." };
  }

  await prisma.lead.createMany({ data: leads });

  revalidatePath("/inbox");
  revalidatePath("/leads");

  return {
    status: "success",
    message: `Imported ${leads.length} lead${leads.length === 1 ? "" : "s"}.`,
    created: leads.length,
    skipped,
  };
}
