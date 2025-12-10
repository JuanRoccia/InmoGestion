import { db } from "../server/db";
import { properties, agencies } from "../shared/schema";
import { eq } from "drizzle-orm";

// Category IDs from database
const CATEGORY_IDS = {
    country: '83006202-b65f-44e2-a8fc-645eb08b27d4',
    campo: 'a5963624-27cc-4779-8eb8-a16a1e787b95',
    casa: '8ecd2363-e0da-4c57-8aad-2cce1a1ec27a',
    departamento: 'dac32135-c36c-4037-985a-efce15e0e7eb',
};

const IMAGES = {
    country: [
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ],
    campo: [
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1464226184884-fa280b87c399?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ],
};

const countryNames = [
    "Altos del Sol",
    "Las Lomas Country",
    "El Remanso",
    "San Marcos Village",
    "Los Robles Barrio Privado",
    "Terrazas del Norte",
];

const campoNames = [
    "Estancia Santa María",
    "Campo Los Álamos",
    "Chacra El Recuerdo",
    "Estancia La Esperanza",
    "Campo Verde",
    "Finca San Antonio",
];

async function main() {
    console.log("Creating featured properties for Countries and Campos...");

    // Get existing agencies
    const allAgencies = await db.select().from(agencies).limit(4);
    if (allAgencies.length === 0) {
        console.error("No agencies found. Please seed agencies first.");
        process.exit(1);
    }

    console.log(`Found ${allAgencies.length} agencies to distribute properties.`);

    // Create Country properties
    console.log("\n=== Creating Country/Barrio Cerrado Properties ===");
    for (let i = 0; i < 6; i++) {
        const agency = allAgencies[i % allAgencies.length];
        const code = `CTRY-${Math.floor(10000 + Math.random() * 90000)}`;
        const price = Math.floor(200000 + Math.random() * 800000);
        const area = Math.floor(500 + Math.random() * 2000);

        const [newProp] = await db.insert(properties).values({
            code,
            title: countryNames[i],
            description: `Exclusiva propiedad en ${countryNames[i]}. Amplio lote con casa principal, pileta, quincho y seguridad 24hs. Ideal para familias que buscan tranquilidad y naturaleza cerca de la ciudad.`,
            price: price.toString(),
            currency: "USD",
            area,
            bedrooms: Math.floor(3 + Math.random() * 3),
            bathrooms: Math.floor(2 + Math.random() * 3),
            garages: Math.floor(1 + Math.random() * 3),
            address: `Lote ${10 + i}, ${countryNames[i]}`,
            latitude: (-34.5 - Math.random() * 0.3).toFixed(7),
            longitude: (-58.4 - Math.random() * 0.2).toFixed(7),
            images: IMAGES.country,
            operationType: "venta" as const,
            isFeatured: true,
            isCreditSuitable: i % 2 === 0,
            isActive: true,
            agencyId: agency.id,
            categoryId: CATEGORY_IDS.country,
        }).returning();

        console.log(`Created: ${newProp.title} (${newProp.code}) - Agency: ${agency.name}`);
    }

    // Create Campo properties
    console.log("\n=== Creating Campo/Chacra Properties ===");
    for (let i = 0; i < 6; i++) {
        const agency = allAgencies[i % allAgencies.length];
        const code = `CAMP-${Math.floor(10000 + Math.random() * 90000)}`;
        const price = Math.floor(100000 + Math.random() * 500000);
        const area = Math.floor(5000 + Math.random() * 50000); // Campos are much larger

        const [newProp] = await db.insert(properties).values({
            code,
            title: campoNames[i],
            description: `${campoNames[i]} - ${area} hectáreas de campo productivo. Excelente tierra para agricultura o ganadería. Incluye casco de estancia, galpones y acceso a ruta pavimentada.`,
            price: price.toString(),
            currency: "USD",
            area,
            bedrooms: Math.floor(2 + Math.random() * 4),
            bathrooms: Math.floor(1 + Math.random() * 3),
            garages: 2,
            address: `Ruta ${Math.floor(1 + Math.random() * 50)} Km ${Math.floor(10 + Math.random() * 100)}`,
            latitude: (-37.5 - Math.random() * 2).toFixed(7),
            longitude: (-60.5 - Math.random() * 3).toFixed(7),
            images: IMAGES.campo,
            operationType: "venta" as const,
            isFeatured: true,
            isCreditSuitable: false,
            isActive: true,
            agencyId: agency.id,
            categoryId: CATEGORY_IDS.campo,
        }).returning();

        console.log(`Created: ${newProp.title} (${newProp.code}) - Agency: ${agency.name}`);
    }

    // Also make sure we have enough featured properties in each main category
    console.log("\n=== Verifying and adding featured properties per category ===");

    // Check Venta featured count
    const ventaFeatured = await db.select().from(properties).where(eq(properties.isFeatured, true));
    const ventaCount = ventaFeatured.filter(p =>
        p.operationType === 'venta' &&
        !p.developmentStatus &&
        p.categoryId !== CATEGORY_IDS.country &&
        p.categoryId !== CATEGORY_IDS.campo
    ).length;

    console.log(`Venta featured: ${ventaCount} properties`);

    if (ventaCount < 6) {
        console.log(`Adding ${6 - ventaCount} more featured Venta properties...`);
        const nonFeaturedVenta = await db.select().from(properties).where(eq(properties.operationType, 'venta'));
        const toFeature = nonFeaturedVenta.filter(p => !p.isFeatured && !p.developmentStatus).slice(0, 6 - ventaCount);

        for (const prop of toFeature) {
            await db.update(properties).set({ isFeatured: true }).where(eq(properties.id, prop.id));
            console.log(`Featured: ${prop.title}`);
        }
    }

    // Check Alquiler featured count
    const alquilerCount = ventaFeatured.filter(p => p.operationType === 'alquiler').length;
    console.log(`Alquiler featured: ${alquilerCount} properties`);

    if (alquilerCount < 6) {
        console.log(`Adding ${6 - alquilerCount} more featured Alquiler properties...`);
        const nonFeaturedAlquiler = await db.select().from(properties).where(eq(properties.operationType, 'alquiler'));
        const toFeature = nonFeaturedAlquiler.filter(p => !p.isFeatured).slice(0, 6 - alquilerCount);

        for (const prop of toFeature) {
            await db.update(properties).set({ isFeatured: true }).where(eq(properties.id, prop.id));
            console.log(`Featured: ${prop.title}`);
        }
    }

    // Check Temporario featured count
    const temporarioCount = ventaFeatured.filter(p => p.operationType === 'temporario').length;
    console.log(`Temporario featured: ${temporarioCount} properties`);

    if (temporarioCount < 6) {
        console.log(`Adding ${6 - temporarioCount} more featured Temporario properties...`);
        const nonFeaturedTemp = await db.select().from(properties).where(eq(properties.operationType, 'temporario'));
        const toFeature = nonFeaturedTemp.filter(p => !p.isFeatured).slice(0, 6 - temporarioCount);

        for (const prop of toFeature) {
            await db.update(properties).set({ isFeatured: true }).where(eq(properties.id, prop.id));
            console.log(`Featured: ${prop.title}`);
        }
    }

    console.log("\n=== Done! ===");
    console.log("Summary of featured properties by category:");

    const allFeatured = await db.select().from(properties).where(eq(properties.isFeatured, true));

    const summary = {
        venta: allFeatured.filter(p => p.operationType === 'venta' && !p.developmentStatus && p.categoryId !== CATEGORY_IDS.country && p.categoryId !== CATEGORY_IDS.campo).length,
        alquiler: allFeatured.filter(p => p.operationType === 'alquiler').length,
        temporario: allFeatured.filter(p => p.operationType === 'temporario').length,
        emprendimientos: allFeatured.filter(p => !!p.developmentStatus).length,
        countries: allFeatured.filter(p => p.categoryId === CATEGORY_IDS.country).length,
        campos: allFeatured.filter(p => p.categoryId === CATEGORY_IDS.campo).length,
    };

    console.log(summary);

    process.exit(0);
}

main().catch(console.error);
