
import { db } from "./db";
import { users, agencies, properties, banners } from "@shared/schema";
import { eq } from "drizzle-orm";

async function resetTestUserAgency() {
    console.log("Starting agency reset for test@inmogestion.com...");

    try {
        // 1. Find the user
        const user = await db.query.users.findFirst({
            where: eq(users.email, "test@inmogestion.com"),
        });

        if (!user) {
            console.log("User test@inmogestion.com not found.");
            return;
        }

        console.log(`Found user: ${user.id} (${user.email})`);

        // 2. Find the agency
        const agency = await db.query.agencies.findFirst({
            where: eq(agencies.ownerId, user.id),
        });

        if (!agency) {
            console.log("No agency found for this user. State is already clean.");
            return;
        }

        console.log(`Found agency: ${agency.id} (${agency.name})`);

        // 3. Delete dependent records
        // Delete banners
        const deletedBanners = await db.delete(banners).where(eq(banners.agencyId, agency.id)).returning();
        console.log(`Deleted ${deletedBanners.length} banners.`);

        // Delete properties
        const deletedProperties = await db.delete(properties).where(eq(properties.agencyId, agency.id)).returning();
        console.log(`Deleted ${deletedProperties.length} properties.`);

        // 4. Delete the agency
        await db.delete(agencies).where(eq(agencies.id, agency.id));
        console.log("Agency deleted successfully.");

        console.log("Reset complete. User test@inmogestion.com should now be able to register a new agency.");

    } catch (error) {
        console.error("Error during reset:", error);
    } finally {
        process.exit(0);
    }
}

resetTestUserAgency();
