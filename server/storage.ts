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
import * as fs from 'fs';

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUsers(): Promise<User[]>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserStripeInfo(userId: string, stripeCustomerId: string, stripeSubscriptionId: string): Promise<User>;
  updateUserRegistrationStatus(userId: string, registrationStatus: 'pre-registered' | 'completed'): Promise<User>;
  deleteUser(id: string): Promise<void>;
  updateUserPassword(userId: string, hashedPassword: string): Promise<User>;

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
    isCreditSuitable?: boolean;
    minPrice?: number;
    maxPrice?: number;
    price?: number;
    limit?: number;
    offset?: number;
  }): Promise<Property[]>;
  countProperties(filters?: {
    operationType?: string;
    locationId?: string;
    categoryId?: string;
    agencyId?: string;
    isFeatured?: boolean;
    isCreditSuitable?: boolean;
    minPrice?: number;
    maxPrice?: number;
    price?: number;
  }): Promise<number>;
  getProperty(id: string): Promise<Property | undefined>;
  getPropertyByCode(code: string): Promise<Property | undefined>;
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

  async getUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.email,
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
        registrationStatus: 'completed', // Cuando se completa la suscripción, el registro está completo
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async updateUserRegistrationStatus(userId: string, registrationStatus: 'pre-registered' | 'completed'): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        registrationStatus,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async deleteUser(id: string): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }

  async updateUserPassword(userId: string, hashedPassword: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        password: hashedPassword,
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
    console.log("getProperties filters:", filters);
    fs.writeFileSync('debug-query.txt', JSON.stringify({ timestamp: new Date(), filters }, null, 2));

    const conditions = [eq(properties.isActive, true)];

    if (filters?.operationType) {
      conditions.push(eq(properties.operationType, filters.operationType as any));
    }
    if (filters?.locationId) {
      conditions.push(eq(properties.locationId, filters.locationId));
    }
    if (filters?.categoryId) {
      conditions.push(eq(properties.categoryId, filters.categoryId));
    }
    if (filters?.agencyId) {
      conditions.push(eq(properties.agencyId, filters.agencyId));
    }
    if (filters?.isFeatured !== undefined) {
      conditions.push(eq(properties.isFeatured, filters.isFeatured));
    }
    if (filters?.isCreditSuitable) {
      conditions.push(eq(properties.isCreditSuitable, true));
    }
    if (filters?.minPrice !== undefined) {
      conditions.push(sql`${properties.price} >= ${filters.minPrice}`);
    }
    if (filters?.maxPrice !== undefined) {
      conditions.push(sql`${properties.price} <= ${filters.maxPrice}`);
    }
    if (filters?.price !== undefined) {
      conditions.push(eq(properties.price, filters.price.toString()));
    }

    let query = db.select().from(properties).where(and(...conditions)).orderBy(desc(properties.createdAt));

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    if (filters?.offset) {
      query = query.offset(filters.offset);
    }

    return await query;
  }

  async countProperties(filters?: {
    operationType?: string;
    locationId?: string;
    categoryId?: string;
    agencyId?: string;
    isFeatured?: boolean;
    isCreditSuitable?: boolean;
    minPrice?: number;
    maxPrice?: number;
    price?: number;
  }): Promise<number> {
    const conditions = [eq(properties.isActive, true)];

    if (filters?.operationType) {
      conditions.push(eq(properties.operationType, filters.operationType as any));
    }
    if (filters?.locationId) {
      conditions.push(eq(properties.locationId, filters.locationId));
    }
    if (filters?.categoryId) {
      conditions.push(eq(properties.categoryId, filters.categoryId));
    }
    if (filters?.agencyId) {
      conditions.push(eq(properties.agencyId, filters.agencyId));
    }
    if (filters?.isFeatured !== undefined) {
      conditions.push(eq(properties.isFeatured, filters.isFeatured));
    }
    if (filters?.isCreditSuitable) {
      conditions.push(eq(properties.isCreditSuitable, true));
    }
    if (filters?.minPrice !== undefined) {
      conditions.push(sql`${properties.price} >= ${filters.minPrice}`);
    }
    if (filters?.maxPrice !== undefined) {
      conditions.push(sql`${properties.price} <= ${filters.maxPrice}`);
    }
    if (filters?.price !== undefined) {
      conditions.push(eq(properties.price, filters.price.toString()));
    }

    const result = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(properties)
      .where(and(...conditions));

    return result[0]?.count ?? 0;
  }

  async getProperty(id: string): Promise<Property | undefined> {
    const [property] = await db.select().from(properties).where(eq(properties.id, id));
    return property;
  }

  async getPropertyByCode(code: string): Promise<Property | undefined> {
    const [property] = await db.select().from(properties).where(eq(properties.code, code));
    return property;
  }

  async createProperty(property: InsertProperty): Promise<Property> {
    // Generate a unique code like "PROP-12345"
    const code = `PROP-${Math.floor(10000 + Math.random() * 90000)}`;
    const [newProperty] = await db.insert(properties).values({ ...property, code }).returning();
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
    const conditions = [eq(properties.isActive, true), eq(properties.isFeatured, true)];

    if (operationType) {
      conditions.push(eq(properties.operationType, operationType as any));
    }

    return await db
      .select()
      .from(properties)
      .where(and(...conditions))
      .orderBy(desc(properties.createdAt))
      .limit(limit);
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
    const conditions = [eq(banners.isActive, true)];

    if (position) {
      conditions.push(eq(banners.position, position));
    }
    if (size) {
      conditions.push(eq(banners.size, size));
    }

    return await db.select().from(banners).where(and(...conditions));
  }
}

export const storage = new DatabaseStorage();
