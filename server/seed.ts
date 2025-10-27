import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "../shared/schema";

neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool, schema });

async function seed() {
  // Las localidades ahora se manejan con el script SQL en /scripts/locations.sql

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
