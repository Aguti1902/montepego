-- MontePego Life — esquema inicial + RLS
-- Generado para Supabase (Postgres)

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$ BEGIN
  CREATE TYPE property_status AS ENUM ('available', 'reserved', 'sold', 'draft', 'withdrawn');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE property_type AS ENUM ('villa', 'apartment', 'plot', 'townhouse', 'commercial');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE location_precision AS ENUM ('exact', 'approximate', 'hidden');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE translation_source AS ENUM ('manual', 'ai_generated', 'ai_translated');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE media_kind AS ENUM ('photo', 'floorplan', 'video', 'tour_360', 'document');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE lead_source AS ENUM ('form', 'whatsapp', 'valuation', 'property_alert', 'portal');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'qualified', 'visiting', 'closed', 'lost');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE valuation_status AS ENUM ('pending', 'reviewed', 'contacted');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE sync_status AS ENUM ('success', 'partial', 'failed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('admin', 'agent', 'editor', 'owner', 'resident');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  full_name text NOT NULL,
  role user_role NOT NULL DEFAULT 'agent',
  auth_id uuid UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  crm_id text UNIQUE,
  reference text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  status property_status NOT NULL DEFAULT 'draft',
  type property_type NOT NULL,
  price integer NOT NULL,
  price_visible boolean NOT NULL DEFAULT true,
  bedrooms integer NOT NULL DEFAULT 0,
  bathrooms integer NOT NULL DEFAULT 0,
  built_area integer,
  plot_area integer,
  terrace_area integer,
  year_built integer,
  energy_rating text,
  latitude numeric(10, 7),
  longitude numeric(10, 7),
  location_precision location_precision NOT NULL DEFAULT 'approximate',
  features jsonb NOT NULL DEFAULT '[]'::jsonb,
  elevation integer,
  orientation text,
  view_relation text,
  is_featured boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  sold_at timestamptz,
  crm_synced_at timestamptz,
  crm_raw jsonb,
  owner_user_id uuid REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS property_overrides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  field text NOT NULL,
  value jsonb NOT NULL,
  reason text,
  created_by uuid REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS property_translations (
  property_id uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  locale text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  seo_title text,
  seo_description text,
  source translation_source NOT NULL DEFAULT 'manual',
  reviewed boolean NOT NULL DEFAULT false,
  reviewed_by uuid REFERENCES users(id),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (property_id, locale)
);

CREATE TABLE IF NOT EXISTS property_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  kind media_kind NOT NULL DEFAULT 'photo',
  storage_path text NOT NULL,
  width integer,
  height integer,
  blur_hash text,
  sort_order integer NOT NULL DEFAULT 0,
  ai_room_type text,
  ai_quality_score numeric(4, 2),
  alt_translations jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_cover boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  locale text NOT NULL DEFAULT 'en',
  message text,
  source lead_source NOT NULL DEFAULT 'form',
  property_id uuid REFERENCES properties(id),
  budget_min integer,
  budget_max integer,
  preferences jsonb,
  ai_summary text,
  ai_score integer,
  notes text,
  crm_pushed_at timestamptz,
  status lead_status NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS valuations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  address text NOT NULL,
  property_type property_type NOT NULL,
  bedrooms integer,
  built_area integer,
  plot_area integer,
  condition text,
  photos jsonb NOT NULL DEFAULT '[]'::jsonb,
  ai_estimate_min integer,
  ai_estimate_max integer,
  ai_reasoning text,
  agent_estimate integer,
  agent_notes text,
  status valuation_status NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sync_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  started_at timestamptz NOT NULL DEFAULT now(),
  finished_at timestamptz,
  status sync_status NOT NULL DEFAULT 'failed',
  properties_created integer NOT NULL DEFAULT 0,
  properties_updated integer NOT NULL DEFAULT 0,
  properties_archived integer NOT NULL DEFAULT 0,
  warnings jsonb NOT NULL DEFAULT '[]'::jsonb,
  warnings_reviewed boolean NOT NULL DEFAULT false,
  error text
);

CREATE TABLE IF NOT EXISTS pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS page_translations (
  page_id uuid NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  locale text NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  seo_title text,
  seo_description text,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (page_id, locale)
);

CREATE TABLE IF NOT EXISTS ai_usage_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module text NOT NULL,
  model text NOT NULL,
  input_tokens integer NOT NULL DEFAULT 0,
  output_tokens integer NOT NULL DEFAULT 0,
  cost_usd numeric(10, 6),
  created_by uuid REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Helpers RLS
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM users WHERE auth_id = auth.uid() LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM users
    WHERE auth_id = auth.uid()
      AND role IN ('admin', 'agent', 'editor')
  );
$$;

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE valuations ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage_logs ENABLE ROW LEVEL SECURITY;

-- Público: propiedades publicadas disponibles/reservadas
CREATE POLICY properties_public_read ON properties
  FOR SELECT TO anon, authenticated
  USING (
    status IN ('available', 'reserved')
    AND published_at IS NOT NULL
  );

CREATE POLICY properties_staff_all ON properties
  FOR ALL TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

CREATE POLICY property_translations_public_read ON property_translations
  FOR SELECT TO anon, authenticated
  USING (
    reviewed = true
    AND EXISTS (
      SELECT 1 FROM properties p
      WHERE p.id = property_id
        AND p.status IN ('available', 'reserved')
        AND p.published_at IS NOT NULL
    )
  );

CREATE POLICY property_translations_staff_all ON property_translations
  FOR ALL TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

CREATE POLICY property_media_public_read ON property_media
  FOR SELECT TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM properties p
      WHERE p.id = property_id
        AND p.status IN ('available', 'reserved')
        AND p.published_at IS NOT NULL
    )
  );

CREATE POLICY property_media_staff_all ON property_media
  FOR ALL TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

CREATE POLICY pages_public_read ON pages
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY page_translations_public_read ON page_translations
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY pages_staff_all ON pages
  FOR ALL TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

CREATE POLICY page_translations_staff_all ON page_translations
  FOR ALL TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

CREATE POLICY leads_insert_public ON leads
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY leads_staff_all ON leads
  FOR ALL TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

CREATE POLICY valuations_insert_public ON valuations
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY valuations_staff_all ON valuations
  FOR ALL TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

CREATE POLICY overrides_staff_all ON property_overrides
  FOR ALL TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

CREATE POLICY sync_logs_staff_all ON sync_logs
  FOR ALL TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

CREATE POLICY ai_usage_staff_all ON ai_usage_logs
  FOR ALL TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

CREATE POLICY users_staff_read ON users
  FOR SELECT TO authenticated
  USING (public.is_staff() OR auth_id = auth.uid());

CREATE POLICY users_admin_all ON users
  FOR ALL TO authenticated
  USING (public.current_user_role() = 'admin')
  WITH CHECK (public.current_user_role() = 'admin');
