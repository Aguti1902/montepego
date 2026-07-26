# MontePego Life

Web, panel y portales de MontePego Life (Monte Pego, Alicante). Especificación completa en [`PROJECT.md`](./PROJECT.md).

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS v4 · Supabase · Drizzle · Zod · next-intl · MapLibre · Anthropic · Resend · Vitest · Playwright

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

## Variables de entorno

Ver [`.env.example`](./.env.example):

| Variable | Uso |
|---|---|
| `DATABASE_URL` | Postgres Supabase |
| `NEXT_PUBLIC_SUPABASE_*` | Auth cliente/servidor |
| `ANTHROPIC_API_KEY` | Módulos IA (sin clave → fallback mock registrado) |
| `RESEND_API_KEY` / `EMAIL_FROM` | Emails transaccionales |
| `CRON_SECRET` | Protege `/api/sync` y alertas |
| `CRM_ADAPTER` | `mock` por defecto |
| `NEXT_PUBLIC_SITE_URL` | Canonical / sitemap / feeds |

## Scripts

| Script | Uso |
|---|---|
| `npm run dev` | Desarrollo |
| `npm run build` | Build producción |
| `npm run test` | Vitest |
| `npm run test:e2e` | Playwright (3 flujos críticos) |
| `npm run db:push` | Empuja esquema Drizzle |
| `npm run db:seed` | Semilla |
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
3. Configura las variables de `.env.example` en cada entorno.
4. Conecta el dominio de staging (p. ej. `staging.montepegolife.com`) y producción.
5. El cron de `/api/sync` queda definido en `vercel.json`.

## Documentación de proceso

- `PROJECT.md` — especificación vinculante
- `PROGRESS.md` — checklist de bloques
- `DECISIONS.md` — decisiones tomadas en el camino
