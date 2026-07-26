# MontePego Life — Contexto de proyecto

> Guarda este archivo como `PROJECT.md` en la raíz del repo y referéncialo con `@PROJECT.md` en cada chat de Cursor.
> Alternativa: guárdalo como `.cursor/rules/project.mdc` con `alwaysApply: true` para que se cargue solo.

---

## 0. Cómo debes trabajar en este repo (instrucciones para el agente)

Eres el desarrollador principal de este proyecto. Trabajas de forma incremental y verificable.

**Reglas de proceso, no negociables:**

1. **Ejecuta sin pedir confirmación.** Construyes el proyecto entero de principio a fin. No te detengas a validar decisiones intermedias, no pidas aprobación de diseño, no entregues avances parciales para revisión. Si tienes que elegir entre dos opciones razonables, elige la mejor según este documento, anótala en `DECISIONS.md` y sigue.
2. **No inventes datos de negocio.** Si necesitas un dato del cliente que no está en este documento (credenciales del CRM, nombres del equipo, precios de servicios), déjalo como constante en `src/config/pending.ts` con un comentario `// TODO(cliente): confirmar` y sigue adelante.
3. **Un commit por unidad funcional coherente.** Mensajes en español, imperativo, con prefijo tipo `feat:`, `fix:`, `chore:`.
4. **TypeScript estricto.** Nada de `any`. Si no sabes el tipo de una respuesta externa, defínelo con Zod y valida en el borde.
5. **Cada módulo nuevo con datos debe funcionar con los datos semilla** de la sección 12. La app debe arrancar y verse completa sin conexión al CRM real.
6. **No añadas dependencias sin justificarlo** en una línea. Prefiere la librería estándar y componentes propios antes que instalar un paquete para algo pequeño.
7. Al terminar cada fase, actualiza `PROGRESS.md` con qué está hecho, qué falta y qué decisiones tomaste.

---

## 1. Contexto de negocio

**Cliente:** MontePego Life — empresa familiar en el residencial Monte Pego (Pego, Alicante, Costa Blanca, España).

**No es solo una inmobiliaria.** Sus líneas de negocio:

- **Inmobiliaria** — venta de villas y apartamentos dentro del residencial. Cartera de unas 25-30 propiedades activas, precios entre 180.000 € y 1.450.000 €.
- **Service center** — recepción, correo y paquetería para los residentes.
- **Seguridad 24h** del residencial.
- **Gastrobar La Cova** — bar/restaurante de la urbanización.
- **montepego.info** — web de noticias y comunidad del residencial (actualmente separada).

**Público objetivo:** compradores extranjeros de segunda residencia y jubilación. Principalmente **holandeses, alemanes, belgas, británicos, franceses y polacos**. Por eso la web actual está en 6 idiomas: EN, ES, NL, FR, DE, PL. **El inglés y el holandés son prioritarios, no el español.**

**Tono de marca:** familiar, cercano, de confianza, con arraigo local. No es lujo frío ni corporativo. Venden tranquilidad, vistas al mar y a la montaña, y una comunidad.

**Datos de contacto reales:**
- Edificio Rosario, Avd. Internacional Nº1, Monte Pego, 03780, Pego, Alicante, España
- Tel: 96 557 25 07 / 96 557 14 58
- Email: info@montepegolife.com
- WhatsApp: +34 662 306 461
- Instagram: @montepegolife

---

## 2. Situación actual y por qué la reemplazamos

La web actual (`montepegolife.com`) es **WordPress + Elementor + WPML**, con las propiedades importadas desde su CRM mediante una integración frágil.

**Problemas concretos y verificados que este proyecto debe resolver:**

| Problema actual | Cómo lo resolvemos |
|---|---|
| Campos de m² que muestran una URL en lugar del valor, o `0 M2` | Validación con Zod en la importación + campos override manuales desde el panel |
| Propiedades vendidas mezcladas con las disponibles en portada | Estados de propiedad y archivado automático |
| Imágenes sin optimizar, nombradas `WhatsApp Image 2026-02-17 at 12.50.29 (14)` | Pipeline de imágenes: AVIF/WebP, variantes responsive, `alt` generado por IA |
| Traducción manual a 6 idiomas | Generación y traducción asistida por IA con revisión humana en el panel |
| Enlaces rotos (`#`) y mal apuntados | Contenido gestionado desde el panel, sin HTML suelto |
| Elementor: lento y frágil | Next.js con render estático |
| Publicar en portales externos a mano | Feeds XML automáticos |

