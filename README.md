# MontePego Life

Web, panel y portales de MontePego Life (Monte Pego, Alicante). Especificación completa en [`PROJECT.md`](./PROJECT.md).

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS v4 · Supabase · Drizzle · Zod · next-intl · MapLibre · Anthropic · Resend · Vitest · Playwright

## Modelo de datos (CRM-API primero)

```
CRM (API eGO u otro) → CrmAdapter → sanitize (Zod) → Postgres (Supabase) → Web / Panel
```

- El **front nunca llama al CRM**. Solo el servidor (cron `/api/sync` y `pushLead`).
- Si el CRM cae, la web sigue sirviendo la BD; el panel muestra warnings en `sync_logs`.
- Los **overrides** manuales del panel ganan siempre sobre el valor entrante del CRM.
- `CRM_ADAPTER=mock` **imita** la API con `src/lib/db/seed-data.ts` (local/tests).
- Staging/prod: `CRM_ADAPTER=ego` (u otro) + `CRM_API_URL` + `CRM_API_KEY`, y la cartera vive en la BD tras el sync.

## Arranque local

```bash
cp .env.example .env.local
npm install
npm run dev
```

Sin `DATABASE_URL` la UI funciona con datos semilla (`src/lib/db/seed-data.ts`). Auth persistente y sync CRM requieren Supabase.

### Con Supabase

1. Rellena en `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `DATABASE_URL`
2. Aplica esquema:

```bash
psql "$DATABASE_URL" -f supabase/migrations/0001_init.sql
psql "$DATABASE_URL" -f supabase/migrations/0002_portals.sql
# o: npm run db:push && aplicar RLS a mano desde los SQL
npm run db:seed
```

3. (Opcional) Sincroniza desde el adaptador CRM:

```bash
curl -X POST http://localhost:3000/api/sync
```

## Variables de entorno

Ver [`.env.example`](./.env.example):

| Variable | Uso |
|---|---|
| `DATABASE_URL` | Postgres Supabase (fuente de verdad del front) |
| `NEXT_PUBLIC_SUPABASE_*` | Auth cliente/servidor |
| `CRM_ADAPTER` | `mock` (demo) · `ego` · stubs |
| `CRM_API_URL` / `CRM_API_KEY` | Credenciales API del CRM (solo servidor) |
| `ANTHROPIC_API_KEY` | Módulos IA (sin clave → fallback mock registrado) |
| `RESEND_API_KEY` / `EMAIL_FROM` | Emails transaccionales |
| `CRON_SECRET` | Protege `/api/sync` y alertas |
| `NEXT_PUBLIC_SITE_URL` | Canonical / sitemap / feeds |

## Scripts

| Script | Uso |
|---|---|
| `npm run dev` | Desarrollo |
| `npm run build` | Build producción |
| `npm run test` | Vitest |
| `npm run test:e2e` | Playwright (3 flujos críticos) |
| `npm run db:push` | Empuja esquema Drizzle |
| `npm run db:seed` | Semilla de bootstrap |
| `npm run lint` | ESLint |

## Rutas útiles

- Web: `/en`, `/nl`, … (6 idiomas)
- Panel: `/admin` (español)
- Portales: `/portal/owner`, `/portal/resident`
- Feed: `/api/feeds/kyero`
- Sync CRM: `GET/POST /api/sync` (cron cada 30 min vía `vercel.json`)

## Despliegue (Vercel)

1. Importa el repo en Vercel.
2. Crea dos entornos: **Preview/Staging** y **Production**.
3. Configura las variables de `.env.example` en cada entorno (`CRM_ADAPTER=ego` + claves en prod).
4. Conecta el dominio de staging (p. ej. `staging.montepegolife.com`) y producción.
5. El cron de `/api/sync` queda definido en `vercel.json`.

## Documentación de proceso

- `PROJECT.md` — especificación vinculante
- `PROGRESS.md` — checklist de bloques
- `DECISIONS.md` — decisiones tomadas en el camino
