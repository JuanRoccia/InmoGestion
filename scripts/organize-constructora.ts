import { db } from "../server/db";
import { agencies, properties } from "../shared/schema";
import { eq, isNotNull } from "drizzle-orm";

async function main() {
    console.log("=== Organizing Constructora and Emprendimientos ===\n");

    // 1. Find or update constructora
    console.log("1. Finding/updating constructora...");

    let [constructora] = await db.select().from(agencies).where(eq(agencies.type, 'constructora')).limit(1);

    if (!constructora) {
        console.log("   No constructora found. Creating one...");
        // Convert an existing agency or create new one
        const [anyAgency] = await db.select().from(agencies).limit(1);
        if (anyAgency) {
            [constructora] = await db.update(agencies)
                .set({
                    type: 'constructora',
                    name: 'Constructora Demo',
                    email: 'contacto@constructorademo.com',
                    description: 'Constructora especializada en desarrollos inmobiliarios de alta calidad.'
                })
                .where(eq(agencies.id, anyAgency.id))
                .returning();
        }
    } else {
        // Update name if needed
        if (constructora.name !== 'Constructora Demo') {
            [constructora] = await db.update(agencies)
                .set({
                    name: 'Constructora Demo',
                    email: 'contacto@constructorademo.com',
                    description: 'Constructora especializada en desarrollos inmobiliarios de alta calidad.'
                })
                .where(eq(agencies.id, constructora.id))
                .returning();
            console.log(`   Renamed constructora to: ${constructora.name}`);
        } else {
            console.log(`   Constructora already exists: ${constructora.name}`);
        }
    }

    console.log(`   Constructora ID: ${constructora.id}`);
    console.log(`   Constructora Name: ${constructora.name}`);

    // 2. Find all emprendimiento properties (those with developmentStatus)
    console.log("\n2. Finding emprendimiento properties...");

    const emprendimientos = await db.select().from(properties).where(isNotNull(properties.developmentStatus));
    console.log(`   Found ${emprendimientos.length} emprendimiento properties`);

    // 3. Link all emprendimientos to the constructora
    console.log("\n3. Linking emprendimientos to constructora...");

    for (const emp of emprendimientos) {
        if (emp.agencyId !== constructora.id) {
            await db.update(properties)
                .set({ agencyId: constructora.id })
                .where(eq(properties.id, emp.id));
            console.log(`   Linked: ${emp.title} -> ${constructora.name}`);
        } else {
            console.log(`   Already linked: ${emp.title}`);
        }
    }

    // 4. Verify emprendimientos are featured
    console.log("\n4. Ensuring emprendimientos are featured...");

    for (const emp of emprendimientos) {
        if (!emp.isFeatured) {
            await db.update(properties)
                .set({ isFeatured: true })
                .where(eq(properties.id, emp.id));
            console.log(`   Featured: ${emp.title}`);
        }
    }

    // 5. Summary
    console.log("\n=== Summary ===");

    const allAgencies = await db.select().from(agencies);
    console.log(`\nAgencies (${allAgencies.length} total):`);
    for (const agency of allAgencies) {
        console.log(`  - ${agency.name || '(no name)'} [${agency.type}] (ID: ${agency.id.slice(0, 8)}...)`);
    }

    const updatedEmp = await db.select().from(properties).where(isNotNull(properties.developmentStatus));
    console.log(`\nEmprendimientos (${updatedEmp.length} total):`);
    for (const emp of updatedEmp) {
        const agency = allAgencies.find(a => a.id === emp.agencyId);
        console.log(`  - ${emp.title} [${emp.developmentStatus}] -> ${agency?.name || 'Unknown'}`);
    }

    console.log("\n=== Done! ===");
    process.exit(0);
}

main().catch(console.error);