**Filosofía técnica central del proyecto:**

> **El CRM deja de ser la fuente de verdad del front.** Sincronizamos el CRM a una base de datos propia. Si el CRM cae, cambia de formato o devuelve datos sucios, la web sigue funcionando y el panel avisa del problema en vez de publicar basura.

---

## 3. Alcance

**Se construye el producto completo.** No hay demo, no hay maqueta, no hay entregas intermedias para enseñar. Todo lo descrito en este documento forma parte del alcance y debe quedar implementado y funcionando.

Orden de construcción (es un orden de dependencias técnicas, no fases de entrega — no pares entre bloques):

1. **Base** — proyecto, tokens de diseño, sistema de componentes, i18n con los 6 idiomas, esquema de BD completo en Supabase con RLS, autenticación y roles, datos semilla.
2. **Dominio** — capa de datos de propiedades con overrides aplicados, medios, traducciones, leads, valoraciones.
3. **CRM** — adaptador, saneamiento, sincronización programada, registro de incidencias.
4. **Web pública** — todas las rutas de la sección 7, en los 6 idiomas, con SEO completo, sitemaps, schema.org, OG dinámicas y redirecciones desde la web antigua.
5. **Panel** — todo lo de la sección 11.
6. **IA** — los 7 módulos de la sección 8.
7. **Distribución** — feeds XML a portales externos, emails transaccionales, alertas de matching.
8. **Portales** — portal del propietario vendedor y portal del residente (paquetería, incidencias, reservas en La Cova).
9. **Calidad** — tests, auditoría de accesibilidad y rendimiento, deploy en Vercel con entornos de staging y producción.

El proyecto está terminado cuando los nueve bloques están completos y la aplicación funciona de extremo a extremo.

---

## 4. Stack

Decidido. No lo cambies sin justificarlo.

- **Framework:** Next.js 15+, App Router, React Server Components por defecto.
- **Lenguaje:** TypeScript estricto.
- **Estilos:** Tailwind CSS v4. Tokens de diseño en CSS variables (sección 9). Sin librerías de componentes pesadas.
- **Componentes base:** shadcn/ui, pero **restilizado** con nuestros tokens. No debe parecer una web de shadcn por defecto.
- **BD + Auth + Storage:** Supabase (Postgres). RLS activo en todas las tablas.
- **ORM:** Drizzle.
- **Validación:** Zod en todos los bordes (formularios, API, importación del CRM).
- **i18n:** `next-intl`, rutas `/[locale]/...`.
- **Imágenes:** `next/image` con Supabase Storage. Procesado con `sharp` en la subida.
- **IA:** SDK de Anthropic (`@anthropic-ai/sdk`). Modelo por defecto `claude-sonnet-4-6` para tareas de texto y visión.
- **Emails:** Resend + React Email.
- **Formularios:** React Hook Form + Zod.
- **Mapas:** MapLibre GL con tiles de un proveedor gratuito. No Google Maps.
- **Analítica:** Vercel Analytics + Plausible.
- **Tests:** Vitest para lógica de negocio (especialmente el mapeo del CRM), Playwright para 3 flujos críticos.
- **Deploy:** Vercel.

**Estructura de carpetas:**

```
src/
  app/
    [locale]/            # web pública
      page.tsx
      propiedades/
      propiedad/[slug]/
      vender/
      servicios/
      la-cova/
      contacto/
    admin/               # panel, sin locale, siempre en español
    api/
      sync/              # cron de sincronización con CRM
      feeds/             # XML para portales
      ai/                # endpoints de IA
  components/
    ui/                  # primitivas
    property/
    admin/
  lib/
    db/                  # esquema drizzle + queries
    crm/                 # adaptador de CRM (ver sección 6)
    ai/                  # prompts y clientes
    i18n/
  config/
messages/                # traducciones de UI: en.json, nl.json, de.json, fr.json, pl.json, es.json
```

---

## 5. Modelo de datos

Esquema en Drizzle. Tablas principales:

**`properties`**
```
id                uuid PK
crm_id            text unique nullable    -- referencia en el CRM origen
reference         text unique             -- ref visible: "1505"
slug              text unique
status            enum: available | reserved | sold | draft | withdrawn
type              enum: villa | apartment | plot | townhouse | commercial
price             integer                 -- en euros, sin decimales
price_visible     boolean default true
bedrooms          integer
bathrooms         integer
built_area        integer nullable        -- m² construidos
plot_area         integer nullable        -- m² parcela
terrace_area      integer nullable
year_built        integer nullable
energy_rating     text nullable
latitude          numeric nullable
longitude         numeric nullable
location_precision enum: exact | approximate | hidden
features          jsonb                   -- array de slugs: ["pool","sea_view","garage"]
is_featured       boolean default false
published_at      timestamptz nullable
sold_at           timestamptz nullable
crm_synced_at     timestamptz
crm_raw           jsonb                   -- payload original del CRM, para depurar
created_at, updated_at
```

