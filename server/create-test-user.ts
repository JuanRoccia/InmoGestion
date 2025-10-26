import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { createHash } from 'crypto';
import ws from "ws";
import * as schema from "../shared/schema.js";

neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool, schema });

async function createTestUser() {
  // Crear usuario de prueba
  const testUser = {
    id: "test-user-1",
    email: "test@inmogestion.com",
    name: "Usuario de Prueba",
    picture: "https://ui-avatars.com/api/?name=Usuario+Prueba",
    role: "admin" as const
  };

  await db.insert(schema.users).values(testUser).onConflictDoNothing();

  // Crear agencia de prueba
  const testAgency = {
    id: "test-agency-1",
    name: "Inmobiliaria de Prueba",
    description: "Agencia para testing",
    logo: "https://ui-avatars.com/api/?name=Inmobiliaria+Prueba",
    ownerId: testUser.id,
    planType: "professional" as const,
    stripeCustomerId: "test_stripe_id",
    stripeSubscriptionId: "test_subscription_id",
  };

  await db.insert(schema.agencies).values(testAgency).onConflictDoNothing();

  console.log("✅ Usuario y agencia de prueba creados");
  console.log("\nCredenciales de prueba:");
  console.log("Email:", testUser.email);
  console.log("Usuario tiene rol de admin y una agencia asociada");
  
  process.exit(0);
}

createTestUser().catch((err) => {
  console.error("Error al crear usuario de prueba:", err);
  process.exit(1);
});