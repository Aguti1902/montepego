"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AdminCard, adminToneBox } from "@/components/admin/admin-shell";
import { cn } from "@/lib/utils";
import type { FeatureSlug } from "@/config/site";
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
  features?: FeatureSlug[];
};

export function PropertyEditor({
  propertyId,
  status,
  isFeatured,
  fields,
  translations,
  features = [],
}: Props) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="space-y-8">
      <AdminCard>
        <h2 className="font-display text-xl">Publicación</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="status">Estado</Label>
            <Select
              id="status"
              defaultValue={status}
              disabled={pending}
              className="rounded-xl"
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
              className="rounded-full"
              onClick={() => {
                startTransition(async () => {
                  await toggleFeaturedAction(propertyId, !isFeatured);
                });
              }}
            >
              {isFeatured ? "Destacada" : "Destacar"}
            </Button>
          </div>
        </div>
      </AdminCard>

      <AdminCard>
        <h2 className="font-display text-xl">Campos y overrides</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          El valor manual se marca y manda sobre el CRM en cada sincronización.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {fields.map((item) => (
            <form
              key={item.field}
              className={cn("space-y-2 rounded-2xl p-4", adminToneBox("cream"))}
              action={(formData) => {
                startTransition(async () => {
                  const raw = String(formData.get("value") ?? "");
                  const value =
                    item.field === "price" ||
                    item.field.endsWith("Area") ||
                    item.field === "bedrooms" ||
                    item.field === "bathrooms" ||
                    item.field === "yearBuilt" ||
                    item.field === "elevation"
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
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                    item.overridden
                      ? "bg-rosemary/15 text-rosemary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {item.overridden ? "Manual" : "CRM"}
                </span>
              </div>
              <Input
                id={item.field}
                name="value"
                defaultValue={item.value ?? ""}
                className="rounded-xl bg-white"
              />
              <Input
                name="reason"
                placeholder="Motivo del cambio"
                className="rounded-xl bg-white text-xs"
              />
              <Button
                type="submit"
                size="sm"
                disabled={pending}
                className="rounded-full"
              >
                Guardar override
              </Button>
            </form>
          ))}
        </div>
      </AdminCard>

      {features.length > 0 ? (
        <AdminCard>
          <h2 className="font-display text-xl">Características (CRM)</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Vienen del CRM en la sincronización. Para editarlas, corrige en el
            origen o añade override en producción.
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {features.map((slug) => (
              <li
                key={slug}
                className={cn("rounded-full px-3 py-1 text-sm", adminToneBox("sea"))}
              >
                {slug}
              </li>
            ))}
          </ul>
        </AdminCard>
      ) : null}

      <AdminCard>
        <h2 className="font-display text-xl">Traducciones</h2>
        <div className="mt-4 space-y-4">
          {translations.map((tr) => (
            <form
              key={tr.locale}
              className={cn("space-y-3 rounded-2xl p-4", adminToneBox("gold"))}
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
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    tr.reviewed
                      ? "bg-rosemary/15 text-rosemary"
                      : "bg-limestone text-sea-deep"
                  }`}
                >
                  {tr.reviewed ? "Revisada" : "Pendiente"}
                </span>
              </div>
              <Input
                name="title"
                defaultValue={tr.title}
                required
                className="rounded-xl bg-white"
              />
              <Textarea
                name="description"
                defaultValue={tr.description}
                required
                rows={5}
                className="rounded-xl bg-white"
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
                <Button
                  type="submit"
                  size="sm"
                  disabled={pending}
                  className="rounded-full"
                >
                  Guardar
                </Button>
                {!tr.reviewed ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={pending}
                    className="rounded-full"
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
        </div>
      </AdminCard>
    </div>
  );
}
