
import { storage } from "./server/storage";

async function main() {
    console.log("--- Testing Storage Filters ---");

    // 1. No filters (Should return all active properties)
    const all = await storage.getProperties({});
    console.log(`No filters: ${all.length} properties found.`);
    all.forEach(p => console.log(` - ${p.title} (Credit: ${p.isCreditSuitable})`));

    // 2. Credit Suitable = true
    const credit = await storage.getProperties({ isCreditSuitable: true });
    console.log(`\nCredit Suitable (true): ${credit.length} properties found.`);

    // 3. Credit Suitable = false (Should behave same as no filters in current logic?)
    const noCredit = await storage.getProperties({ isCreditSuitable: false });
    console.log(`\nCredit Suitable (false): ${noCredit.length} properties found.`);

    // 4. Operation Type = All (if passed as undefined/string)
    // storage.ts expects string | undefined.
    // Testing with undefined (simulating not passed)
    const opTypeUndef = await storage.getProperties({ operationType: undefined });
    console.log(`\nOperation Type (undefined): ${opTypeUndef.length} properties found.`);

    // 5. Operation Type = "venta"
    const venta = await storage.getProperties({ operationType: "venta" });
    console.log(`\nOperation Type (venta): ${venta.length} properties found.`);

    console.log("\n--- End Test ---");
    process.exit(0);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
