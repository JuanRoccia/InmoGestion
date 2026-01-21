import { db } from "../server/db";
import { hashPassword } from "../server/auth-utils";

async function createUser() {
  try {
    console.log("Creando usuario de prueba con email y contraseña...\n");
    
    const email = "test@example.com";
    const password = "password123";
    const firstName = "Test";
    const lastName = "User";
    
    // Hashear la contraseña
    const hashedPassword = await hashPassword(password);
    
    // Crear el usuario (sin registration_status porque no existe en la tabla)
    const result = await db.execute(`
      INSERT INTO users (id, email, first_name, last_name, password, created_at, updated_at)
      VALUES (gen_random_uuid(), '${email}', '${firstName}', '${lastName}', '${hashedPassword}', NOW(), NOW())
      RETURNING id, email, first_name, last_name
    `);
    
    console.log("✅ Usuario creado exitosamente!");
    console.log(`ID: ${result.rows[0].id}`);
    console.log(`Email: ${result.rows[0].email}`);
    console.log(`Nombre: ${result.rows[0].first_name} ${result.rows[0].last_name}`);
    console.log(`Contraseña: ${password} (para pruebas)`);
    
    // Verificar que se creó
    const checkUser = await db.execute(`
      SELECT id, email, first_name, last_name, password IS NOT NULL as has_password
      FROM users 
      WHERE email = '${email}'
    `);
    
    if (checkUser.rows.length > 0) {
      console.log("✅ Verificación exitosa: el usuario fue creado");
    } else {
      console.log("❌ El usuario no se creó correctamente");
    }

  } catch (error) {
    console.error("Error al crear usuario:", error);
  }
}

// Ejecutar la función
createUser();