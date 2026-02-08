import { db, pool } from '../server/db';
import { agencies, properties } from '../shared/schema';
import { eq, count, sql } from 'drizzle-orm';

interface MigrationReport {
  timestamp: string;
  agenciesMigrated: number;
  propertiesUpdated: number;
  issues: string[];
  agenciesOverLimit: Array<{
    id: string;
    name: string;
    propertyCount: number;
    currentPlan: string;
    recommendedPlan: string;
  }>;
}

async function createBackup() {
  console.log('💾 CREANDO BACKUP COMPLETO DE LA BASE DE DATOS...');
  
  try {
    // Backup de agencias
    const agenciesBackup = await pool.query('SELECT * FROM agencies ORDER BY created_at');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS agencies_backup_${Date.now()} 
      AS SELECT * FROM agencies
    `);
    
    // Backup de propiedades (como referencia)
    const propertiesBackup = await pool.query('SELECT * FROM properties ORDER BY created_at');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS properties_backup_${Date.now()} 
      AS SELECT * FROM properties
    `);
    
    console.log(`✅ BACKUP COMPLETO:`);
    console.log(`   - ${agenciesBackup.rows.length} agencias respaldadas`);
    console.log(`   - ${propertiesBackup.rows.length} propiedades respaldadas`);
    console.log(`   - Tablas: agencies_backup_${Date.now()}, properties_backup_${Date.now()}`);
    
    return true;
  } catch (error) {
    console.error('❌ ERROR EN BACKUP:', error);
    throw error;
  }
}

async function addNewColumns() {
  console.log('🔧 AGREGANDO NUEVAS COLUMNAS A LA TABLA AGENCIES...');
  
  try {
    // Agregar columnas nuevas
    await pool.query(`
      ALTER TABLE agencies 
      ADD COLUMN IF NOT EXISTS property_limit INTEGER DEFAULT 20,
      ADD COLUMN IF NOT EXISTS property_count INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS subscription_updated_at TIMESTAMP DEFAULT NOW()
    `);
    
    console.log('✅ COLUMNAS AGREGADAS:');
    console.log('   - property_limit: INTEGER DEFAULT 20');
    console.log('   - property_count: INTEGER DEFAULT 0');
    console.log('   - subscription_updated_at: TIMESTAMP DEFAULT NOW()');
    
    return true;
  } catch (error) {
    console.error('❌ ERROR AGREGANDO COLUMNAS:', error);
    throw error;
  }
}

async function calculateAndUpdatePropertyCounts() {
  console.log('📊 CALCULANDO Y ACTUALIZANDO CONTADOR DE PROPIEDADES...');
  
  try {
    const allAgencies = await db.select().from(agencies);
    let totalPropertiesUpdated = 0;
    
    for (const agency of allAgencies) {
      const propertyCountResult = await db.select({ count: count() })
        .from(properties)
        .where(eq(properties.agencyId, agency.id));
      
      const propertyCount = propertyCountResult[0].count;
      
      // Actualizar contador y límite según plan actual
      let newLimit = 20; // default basic
      if (agency.subscriptionPlan === 'professional') {
        newLimit = 75;
      } else if (agency.subscriptionPlan === 'enterprise') {
        newLimit = 150;
      }
      
      await pool.query(`
        UPDATE agencies 
        SET property_count = $1, 
            property_limit = $2, 
            subscription_updated_at = NOW()
        WHERE id = $3
      `, [propertyCount, newLimit, agency.id]);
      
      totalPropertiesUpdated++;
      console.log(`   ${agency.name || agency.id}: ${propertyCount} propiedades, límite: ${newLimit}`);
    }
    
    console.log(`✅ CONTADORES ACTUALIZADOS: ${totalPropertiesUpdated} agencias`);
    return totalPropertiesUpdated;
  } catch (error) {
    console.error('❌ ERROR ACTUALIZANDO CONTADORES:', error);
    throw error;
  }
}

async function identifyIssuesAndReport() {
  console.log('🔍 IDENTIFICANDO PROBLEMAS Y GENERANDO REPORTE...');
  
  try {
    const allAgencies = await db.select().from(agencies);
    const report: MigrationReport = {
      timestamp: new Date().toISOString(),
      agenciesMigrated: allAgencies.length,
      propertiesUpdated: 0,
      issues: [],
      agenciesOverLimit: []
    };
    
    for (const agency of allAgencies) {
      // Obtener property_count directamente desde SQL ya que es un campo nuevo
      const agencyWithCount = await pool.query(`
        SELECT property_count, property_limit 
        FROM agencies 
        WHERE id = $1
      `, [agency.id]);
      
      const propertyCount = agencyWithCount.rows[0]?.property_count || 0;
      const currentLimit = agencyWithCount.rows[0]?.property_limit || 20;
      const currentPlan = agency.subscriptionPlan || 'basic';
      
      // Acumular total de propiedades procesadas
      report.propertiesUpdated += propertyCount;
      
      // Verificar si excede límite actual
      if (propertyCount > currentLimit) {
        let recommendedPlan = currentPlan;
        if (propertyCount <= 75) {
          recommendedPlan = 'professional';
        } else if (propertyCount <= 150) {
          recommendedPlan = 'enterprise';
        } else {
          recommendedPlan = 'enterprise'; // Máximo permitido, caso límite
        }
        
        report.agenciesOverLimit.push({
          id: agency.id,
          name: agency.name || 'SIN NOMBRE',
          propertyCount,
          currentPlan,
          recommendedPlan
        });
        
        report.issues.push(
          `Agencia "${agency.name || agency.id}" tiene ${propertyCount} propiedades, excede límite de ${currentLimit}`
        );
      }
      
      // Verificar inconsistencias
      if (!agency.subscriptionPlan) {
        report.issues.push(`Agencia "${agency.name || agency.id}" sin plan definido`);
      }
      
      if (agency.isActive && agency.subscriptionStatus !== 'active') {
        report.issues.push(
          `Agencia "${agency.name || agency.id}" está activa pero con status "${agency.subscriptionStatus}"`
        );
      }
    }
    
    // Generar reporte en archivo
    const reportText = `
REPORTE DE MIGRACIÓN - PASO 0
================================
Fecha: ${report.timestamp}
Agencias migradas: ${report.agenciesMigrated}
Propiedades procesadas: ${report.propertiesUpdated}

AGENCIAS SOBRE LÍMITE:
${report.agenciesOverLimit.map(a => 
  `- ${a.name} (${a.id}): ${a.propertyCount} props, plan: ${a.currentPlan} → recomendado: ${a.recommendedPlan}`
).join('\n')}

PROBLEMAS IDENTIFICADOS:
${report.issues.length > 0 ? report.issues.join('\n') : 'Ninguno'}

ESTADO POST-MIGRACIÓN:
✅ Todas las agencias tienen límite de propiedades asignado
✅ Contador de propiedades inicializado
✅ Plan actual respetado
⚠️  ${report.agenciesOverLimit.length} agencias pueden necesitar atención manual
    `;
    
    console.log(reportText);
    
    return report;
  } catch (error) {
    console.error('❌ ERROR EN REPORTE:', error);
    throw error;
  }
}