**`property_overrides`** — clave del proyecto
```
property_id       uuid FK
field             text                    -- "built_area", "price", ...
value             jsonb
reason            text nullable
created_by        uuid FK users
created_at
```
> Si existe un override para un campo, **manda sobre el valor del CRM en cada sincronización**. Esto resuelve el problema histórico de datos sucios. La query de lectura de propiedades debe aplicar overrides siempre.

**`property_translations`**
```
property_id       uuid FK
locale            text                    -- en, nl, de, fr, pl, es
title             text
description       text
seo_title         text nullable
seo_description   text nullable
source            enum: manual | ai_generated | ai_translated
reviewed          boolean default false   -- nada generado por IA se publica sin revisar
reviewed_by       uuid nullable
updated_at
PK (property_id, locale)
```

**`property_media`**
```
id                uuid PK
property_id       uuid FK
kind              enum: photo | floorplan | video | tour_360 | document
storage_path      text
width, height     integer
blur_hash         text nullable
sort_order        integer
ai_room_type      text nullable           -- facade, living_room, kitchen, pool, view, plan
ai_quality_score  numeric nullable        -- para ordenación sugerida
alt_translations  jsonb                   -- { "en": "...", "nl": "..." }
is_cover          boolean default false
```

**`leads`**
```
id                uuid PK
name, email, phone, locale
message           text nullable
source            enum: form | whatsapp | valuation | property_alert | portal
property_id       uuid FK nullable
budget_min, budget_max  integer nullable
preferences       jsonb                   -- criterios para el matching
ai_summary        text nullable
ai_score          integer nullable        -- 0-100 cualificación
crm_pushed_at     timestamptz nullable
status            enum: new | contacted | qualified | visiting | closed | lost
created_at
```

**`valuations`** — solicitudes del valorador
```
id, name, email, phone, address, property_type,
bedrooms, built_area, plot_area, condition,
photos            jsonb
ai_estimate_min, ai_estimate_max  integer
ai_reasoning      text
status            enum: pending | reviewed | contacted
created_at
```

**`sync_logs`**
```
id, started_at, finished_at,
status            enum: success | partial | failed
properties_created, properties_updated, properties_archived  integer
warnings          jsonb    -- ["Ref 1456: built_area = 0, se ignora", ...]
error             text nullable
```

**`users`** — roles: `admin` | `agent` | `editor` | `owner` (propietario vendedor) | `resident`

**`pages`** y **`page_translations`** — contenido editable de páginas estáticas.

**RLS:** público solo lee `properties` con `status in (available, reserved)` y `published_at not null`, sus traducciones revisadas y sus medios. Todo lo demás requiere sesión con rol.

---

## 6. Integración con el CRM

**Estado:** el CRM concreto está **pendiente de confirmar por el cliente** (candidatos: Inmovilla, Resales Online, Optima-CRM, Witei, Egorealestate).

**Por eso, diséñalo como adaptador desde el minuto uno:**

```ts
// src/lib/crm/types.ts
export interface CrmAdapter {
  name: string;
  fetchProperties(since?: Date): Promise<RawCrmProperty[]>;
  fetchProperty(crmId: string): Promise<RawCrmProperty | null>;
  pushLead?(lead: LeadPayload): Promise<{ crmId: string }>;
}
```

Implementaciones en `src/lib/crm/adapters/`:
- `mock.ts` — devuelve los datos semilla. Es el adaptador activo por defecto y el que usan los tests. La aplicación debe funcionar completa con él.
- `inmovilla.ts`, `resales.ts`, ... — se implementan cuando se confirme.

**Reglas de la sincronización (`/api/sync`, cron cada 30 min):**

1. Todo payload del CRM pasa por un schema Zod **permisivo**: nunca lanza excepción, marca campos inválidos y los registra en `sync_logs.warnings`.
2. Un campo inválido **no bloquea** la importación del resto de la propiedad. Se importa lo bueno y se avisa.
3. Reglas de saneamiento obligatorias, aprendidas de los fallos actuales:
   - Si un campo numérico contiene una URL o texto no numérico → `null` + warning.
   - Si `built_area === 0` o `plot_area === 0` → `null` + warning.
   - Si `price === 0` o falta → la propiedad entra como `draft`, nunca publicada.
   - Si faltan fotos → `draft`.
