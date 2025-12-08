import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertAgencySchema, insertPropertySchema } from "@shared/schema";
import { z } from "zod";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-08-27.basil",
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Agency routes
  app.get('/api/agencies', async (req, res) => {
    try {
      const { search } = req.query;
      let agencies;

      if (search) {
        agencies = await storage.searchAgencies(search as string);
      } else {
        agencies = await storage.getAgencies();
      }

      res.json(agencies);
    } catch (error) {
      console.error("Error fetching agencies:", error);
      res.status(500).json({ message: "Failed to fetch agencies" });
    }
  });

  app.get('/api/agencies/:id', async (req, res) => {
    try {
      const agency = await storage.getAgency(req.params.id);
      if (!agency) {
        return res.status(404).json({ message: "Agency not found" });
      }
      res.json(agency);
    } catch (error) {
      console.error("Error fetching agency:", error);
      res.status(500).json({ message: "Failed to fetch agency" });
    }
  });

  app.post('/api/agencies', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const agencyData = insertAgencySchema.parse({ ...req.body, ownerId: userId });
      const agency = await storage.createAgency(agencyData);
      res.status(201).json(agency);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating agency:", error);
      res.status(500).json({ message: "Failed to create agency" });
    }
  });

  app.put('/api/agencies/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const agency = await storage.getAgency(req.params.id);

      if (!agency) {
        return res.status(404).json({ message: "Agency not found" });
      }

      if (agency.ownerId !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const agencyData = insertAgencySchema.partial().parse(req.body);
      const updatedAgency = await storage.updateAgency(req.params.id, agencyData);
      res.json(updatedAgency);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating agency:", error);
      res.status(500).json({ message: "Failed to update agency" });
    }
  });

  app.delete('/api/agencies/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const agency = await storage.getAgency(req.params.id);

      if (!agency) {
        return res.status(404).json({ message: "Agency not found" });
      }

      if (agency.ownerId !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      await storage.deleteAgency(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting agency:", error);
      res.status(500).json({ message: "Failed to delete agency" });
    }
  });

  app.post('/api/agencies/verify-subscription', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);

      if (!user?.stripeSubscriptionId) {
        return res.status(400).json({ message: "No active subscription found" });
      }

      const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);

      if (subscription.status === 'active') {
        const agency = await storage.getAgencyByOwnerId(userId);
        if (agency) {
          const updatedAgency = await storage.updateAgency(agency.id, {
            isActive: true,
            subscriptionStatus: 'active'
          });
          return res.json(updatedAgency);
        }
      }

      res.json({ message: "Subscription not active yet", status: subscription.status });
    } catch (error) {
      console.error("Error verifying subscription:", error);
      res.status(500).json({ message: "Failed to verify subscription" });
    }
  });

  // Property routes
  app.get('/api/properties', async (req, res) => {
    try {
      const {
        operationType,
        locationId,
        categoryId,
        agencyId,
        isFeatured,
        isCreditSuitable,
        minPrice,
        maxPrice,
        price,
        limit,
        offset,
      } = req.query;

      const filters = {
        operationType: operationType as string,
        locationId: locationId as string,
        categoryId: categoryId as string,
        agencyId: agencyId as string,
        isFeatured: isFeatured === 'true',
        isCreditSuitable: isCreditSuitable === 'true',
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        price: price ? Number(price) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined,
      };

      const properties = await storage.getProperties(filters);
      res.json(properties);
    } catch (error) {
      console.error("Error fetching properties:", error);
      res.status(500).json({ message: "Failed to fetch properties" });
    }
  });

  app.get('/api/properties/featured', async (req, res) => {
    try {
      const { operationType, limit } = req.query;
      const properties = await storage.getFeaturedProperties(
        operationType as string,
        limit ? parseInt(limit as string) : 6
      );
      res.json(properties);
    } catch (error) {
      console.error("Error fetching featured properties:", error);
      res.status(500).json({ message: "Failed to fetch featured properties" });
    }
  });

  app.get('/api/properties/:id', async (req, res) => {
    try {
      const property = await storage.getProperty(req.params.id);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      res.json(property);
    } catch (error) {
      console.error("Error fetching property:", error);
      res.status(500).json({ message: "Failed to fetch property" });
    }
  });

  app.get('/api/properties/code/:code', async (req, res) => {
    try {
      const property = await storage.getPropertyByCode(req.params.code);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      res.json(property);
    } catch (error) {
      console.error("Error fetching property by code:", error);
      res.status(500).json({ message: "Failed to fetch property" });
    }
  });

  app.post('/api/properties', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const agency = await storage.getAgencyByOwnerId(userId);

      if (!agency) {
        return res.status(403).json({ message: "You must own an agency to create properties" });
      }

      const propertyData = insertPropertySchema.parse({ ...req.body, agencyId: agency.id });
      const property = await storage.createProperty(propertyData);
      res.status(201).json(property);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating property:", error);
      res.status(500).json({ message: "Failed to create property" });
    }
  });

  app.put('/api/properties/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const property = await storage.getProperty(req.params.id);

      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }

      const agency = await storage.getAgency(property.agencyId);
      if (agency?.ownerId !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const propertyData = insertPropertySchema.partial().parse(req.body);
      const updatedProperty = await storage.updateProperty(req.params.id, propertyData);
      res.json(updatedProperty);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating property:", error);
      res.status(500).json({ message: "Failed to update property" });
    }
  });

  app.delete('/api/properties/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const property = await storage.getProperty(req.params.id);

      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }

      const agency = await storage.getAgency(property.agencyId);
      if (agency?.ownerId !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      await storage.deleteProperty(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting property:", error);
      res.status(500).json({ message: "Failed to delete property" });
    }
  });

  // Location routes
  app.get('/api/locations', async (req, res) => {
    try {
      const locations = await storage.getLocations();
      res.json(locations);
    } catch (error) {
      console.error("Error fetching locations:", error);
      res.status(500).json({ message: "Failed to fetch locations" });
    }
  });

  // Category routes
  app.get('/api/categories', async (req, res) => {
    try {
      const categories = await storage.getPropertyCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Banner routes
  app.get('/api/banners', async (req, res) => {
    try {
      const { position, size } = req.query;
      const banners = await storage.getActiveBanners(
        position as string,
        size as string
      );
      res.json(banners);
    } catch (error) {
      console.error("Error fetching banners:", error);
      res.status(500).json({ message: "Failed to fetch banners" });
    }
  });

  // Stripe subscription route
  app.post('/api/get-or-create-subscription', isAuthenticated, async (req: any, res) => {
    const user = req.user;

    if (user.stripeSubscriptionId) {
      const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId, {
        expand: ['latest_invoice.payment_intent'],
      });

      const latestInvoice = subscription.latest_invoice;
      const clientSecret = typeof latestInvoice === 'object' && latestInvoice?.payment_intent
        ? (typeof latestInvoice.payment_intent === 'object' ? latestInvoice.payment_intent.client_secret : null)
        : null;

      res.send({
        subscriptionId: subscription.id,
        clientSecret,
      });

      return;
    }

    if (!user.claims.email) {
      throw new Error('No user email on file');
    }

    try {
      const customer = await stripe.customers.create({
        email: user.claims.email,
        name: `${user.claims.first_name || ''} ${user.claims.last_name || ''}`.trim(),
      });

      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{
          price: process.env.STRIPE_PRICE_ID || 'price_1234567890', // This will be set by user
        }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
      });

      await storage.updateUserStripeInfo(user.claims.sub, customer.id, subscription.id);

      const latestInvoice = subscription.latest_invoice;
      const clientSecret = typeof latestInvoice === 'object' && latestInvoice?.payment_intent
        ? (typeof latestInvoice.payment_intent === 'object' ? latestInvoice.payment_intent.client_secret : null)
        : null;

      res.send({
        subscriptionId: subscription.id,
        clientSecret,
      });
    } catch (error: any) {
      return res.status(400).send({ error: { message: error.message } });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
