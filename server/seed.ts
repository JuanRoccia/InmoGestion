import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "../shared/schema.js";

neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool, schema });

async function seed() {
  // Insert locations
  const locations = [
    { name: "Bahía Blanca", slug: "bahia-blanca", province: "Buenos Aires", imageUrl: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=400" },
    { name: "Coronel Rosales", slug: "coronel-rosales", province: "Buenos Aires", imageUrl: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=400" },
    { name: "Punta Alta", slug: "punta-alta", province: "Buenos Aires", imageUrl: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=400" },
    { name: "Monte Hermoso", slug: "monte-hermoso", province: "Buenos Aires", imageUrl: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=400" },
    { name: "Carmen de Patagones", slug: "carmen-de-patagones", province: "Buenos Aires", imageUrl: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=400" },
  ];

  for (const loc of locations) {
    await db.insert(schema.locations).values(loc).onConflictDoNothing();
  }

  // Insert categories
  const categories = [
    { name: "Casa", slug: "casa", description: "Casas familiares" },
    { name: "Departamento", slug: "departamento", description: "Departamentos y apartamentos" },
    { name: "Terreno", slug: "terreno", description: "Terrenos y lotes" },
    { name: "Local Comercial", slug: "local-comercial", description: "Locales para negocios" },
    { name: "Oficina", slug: "oficina", description: "Oficinas comerciales" },
    { name: "Country/Barrio Cerrado", slug: "country", description: "Countries y barrios privados" },
    { name: "Campo/Chacra", slug: "campo", description: "Campos y chacras" },
  ];

  for (const cat of categories) {
    await db.insert(schema.propertyCategories).values(cat).onConflictDoNothing();
  }

  console.log("✅ Base de datos inicializada con datos de prueba");
  
  process.exit(0);
}

seed().catch((err) => {
  console.error("Error al inicializar la base de datos:", err);
  process.exit(1);
});
