import { storage } from "../server/storage";
import { hashPassword } from "../server/auth-utils";
import { db } from "../server/db";
import { agencies } from "@shared/schema";
import { eq } from "drizzle-orm";

async function fixAdminUser() {
  try {
    // Buscar el usuario existente
    const existingUser = await storage.getUserByEmail("test@inmogestion.com");
    if (!existingUser) {
      console.log("Usuario no encontrado");
      process.exit(1);
    }

    console.log(`Encontrado usuario: ${existingUser.id}`);

    // Eliminar agencias asociadas
    await db.delete(agencies).where(eq(agencies.ownerId, existingUser.id));
    console.log("✓ Agencias asociadas eliminadas");

    // Eliminar usuario OIDC
    await storage.deleteUser(existingUser.id);
    console.log("✓ Usuario OIDC eliminado");

    // Crear nuevo ID para el usuario local (sin el prefijo)
    // Crear usuario local con contraseña
    const hashedPassword = await hashPassword("admin123");
    const newUser = await storage.upsertUser({
      email: "test@inmogestion.com",
      password: hashedPassword,
      registrationStatus: 'completed',
      firstName: "Admin",
      lastName: "Test",
      profileImageUrl: null,
    });

    console.log("✓ Usuario local creado:");
    console.log(`  ID: ${newUser.id}`);
    console.log(`  Email: ${newUser.email}`);
    console.log(`  Contraseña: admin123`);
    console.log(`  Status: ${newUser.registrationStatus}`);
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

fixAdminUser();
