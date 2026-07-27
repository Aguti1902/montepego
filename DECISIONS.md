# Decisiones

Registro de decisiones tomadas por cuenta propia durante la construcción del proyecto.

| Fecha | Decisión | Motivo |
|---|---|---|
| 2026-07-26 | Next.js 16.2 (create-next-app latest) en lugar de pin a 15.x | PROJECT.md exige Next.js 15+; 16 cumple y es el scaffold actual |
| 2026-07-26 | Tipografía: Fraunces (display) + Inter Tight (cuerpo) | Sugeridas en sección 9; buen contraste serif/sans y legibilidad |
| 2026-07-26 | BD local vía `DATABASE_URL` de Supabase (sin Postgres embebido) | No hay Docker/psql en el entorno; el esquema y seed apuntan a Supabase real |
| 2026-07-26 | Tiles MapLibre: OpenFreeMap (`https://tiles.openfreemap.org/styles/liberty`) | Proveedor gratuito sin API key, compatible con MapLibre GL |
| 2026-07-26 | UI pública usa `seed-data.ts` hasta conectar `DATABASE_URL` | Permite ver la app completa sin Supabase; las queries de dominio hacen fallback a semilla |
| 2026-07-26 | Se mantiene `middleware.ts` (aviso Next 16 → proxy) | next-intl + sesión Supabase dependen del middleware actual; migrar a proxy cuando el ecosistema lo estabilice |
| 2026-07-26 | Mapa de redirecciones legacy mínimo + TODO(cliente) | No hay inventario completo de URLs WP; ampliar antes del lanzamiento |
| 2026-07-26 | Feed XML prioritario: Kyero (Idealista/Fotocasa pendientes de acceso) | `PENDING_PORTAL_FEEDS`; Kyero no requiere credenciales de portal para el XML |
| 2026-07-26 | IA y email con fallback mock si faltan API keys | Permite E2E y demos locales; el coste se registra igual |
| 2026-07-26 | Portales con memoria local hasta auth de roles en Supabase | Flujos visibles sin BD; esquema RLS en `0002_portals.sql` |
| 2026-07-26 | Front nunca llama al CRM: solo adaptador + sync/pushLead en servidor | PROJECT.md: CRM deja de ser fuente de verdad del front; BD propia + overrides |
| 2026-07-26 | `CRM_ADAPTER=mock` simula API; prod previsto `ego` (eGO Real Estate) | Cliente confirmó eGO; token/URL exactos pendientes en env |
| 2026-07-26 | `pushLead` obligatorio en el contrato; si no soportado → skipped sin romper el form | Leads web no deben fallar porque el CRM no acepte el alta aún |
| 2026-07-26 | Paleta marca real `#2C558A` / `#B88C40` / `#F4EEE3` (no `#094D88` del PROJECT) | Usuario pidió clonar/mejorar montepegolife.com; la web Elementor define la marca |
| 2026-07-26 | Tipografía Montserrat + Cormorant Garamond | Alineado a Raleway/Montserrat de la web real + display más editorial |
| 2026-07-26 | Imágenes seed vía URLs `montepegolife.com/wp-content` + `next/image` remotePatterns | Scrape del catálogo real; prod seguirá trayendo media del CRM → BD |
| 2026-07-26 | Chat IA público + panel/portal (`/api/ai/chat`) con fallback mock | Pedido explícito; sin `ANTHROPIC_API_KEY` responde plantilla útil |
| 2026-07-26 | Pathnames i18n sin traducir (`/about` en todos los locales) | Las URLs localizadas (p.ej. `/es/nosotros`) generaban bucle 307 con next-intl + Next 16 |
| 2026-07-26 | Reseñas home ilustrativas (`PENDING_TESTIMONIALS`) | Usuario pidió sección; no son reseñas verificadas — sustituir antes de launch |
| 2026-07-26 | UI más redondeada (pill buttons, FAB chat, radios ~1.1–1.75rem) | Feedback: menos aspecto cuadrado / más moderno |
| 2026-07-26 | Panel admin ampliado a 13 módulos con sidebar por secciones | Pedido de panel completísimo: operación, cartera, contenido, sistema; datos demo en memoria hasta Supabase |
| 2026-07-26 | Fichas enriquecidas: specs, características, plano, descripciones generadas | Datos demo derivados (terraza, año, certificado) + textos comerciales desde datos estructurados |
| 2026-07-27 | Panel admin reducido a 7 entradas; IA/feeds/portales/sync/usuarios → Ajustes | Menú orientado a agentes no técnicos; sin rutas API ni tokens visibles |
