-- Portales: propietario vendedor y residente

DO $$ BEGIN
  CREATE TYPE parcel_status AS ENUM ('received', 'notified', 'collected');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE incident_status AS ENUM ('open', 'in_progress', 'resolved');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE reservation_status AS ENUM ('requested', 'confirmed', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS parcels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_user_id uuid NOT NULL REFERENCES users(id),
  carrier text,
  tracking_code text,
  description text,
  status parcel_status NOT NULL DEFAULT 'received',
  received_at timestamptz NOT NULL DEFAULT now(),
  collected_at timestamptz
);

CREATE TABLE IF NOT EXISTS incidents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_user_id uuid NOT NULL REFERENCES users(id),
  title text NOT NULL,
  description text NOT NULL,
  status incident_status NOT NULL DEFAULT 'open',
  created_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz
);

CREATE TABLE IF NOT EXISTS cova_reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_user_id uuid NOT NULL REFERENCES users(id),
  party_size integer NOT NULL DEFAULT 2,
  reserved_for timestamptz NOT NULL,
  notes text,
  status reservation_status NOT NULL DEFAULT 'requested',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE parcels ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE cova_reservations ENABLE ROW LEVEL SECURITY;

CREATE POLICY parcels_own ON parcels
  FOR ALL TO authenticated
  USING (
    resident_user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
    OR public.is_staff()
  )
  WITH CHECK (
    resident_user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
    OR public.is_staff()
  );

CREATE POLICY incidents_own ON incidents
  FOR ALL TO authenticated
  USING (
    resident_user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
    OR public.is_staff()
  )
  WITH CHECK (
    resident_user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
    OR public.is_staff()
  );

CREATE POLICY reservations_own ON cova_reservations
  FOR ALL TO authenticated
  USING (
    resident_user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
    OR public.is_staff()
  )
  WITH CHECK (
    resident_user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
    OR public.is_staff()
  );
