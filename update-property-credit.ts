
import { db } from "./server/db";
import { properties } from "./shared/schema";
import { eq } from "drizzle-orm";

async function main() {
    const allProperties = await db.select().from(properties).limit(1);

    if (allProperties.length === 0) {
        console.log("No properties found.");
        return;
    }

    const propId = allProperties[0].id;
    await db.update(properties)
        .set({ isCreditSuitable: true })
        .where(eq(properties.id, propId));

    console.log(`Updated property ${propId} to acts creditable.`);
    process.exit(0);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
