import { parseCsv } from "@/lib/csv";

const COLUMN_ALIASES: Record<string, string> = {
  name: "name",
  location: "location",
  phone: "phone",
  "phone/sms": "phone",
  whatsapp: "whatsappNumber",
  "whatsapp number": "whatsappNumber",
  email: "email",
  insta: "instagramHandle",
  instagram: "instagramHandle",
  "instagram handle": "instagramHandle",
  fbook: "facebookHandle",
  facebook: "facebookHandle",
  "facebook handle": "facebookHandle",
};

function normalizeHeader(header: string): string {
  return header.trim().toLowerCase();
}

export type ParsedLeadRow = {
  name: string;
  location: string | null;
  phone: string | null;
  whatsappNumber: string | null;
  email: string | null;
  instagramHandle: string | null;
  facebookHandle: string | null;
};

export type LeadCsvResult = {
  leads: ParsedLeadRow[];
  skipped: number;
  error?: string;
};

export function parseLeadCsv(text: string): LeadCsvResult {
  const rows = parseCsv(text);
  if (rows.length === 0) {
    return { leads: [], skipped: 0, error: "The file is empty." };
  }

  const header = rows[0].map(normalizeHeader);
  const columnIndex: Partial<Record<string, number>> = {};
  header.forEach((h, i) => {
    const field = COLUMN_ALIASES[h];
    if (field) columnIndex[field] = i;
  });

  if (columnIndex.name === undefined) {
    return { leads: [], skipped: 0, error: 'Could not find a "Name" column in the file.' };
  }

  const leads: ParsedLeadRow[] = [];
  let skipped = 0;

  for (const row of rows.slice(1)) {
    if (row.every((cell) => cell.trim() === "")) continue;

    const get = (field: string) => {
      const idx = columnIndex[field];
      if (idx === undefined) return null;
      const value = (row[idx] ?? "").trim();
      return value || null;
    };

    const name = get("name");
    if (!name) {
      skipped++;
      continue;
    }

    leads.push({
      name,
      location: get("location"),
      phone: get("phone"),
      whatsappNumber: get("whatsappNumber"),
      email: get("email"),
      instagramHandle: get("instagramHandle"),
      facebookHandle: get("facebookHandle"),
    });
  }

  return { leads, skipped };
}
