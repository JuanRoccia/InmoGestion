
import { storage } from "./storage";

async function main() {
    const propertyId = "90c4e596-9219-42b4-b2cd-47aef37bbfad";
    console.log(`Fetching property: ${propertyId}...`);

    try {
        const property = await storage.getProperty(propertyId);
        if (property) {
            console.log("Property found.");
            console.log("Services:", property.services);
        } else {
            console.log("Property not found.");
        }
    } catch (error) {
        console.error("Error fetching property:", error);
    }
}

main().catch(console.error).finally(() => process.exit());
