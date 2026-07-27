"use client";

import { useTransition } from "react";
import {
  saveLeadNotesAction,
  setLeadStatusAction,
} from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const statuses = [
  "new",
  "contacted",
  "qualified",
  "visiting",
  "closed",
  "lost",
] as const;

const statusLabel: Record<(typeof statuses)[number], string> = {
  new: "Nuevo",
  contacted: "Contactado",
  qualified: "Cualificado",
  visiting: "Visita",
  closed: "Cerrado",
  lost: "Perdido",
};

type Props = {
  leadId: string;
  status: string;
  notes: string | null;
};

export function LeadManager({ leadId, status, notes }: Props) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="mt-4 space-y-3 border-t border-border/70 pt-4">
      <div className="flex flex-wrap items-center gap-3">
        <Select
          defaultValue={status}
          disabled={pending}
          className="max-w-[180px]"
          onChange={(e) => {
            startTransition(async () => {
              await setLeadStatusAction(
                leadId,
                e.target.value as (typeof statuses)[number],
              );
            });
          }}
        >
          {statuses.map((s) => (
            <option key={s} value={s}>
              {statusLabel[s]}
            </option>
          ))}
        </Select>
      </div>
      <form
        action={(formData) => {
          startTransition(async () => {
            await saveLeadNotesAction(
              leadId,
              String(formData.get("notes") ?? ""),
            );
          });
        }}
        className="space-y-2"
      >
        <Textarea
          name="notes"
          defaultValue={notes ?? ""}
          placeholder="Notas internas del equipo…"
          rows={2}
        />
        <Button type="submit" size="sm" variant="outline" disabled={pending}>
          Guardar notas
        </Button>
      </form>
    </div>
  );
}
