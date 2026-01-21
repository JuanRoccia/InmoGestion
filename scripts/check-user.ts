import { storage } from "../server/storage";

async function checkUser() {
  const user = await storage.getUserByEmail("test@inmogestion.com");
  if (user) {
    console.log("Usuario encontrado:");
    console.log(`  ID: ${user.id}`);
    console.log(`  Email: ${user.email}`);
    console.log(`  Password en BD: ${user.password ? 'SÍ (existe)' : 'NO (es null)'}`);
    if (user.password) {
      console.log(`  Password hash: ${user.password.substring(0, 20)}...`);
    }
  } else {
    console.log("Usuario no encontrado");
  }
  process.exit(0);
}

checkUser();
