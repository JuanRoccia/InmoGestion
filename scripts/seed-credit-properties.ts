
import { db } from "../server/db";
import { properties } from "../shared/schema";
import { eq, and } from "drizzle-orm";

async function main() {
    console.log("Updating properties to be Credit Suitable...");

    // Get first 3 active properties
    const activeProperties = await db.select()
        .from(properties)
        .where(eq(properties.isActive, true))
        .limit(3);

    if (activeProperties.length === 0) {
        console.log("No active properties found to update.");
        return;
    }

    for (const prop of activeProperties) {
        await db.update(properties)
            .set({ isCreditSuitable: true })
            .where(eq(properties.id, prop.id));
        console.log(`Updated property '${prop.title}' (ID: ${prop.id}) to be Credit Suitable.`);
    }

    console.log("Done.");
    process.exit(0);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
