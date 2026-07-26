"use client";

import { useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type ContactFormProps = {
  propertyId?: string;
};

export function ContactForm({ propertyId }: ContactFormProps) {
  const t = useTranslations("Contact");
  const locale = useLocale();
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      setStatus("idle");
      const payload = {
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        phone: String(formData.get("phone") ?? "") || undefined,
        message: String(formData.get("message") ?? "") || undefined,
        locale,
        propertyId,
        source: "form" as const,
      };

      try {
        const response = await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        setStatus(response.ok ? "ok" : "error");
      } catch {
        setStatus("error");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">{t("name")}</Label>
        <Input id="name" name="name" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">{t("email")}</Label>
        <Input id="email" name="email" type="email" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">{t("phone")}</Label>
        <Input id="phone" name="phone" type="tel" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">{t("message")}</Label>
        <Textarea id="message" name="message" required />
      </div>
      <Button type="submit" disabled={pending}>
        {t("send")}
      </Button>
      {status === "ok" ? (
        <p className="text-sm text-rosemary" role="status">
          {t("success")}
        </p>
      ) : null}
      {status === "error" ? (
        <p className="text-sm text-destructive" role="alert">
          {t("error")}
        </p>
      ) : null}
    </form>
  );
}
