import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { users, properties } from "./schema";

export const parcelStatusEnum = pgEnum("parcel_status", [
  "received",
  "notified",
  "collected",
]);

export const incidentStatusEnum = pgEnum("incident_status", [
  "open",
  "in_progress",
  "resolved",
]);

export const reservationStatusEnum = pgEnum("reservation_status", [
  "requested",
  "confirmed",
  "cancelled",
]);

export const parcels = pgTable("parcels", {
  id: uuid("id").defaultRandom().primaryKey(),
  residentUserId: uuid("resident_user_id")
    .notNull()
    .references(() => users.id),
  carrier: text("carrier"),
  trackingCode: text("tracking_code"),
  description: text("description"),
  status: parcelStatusEnum("status").notNull().default("received"),
  receivedAt: timestamp("received_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  collectedAt: timestamp("collected_at", { withTimezone: true }),
});

export const incidents = pgTable("incidents", {
  id: uuid("id").defaultRandom().primaryKey(),
  residentUserId: uuid("resident_user_id")
    .notNull()
    .references(() => users.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: incidentStatusEnum("status").notNull().default("open"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  resolvedAt: timestamp("resolved_at", { withTimezone: true }),
});

export const covaReservations = pgTable("cova_reservations", {
  id: uuid("id").defaultRandom().primaryKey(),
  residentUserId: uuid("resident_user_id")
    .notNull()
    .references(() => users.id),
  partySize: integer("party_size").notNull().default(2),
  reservedFor: timestamp("reserved_for", { withTimezone: true }).notNull(),
  notes: text("notes"),
  status: reservationStatusEnum("status").notNull().default("requested"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const ownerProperties = pgTable("owner_properties", {
  id: uuid("id").defaultRandom().primaryKey(),
  ownerUserId: uuid("owner_user_id")
    .notNull()
    .references(() => users.id),
  propertyId: uuid("property_id")
    .notNull()
    .references(() => properties.id),
});
