"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { saveValuationAgentAction } from "@/app/admin/actions";
import { adminToneBox } from "@/components/admin/admin-shell";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  valuationId: string;
  agentEstimate: number | null;
  agentNotes: string | null;
  status: string;
};

export function ValuationAgentForm({
  valuationId,
  agentEstimate,
  agentNotes,
  status,
}: Props) {
  const [pending, startTransition] = useTransition();

  return (
    <form
      className={cn("mt-4 space-y-3 rounded-2xl p-4", adminToneBox("gold"))}
      action={(formData) => {
        startTransition(async () => {
          await saveValuationAgentAction({
            id: valuationId,
            agentEstimate: formData.get("agentEstimate")
              ? Number(formData.get("agentEstimate"))
              : null,
            agentNotes: String(formData.get("agentNotes") ?? ""),
            status: String(formData.get("status") ?? status) as
              | "pending"
              | "reviewed"
              | "contacted",
          });
        });
      }}
    >
      <p className="text-sm font-medium text-ink">Valoración del agente</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor={`est-${valuationId}`}>Precio agente (€)</Label>
          <Input
            id={`est-${valuationId}`}
            name="agentEstimate"
            type="number"
            defaultValue={agentEstimate ?? ""}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor={`st-${valuationId}`}>Estado</Label>
          <select
            id={`st-${valuationId}`}
            name="status"
            defaultValue={status}
            className="flex h-11 w-full rounded-full border border-border bg-white px-4 text-sm"
          >
            <option value="pending">Pendiente</option>
            <option value="reviewed">Revisada</option>
            <option value="contacted">Contactada</option>
          </select>
        </div>
      </div>
      <Textarea
        name="agentNotes"
        defaultValue={agentNotes ?? ""}
        placeholder="Notas para el propietario o el equipo…"
        rows={2}
      />
      <Button type="submit" size="sm" disabled={pending}>
        Guardar valoración agente
      </Button>
    </form>
  );
}
