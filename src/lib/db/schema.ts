import {
  boolean,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const propertyStatusEnum = pgEnum("property_status", [
  "available",
  "reserved",
  "sold",
  "draft",
  "withdrawn",
]);

export const propertyTypeEnum = pgEnum("property_type", [
  "villa",
  "apartment",
  "plot",
  "townhouse",
  "commercial",
]);

export const locationPrecisionEnum = pgEnum("location_precision", [
  "exact",
  "approximate",
  "hidden",
]);

export const translationSourceEnum = pgEnum("translation_source", [
  "manual",
  "ai_generated",
  "ai_translated",
]);

export const mediaKindEnum = pgEnum("media_kind", [
  "photo",
  "floorplan",
  "video",
  "tour_360",
  "document",
]);

export const leadSourceEnum = pgEnum("lead_source", [
  "form",
  "whatsapp",
  "valuation",
  "property_alert",
  "portal",
]);

export const leadStatusEnum = pgEnum("lead_status", [
  "new",
  "contacted",
  "qualified",
  "visiting",
  "closed",
  "lost",
]);

export const valuationStatusEnum = pgEnum("valuation_status", [
  "pending",
  "reviewed",
  "contacted",
]);

export const syncStatusEnum = pgEnum("sync_status", [
  "success",
  "partial",
  "failed",
]);

export const userRoleEnum = pgEnum("user_role", [
  "admin",
  "agent",
  "editor",
  "owner",
  "resident",
]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  role: userRoleEnum("role").notNull().default("agent"),
  authId: uuid("auth_id").unique(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const properties = pgTable("properties", {
  id: uuid("id").defaultRandom().primaryKey(),
  crmId: text("crm_id").unique(),
  reference: text("reference").notNull().unique(),
  slug: text("slug").notNull().unique(),
  status: propertyStatusEnum("status").notNull().default("draft"),
  type: propertyTypeEnum("type").notNull(),
  price: integer("price").notNull(),
  priceVisible: boolean("price_visible").notNull().default(true),
  bedrooms: integer("bedrooms").notNull().default(0),
  bathrooms: integer("bathrooms").notNull().default(0),
  builtArea: integer("built_area"),
  plotArea: integer("plot_area"),
  terraceArea: integer("terrace_area"),
  yearBuilt: integer("year_built"),
  energyRating: text("energy_rating"),
  latitude: numeric("latitude", { precision: 10, scale: 7 }),
  longitude: numeric("longitude", { precision: 10, scale: 7 }),
  locationPrecision: locationPrecisionEnum("location_precision")
    .notNull()
    .default("approximate"),
  features: jsonb("features").$type<string[]>().notNull().default([]),
  elevation: integer("elevation"),
  orientation: text("orientation"),
  viewRelation: text("view_relation"),
  isFeatured: boolean("is_featured").notNull().default(false),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  soldAt: timestamp("sold_at", { withTimezone: true }),
  crmSyncedAt: timestamp("crm_synced_at", { withTimezone: true }),
  crmRaw: jsonb("crm_raw"),
  ownerUserId: uuid("owner_user_id").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const propertyOverrides = pgTable("property_overrides", {
  id: uuid("id").defaultRandom().primaryKey(),
  propertyId: uuid("property_id")
    .notNull()
    .references(() => properties.id, { onDelete: "cascade" }),
  field: text("field").notNull(),
  value: jsonb("value").notNull(),
  reason: text("reason"),
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const propertyTranslations = pgTable(
  "property_translations",
  {
    propertyId: uuid("property_id")
      .notNull()
      .references(() => properties.id, { onDelete: "cascade" }),
    locale: text("locale").notNull(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    source: translationSourceEnum("source").notNull().default("manual"),
    reviewed: boolean("reviewed").notNull().default(false),
    reviewedBy: uuid("reviewed_by").references(() => users.id),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [primaryKey({ columns: [table.propertyId, table.locale] })],
);

export const propertyMedia = pgTable("property_media", {
  id: uuid("id").defaultRandom().primaryKey(),
  propertyId: uuid("property_id")
    .notNull()
    .references(() => properties.id, { onDelete: "cascade" }),
  kind: mediaKindEnum("kind").notNull().default("photo"),
  storagePath: text("storage_path").notNull(),
  width: integer("width"),
  height: integer("height"),
  blurHash: text("blur_hash"),
  sortOrder: integer("sort_order").notNull().default(0),
  aiRoomType: text("ai_room_type"),
  aiQualityScore: numeric("ai_quality_score", { precision: 4, scale: 2 }),
  altTranslations: jsonb("alt_translations")
    .$type<Record<string, string>>()
    .notNull()
    .default({}),
  isCover: boolean("is_cover").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const leads = pgTable("leads", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  locale: text("locale").notNull().default("en"),
  message: text("message"),
  source: leadSourceEnum("source").notNull().default("form"),
  propertyId: uuid("property_id").references(() => properties.id),
  budgetMin: integer("budget_min"),
  budgetMax: integer("budget_max"),
  preferences: jsonb("preferences").$type<Record<string, unknown>>(),
  aiSummary: text("ai_summary"),
  aiScore: integer("ai_score"),
  notes: text("notes"),
  crmPushedAt: timestamp("crm_pushed_at", { withTimezone: true }),
  status: leadStatusEnum("status").notNull().default("new"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const valuations = pgTable("valuations", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  address: text("address").notNull(),
  propertyType: propertyTypeEnum("property_type").notNull(),
  bedrooms: integer("bedrooms"),
  builtArea: integer("built_area"),
  plotArea: integer("plot_area"),
  condition: text("condition"),
  photos: jsonb("photos").$type<string[]>().notNull().default([]),
  aiEstimateMin: integer("ai_estimate_min"),
  aiEstimateMax: integer("ai_estimate_max"),
  aiReasoning: text("ai_reasoning"),
  agentEstimate: integer("agent_estimate"),
  agentNotes: text("agent_notes"),
  status: valuationStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const syncLogs = pgTable("sync_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  startedAt: timestamp("started_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  finishedAt: timestamp("finished_at", { withTimezone: true }),
  status: syncStatusEnum("status").notNull().default("failed"),
  propertiesCreated: integer("properties_created").notNull().default(0),
  propertiesUpdated: integer("properties_updated").notNull().default(0),
  propertiesArchived: integer("properties_archived").notNull().default(0),
  warnings: jsonb("warnings").$type<string[]>().notNull().default([]),
  warningsReviewed: boolean("warnings_reviewed").notNull().default(false),
  error: text("error"),
});

export const pages = pgTable("pages", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const pageTranslations = pgTable(
  "page_translations",
  {
    pageId: uuid("page_id")
      .notNull()
      .references(() => pages.id, { onDelete: "cascade" }),
    locale: text("locale").notNull(),
    title: text("title").notNull(),
    body: text("body").notNull(),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [primaryKey({ columns: [table.pageId, table.locale] })],
);

export const aiUsageLogs = pgTable("ai_usage_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  module: text("module").notNull(),
  model: text("model").notNull(),
  inputTokens: integer("input_tokens").notNull().default(0),
  outputTokens: integer("output_tokens").notNull().default(0),
  costUsd: numeric("cost_usd", { precision: 10, scale: 6 }),
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type Property = typeof properties.$inferSelect;
export type NewProperty = typeof properties.$inferInsert;
export type PropertyOverride = typeof propertyOverrides.$inferSelect;
export type PropertyTranslation = typeof propertyTranslations.$inferSelect;
export type PropertyMedia = typeof propertyMedia.$inferSelect;
export type Lead = typeof leads.$inferSelect;
export type Valuation = typeof valuations.$inferSelect;
export type SyncLog = typeof syncLogs.$inferSelect;
export type User = typeof users.$inferSelect;
