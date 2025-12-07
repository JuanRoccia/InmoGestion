
import { db } from "../server/db";
import { properties } from "../shared/schema";

async function truncateProperties() {
    try {
        console.log("Truncating properties table...");
        await db.delete(properties);
        console.log("Properties table truncated.");
    } catch (error) {
        // Ignore error if table doesn't exist (which caused the push to fail partially maybe?)
        // But actually the table exists, just the column code is missing.
        console.error("Error truncating properties:", error);
    }
    process.exit(0);
}

truncateProperties();
