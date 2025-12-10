import { db } from "../server/db";
import { properties } from "../shared/schema";
import { eq, like, isNotNull } from "drizzle-orm";

// Unique high-quality Unsplash images for each property type

const IMAGES = {
    // Casas - different styles
    casa_parque: [
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    ],
    casa_centro: [
        "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&q=80",
        "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80",
        "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&q=80",
    ],
    casa_jardines: [
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80",
        "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&q=80",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    ],
    casa_este: [
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
        "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80",
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80",
    ],

    // Departamentos - modern apartments
    depto_norte: [
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
    ],
    depto_oeste: [
        "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80",
        "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&q=80",
        "https://images.unsplash.com/photo-1560185008-b033106af5c3?w=800&q=80",
    ],
    depto_troncos: [
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
        "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&q=80",
        "https://images.unsplash.com/photo-1515263487990-61b07816b324?w=800&q=80",
    ],
    depto_este: [
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80",
        "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80",
        "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800&q=80",
    ],

    // PH - Penthouse style
    ph_este: [
        "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&q=80",
        "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80",
        "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80",
    ],
    ph_parque: [
        "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&q=80",
        "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&q=80",
        "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800&q=80",
    ],
    ph_altos: [
        "https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=800&q=80",
        "https://images.unsplash.com/photo-1600566752734-2a0cd66c42b9?w=800&q=80",
        "https://images.unsplash.com/photo-1600210491369-e753d80a41f3?w=800&q=80",
    ],

    // Emprendimientos - Buildings under construction
    edificio_pozo: [
        "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",
        "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80",
        "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80",
    ],
    edificio_construccion: [
        "https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?w=800&q=80",
        "https://images.unsplash.com/photo-1590644365607-1c5a8a914d15?w=800&q=80",
        "https://images.unsplash.com/photo-1621929747188-0b4dc28498d2?w=800&q=80",
    ],
    edificio_terminado: [
        "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
        "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=800&q=80",
    ],

    // Countries / Barrios Cerrados
    country_1: [
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
        "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80",
    ],
    country_2: [
        "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80",
        "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80",
    ],
    country_3: [
        "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
        "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80",
    ],
    country_4: [
        "https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=800&q=80",
        "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&q=80",
        "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&q=80",
    ],

    // Campos / Estancias / Chacras
    campo_1: [
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
        "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80",
        "https://images.unsplash.com/photo-1500076656116-558758c991c1?w=800&q=80",
    ],
    campo_2: [
        "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80",
        "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80",
        "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=800&q=80",
    ],
    campo_3: [
        "https://images.unsplash.com/photo-1595356700395-6f14b5c1f33f?w=800&q=80",
        "https://images.unsplash.com/photo-1500259571355-332da5cb07aa?w=800&q=80",
        "https://images.unsplash.com/photo-1444858291040-58f756a3bdd6?w=800&q=80",
    ],
    campo_4: [
        "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800&q=80",
        "https://images.unsplash.com/photo-1628624747186-a941c476b7ef?w=800&q=80",
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80",
    ],
    campo_5: [
        "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80",
        "https://images.unsplash.com/photo-1548407260-da850faa41e3?w=800&q=80",
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&q=80",
    ],
};

// New titles for emprendimientos (construction projects)
const EMPRENDIMIENTO_DATA = {
    pozo: {
        title: "Torre Mirador - En Pozo",
        description: "Exclusivo proyecto de 15 pisos en pleno centro. Unidades de 1, 2 y 3 ambientes. Amenities completos: pileta, gym, SUM, parrillas. Entrega estimada: 24 meses. Financiación directa con la constructora.",
        images: IMAGES.edificio_pozo,
    },
    construccion: {
        title: "Edificio Altos del Puerto - En Construcción",
        description: "Moderno edificio de categoría en zona puerto. 8 pisos, departamentos de 2 y 3 ambientes con balcón terraza. Avance de obra: 60%. Cocheras disponibles. Entrega: 12 meses.",
        images: IMAGES.edificio_construccion,
    },
    terminado: {
        title: "Residencial Vista Park - Terminado",
        description: "Edificio premium terminado y listo para habitar. Últimas unidades disponibles. Departamentos de 1 a 4 ambientes con vista al parque. Cochera y baulera incluidas. Escritura inmediata.",
        images: IMAGES.edificio_terminado,
    },
};

