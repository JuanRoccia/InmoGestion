import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';
import * as schema from '../shared/schema/index.js';

neonConfig.webSocketConstructor = ws;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool, schema });

const locations = [
  { name: "Adolfo González Chávez", slug: "adolfo-gonzalez-chavez", province: "Buenos Aires" },
  { name: "Bahía Blanca", slug: "bahia-blanca", province: "Buenos Aires" },
  { name: "Carmen de Patagones", slug: "carmen-de-patagones", province: "Buenos Aires" },
  { name: "Coronel Dorrego", slug: "coronel-dorrego", province: "Buenos Aires" },
  { name: "Coronel Pringles", slug: "coronel-pringles", province: "Buenos Aires" },
  { name: "Coronel Rosales", slug: "coronel-rosales", province: "Buenos Aires" },
  { name: "Coronel Suárez", slug: "coronel-suarez", province: "Buenos Aires" },
  { name: "Monte Hermoso", slug: "monte-hermoso", province: "Buenos Aires" },
  { name: "Pehuen Co", slug: "pehuen-co", province: "Buenos Aires" },
  { name: "Pigüé", slug: "pigue", province: "Buenos Aires" },
  { name: "Puan", slug: "puan", province: "Buenos Aires" },
  { name: "Tornquist", slug: "torquinst", province: "Buenos Aires" },
  { name: "Tres Arroyos", slug: "tres-arroyos", province: "Buenos Aires" },
  { name: "Villarino", slug: "villarino", province: "Buenos Aires" }
];

async function insertLocations() {
  try {
    await pool.query('TRUNCATE TABLE locations CASCADE;');
    
    for (const loc of locations) {
      await db.insert(schema.locations).values(loc);
    }
    
    console.log("✅ Localidades insertadas correctamente");
  } catch (error) {
    console.error("Error al insertar localidades:", error);
  } finally {
    await pool.end();
  }
}

insertLocations();