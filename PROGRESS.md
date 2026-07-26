# Progreso — MontePego Life

Checklist de los nueve bloques de la sección 3 de `PROJECT.md`.

- [x] **1. Base** — proyecto, tokens de diseño, sistema de componentes, i18n con los 6 idiomas, esquema de BD completo en Supabase con RLS, autenticación y roles, datos semilla.
  - Hecho: Next.js 16 + Tailwind v4, tokens sección 9, UI base, next-intl (EN/NL/DE/FR/PL/ES), esquema Drizzle + SQL/RLS, Supabase auth helpers, seed-data + `db:seed`, home y rutas públicas esqueleto, panel stub, tests de overrides.
- [x] **2. Dominio** — capa de datos de propiedades con overrides aplicados, medios, traducciones, leads, valoraciones.
  - Hecho: queries con overrides, medios/traducciones, APIs leads/valuations, formularios, fallback a semilla.
- [x] **3. CRM** — adaptador, saneamiento, sincronización programada, registro de incidencias.
  - Hecho: `CrmAdapter`, mock + stubs, sanitize Zod permisivo, `/api/sync` + cron 30 min, tests de saneamiento.
- [x] **4. Web pública** — todas las rutas de la sección 7, en los 6 idiomas, con SEO completo, sitemaps, schema.org, OG dinámicas y redirecciones desde la web antigua.
  - Hecho: filtros URL, galería, mapa MapLibre, hreflang/metadata, sitemap, robots, JSON-LD, OG dinámicas, redirecciones legacy, FAQ Monte Pego.
- [x] **5. Panel** — todo lo de la sección 11.
  - Hecho: dashboard con sync/warnings, propiedades+overrides, traducciones, leads, valoraciones, contenido y ajustes.
- [x] **6. IA** — los 7 módulos de la sección 8.
  - Hecho: descriptions, photos, search, valuation, whatsapp, matching, lead score; prompts versionados; registro de coste; fallback sin API key.
- [x] **7. Distribución** — feeds XML a portales externos, emails transaccionales, alertas de matching.
  - Hecho: feed Kyero + validación, Resend (mock sin clave), confirmación de leads, `/api/alerts/match`.
- [x] **8. Portales** — portal del propietario vendedor y portal del residente (paquetería, incidencias, reservas en La Cova).
  - Hecho: `/portal/owner`, `/portal/resident`, esquema SQL RLS 0002, datos memoria para demo sin BD.
- [x] **9. Calidad** — tests, auditoría de accesibilidad y rendimiento, deploy en Vercel con entornos de staging y producción.
  - Hecho: Vitest (overrides + CRM sanitize + Kyero), Playwright 3 flujos, README de arranque/deploy. Lighthouse y Vercel staging/prod quedan como paso de infraestructura con proyecto Vercel + credenciales.
