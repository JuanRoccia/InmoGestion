import {
  users,
  agencies,
  properties,
  locations,
  propertyCategories,
  banners,
  type User,
  type UpsertUser,
  type Agency,
  type InsertAgency,
  type Property,
  type InsertProperty,
  type Location,
  type PropertyCategory,
  type Banner,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, like, desc, asc, sql, or } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserStripeInfo(userId: string, stripeCustomerId: string, stripeSubscriptionId: string): Promise<User>;

  // Agency operations
  getAgencies(): Promise<Agency[]>;
  getAgency(id: string): Promise<Agency | undefined>;
  getAgencyByOwnerId(ownerId: string): Promise<Agency | undefined>;
  createAgency(agency: InsertAgency): Promise<Agency>;
  updateAgency(id: string, agency: Partial<InsertAgency>): Promise<Agency>;
  deleteAgency(id: string): Promise<void>;
  searchAgencies(query: string): Promise<Agency[]>;

  // Property operations
  getProperties(filters?: {
    operationType?: string;
    locationId?: string;
    categoryId?: string;
    agencyId?: string;
    isFeatured?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<Property[]>;
  getProperty(id: string): Promise<Property | undefined>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: string, property: Partial<InsertProperty>): Promise<Property>;
  deleteProperty(id: string): Promise<void>;
  getFeaturedProperties(operationType?: string, limit?: number): Promise<Property[]>;

  // Location operations
  getLocations(): Promise<Location[]>;
  getLocation(id: string): Promise<Location | undefined>;

  // Category operations
  getPropertyCategories(): Promise<PropertyCategory[]>;

  // Banner operations
  getActiveBanners(position?: string, size?: string): Promise<Banner[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserStripeInfo(userId: string, stripeCustomerId: string, stripeSubscriptionId: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        stripeCustomerId,
        stripeSubscriptionId,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // Agency operations
  async getAgencies(): Promise<Agency[]> {
    return await db.select().from(agencies).orderBy(desc(agencies.createdAt));
  }

  async getAgency(id: string): Promise<Agency | undefined> {
    const [agency] = await db.select().from(agencies).where(eq(agencies.id, id));
    return agency;
  }

  async getAgencyByOwnerId(ownerId: string): Promise<Agency | undefined> {
    const [agency] = await db.select().from(agencies).where(eq(agencies.ownerId, ownerId));
    return agency;
  }

  async createAgency(agency: InsertAgency): Promise<Agency> {
    const [newAgency] = await db.insert(agencies).values(agency).returning();
    return newAgency;
  }

  async updateAgency(id: string, agency: Partial<InsertAgency>): Promise<Agency> {
    const [updatedAgency] = await db
      .update(agencies)
      .set({ ...agency, updatedAt: new Date() })
      .where(eq(agencies.id, id))
      .returning();
    return updatedAgency;
  }

  async deleteAgency(id: string): Promise<void> {
    await db.delete(agencies).where(eq(agencies.id, id));
  }

  async searchAgencies(query: string): Promise<Agency[]> {
    return await db
      .select()
      .from(agencies)
      .where(
        or(
          like(agencies.name, `%${query}%`),
          like(agencies.email, `%${query}%`)
        )
      )
      .orderBy(desc(agencies.createdAt));
  }

  // Property operations
  async getProperties(filters?: {
    operationType?: string;
    locationId?: string;
    categoryId?: string;
    agencyId?: string;
    isFeatured?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<Property[]> {
    let query = db.select().from(properties).where(eq(properties.isActive, true));

    if (filters?.operationType) {
      query = query.where(eq(properties.operationType, filters.operationType as any));
    }
    if (filters?.locationId) {
      query = query.where(eq(properties.locationId, filters.locationId));
    }
    if (filters?.categoryId) {
      query = query.where(eq(properties.categoryId, filters.categoryId));
    }
    if (filters?.agencyId) {
      query = query.where(eq(properties.agencyId, filters.agencyId));
    }
    if (filters?.isFeatured !== undefined) {
      query = query.where(eq(properties.isFeatured, filters.isFeatured));
    }

    query = query.orderBy(desc(properties.createdAt));

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    if (filters?.offset) {
      query = query.offset(filters.offset);
    }

    return await query;
  }

  async getProperty(id: string): Promise<Property | undefined> {
    const [property] = await db.select().from(properties).where(eq(properties.id, id));
    return property;
  }

  async createProperty(property: InsertProperty): Promise<Property> {
    const [newProperty] = await db.insert(properties).values(property).returning();
    return newProperty;
  }

  async updateProperty(id: string, property: Partial<InsertProperty>): Promise<Property> {
    const [updatedProperty] = await db
      .update(properties)
      .set({ ...property, updatedAt: new Date() })
      .where(eq(properties.id, id))
      .returning();
    return updatedProperty;
  }

  async deleteProperty(id: string): Promise<void> {
    await db.delete(properties).where(eq(properties.id, id));
  }

  async getFeaturedProperties(operationType?: string, limit: number = 6): Promise<Property[]> {
    let query = db
      .select()
      .from(properties)
      .where(and(eq(properties.isActive, true), eq(properties.isFeatured, true)));

    if (operationType) {
      query = query.where(eq(properties.operationType, operationType as any));
    }

    return await query.orderBy(desc(properties.createdAt)).limit(limit);
  }

  // Location operations
  async getLocations(): Promise<Location[]> {
    return await db.select().from(locations).orderBy(asc(locations.name));
  }

  async getLocation(id: string): Promise<Location | undefined> {
    const [location] = await db.select().from(locations).where(eq(locations.id, id));
    return location;
  }

  // Category operations
  async getPropertyCategories(): Promise<PropertyCategory[]> {
    return await db.select().from(propertyCategories).orderBy(asc(propertyCategories.name));
  }

  // Banner operations
  async getActiveBanners(position?: string, size?: string): Promise<Banner[]> {
    let query = db.select().from(banners).where(eq(banners.isActive, true));

    if (position) {
      query = query.where(eq(banners.position, position));
    }
    if (size) {
      query = query.where(eq(banners.size, size));
    }

    return await query;
  }
}

export const storage = new DatabaseStorage();
