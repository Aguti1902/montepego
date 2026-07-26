export default function AdminContentPage() {
  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl">Contenido</h1>
      <p className="text-sm text-muted-foreground">
        Edición de páginas estáticas por idioma (about, services, la-cova,
        monte-pego). Los textos viven en `pages` / `page_translations`.
      </p>
      <ul className="list-disc space-y-1 pl-5 text-sm">
        <li>about</li>
        <li>services</li>
        <li>la-cova</li>
        <li>monte-pego</li>
      </ul>
    </div>
  );
}
