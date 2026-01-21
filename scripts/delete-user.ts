import { db } from "../server/db";

async function deleteUser() {
  try {
    console.log("Eliminando usuario juanroccia@gmail.com y sus datos asociados...\n");
    
    // Primero obtener el ID del usuario
    const userResult = await db.execute(`
      SELECT id FROM users WHERE email = 'juanroccia@gmail.com'
    `);
    
    if (userResult.rows.length === 0) {
      console.log("❌ El usuario no existe en la base de datos");
      return;
    }
    
    const userId = userResult.rows[0].id;
    console.log(`Usuario encontrado con ID: ${userId}`);
    
    // Eliminar propiedades asociadas al usuario (a través de su agencia)
    await db.execute(`
      DELETE FROM properties WHERE agency_id IN (
        SELECT id FROM agencies WHERE owner_id = '${userId}'
      )
    `);
    console.log("✅ Propiedades eliminadas");
    
    // Eliminar agencias del usuario
    await db.execute(`
      DELETE FROM agencies WHERE owner_id = '${userId}'
    `);
    console.log("✅ Agencias eliminadas");
    
    // Eliminar el usuario
    await db.execute(`
      DELETE FROM users WHERE id = '${userId}'
    `);
    console.log("✅ Usuario eliminado exitosamente!");
    
    // Verificar que se eliminó
    const remainingUsers = await db.execute(`
      SELECT id, email, first_name, last_name 
      FROM users 
      WHERE email = 'juanroccia@gmail.com'
    `);
    
    if (remainingUsers.rows.length === 0) {
      console.log("✅ Verificación exitosa: el usuario ya no existe en la base de datos");
    } else {
      console.log("❌ El usuario sigue existiendo");
    }

  } catch (error) {
    console.error("Error al eliminar usuario:", error);
  }
}

// Ejecutar la función
deleteUser();