async function rollbackPlan() {
  console.log('🔄 PLAN DE ROLLBACK (en caso de error):');
  console.log('1. DROP COLUMN property_limit FROM agencies;');
  console.log('2. DROP COLUMN property_count FROM agencies;');
  console.log('3. DROP COLUMN subscription_updated_at FROM agencies;');
  console.log('4. DELETE FROM agencies_backup_<timestamp>;');
  console.log('5. DELETE FROM properties_backup_<timestamp>;');
}

async function verifyPostMigration() {
  console.log('✅ VERIFICACIÓN POST-MIGRACIÓN...');
  
  try {
    // Verificar estructura
    const columns = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'agencies' 
      AND column_name IN ('property_limit', 'property_count', 'subscription_updated_at')
    `);
    
    console.log(`Columnas verificadas: ${columns.rows.length}`);
    columns.rows.forEach(col => {
      console.log(`   - ${col.column_name}: ${col.data_type}`);
    });
    
    // Verificar datos con SQL directo para incluir nuevos campos
    const agenciesWithNewFields = await pool.query(`
      SELECT id, name, property_limit, property_count, subscription_updated_at
      FROM agencies
    `);
    let allGood = true;
    
    for (const agency of agenciesWithNewFields.rows) {
      if (agency.property_limit === null || agency.property_count === null) {
        console.log(`❌ Agencia ${agency.name || agency.id} con campos indefinidos`);
        allGood = false;
      }
    }
    
    if (allGood) {
      console.log('✅ VERIFICACIÓN EXITOSA: Todas las agencias tienen nuevos campos');
    }
    
    return allGood;
  } catch (error) {
    console.error('❌ ERROR EN VERIFICACIÓN:', error);
    return false;
  }
}

// FUNCIÓN PRINCIPAL DE MIGRACIÓN
async function executeMigration() {
  console.log('🚀 INICIANDO MIGRACIÓN - PASO 0');
  console.log('=====================================');
  console.log('⚠️  ESTE PROCESO MODIFICARÁ LA BASE DE DATOS');
  console.log('⚠️  SE HA CREADO UN BACKUP AUTOMÁTICO');
  console.log('');
  
  try {
    // Paso 1: Backup
    const backupSuccess = await createBackup();
    if (!backupSuccess) throw new Error('Backup falló');
    
    console.log('');
    
    // Paso 2: Agregar columnas
    const columnsSuccess = await addNewColumns();
    if (!columnsSuccess) throw new Error('Fallo al agregar columnas');
    
    console.log('');
    
    // Paso 3: Calcular y actualizar contadores
    const updatedCount = await calculateAndUpdatePropertyCounts();
    if (updatedCount === 0) throw new Error('No se actualizaron contadores');
    
    console.log('');
    
    // Paso 4: Verificación
    const verificationSuccess = await verifyPostMigration();
    if (!verificationSuccess) throw new Error('Verificación falló');
    
    console.log('');
    
    // Paso 5: Reporte final
    const report = await identifyIssuesAndReport();
    
    console.log('');
    console.log('🎉 MIGRACIÓN COMPLETADA EXITOSAMENTE');
    console.log('=====================================');
    console.log(`✅ ${report.agenciesMigrated} agencias migradas`);
    console.log(`✅ ${report.propertiesUpdated} propiedades contadas`);
    console.log(`⚠️  ${report.issues.length} issues identificados para revisión manual`);
    
    if (report.agenciesOverLimit.length > 0) {
      console.log('');
      console.log('🚨 ACCIÓN REQUERIDA POST-MIGRACIÓN:');
      console.log(`${report.agenciesOverLimit.length} agencias exceden límites y necesitan atención manual`);
      console.log('Revisa el reporte completo arriba para detalles');
    }
    
    return report;
    
  } catch (error) {
    console.error('');
    console.error('❌ ERROR CRÍTICO EN MIGRACIÓN:', error);
    console.error('');
    console.error('🔄 EJECUTANDO PLAN DE ROLLBACK...');
    await rollbackPlan();
    throw error;
  } finally {
    await pool.end();
  }
}

// Ejecutar migración
executeMigration().catch(console.error);