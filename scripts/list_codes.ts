
import { db } from "../server/db";
import { properties } from "../shared/schema";

async function listCodes() {
    try {
        const result = await db.select({ code: properties.code, title: properties.title }).from(properties);
        console.log("Propertie Codes found in DB:");
        console.log(JSON.stringify(result, null, 2));
    } catch (error) {
        console.error("Error listing codes:", error);
    }
    process.exit(0);
}

listCodes();