async function main() {
    console.log("=== Updating Property Images and Titles ===\n");

    // 1. Update Casas
    console.log("1. Updating Casas...");

    await updateProperty("Hermoso Casa en Parque", IMAGES.casa_parque);
    await updateProperty("Elegante Casa en Centro", IMAGES.casa_centro);
    await updateProperty("Acogedor Casa en Jardines", IMAGES.casa_jardines);
    await updateProperty("Renovado Casa en Este", IMAGES.casa_este);

    // Handle duplicate "Renovado Casa en Parque"
    const casasParque = await db.select().from(properties).where(like(properties.title, '%Renovado Casa en Parque%'));
    let parqueIndex = 0;
    const parqueImages = [IMAGES.casa_parque, IMAGES.casa_jardines];
    for (const casa of casasParque) {
        if (casa.developmentStatus) continue; // Skip emprendimientos
        await db.update(properties).set({
            images: parqueImages[parqueIndex % 2]
        }).where(eq(properties.id, casa.id));
        console.log(`  Updated: ${casa.title} (${casa.id.slice(0, 8)}...)`);
        parqueIndex++;
    }

    // 2. Update Departamentos
    console.log("\n2. Updating Departamentos...");

    await updateProperty("Acogedor Departamento en Norte", IMAGES.depto_norte);
    await updateProperty("Renovado Departamento en Oeste", IMAGES.depto_oeste);
    await updateProperty("Elegante Departamento en Los Troncos", IMAGES.depto_troncos);
    await updateProperty("Increíble Departamento en Este", IMAGES.depto_este);
    await updateProperty("Exclusivo Departamento en Norte", IMAGES.depto_norte);

    // Skip "Renovado Departamento en Norte" if it's an emprendimiento
    const deptoNorte = await db.select().from(properties).where(like(properties.title, '%Renovado Departamento en Norte%'));
    for (const depto of deptoNorte) {
        if (!depto.developmentStatus) {
            await db.update(properties).set({ images: IMAGES.depto_norte }).where(eq(properties.id, depto.id));
            console.log(`  Updated: ${depto.title}`);
        }
    }

    // 3. Update PHs
    console.log("\n3. Updating PHs...");

    await updateProperty("Moderno PH en Este", IMAGES.ph_este);
    await updateProperty("Renovado PH en Parque", IMAGES.ph_parque);
    await updateProperty("Moderno PH en Altos", IMAGES.ph_altos);

    // 4. Update Emprendimientos (with new titles too)
    console.log("\n4. Updating Emprendimientos (titles + images)...");

    const emprendimientos = await db.select().from(properties).where(isNotNull(properties.developmentStatus));

    for (const emp of emprendimientos) {
        const status = emp.developmentStatus as keyof typeof EMPRENDIMIENTO_DATA;
        if (EMPRENDIMIENTO_DATA[status]) {
            await db.update(properties).set({
                title: EMPRENDIMIENTO_DATA[status].title,
                description: EMPRENDIMIENTO_DATA[status].description,
                images: EMPRENDIMIENTO_DATA[status].images,
            }).where(eq(properties.id, emp.id));
            console.log(`  Updated: ${emp.title} -> ${EMPRENDIMIENTO_DATA[status].title}`);
        }
    }

    // 5. Update Countries/Barrios Cerrados
    console.log("\n5. Updating Countries/Barrios Cerrados...");

    const countryUpdates = [
        { title: "Terrazas del Norte", images: IMAGES.country_1 },
        { title: "Los Robles Barrio Privado", images: IMAGES.country_2 },
        { title: "San Marcos Village", images: IMAGES.country_3 },
        { title: "Las Lomas Country", images: IMAGES.country_4 },
        { title: "El Remanso", images: IMAGES.country_1 },
        { title: "Altos del Sol", images: IMAGES.country_2 },
    ];

    for (const update of countryUpdates) {
        await updateProperty(update.title, update.images);
    }

    // 6. Update Campos/Estancias/Chacras
    console.log("\n6. Updating Campos/Estancias/Chacras...");

    const campoUpdates = [
        { title: "Finca San Antonio", images: IMAGES.campo_1 },
        { title: "Estancia La Esperanza", images: IMAGES.campo_2 },
        { title: "Chacra El Recuerdo", images: IMAGES.campo_3 },
        { title: "Campo Los Álamos", images: IMAGES.campo_4 },
        { title: "Estancia Santa María", images: IMAGES.campo_5 },
        { title: "Campo Verde", images: IMAGES.campo_1 },
    ];

    for (const update of campoUpdates) {
        await updateProperty(update.title, update.images);
    }

    console.log("\n=== Done! ===");
    process.exit(0);
}

async function updateProperty(title: string, images: string[]) {
    const [prop] = await db.select().from(properties).where(eq(properties.title, title)).limit(1);
    if (prop) {
        await db.update(properties).set({ images }).where(eq(properties.id, prop.id));
        console.log(`  Updated: ${title}`);
    } else {
        console.log(`  Not found: ${title}`);
    }
}

main().catch(console.error);
