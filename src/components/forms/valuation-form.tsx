"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

export function ValuationForm() {
  const t = useTranslations("Sell");
  const tc = useTranslations("Contact");
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");

  function onSubmit(formData: FormData) {
    startTransition(async () => {
      setStatus("idle");
      const payload = {
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        phone: String(formData.get("phone") ?? ""),
        address: String(formData.get("address") ?? ""),
        propertyType: String(formData.get("propertyType") ?? "villa"),
        bedrooms: formData.get("bedrooms")
          ? Number(formData.get("bedrooms"))
          : undefined,
        builtArea: formData.get("builtArea")
          ? Number(formData.get("builtArea"))
          : undefined,
        plotArea: formData.get("plotArea")
          ? Number(formData.get("plotArea"))
          : undefined,
        condition: String(formData.get("condition") ?? ""),
      };

      const response = await fetch("/api/valuations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setStatus(response.ok ? "ok" : "error");
    });
  }

  return (
    <form
      action={onSubmit}
      className="mt-8 space-y-4 border border-border bg-card p-6"
    >
      <h2 className="font-display text-2xl">{t("valuationTitle")}</h2>
      <p className="text-sm text-muted-foreground">{t("disclaimer")}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">{tc("name")}</Label>
          <Input id="name" name="name" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">{tc("email")}</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">{tc("phone")}</Label>
          <Input id="phone" name="phone" type="tel" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="propertyType">Type</Label>
          <Select id="propertyType" name="propertyType" defaultValue="villa">
            <option value="villa">Villa</option>
            <option value="apartment">Apartment</option>
            <option value="townhouse">Townhouse</option>
            <option value="plot">Plot</option>
            <option value="commercial">Commercial</option>
          </Select>
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="address">Address</Label>
          <Input id="address" name="address" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bedrooms">Bedrooms</Label>
          <Input id="bedrooms" name="bedrooms" type="number" min={0} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="builtArea">Built m²</Label>
          <Input id="builtArea" name="builtArea" type="number" min={1} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="plotArea">Plot m²</Label>
          <Input id="plotArea" name="plotArea" type="number" min={1} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="condition">Condition</Label>
          <Input id="condition" name="condition" />
        </div>
      </div>
      <Button type="submit" disabled={pending}>
        {t("valuationTitle")}
      </Button>
      {status === "ok" ? (
        <p className="text-sm text-rosemary" role="status">
          {tc("success")}
        </p>
      ) : null}
      {status === "error" ? (
        <p className="text-sm text-destructive" role="alert">
          {tc("error")}
        </p>
      ) : null}
    </form>
  );
}
