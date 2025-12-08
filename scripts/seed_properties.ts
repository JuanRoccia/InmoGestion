
import { db } from "../server/db";
import { agencies, properties, type InsertProperty } from "../shared/schema";
import { eq } from "drizzle-orm";
import { storage } from "../server/storage";

const STREET_NAMES = [
    "San Martin", "Belgrano", "Rivadavia", "Mitre", "Sarmiento", "Alvear", "Urquiza", "Moreno",
    "9 de Julio", "Independencia", "Colon", "Libertad", "Lavalle", "Guemes", "Pueyrredon", "Alberdi"
];

const NEIGHBORHOODS = [
    "Centro", "Norte", "Sur", "Oeste", "Este", "Altos", "Jardines", "Parque", "Vista Alegre", "Los Troncos", "Playa Grande"
];

// Feature configs: bedrooms, bathrooms, area (m2), type
const FEATURES = [
    { beds: 1, baths: 1, area: 45, type: 'Departamento' },
    { beds: 2, baths: 1, area: 60, type: 'Departamento' },
    { beds: 3, baths: 2, area: 90, type: 'Departamento' },
    { beds: 3, baths: 2, area: 120, type: 'Casa' },
    { beds: 4, baths: 3, area: 200, type: 'Casa' },
    { beds: 5, baths: 4, area: 350, type: 'Casa' },
    { beds: 2, baths: 1, area: 70, type: 'PH' },
];

const ADJECTIVES = ["Hermoso", "Moderno", "Amplio", "Luminoso", "Exclusivo", "Renovado", "Impecable", "Oportunidad", "Increíble", "Acogedor", "Elegante"];

function getRandomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomProperty(agencyId: string): InsertProperty {
    const street = getRandomItem(STREET_NAMES);
    const number = getRandomInt(100, 9999);
    const neighborhood = getRandomItem(NEIGHBORHOODS);
    const feature = getRandomItem(FEATURES);
    const adj = getRandomItem(ADJECTIVES);

    // Decide operation type with some distribution
    const rand = Math.random();
    let operationType: 'venta' | 'alquiler' | 'temporario';
    let price: string;
    let currency: string;

    if (rand < 0.5) {
        operationType = 'venta';
        currency = 'USD';
        price = getRandomInt(75000, 450000).toString();
    } else if (rand < 0.8) {
        operationType = 'alquiler';
        currency = '$';
        price = getRandomInt(250000, 900000).toString();
    } else {
        operationType = 'temporario';
        currency = '$';
        price = getRandomInt(40000, 150000).toString(); // Daily/Weekly rate? usually high numbers in current economy
    }

    // Address ensuring some uniqueness by number
    const address = `${street} ${number}, ${neighborhood}`;

    return {
        agencyId,
        title: `${adj} ${feature.type} en ${neighborhood}`,
        description: `Excelente ${feature.type.toLowerCase()} ubicado en calle ${street} al ${number}. Cuenta con ${feature.beds} dormitorios y ${feature.baths} baños. Muy luminoso y con excelente distribución. Oportunidad única en la zona.`,
        price,
        currency,
        area: feature.area,
        bedrooms: feature.beds,
        bathrooms: feature.baths,
        garages: Math.random() > 0.5 ? 1 : 0,
        address,
        latitude: (-34.6037 + (Math.random() * 0.1 - 0.05)).toFixed(7),
        longitude: (-58.3816 + (Math.random() * 0.1 - 0.05)).toFixed(7),
        operationType,
        isFeatured: Math.random() < 0.4, // 40% featured
        isCreditSuitable: Math.random() < 0.4, // 40% credit suitable
        isActive: true,
        images: [
            "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1600596542815-2a4d04b28fe4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ]
    };
}

async function main() {
    try {
        console.log("Starting DB seed...");
        // 1. Get Agencies
        const allAgencies = await db.select().from(agencies);
        if (allAgencies.length === 0) {
            console.error("No agencies found. Please create an agency via the UI first or seed one.");
            process.exit(1);
        }
        console.log(`Found ${allAgencies.length} agencies.`);

        // 2. Generate and Insert properties using storage
        // We generated 30 properties
        const TOTAL_PROPERTIES = 30;

        for (let i = 0; i < TOTAL_PROPERTIES; i++) {
            const agency = allAgencies[i % allAgencies.length];
            const propData = generateRandomProperty(agency.id);

            // Use storage to create property (handles code generation and DB insert)
            const newProp = await storage.createProperty(propData);
            console.log(`[${i + 1}/${TOTAL_PROPERTIES}] Created: ${newProp.code} - ${newProp.title} (${newProp.operationType})`);
        }

        console.log("Seeding verified!");
        process.exit(0);

    } catch (e) {
        console.error("Error seeding properties:", e);
        process.exit(1);
    }
}

main();
