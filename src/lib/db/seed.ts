/**
 * Inserta el dataset de bootstrap en la BD.
 * Tras el primer sync CRM (`npm`-equivalente: GET /api/sync), la cartera
 * operativa es la del adaptador; este seed sirve para desarrollo y demos.
 */
import "dotenv/config";
import { getDb } from "./index";
import {
  pages,
  pageTranslations,
  properties,
  propertyMedia,
  propertyTranslations,
  users,
} from "./schema";
import { seedProperties } from "./seed-data";

async function seed() {
  const db = getDb();

  console.log("Sembrando usuarios…");
  const [admin] = await db
    .insert(users)
    .values({
      email: "admin@montepegolife.com",
      fullName: "Admin MontePego",
      role: "admin",
    })
    .onConflictDoNothing()
    .returning();

  console.log("Sembrando propiedades…");
  for (const item of seedProperties) {
    const [property] = await db
      .insert(properties)
      .values({
        reference: item.reference,
        slug: item.slug,
        status: item.status,
        type: item.type,
        price: item.price,
        bedrooms: item.bedrooms,
        bathrooms: item.bathrooms,
        builtArea: item.builtArea,
        plotArea: item.plotArea,
        features: item.features,
        isFeatured: item.isFeatured,
        elevation: item.elevation,
        orientation: item.orientation,
        viewRelation: item.viewRelation,
        latitude: item.latitude,
        longitude: item.longitude,
        locationPrecision: "approximate",
        publishedAt:
          item.status === "available" || item.status === "reserved"
            ? new Date()
            : item.status === "sold"
              ? new Date("2025-11-01")
              : null,
        soldAt: item.status === "sold" ? new Date("2025-11-01") : null,
        crmSyncedAt: new Date(),
        crmRaw: { seed: true, reference: item.reference },
      })
      .onConflictDoNothing()
      .returning();

    if (!property) continue;

    await db.insert(propertyTranslations).values(
      Object.entries(item.titles).map(([locale, title]) => ({
        propertyId: property.id,
        locale,
        title,
        description: item.descriptions[locale] ?? item.descriptions.en,
        seoTitle: title,
        seoDescription: (item.descriptions[locale] ?? item.descriptions.en).slice(
          0,
          155,
        ),
        source: "manual" as const,
        reviewed: true,
        reviewedBy: admin?.id,
      })),
    );

    await db.insert(propertyMedia).values({
      propertyId: property.id,
      kind: "photo",
      storagePath: item.coverPlaceholder,
      width: 1600,
      height: 1067,
      sortOrder: 0,
      isCover: true,
      aiRoomType: "facade",
      altTranslations: Object.fromEntries(
        Object.entries(item.titles).map(([locale, title]) => [
          locale,
          `${title} — MontePego Life`,
        ]),
      ),
    });
  }

  console.log("Sembrando páginas…");
  const staticPages = [
    { slug: "about", title: "About MontePego Life" },
    { slug: "services", title: "Services" },
    { slug: "la-cova", title: "La Cova" },
    { slug: "monte-pego", title: "Living in Monte Pego" },
  ];

  for (const page of staticPages) {
    const [row] = await db
      .insert(pages)
      .values({ slug: page.slug })
      .onConflictDoNothing()
      .returning();

    if (!row) continue;

    await db.insert(pageTranslations).values(
      ["en", "nl", "de", "fr", "pl", "es"].map((locale) => ({
        pageId: row.id,
        locale,
        title: page.title,
        body: `${page.title} content placeholder. Editable from the admin panel.`,
        seoTitle: page.title,
        seoDescription: `${page.title} — MontePego Life`,
      })),
    );
  }

  console.log("Seed completado.");
  process.exit(0);
}

seed().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
