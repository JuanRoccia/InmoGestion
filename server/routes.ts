import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertAgencySchema, insertPropertySchema } from "@shared/schema";
import { hashPassword, comparePassword } from "./auth-utils";
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

  // Pre-registration endpoint
  const preRegisterSchema = z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  });

  app.post('/api/register/pre', async (req, res) => {
    try {
      // Validate input
      const validationResult = preRegisterSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({
          message: "Datos inválidos",
          errors: validationResult.error.errors,
        });
      }

      const { email, password } = validationResult.data;

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          message: "El email ya está registrado",
        });
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create user with pre-registered status
      const newUser = await storage.upsertUser({
        email,
        password: hashedPassword,
        registrationStatus: 'pre-registered',
        firstName: null,
        lastName: null,
        profileImageUrl: null,
      });

      res.status(201).json({
        success: true,
        message: "Pre-registro exitoso",
        user: {
          id: newUser.id,
          email: newUser.email,
          registrationStatus: newUser.registrationStatus,
        },
      });
    } catch (error) {
      console.error("Error en pre-registro:", error);
      res.status(500).json({ message: "Error al procesar el pre-registro" });
    }
  });

  // Endpoint para establecer o cambiar contraseña (para account linking)
  const setPasswordSchema = z.object({
    currentPassword: z.string().optional(), // Requerido si el usuario ya tiene contraseña
    newPassword: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  });

  app.post('/api/auth/set-password', isAuthenticated, async (req: any, res) => {
    try {
      const validationResult = setPasswordSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({
          message: "Datos inválidos",
          errors: validationResult.error.errors,
        });
      }

      const userId = req.user.claims.sub;
      const { currentPassword, newPassword } = validationResult.data;

      // Obtener usuario actual
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      // Si el usuario ya tiene contraseña, verificar la actual
      if (user.password && currentPassword) {
        const isValid = await comparePassword(currentPassword, user.password);
        if (!isValid) {
          return res.status(401).json({ message: "Contraseña actual incorrecta" });
        }
      } else if (user.password && !currentPassword) {
        return res.status(401).json({ message: "Se requiere contraseña actual para cambiar" });
      }

      // Hash de la nueva contraseña
      const hashedPassword = await hashPassword(newPassword);

      // Actualizar contraseña
      await storage.updateUserPassword(userId, hashedPassword);

      res.json({
        success: true,
        message: user.password ? "Contraseña actualizada correctamente" : "Contraseña establecida correctamente",
      });
    } catch (error) {
      console.error("Error al establecer contraseña:", error);
      res.status(500).json({ message: "Error al procesar solicitud" });
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
        isFeatured: isFeatured !== undefined ? isFeatured === 'true' : undefined,
        isCreditSuitable: isCreditSuitable === 'true',
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        price: price ? Number(price) : undefined,
        limit: limit ? parseInt(limit as string) : 12,
        offset: offset ? parseInt(offset as string) : 0,
      };

      const [propertiesData, total] = await Promise.all([
        storage.getProperties(filters),
        storage.countProperties(filters)
      ]);

      res.json({
        data: propertiesData,
        total,
        limit: filters.limit,
        offset: filters.offset
      });
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

      // Get related data
      const agency = property.agencyId ? await storage.getAgency(property.agencyId) : null;
      const category = property.categoryId ? await storage.getPropertyCategory(property.categoryId) : null;
      const location = property.locationId ? await storage.getLocation(property.locationId) : null;

      // If it's a building, include units count
      let unitsCount = 0;
      if (category?.slug === 'edificio') {
        unitsCount = await storage.countPropertyUnits(property.id);
      }

      res.json({
        ...property,
        agency,
        category,
        location,
        unitsCount
      });
    } catch (error) {
      console.error("Error fetching property:", error);
      res.status(500).json({ message: "Failed to fetch property" });
    }
  });

  // Get units of a building
  app.get('/api/properties/:id/units', async (req, res) => {
    try {
      const units = await storage.getPropertyUnits(req.params.id);
      res.json(units);
    } catch (error) {
      console.error("Error fetching property units:", error);
      res.status(500).json({ message: "Failed to fetch property units" });
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

      // ✅ VALIDACIÓN DE LÍMITES DE PROPIEDADES
      const currentCount = agency.propertyCount || 0;
      const currentLimit = agency.propertyLimit || 20;
      
      if (currentCount >= currentLimit) {
        return res.status(429).json({
          message: `Has alcanzado tu límite de ${currentLimit} propiedades. Actualiza tu plan para continuar.`,
          code: 'PROPERTY_LIMIT_EXCEEDED',
          currentPlan: agency.subscriptionPlan,
          currentCount: currentCount,
          limit: currentLimit,
          upgradeUrl: '/subscribe'
        });
      }

      const propertyData = insertPropertySchema.parse({ ...req.body, agencyId: agency.id });

      // Validation for Constructoras
      if (agency.type === 'constructora') {
        if (!propertyData.developmentStatus) {
          // Allow if category is 'emprendimiento' (we need to check category slug/id, but simplified: enforce status)
          // Actually, the requirement says "unicamente suben propiedades que son edificios, los cuales pueden encontrarse con las siuguientes categorias: ...".
          // So they MUST have a development status.
          return res.status(400).json({ message: "Las constructoras solo pueden subir propiedades con estado de desarrollo (En Pozo, En Construcción, Terminado)" });
        }
      }

      // Optional: Prevent normal agencies from setting development status?
      // "en logica son lo mismo que las inmobiliarias, pero con algunas diferencias... unicamente suben propiedades que son edificios"
      // It implies implied restriction on Constructoras, not necessarily on Agencies (though agencies usually sell everything).
      // Let's assume Agencies CAN allow developmentStatus if they want (e.g. selling a development for a third party), 
      // but Constructoras MUST ONLY do that.

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

      // Validation for Constructoras on update
      if (agency && agency.type === 'constructora') {
        // If they are updating, presumably they might maintain validity. 
        // If they try to clear developmentStatus, we should block it? 
        // simplified: if developmentStatus is explicitly passed as null/undefined in specific cases we might need care, 
        // but parse only includes present fields. logic: if they update, they can't remove it or change to non-compliant.
        // However, verifying implicit state on partial update is complex without full object. 
        // For now, let's just check if they try to set it to null if that's possible, or if they are creating a new one.
        // Since this is update, let's relax or rely on frontend + initial creation check, unless they try to CHANGE it to invalid.
        // propertyData.developmentStatus check:
        if (propertyData.developmentStatus === null) {  // If they try to remove it
          return res.status(400).json({ message: "Las constructoras deben mantener el estado de desarrollo" });
        }
      }

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

  // Stripe Webhook Handler
  app.post('/api/stripe/webhook', 
    require('express').raw({ type: 'application/json' }),
    async (req, res) => {
      try {
        const { handleStripeWebhook } = await import('./stripe-webhook');
        await handleStripeWebhook(req, res);
      } catch (error: any) {
        console.error('Webhook error:', error);
        res.status(500).send('Webhook processing failed');
      }
    }
  );

  const httpServer = createServer(app);

  return httpServer;
}
