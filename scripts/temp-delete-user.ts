import { storage } from "../server/storage";

async function deleteTestUser() {
  try {
    const user = await storage.getUserByEmail("test@test.com");

    if (!user) {
      console.log("Usuario test@test.com no encontrado");
      process.exit(0);
    }

    console.log("Eliminando usuario:");
    console.log(`Email: ${user.email}`);
    console.log(`ID: ${user.id}`);

    await storage.deleteUser(user.id);

    console.log("✓ Usuario eliminado correctamente");
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

deleteTestUser();
