"use server";

import { revalidatePath } from "next/cache";
import { runCrmSync } from "@/lib/crm/sync";
import {
  setPropertyFeatured,
  updatePropertyStatus,
} from "@/lib/db/queries/admin-properties";
import { upsertOverride } from "@/lib/db/queries/overrides";
import {
  markTranslationReviewed,
  upsertTranslation,
} from "@/lib/db/queries/translations";
import { updateLeadStatus, updateLeadNotes } from "@/lib/db/queries/leads";
import { savePageTranslation } from "@/lib/db/queries/pages";
import { updateValuationAgent } from "@/lib/db/queries/valuations";
import { markSyncWarningsReviewed } from "@/lib/db/queries/admin-sync";

export async function syncNowAction() {
  await runCrmSync();
  revalidatePath("/admin");
  revalidatePath("/admin/settings");
}

export async function markSyncReviewedAction(id: string) {
  await markSyncWarningsReviewed(id);
  revalidatePath("/admin");
  revalidatePath("/admin/settings");
  return { ok: true };
}

export async function updateStatusAction(
  id: string,
  status: "available" | "reserved" | "sold" | "draft" | "withdrawn",
) {
  await updatePropertyStatus(id, status);
  revalidatePath("/admin/properties");
  revalidatePath(`/admin/properties/${id}`);
}

export async function toggleFeaturedAction(id: string, isFeatured: boolean) {
  await setPropertyFeatured(id, isFeatured);
  revalidatePath("/admin/properties");
}

export async function saveOverrideAction(input: {
  propertyId: string;
  field: string;
  value: unknown;
  reason?: string;
}) {
  if (input.propertyId.startsWith("seed-")) {
    return { ok: false, error: "Conecta DATABASE_URL para guardar overrides" };
  }
  await upsertOverride(input);
  revalidatePath(`/admin/properties/${input.propertyId}`);
  return { ok: true };
}

export async function saveTranslationAction(input: {
  propertyId: string;
  locale: string;
  title: string;
  description: string;
  reviewed?: boolean;
}) {
  if (input.propertyId.startsWith("seed-")) {
    return { ok: false, error: "Conecta DATABASE_URL para guardar traducciones" };
  }
  await upsertTranslation({
    ...input,
    source: "manual",
  });
  revalidatePath("/admin/translations");
  revalidatePath(`/admin/properties/${input.propertyId}`);
  return { ok: true };
}

export async function reviewTranslationAction(
  propertyId: string,
  locale: string,
) {
  if (propertyId.startsWith("seed-")) {
    return { ok: false };
  }
  await markTranslationReviewed(propertyId, locale);
  revalidatePath("/admin/translations");
  return { ok: true };
}

export async function setLeadStatusAction(
  id: string,
  status: "new" | "contacted" | "qualified" | "visiting" | "closed" | "lost",
) {
  await updateLeadStatus(id, status);
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
}

export async function savePageContentAction(input: {
  slug: string;
  locale: string;
  title: string;
  body: string;
  seoTitle: string;
  seoDescription: string;
}) {
  const result = await savePageTranslation(input);
  revalidatePath("/admin/content");
  return result;
}

export async function saveLeadNotesAction(id: string, notes: string) {
  await updateLeadNotes(id, notes);
  revalidatePath("/admin/leads");
  return { ok: true };
}

export async function saveValuationAgentAction(input: {
  id: string;
  agentEstimate: number | null;
  agentNotes: string;
  status: "pending" | "reviewed" | "contacted";
}) {
  await updateValuationAgent(input.id, {
    agentEstimate: input.agentEstimate,
    agentNotes: input.agentNotes,
    status: input.status,
  });
  revalidatePath("/admin/valuations");
  revalidatePath("/admin");
  return { ok: true };
}