4. **Los overrides manuales siempre ganan** sobre el valor entrante del CRM.
5. Propiedades que desaparecen del CRM → `withdrawn`, nunca borrado físico.
6. `crm_raw` guarda siempre el payload original para depuración.
7. El panel muestra un banner rojo si la última sincronización falló o tiene warnings sin revisar.

---

## 7. Web pública

**Rutas** (con prefijo de locale; slugs traducidos por idioma):

- `/` — home
- `/properties` — listado con filtros
- `/property/[slug]` — ficha
- `/sell` — captación de vendedores + valorador IA
- `/about` — la empresa y el equipo
- `/services` — service center, seguridad, paquetería
- `/la-cova` — el gastrobar
- `/monte-pego` — guía del residencial y la zona (motor de SEO)
- `/contact`
- `/legal-notice`, `/privacy-policy`, `/cookies-policy`

**Home:** hero con las vistas reales (mar + montaña), buscador prominente, 6 propiedades destacadas, bloque de "somos más que una inmobiliaria" con los servicios, CTA de valoración para vendedores, prueba social.

**Listado:** filtros por tipo, precio, dormitorios, características, y ordenación. Filtros en la URL (compartibles e indexables). Vista mapa/lista. Paginación real, no scroll infinito.

**Ficha:** galería a pantalla completa con teclado y swipe, datos clave, descripción, mapa (respetando `location_precision`), plano, propiedades similares, formulario de contacto lateral fijo y botón de WhatsApp. Los estados `sold` y `reserved` se muestran con claridad, no se ocultan.

**Requisitos transversales:**
- Lighthouse ≥ 95 en performance y accesibilidad en móvil.
- LCP < 2s con la galería cargada.
- Todo navegable por teclado, foco visible, `prefers-reduced-motion` respetado.
- Cero *layout shift* en la galería.

---

## 8. Módulos de IA

Todos los endpoints en `/api/ai/*`, todos los prompts versionados en `src/lib/ai/prompts/`, todos protegidos por rol.

**Regla de oro: la IA propone, el humano publica.** Nada generado por IA llega al público sin `reviewed = true`.

Orden de implementación:

1. **Descripciones multiidioma.** Entrada: datos estructurados de la propiedad + fotos. Salida: título y descripción comercial en los 6 idiomas, con el tono de marca. Editable y aprobable desde el panel, idioma por idioma. Guardar en `property_translations` con `source = ai_generated`.
2. **Procesado de fotos.** En la subida: clasificar tipo de estancia, puntuar calidad, sugerir orden y portada, generar `alt` en 6 idiomas. Detección y difuminado de matrículas y caras.
3. **Buscador conversacional.** El usuario escribe en lenguaje natural en su idioma; se traduce a filtros estructurados con salida JSON validada por Zod; se ejecuta contra la BD. **Nunca inventes propiedades: solo devuelve resultados reales de la consulta.** Si no hay resultados, dilo y ofrece la búsqueda más cercana.
4. **Valorador para vendedores.** Formulario + fotos → estimación con **rango**, nunca cifra única, más el razonamiento. Debe mostrar aviso claro de que es una estimación orientativa y no una tasación oficial. Genera un lead de alto valor.
5. **Agente de WhatsApp.** Vía WhatsApp Business API. Responde 24/7 en el idioma del usuario, solo sobre la cartera real y la información de la empresa. Cualifica, propone visita y escala a humano cuando detecta intención de compra o cuando no sabe. Registra todo como `lead`.
6. **Matching comprador–propiedad.** Al publicarse una propiedad, se cruza con las preferencias de los leads y se envían alertas segmentadas.
7. **Resumen y puntuación de leads.** Cada lead entrante se resume y puntúa para priorizar.

**Restricciones para todos los módulos de IA:**
- Nunca afirmar datos legales, urbanísticos o fiscales. Derivar a la oficina.
- Nunca prometer precios, disponibilidad ni condiciones que no estén en la BD.
- Las imágenes generadas o modificadas (home staging virtual) se etiquetan visiblemente como recreación.
- Registrar coste por llamada para poder facturar el consumo.

---

## 9. Dirección de diseño

