
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "../shared/schema";
import { eq } from 'drizzle-orm';

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be set");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool, schema });

async function seedTestData() {
    console.log("🌱 Starting test data seed...");

    // 1. Create Test User
    console.log("Creating test user...");
    const [user] = await db.insert(schema.users).values({
        email: "test@agency.com",
        firstName: "Test",
        lastName: "Agent",
        profileImageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=test",
    }).onConflictDoUpdate({
        target: schema.users.email,
        set: { updatedAt: new Date() }
    }).returning();

    // 2. Create Test Agency
    console.log("Creating test agency...");
    const [agency] = await db.insert(schema.agencies).values({
        name: "Inmobiliaria Demo",
        email: "contacto@inmobiliariademo.com",
        phone: "+54 291 1234567",
        address: "Av. Alem 123, Bahía Blanca",
        description: "Agencia inmobiliaria de prueba con las mejores propiedades de la ciudad.",
        ownerId: user.id,
        isActive: true,
        subscriptionPlan: 'professional',
        subscriptionStatus: 'active'
    }).onConflictDoUpdate({
        target: schema.agencies.email,
        set: { updatedAt: new Date() }
    }).returning();

    // 3. Ensure Locations
    console.log("Ensuring locations...");
    const locationsData = [
        { name: "Bahía Blanca", slug: "bahia-blanca", province: "Buenos Aires", latitude: "-38.7183", longitude: "-62.2663" },
        { name: "Monte Hermoso", slug: "monte-hermoso", province: "Buenos Aires", latitude: "-38.9833", longitude: "-61.2833" },
        { name: "Punta Alta", slug: "punta-alta", province: "Buenos Aires", latitude: "-38.8779", longitude: "-62.0712" },
        { name: "Pehuen Co", slug: "pehuen-co", province: "Buenos Aires", latitude: "-38.9967", longitude: "-61.5433" },
    ];

    const locations = [];
    for (const loc of locationsData) {
        const [l] = await db.insert(schema.locations).values(loc)
            .onConflictDoUpdate({
                target: schema.locations.slug,
                set: {
                    name: loc.name,
                    latitude: loc.latitude,
                    longitude: loc.longitude
                }
            })
            .returning();
        locations.push(l);
    }

    // 4. Get Categories
    const categories = await db.select().from(schema.propertyCategories);
    const houseCat = categories.find(c => c.slug === 'casa');
    const aptCat = categories.find(c => c.slug === 'departamento');
    const landCat = categories.find(c => c.slug === 'terreno');

    if (!houseCat || !aptCat || !landCat) {
        throw new Error("Categories not found. Run 'npm run db:push' and basic seed first.");
    }

    // 5. Create Test Properties
    console.log("Creating test properties...");
    const propertiesData = [
        {
            title: "Casa Moderna en Barrio Universitario",
            description: "Hermosa casa de 3 dormitorios, amplio living comedor, cocina integrada y patio con parrilla. Excelente ubicación cerca de la universidad.",
            price: "150000.00",
            currency: "USD",
            area: 180,
            bedrooms: 3,
            bathrooms: 2,
            garages: 1,
            address: "San Juan 450",
            operationType: "venta",
            isFeatured: true,
            isActive: true,
            agencyId: agency.id,
            locationId: locations[0].id, // Bahía Blanca
            categoryId: houseCat.id,
            code: "PROP-15000",
            images: ["https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
            latitude: "-38.7051",
            longitude: "-62.2662"
        },
        {
            title: "Departamento Céntrico 2 Ambientes",
            description: "Departamento luminoso en pleno centro. Ideal estudiantes o inversión. Bajas expensas.",
            price: "65000.00",
            currency: "USD",
            area: 45,
            bedrooms: 1,
            bathrooms: 1,
            garages: 0,
            address: "Chiclana 200",
            operationType: "venta",
            isFeatured: false,
            isActive: true,
            agencyId: agency.id,
            locationId: locations[0].id, // Bahía Blanca
            categoryId: aptCat.id,
            code: "PROP-65000",
            images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
            latitude: "-38.7202",
            longitude: "-62.2618"
        },
        {
            title: "Terreno en Monte Hermoso",
            description: "Lote de 600m2 a 3 cuadras del mar. Zona residencial en crecimiento. Todos los servicios.",
            price: "45000.00",
            currency: "USD",
            area: 600,
            bedrooms: 0,
            bathrooms: 0,
            garages: 0,
            address: "Las Dunas 100",
            operationType: "venta",
            isFeatured: true,
            isActive: true,
            agencyId: agency.id,
            locationId: locations[1].id, // Monte Hermoso
            categoryId: landCat.id,
            code: "PROP-45000",
            images: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
            latitude: "-38.9867",
            longitude: "-61.2885"
        },
        {
            title: "Alquiler Casa Quinta",
            description: "Casa quinta para eventos o fin de semana. Pileta, quincho y amplio parque.",
            price: "150000.00",
            currency: "ARS",
            area: 1200,
            bedrooms: 2,
            bathrooms: 2,
            garages: 4,
            address: "Aldea Romana",
            operationType: "alquiler", // Changed to match enum 'alquiler'
            isFeatured: false,
            isActive: true,
            agencyId: agency.id,
            locationId: locations[0].id, // Bahía Blanca
            categoryId: houseCat.id,
            code: "PROP-15001",
            images: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
            latitude: "-38.6833",
            longitude: "-62.2167"
        },
        {
            title: "Oficina Premium Centro",
            description: "Oficina de categoría en edificio corporativo. Seguridad 24hs, vistas panorámicas.",
            price: "800.00",
            currency: "USD",
            area: 80,
            bedrooms: 0,
            bathrooms: 1,
            garages: 1,
            address: "Alsina 50",
            operationType: "alquiler",
            isFeatured: true,
            isActive: true,
            agencyId: agency.id,
            locationId: locations[0].id,
            categoryId: aptCat.id, // Using apt category as proxy for office if needed, or fetch office cat
            code: "PROP-800",
            images: ["https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
            latitude: "-38.7180",
            longitude: "-62.2650"
        }
    ];

    for (const prop of propertiesData) {
        await db.insert(schema.properties).values(prop as any).returning();
    }

    console.log("✅ Test data seeded successfully!");
    process.exit(0);
}

seedTestData().catch((err) => {
    console.error("❌ Error seeding test data:", err);
    process.exit(1);
});
