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
