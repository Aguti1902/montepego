"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { adminToneBox } from "@/components/admin/admin-shell";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export function AdminPropertyFilters() {
  const router = useRouter();
  const params = useSearchParams();

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.replace(`/admin/properties?${next.toString()}`);
  }

  return (
    <div
      className={cn(
        "grid gap-3 rounded-2xl p-4 sm:grid-cols-2 lg:grid-cols-4",
        adminToneBox("cream"),
      )}
    >
      <Input
        placeholder="Buscar ref. o título…"
        defaultValue={params.get("q") ?? ""}
        onChange={(e) => update("q", e.target.value)}
      />
      <Select
        defaultValue={params.get("status") ?? ""}
        onChange={(e) => update("status", e.target.value)}
      >
        <option value="">Todos los estados</option>
        <option value="available">En venta</option>
        <option value="reserved">Reservada</option>
        <option value="sold">Vendida</option>
        <option value="draft">Sin publicar</option>
        <option value="withdrawn">Retirada</option>
      </Select>
      <Select
        defaultValue={params.get("type") ?? ""}
        onChange={(e) => update("type", e.target.value)}
      >
        <option value="">Todos los tipos</option>
        <option value="villa">Villa</option>
        <option value="apartment">Apartamento</option>
        <option value="plot">Parcela</option>
        <option value="townhouse">Adosada</option>
        <option value="commercial">Comercial</option>
      </Select>
      <Select
        defaultValue={params.get("issue") ?? ""}
        onChange={(e) => update("issue", e.target.value)}
      >
        <option value="">Cualquier incidencia</option>
        <option value="no-photos">Sin fotos</option>
        <option value="pending-tr">Traducciones pendientes</option>
        <option value="featured">Solo destacadas</option>
      </Select>
    </div>
  );
}
