"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  saveOverrideAction,
  saveTranslationAction,
  reviewTranslationAction,
  updateStatusAction,
  toggleFeaturedAction,
} from "@/app/admin/actions";

type Props = {
  propertyId: string;
  status: string;
  isFeatured: boolean;
  fields: Array<{
    field: string;
    label: string;
    value: string | number | null;
    overridden: boolean;
  }>;
  translations: Array<{
    locale: string;
    title: string;
    description: string;
    reviewed: boolean;
  }>;
};

export function PropertyEditor({
  propertyId,
  status,
  isFeatured,
  fields,
  translations,
}: Props) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="space-y-10">
      <section className="grid gap-4 border border-border bg-card p-5 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="status">Estado</Label>
          <Select
            id="status"
            defaultValue={status}
            disabled={pending}
            onChange={(e) => {
              startTransition(async () => {
                await updateStatusAction(
                  propertyId,
                  e.target.value as
                    | "available"
                    | "reserved"
                    | "sold"
                    | "draft"
                    | "withdrawn",
                );
              });
            }}
          >
            <option value="draft">Sin publicar</option>
            <option value="available">Publicada</option>
            <option value="reserved">Reservada</option>
            <option value="sold">Vendida</option>
            <option value="withdrawn">Retirada</option>
          </Select>
        </div>
        <div className="flex items-end">
          <Button
            type="button"
            variant={isFeatured ? "accent" : "outline"}
            disabled={pending}
            onClick={() => {
              startTransition(async () => {
                await toggleFeaturedAction(propertyId, !isFeatured);
              });
            }}
          >
            {isFeatured ? "Destacada" : "Destacar"}
          </Button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-2xl">Campos y overrides</h2>
        <p className="text-sm text-muted-foreground">
          El valor manual se marca y manda sobre el CRM en cada sincronización.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {fields.map((item) => (
            <form
              key={item.field}
              className="space-y-2 border border-border bg-card p-4"
              action={(formData) => {
                startTransition(async () => {
                  const raw = String(formData.get("value") ?? "");
                  const value =
                    item.field === "price" ||
                    item.field.endsWith("Area") ||
                    item.field === "bedrooms" ||
                    item.field === "bathrooms"
                      ? Number(raw)
                      : raw;
                  await saveOverrideAction({
                    propertyId,
                    field: item.field,
                    value,
                    reason: String(formData.get("reason") ?? "") || undefined,
                  });
                });
              }}
            >
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor={item.field}>{item.label}</Label>
                <span className="text-xs text-rosemary">
                  {item.overridden ? "Manual" : "CRM"}
                </span>
              </div>
              <Input
                id={item.field}
                name="value"
                defaultValue={item.value ?? ""}
              />
              <Input
                name="reason"
                placeholder="Motivo del cambio"
                className="text-xs"
              />
              <Button type="submit" size="sm" disabled={pending}>
                Guardar override
              </Button>
            </form>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-2xl">Traducciones</h2>
        {translations.map((tr) => (
          <form
            key={tr.locale}
            className="space-y-3 border border-border bg-card p-4"
            action={(formData) => {
              startTransition(async () => {
                await saveTranslationAction({
                  propertyId,
                  locale: tr.locale,
                  title: String(formData.get("title") ?? ""),
                  description: String(formData.get("description") ?? ""),
                  reviewed: formData.get("reviewed") === "on",
                });
              });
            }}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-medium uppercase">{tr.locale}</h3>
              <span className="text-xs">
                {tr.reviewed ? "Revisada" : "Pendiente"}
              </span>
            </div>
            <Input name="title" defaultValue={tr.title} required />
            <Textarea
              name="description"
              defaultValue={tr.description}
              required
              rows={5}
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="reviewed"
                defaultChecked={tr.reviewed}
              />
              Marcar como revisada
            </label>
            <div className="flex gap-2">
              <Button type="submit" size="sm" disabled={pending}>
                Guardar
              </Button>
              {!tr.reviewed ? (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={pending}
                  onClick={() => {
                    startTransition(async () => {
                      await reviewTranslationAction(propertyId, tr.locale);
                    });
                  }}
                >
                  Solo revisar
                </Button>
              ) : null}
            </div>
          </form>
        ))}
      </section>
    </div>
  );
}
