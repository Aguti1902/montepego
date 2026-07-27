"use client";

import { useMemo, useState, useTransition } from "react";
import { savePageContentAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type Translation = {
  locale: string;
  title: string;
  body: string;
  seoTitle: string;
  seoDescription: string;
};

type ContentEditorProps = {
  slug: string;
  label: string;
  translations: Translation[];
};

const localeOrder = ["es", "en", "nl", "de", "fr", "pl"] as const;

export function ContentEditor({ slug, label, translations }: ContentEditorProps) {
  const byLocale = useMemo(() => {
    const map = new Map(translations.map((t) => [t.locale, t]));
    return localeOrder.map((locale) => {
      const existing = map.get(locale);
      return (
        existing ?? {
          locale,
          title: "",
          body: "",
          seoTitle: "",
          seoDescription: "",
        }
      );
    });
  }, [translations]);

  const [locale, setLocale] = useState<string>("es");
  const current = byLocale.find((t) => t.locale === locale) ?? byLocale[0];
  const [title, setTitle] = useState(current.title);
  const [body, setBody] = useState(current.body);
  const [seoTitle, setSeoTitle] = useState(current.seoTitle);
  const [seoDescription, setSeoDescription] = useState(current.seoDescription);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function switchLocale(next: string) {
    const row = byLocale.find((t) => t.locale === next);
    setLocale(next);
    setTitle(row?.title ?? "");
    setBody(row?.body ?? "");
    setSeoTitle(row?.seoTitle ?? "");
    setSeoDescription(row?.seoDescription ?? "");
    setMessage(null);
  }

  function onSave() {
    startTransition(async () => {
      const result = await savePageContentAction({
        slug,
        locale,
        title,
        body,
        seoTitle,
        seoDescription,
      });
      setMessage(result.ok ? "Guardado" : "No se pudo guardar");
    });
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
            Página
          </p>
          <h2 className="font-display text-2xl text-ink">{label}</h2>
          <p className="text-sm text-muted-foreground">/{slug}</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {localeOrder.map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => switchLocale(code)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-semibold uppercase",
                code === locale
                  ? "bg-sea-deep text-white"
                  : "bg-limestone text-ink/70 hover:bg-[#e4dccf]",
              )}
            >
              {code}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 rounded-[1.5rem] bg-white p-5 shadow-[0_12px_36px_rgba(26,34,44,0.05)] ring-1 ring-black/5 md:p-6">
        <div className="space-y-2">
          <Label htmlFor={`title-${slug}`}>Título</Label>
          <Input
            id={`title-${slug}`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`body-${slug}`}>Contenido</Label>
          <Textarea
            id={`body-${slug}`}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="min-h-[180px]"
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor={`seo-title-${slug}`}>SEO título</Label>
            <Input
              id={`seo-title-${slug}`}
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`seo-desc-${slug}`}>SEO descripción</Label>
            <Input
              id={`seo-desc-${slug}`}
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button type="button" onClick={onSave} disabled={pending}>
            {pending ? "Guardando…" : "Guardar idioma"}
          </Button>
          {message ? (
            <p className="text-sm text-sea-deep">{message}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
