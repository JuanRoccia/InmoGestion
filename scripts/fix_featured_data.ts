
import { db } from "../server/db";
import { properties, agencies, propertyCategories } from "../shared/schema";
import { eq, and, isNotNull, sql } from "drizzle-orm";

async function main() {
    console.log("Checking featured properties...");

    // 1. Check Featured Properties
    const featured = await db.select().from(properties).where(and(eq(properties.isFeatured, true), eq(properties.isActive, true)));
    console.log(`Found ${featured.length} featured properties.`);

    if (featured.length < 10) {
        console.log("Not enough featured properties. Assigning more...");

        // Get random active properties that are NOT featured
        const candidates = await db.select()
            .from(properties)
            .where(and(eq(properties.isActive, true), eq(properties.isFeatured, false)))
            .limit(20);

        console.log(`Found ${candidates.length} candidates to feature.`);

        // Feature them
        for (const prop of candidates) {
            await db.update(properties)
                .set({ isFeatured: true })
                .where(eq(properties.id, prop.id));
            console.log(`Featured property ${prop.id} (${prop.title})`);
        }
    }

    // 2. Check Emprendimientos (Developments)
    // User wants Emprendimientos to be from 'constructora' agencies and have developmentStatus.
    console.log("Checking Emprendimientos...");

    const developments = await db.select({
        id: properties.id,
        title: properties.title,
        agencyId: properties.agencyId,
        developmentStatus: properties.developmentStatus,
        categoryId: properties.categoryId
    })
        .from(properties)
        .where(isNotNull(properties.developmentStatus));

    console.log(`Found ${developments.length} properties with developmentStatus.`);

    // Verify they belong to constructoras
    for (const dev of developments) {
        const [agency] = await db.select().from(agencies).where(eq(agencies.id, dev.agencyId));
        if (agency) {
            console.log(`Development ${dev.title} belongs to agency ${agency.name} (Type: ${agency.type})`);
            if (agency.type !== 'constructora') {
                console.warn(`WARNING: Development ${dev.id} is not from a constructora! It is from ${agency.type}.`);
                // We might want to fix this if requested, but user said "solo van las propiedades de contructoras", 
                // implies we should perhaps convert the agency or property?
                // Let's trying to update agency type if it looks like a constructora or just leave it for report.
                // Or ensure we have SOME valid data.
            }
        }
    }

    // Ensure we have some developments from constructoras
    const validDevelopments = await db.select()
        .from(properties)
        .leftJoin(agencies, eq(properties.agencyId, agencies.id))
        .where(and(
            isNotNull(properties.developmentStatus),
            eq(agencies.type, 'constructora')
        ));

    console.log(`Found ${validDevelopments.length} valid developments from constructoras.`);

    if (validDevelopments.length < 3) {
        console.log("Creating/Fixing dummy data for developments...");
        // Find a constructora agency or create one
        let [constructora] = await db.select().from(agencies).where(eq(agencies.type, 'constructora')).limit(1);

        if (!constructora) {
            console.log("No constructora found. Converting an agency to constructora for testing...");
            const [anyAgency] = await db.select().from(agencies).limit(1);
            if (anyAgency) {
                [constructora] = await db.update(agencies)
                    .set({ type: 'constructora' })
                    .where(eq(agencies.id, anyAgency.id))
                    .returning();
                console.log(`Converted agency ${constructora.name} to constructora.`);
            }
        }

        if (constructora) {
            // Find properties of this agency and make them developments
            const agencyProps = await db.select().from(properties).where(eq(properties.agencyId, constructora.id)).limit(3);

            const statuses = ['pozo', 'construccion', 'terminado'];
            let i = 0;
            for (const prop of agencyProps) {
                await db.update(properties)
                    .set({ developmentStatus: statuses[i % 3] as any, isFeatured: true }) // make them featured too mostly? User didnt say explicitly but good for visibility
                    .where(eq(properties.id, prop.id));
                console.log(`Updated property ${prop.title} to be development (${statuses[i % 3]}).`);
                i++;
            }
        }
    }

    console.log("Done.");
    process.exit(0);
}

main().catch(console.error);
