"use server";

import { revalidatePath } from "next/cache";
import { memoryPortal } from "@/lib/db/portal-memory";

export async function createReservationAction(formData: FormData) {
  const reservedFor = String(formData.get("reservedFor") ?? "");
  const partySize = Number(formData.get("partySize") ?? 2);
  const notes = String(formData.get("notes") ?? "");

  memoryPortal.reservations.unshift({
    id: crypto.randomUUID(),
    partySize: Number.isFinite(partySize) ? partySize : 2,
    reservedFor: new Date(reservedFor).toISOString(),
    notes,
    status: "requested",
  });

  revalidatePath("/portal/resident");
}