El sitio no puede parecer una plantilla inmobiliaria genérica ni una web de agencia de IA. La referencia es el propio lugar: **la sierra de Segària, la marjal de Pego, la piedra caliza, el mar al fondo, la vegetación mediterránea baja**.

**Paleta** (define como CSS variables en `globals.css`):

```
--sea-deep:   #094D88   /* azul de marca existente, se conserva */
--sea-mist:   #6E97B8   /* azul desaturado, secundario */
--limestone:  #EDE8DF   /* fondo cálido claro, piedra */
--rosemary:   #4A5D46   /* verde romero, acento vegetal */
--sun-clay:   #C8763F   /* acento cálido, uso muy puntual */
--ink:        #1B2229   /* texto */
```

Fondo dominante: `--limestone`. Texto: `--ink`. Azul de marca para acciones primarias. El verde romero como acento estructural (filetes, etiquetas, estados). El `--sun-clay` solo en microdetalles: no debe dominar ninguna vista.

**Tipografía:**
- Display: una serif con carácter y algo de contraste, usada con moderación en titulares grandes. Sugerencia: *Fraunces* o *Instrument Serif*.
- Cuerpo e interfaz: una sans neutra y muy legible a tamaños pequeños. Sugerencia: *Inter Tight* o *Geist*.
- Datos y referencias (precio, ref, m²): la sans en variante tabular, con `font-variant-numeric: tabular-nums`. Los números de una ficha inmobiliaria son datos, deben alinearse y leerse como datos.

**Elemento firma:** la ficha y las tarjetas de propiedad muestran una **franja de cota** — una línea horizontal fina con la altitud/orientación y la relación de la parcela con la vista (mar, montaña, ambas). Es información real y diferencial en Monte Pego, donde la cota y la orientación determinan el precio, y ninguna competencia la muestra. Que sea sobria: una regla, una etiqueta, nada más.

**Restricciones:**
- Sin degradados decorativos, sin *glassmorphism*, sin sombras difusas grandes.
- Radio de borde pequeño y consistente (4-6px). Nada de tarjetas muy redondeadas.
- Animación: solo revelado al hacer scroll en la galería y micro-transiciones de hover. Nada más.
- La foto manda. El diseño es el marco, no el protagonista.

**Copy de interfaz:** verbos en activa, frase en mayúscula inicial solamente, sin relleno. "Ver la villa", no "Descubre esta increíble oportunidad". Los estados vacíos invitan a actuar y los errores explican qué pasó y cómo arreglarlo.

---

## 10. SEO e internacionalización

- Rutas `/[locale]/`, con `hreflang` correcto entre las 6 versiones y `x-default` en inglés.
- Slugs traducidos por idioma, con redirección 301 de los slugs de la web antigua. **Mapa de redirecciones obligatorio antes del lanzamiento** — la web actual tiene posicionamiento que no se puede perder.
- `schema.org`: `RealEstateListing` en cada ficha, `Organization` y `LocalBusiness` en el sitio, `BreadcrumbList` en la navegación.
- Sitemaps por idioma, generados desde la BD.
- OG images generadas dinámicamente por propiedad (`next/og`) con foto, precio y referencia.
- Página `/monte-pego` como contenido de fondo (clima, servicios, comunidad, cómo llegar, vida en la urbanización) estructurada en preguntas y respuestas, pensada para ser citada por buscadores de IA.

---

## 11. Panel de administración

Ruta `/admin`, siempre en español, sin i18n.

- **Dashboard:** estado de la última sincronización con warnings destacados, leads nuevos, propiedades sin traducir, propiedades sin fotos, métricas de la semana.
- **Propiedades:** tabla con filtros, edición de ficha, gestión de overrides con indicación visual de qué campo viene del CRM y cuál es manual, cambio de estado, destacar.
- **Medios:** subida por arrastre, reordenación por arrastre, portada, alt por idioma, resultado del procesado IA.
- **Traducciones:** vista por propiedad e idioma, generar con IA, editar, marcar como revisada. Contador de pendientes.
- **Leads:** bandeja con resumen y puntuación IA, estado, notas.
- **Valoraciones:** solicitudes del valorador con la estimación de la IA y espacio para la valoración real del agente.
- **Contenido:** edición de las páginas estáticas por idioma.
- **Ajustes:** usuarios y roles, configuración de feeds, claves.

El panel es para gente **no técnica que trabaja rápido**. Prioriza: pocos clics, guardado automático con indicador claro, deshacer, y ningún tecnicismo en la interfaz ("Sincronización", no "cron job"; "Sin publicar", no "draft").

---

## 12. Datos semilla

