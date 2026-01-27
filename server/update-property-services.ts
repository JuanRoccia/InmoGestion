
import { db } from "./db";
import { properties } from "@shared/schema";
import { eq } from "drizzle-orm";

async function main() {
    const propertyId = "90c4e596-9219-42b4-b2cd-47aef37bbfad";
    console.log(`Updating services for property: ${propertyId}...`);

    try {
        const updatedProperty = await db
            .update(properties)
            .set({
                services: ["Agua Corriente", "Internet", "Electricidad", "Wifi", "Gas Natural", "Seguridad"],
            })
            .where(eq(properties.id, propertyId))
            .returning();

        if (updatedProperty.length > 0) {
            console.log("Success! Updated property services:", updatedProperty[0].services);
        } else {
            console.log("Property not found or not updated.");
        }
    } catch (error) {
        console.error("Error updating property:", error);
    }
}

main().catch(console.error).finally(() => process.exit());
