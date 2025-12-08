
import { db } from "../server/db";
import { agencies, properties } from "../shared/schema";
import { eq, count } from "drizzle-orm";

async function main() {
    try {
        console.log("Analyzing data...");

        // Get all agencies
        const allAgencies = await db.select().from(agencies);
        console.log(`\nFound ${allAgencies.length} agencies:`);

        for (const agency of allAgencies) {
            // Count properties for each agency
            const propertyCountResult = await db
                .select({ count: count() })
                .from(properties)
                .where(eq(properties.agencyId, agency.id));

            const propertyCount = propertyCountResult[0].count;
            console.log(`- ${agency.name} (ID: ${agency.id}): ${propertyCount} properties`);
        }

        // Get featured properties count
        const featuredCountResult = await db
            .select({ count: count() })
            .from(properties)
            .where(eq(properties.isFeatured, true));

        console.log(`\nTotal Featured Properties: ${featuredCountResult[0].count}`);

        // Check if there are any properties at all
        const totalPropertiesResult = await db.select({ count: count() }).from(properties);
        console.log(`Total Properties in DB: ${totalPropertiesResult[0].count}`);

    } catch (error) {
        console.error("Error analyzing data:", error);
    }
}

main();