Crea `src/lib/db/seed.ts` con estas propiedades reales. Son el conjunto de datos con el que se desarrolla y se testea todo. Genera descripciones plausibles en los 6 idiomas y usa placeholders de imagen con las proporciones correctas hasta tener las fotos reales.

| Ref | Título | Hab | Baños | Parcela | Construido | Precio | Estado |
|---|---|---|---|---|---|---|---|
| 1505 | Renovated Villa with Panoramic Views | 3 | 2 | 1600 m² | 170 m² | 495.000 € | available |
| 1532 | Charming Villa with Panoramic Views | 2 | 2 | 580 m² | 173 m² | 380.000 € | available |
| 1530 | Elegant Villa with Sea & Mountain Views | 1 | 1 | 900 m² | 265 m² | 540.000 € | available |
| 1528 | Peaceful Oasis with Private Pool and Guest Apartments | 5 | 3 | 2621 m² | 329 m² | 750.000 € | available |
| 1496 | Exclusive Modern Residence with Panoramic Views | 4 | 3 | 858 m² | — | 1.449.000 € | available |
| 1512 | Elegant Mediterranean Villa | 5 | 4 | 1099 m² | 427 m² | 875.000 € | available |
| 1452 | Bright Villa with Private Pool and Sunny Flat Plot | 3 | 2 | 1100 m² | — | 400.000 € | sold |
| 1456 | Newly Refurbished Flat | 2 | 1 | — | — | 199.000 € | draft |

> Las dos últimas están a propósito: la vendida sirve para probar el archivado, y la 1456 (que en la web actual muestra `0 M2`) para probar que el saneamiento la manda a `draft` con warning en vez de publicarla rota.

Características disponibles (`features`): `pool`, `sea_view`, `mountain_view`, `garage`, `guest_apartment`, `terrace`, `garden`, `air_conditioning`, `heating`, `fireplace`, `solar`, `renovated`, `furnished`, `alarm`.

---

## 13. Lo que NO debes hacer

- No usar WordPress, ni ningún CMS headless de terceros. El panel es propio.
- No usar Google Maps.
- No meter Redux ni gestores de estado globales. Server Components y `useState` local bastan.
- No usar `any` ni `@ts-ignore`.
- No dejar que la IA publique contenido sin revisión humana.
- No borrar propiedades físicamente. Nunca.
- No guardar claves de API en el cliente. Toda llamada a IA o al CRM pasa por el servidor.
- No hardcodear textos de interfaz en los componentes: van en `messages/*.json`.
- No inventar reseñas, premios, testimonios ni cifras de empresa. Si el diseño pide prueba social, deja el componente con datos marcados como `// TODO(cliente)`.
- No cambiar el azul de marca `#094D88`: es el que ya usan.

---

## 14. Encargo

Construye el proyecto completo, desde cero, siguiendo el orden de la sección 3. No te detengas entre bloques, no pidas validación, no entregues avances parciales. Empieza inicializando el proyecto con el stack de la sección 4 y continúa hasta que los nueve bloques estén terminados.

**Definición de terminado.** El proyecto está listo cuando se cumple todo esto:

- `npm run build` pasa sin errores ni avisos de TypeScript.
- `npm run test` pasa. Cobertura obligatoria en el saneamiento del CRM y en la aplicación de overrides.
- Los tests de Playwright cubren: buscar y abrir una propiedad, enviar el formulario de contacto, y editar y publicar una propiedad desde el panel.
- La app arranca en limpio con `db:push && db:seed` y se ve completa, sin estados vacíos rotos ni imágenes faltantes.
- Las 11 rutas públicas responden en los 6 idiomas, con `hreflang` correcto entre todas.
- Lighthouse móvil ≥ 95 en rendimiento y accesibilidad en home, listado y ficha.
- El panel permite el ciclo completo: importar, corregir con override, traducir con IA, revisar, publicar, marcar vendido.
- Los 7 módulos de IA responden y quedan registrados con su coste.
- Los feeds XML validan contra el esquema de cada portal.
- Ambos portales (propietario y residente) tienen su flujo de acceso y sus vistas funcionando.
- `README.md` documenta variables de entorno, arranque local, seed y despliegue.
- `DECISIONS.md` recoge cada decisión que tuviste que tomar por tu cuenta.
- Desplegado en Vercel con staging y producción.

Si algo de este documento entra en conflicto con otra cosa, manda lo más específico. Si falta información de negocio, aplica la regla 2 de la sección 0 y continúa: no pares a preguntar.
