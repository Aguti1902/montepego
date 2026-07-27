import { FileText } from "lucide-react";
import { ContentEditor } from "@/components/admin/content-editor";
import { adminToneBox, type AdminTone } from "@/components/admin/admin-shell";
import { getAdminPage, listAdminPages } from "@/lib/db/queries/pages";
import { cn } from "@/lib/utils";

const pageTones: AdminTone[] = ["sea", "gold", "cream", "success"];

export default async function AdminContentPage() {
  const pages = await listAdminPages();
  const details = await Promise.all(
    pages.map(async (page) => {
      const full = await getAdminPage(page.slug);
      return { list: page, full };
    }),
  );

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="font-display text-3xl md:text-4xl">Páginas web</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Textos de Nosotros, Servicios, La Cova y Monte Pego en cada idioma.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {details.map(({ list }, index) => (
          <a
            key={list.id}
            href={`#page-${list.slug}`}
            className={cn(
              "rounded-2xl p-4 shadow-[0_10px_30px_rgba(26,34,44,0.05)] transition hover:-translate-y-0.5",
              adminToneBox(pageTones[index % pageTones.length]),
            )}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sea-deep/10 text-sea-deep">
              <FileText className="h-4 w-4" />
            </span>
            <p className="mt-3 font-medium text-ink">{list.label}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {list.localesReady}/{list.localesTotal} idiomas
            </p>
          </a>
        ))}
      </div>

      <div className="space-y-12">
        {details.map(({ list, full }) =>
          full ? (
            <section key={list.id} id={`page-${list.slug}`} className="scroll-mt-8">
              <ContentEditor
                slug={full.slug}
                label={full.label}
                translations={full.translations}
              />
            </section>
          ) : null,
        )}
      </div>
    </div>
  );
}
