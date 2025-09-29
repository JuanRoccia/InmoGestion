import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  decimal,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Subscription plans enum
export const subscriptionPlanEnum = pgEnum('subscription_plan', ['basic', 'professional', 'enterprise']);

// Real estate agencies table
export const agencies = pgTable("agencies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  phone: varchar("phone", { length: 50 }),
  address: text("address"),
  website: varchar("website", { length: 255 }),
  description: text("description"),
  logo: varchar("logo"),
  isActive: boolean("is_active").default(true),
  subscriptionPlan: subscriptionPlanEnum("subscription_plan").default('basic'),
  subscriptionStatus: varchar("subscription_status").default('active'),
  ownerId: varchar("owner_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Locations table
export const locations = pgTable("locations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  province: varchar("province", { length: 100 }),
  country: varchar("country", { length: 100 }).default('Argentina'),
  latitude: decimal("latitude", { precision: 10, scale: 7 }),
  longitude: decimal("longitude", { precision: 10, scale: 7 }),
  imageUrl: varchar("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Property categories
export const propertyCategories = pgTable("property_categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Operation types enum
export const operationTypeEnum = pgEnum('operation_type', ['venta', 'alquiler', 'temporario']);

// Properties table
export const properties = pgTable("properties", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default('USD'),
  area: integer("area"), // in square meters
  bedrooms: integer("bedrooms"),
  bathrooms: integer("bathrooms"),
  garages: integer("garages"),
  address: text("address"),
  latitude: decimal("latitude", { precision: 10, scale: 7 }),
  longitude: decimal("longitude", { precision: 10, scale: 7 }),
  images: text("images").array(), // Array of image URLs
  operationType: operationTypeEnum("operation_type").notNull(),
  isFeatured: boolean("is_featured").default(false),
  isActive: boolean("is_active").default(true),
  agencyId: varchar("agency_id").references(() => agencies.id).notNull(),
  locationId: varchar("location_id").references(() => locations.id),
  categoryId: varchar("category_id").references(() => propertyCategories.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Banners table for advertising
export const banners = pgTable("banners", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title", { length: 255 }).notNull(),
  imageUrl: varchar("image_url").notNull(),
  linkUrl: varchar("link_url"),
  size: varchar("size", { length: 20 }).notNull(), // '1200x150', '590x150', '1200x250'
  position: varchar("position", { length: 50 }).notNull(), // 'header', 'sidebar', 'footer', etc.
  isActive: boolean("is_active").default(true),
  agencyId: varchar("agency_id").references(() => agencies.id), // null for platform banners
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  agency: one(agencies, {
    fields: [users.id],
    references: [agencies.ownerId],
  }),
}));

export const agenciesRelations = relations(agencies, ({ one, many }) => ({
  owner: one(users, {
    fields: [agencies.ownerId],
    references: [users.id],
  }),
  properties: many(properties),
  banners: many(banners),
}));

export const propertiesRelations = relations(properties, ({ one }) => ({
  agency: one(agencies, {
    fields: [properties.agencyId],
    references: [agencies.id],
  }),
  location: one(locations, {
    fields: [properties.locationId],
    references: [locations.id],
  }),
  category: one(propertyCategories, {
    fields: [properties.categoryId],
    references: [propertyCategories.id],
  }),
}));

export const bannersRelations = relations(banners, ({ one }) => ({
  agency: one(agencies, {
    fields: [banners.agencyId],
    references: [agencies.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
});

export const insertAgencySchema = createInsertSchema(agencies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLocationSchema = createInsertSchema(locations).omit({
  id: true,
  createdAt: true,
});

export const insertPropertyCategorySchema = createInsertSchema(propertyCategories).omit({
  id: true,
  createdAt: true,
});

export const insertBannerSchema = createInsertSchema(banners).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertAgency = z.infer<typeof insertAgencySchema>;
export type Agency = typeof agencies.$inferSelect;
export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Property = typeof properties.$inferSelect;
export type Location = typeof locations.$inferSelect;
export type PropertyCategory = typeof propertyCategories.$inferSelect;
export type Banner = typeof banners.$inferSelect;
