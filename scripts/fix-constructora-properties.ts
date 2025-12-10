import { db } from "../server/db";
import { agencies, properties } from "../shared/schema";
import { eq, isNull, and } from "drizzle-orm";

async function main() {
    console.log("=== Fixing Constructora Properties ===\n");

    // 1. Get constructora
    const [constructora] = await db.select().from(agencies).where(eq(agencies.type, 'constructora')).limit(1);

    if (!constructora) {
        console.error("No constructora found!");
        process.exit(1);
    }

    console.log(`Constructora: ${constructora.name} (${constructora.id})`);

    // 2. Find properties that belong to constructora but DON'T have developmentStatus
    // These should be moved to another agency
    const nonEmprendimientos = await db.select()
        .from(properties)
        .where(and(
            eq(properties.agencyId, constructora.id),
            isNull(properties.developmentStatus)
        ));

    console.log(`\nFound ${nonEmprendimientos.length} non-emprendimiento properties in constructora:`);
    for (const prop of nonEmprendimientos) {
        console.log(`  - ${prop.title} [${prop.operationType}]`);
    }

    // 3. Get another inmobiliaria to move them to
    const [inmobiliaria] = await db.select()
        .from(agencies)
        .where(eq(agencies.type, 'inmobiliaria'))
        .limit(1);

    if (!inmobiliaria) {
        console.error("No inmobiliaria found to move properties to!");
        process.exit(1);
    }

    console.log(`\nMoving to: ${inmobiliaria.name} (${inmobiliaria.id})`);

    // 4. Move each property
    for (const prop of nonEmprendimientos) {
        await db.update(properties)
            .set({ agencyId: inmobiliaria.id })
            .where(eq(properties.id, prop.id));
        console.log(`  Moved: ${prop.title} -> ${inmobiliaria.name}`);
    }

    // 5. Verify
    console.log("\n=== Verification ===");

    const constructoraProps = await db.select()
        .from(properties)
        .where(eq(properties.agencyId, constructora.id));

    console.log(`\nConstructora now has ${constructoraProps.length} properties:`);
    for (const prop of constructoraProps) {
        console.log(`  - ${prop.title} [${prop.developmentStatus || 'NO STATUS!'}]`);
    }

    // All constructora properties should have developmentStatus
    const badProps = constructoraProps.filter(p => !p.developmentStatus);
    if (badProps.length > 0) {
        console.log("\n⚠️  WARNING: Some properties still don't have developmentStatus!");
    } else {
        console.log("\n✅ All constructora properties have developmentStatus.");
    }

    console.log("\n=== Done! ===");
    process.exit(0);
}

main().catch(console.error);
