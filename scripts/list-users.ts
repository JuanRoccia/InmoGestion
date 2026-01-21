import { db } from "../server/db";
import { users } from "@shared/schema";
import { desc } from "drizzle-orm";

async function listUsers() {
  try {
    console.log("Consultando usuarios en la base de datos...\n");
    
    // Consultar los usuarios usando Drizzle ORM
    const allUsers = await db.select().from(users).orderBy(desc(users.createdAt));
    
    if (allUsers.length === 0) {
      console.log("No hay usuarios registrados en la base de datos.");
      return;
    }

    console.log(`Total de usuarios encontrados: ${allUsers.length}\n`);
    
    allUsers.forEach((user: any, index) => {
      console.log(`--- Usuario ${index + 1} ---`);
      console.log(`ID: ${user.id}`);
      console.log(`Email: ${user.email}`);
      console.log(`Nombre: ${user.firstName || 'No especificado'}`);
      console.log(`Apellido: ${user.lastName || 'No especificado'}`);
      console.log(`Stripe Customer ID: ${user.stripeCustomerId || 'No tiene'}`);
      console.log(`Stripe Subscription ID: ${user.stripeSubscriptionId || 'No tiene'}`);
      console.log(`Fecha de creación: ${user.createdAt}`);
      console.log(`Fecha de actualización: ${user.updatedAt}`);
      console.log(`Tiene contraseña: ${user.password ? 'Sí' : 'No (usuario OIDC)'}`);
      console.log('----------------------------------------\n');
    });

  } catch (error) {
    console.error("Error al consultar usuarios:", error);
  }
}

// Ejecutar la función
listUsers();