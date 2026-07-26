# MontePego Life

Web y panel de MontePego Life (Monte Pego, Alicante). Especificación completa en [`PROJECT.md`](./PROJECT.md).

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS v4 · Supabase · Drizzle · Zod · next-intl · Vitest

## Arranque local

1. Copia variables de entorno:

```bash
cp .env.example .env.local
```

2. Rellena al menos:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `DATABASE_URL` (connection string Postgres de Supabase)

3. Aplica esquema y datos semilla:

```bash
# Opción A: SQL completo con RLS
psql "$DATABASE_URL" -f supabase/migrations/0001_init.sql

# Opción B: Drizzle push (sin políticas RLS; aplica después el SQL de RLS)
npm run db:push

npm run db:seed
```

4. Desarrollo:

```bash
npm install
npm run dev
```

La web pública vive en `/[locale]/…` (EN por defecto). El panel en `/admin` (siempre en español).

Sin credenciales de Supabase la UI arranca con datos semilla en memoria (`src/lib/db/seed-data.ts`). Auth y persistencia requieren Supabase.

## Scripts

| Script | Uso |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run test` | Vitest |
| `npm run db:push` | Empuja esquema Drizzle |
| `npm run db:seed` | Inserta propiedades y páginas semilla |
| `npm run lint` | ESLint |

## Despliegue

Vercel, con entornos staging y producción. Variables según `.env.example`. Cron de sincronización CRM en `/api/sync` (bloque 3).

## Documentación de proceso

- `PROJECT.md` — especificación vinculante
- `PROGRESS.md` — checklist de bloques
- `DECISIONS.md` — decisiones tomadas en el camino
