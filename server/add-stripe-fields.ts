import { pool } from '../server/db';

async function addStripeFieldsToAgencies() {
  console.log('🔧 AGREGANDO CAMPOS STRIPE A AGENCIES...');
  
  try {
    // Verificar si los campos ya existen
    const columnsQuery = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'agencies' 
      AND column_name IN ('stripe_customer_id', 'stripe_subscription_id')
    `);
    
    const existingColumns = columnsQuery.rows.map(row => row.column_name);
    console.log('Columnas existentes:', existingColumns);
    
    // Agregar stripe_customer_id si no existe
    if (!existingColumns.includes('stripe_customer_id')) {
      console.log('➕ Agregando stripe_customer_id...');
      await pool.query(`
        ALTER TABLE agencies 
        ADD COLUMN stripe_customer_id VARCHAR(255)
      `);
      console.log('✅ stripe_customer_id agregado');
    } else {
      console.log('ℹ️ stripe_customer_id ya existe');
    }
    
    // Agregar stripe_subscription_id si no existe
    if (!existingColumns.includes('stripe_subscription_id')) {
      console.log('➕ Agregando stripe_subscription_id...');
      await pool.query(`
        ALTER TABLE agencies 
        ADD COLUMN stripe_subscription_id VARCHAR(255)
      `);
      console.log('✅ stripe_subscription_id agregado');
    } else {
      console.log('ℹ️ stripe_subscription_id ya existe');
    }
    
    // Verificar estructura final
    const finalStructure = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'agencies' 
      AND column_name LIKE '%stripe%'
      ORDER BY ordinal_position
    `);
    
    console.log('\n📋 Estructura final de campos Stripe:');
    finalStructure.rows.forEach(col => {
      console.log(`   - ${col.column_name}: ${col.data_type}`);
    });
    
    // Migrar datos existentes desde users a agencies
    console.log('\n🔄 Migrando datos Stripe desde users a agencies...');
    
    const migrationQuery = await pool.query(`
      UPDATE agencies 
      SET 
        stripe_customer_id = u.stripe_customer_id,
        stripe_subscription_id = u.stripe_subscription_id
      FROM users u
      WHERE u.id = agencies.owner_id
        AND (u.stripe_customer_id IS NOT NULL OR u.stripe_subscription_id IS NOT NULL)
    `);
    
    console.log(`✅ ${migrationQuery.rowCount} agencias actualizadas con datos Stripe`);
    
    console.log('\n🎉 MIGRACIÓN DE CAMPOS STRIPE COMPLETADA');
    
  } catch (error) {
    console.error('❌ Error en migración:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Ejecutar migración
addStripeFieldsToAgencies().catch(console.error);