import { db, pool } from '../server/db';
import { agencies, properties, users } from '../shared/schema';
import { eq, count } from 'drizzle-orm';

async function analyzeExistingData() {
  console.log('🔍 ANÁLISIS DE DATOS EXISTENTES');
  console.log('=====================================');

  try {
    // 1. Contar usuarios
    const userCount = await db.select({ count: count() }).from(users);
    console.log(`📊 Usuarios totales: ${userCount[0].count}`);

    // 2. Contar agencias
    const agencyCount = await db.select({ count: count() }).from(agencies);
    console.log(`🏢 Agencias totales: ${agencyCount[0].count}`);

    // 3. Analizar agencias existentes
    const existingAgencies = await db.select().from(agencies);
    console.log(`\n📋 DETALLE DE AGENCIAS EXISTENTES:`);
    
    if (existingAgencies.length === 0) {
      console.log('✅ NO HAY AGENCIAS EXISTENTES - Migración será simple');
    } else {
      existingAgencies.forEach((agency, index) => {
        console.log(`\n${index + 1}. ${agency.name || 'SIN NOMBRE'}`);
        console.log(`   ID: ${agency.id}`);
        console.log(`   Email: ${agency.email}`);
        console.log(`   Plan actual: ${agency.subscriptionPlan || 'NO DEFINIDO'}`);
        console.log(`   Status: ${agency.subscriptionStatus || 'NO DEFINIDO'}`);
        console.log(`   Activa: ${agency.isActive}`);
        console.log(`   Owner: ${agency.ownerId}`);
        console.log(`   Creada: ${agency.createdAt}`);
        
        // Los campos nuevos no existen todavía - son los que vamos a agregar
        console.log(`   ¿Tiene property_limit?: NO (campo a agregar)`);
        console.log(`   ¿Tiene property_count?: NO (campo a agregar)`);
        console.log(`   ¿Tiene subscription_updated_at?: NO (campo a agregar)`);
      });
    }

    // 4. Contar propiedades por agencia
    console.log(`\n🏠 ANÁLISIS DE PROPIEDADES POR AGENCIA:`);
    for (const agency of existingAgencies) {
      const propertyCountResult = await db.select({ count: count() })
        .from(properties)
        .where(eq(properties.agencyId, agency.id));
      
      const propertyCount = propertyCountResult[0].count;
      console.log(`   ${agency.name || agency.id}: ${propertyCount} propiedades`);
      
      // Verificar si excede límites propuestos
      if (propertyCount > 20) {
        console.log(`   ⚠️  EXCEDE LÍMITE BASIC (20): ${propertyCount - 20} propiedades extra`);
      }
      if (propertyCount > 75) {
        console.log(`   ⚠️  EXCEDE LÍMITE PROFESSIONAL (75): ${propertyCount - 75} propiedades extra`);
      }
      if (propertyCount > 150) {
        console.log(`   ⚠️  EXCEDE LÍMITE ENTERPRISE (150): ${propertyCount - 150} propiedades extra`);
      }
    }

    // 5. Verificar estructura actual de tabla agencies
    console.log(`\n🔍 ESTRUCTURA ACTUAL DE TABLA AGENCIES:`);
    const tableInfo = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'agencies' 
      ORDER BY ordinal_position;
    `);
    
    console.log('Columnas actuales:');
    tableInfo.rows.forEach(col => {
      console.log(`   - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})${col.column_default ? ` default: ${col.column_default}` : ''}`);
    });

    // 6. Recomendaciones
    console.log(`\n📋 RECOMENDACIONES DE MIGRACIÓN:`);
    if (existingAgencies.length === 0) {
      console.log('✅ MIGRACIÓN SIMPLE: No hay agencias existentes');
      console.log('   - Solo agregar campos a schema');
      console.log('   - No hay datos que migrar');
    } else {
      console.log(`🔄 MIGRACIÓN REQUIERE ATENCIÓN: ${existingAgencies.length} agencias existentes`);
      console.log('   - Asignar plan "basic" a todas por defecto');
      console.log('   - Contar propiedades existentes para cada agency');
      console.log('   - Verificar si alguna excede límite de 20 propiedades');
      
      // Verificar cuántas agencias tienen más de 20 propiedades
      let agenciesOverLimit = 0;
      for (const agency of existingAgencies) {
        const propertyCountResult = await db.select({ count: count() })
          .from(properties)
          .where(eq(properties.agencyId, agency.id));
        
        const propertyCount = propertyCountResult[0].count;
        if (propertyCount > 20) {
          agenciesOverLimit++;
        }
      }
      
      if (agenciesOverLimit > 0) {
        console.log(`   ⚠️  ${agenciesOverLimit} agencias podrían necesitar plan superior o aviso`);
      }
    }

  } catch (error) {
    console.error('❌ Error en análisis:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Ejecutar análisis
analyzeExistingData().catch(console.error);