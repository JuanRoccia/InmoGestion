// VERIFICATION SCRIPT - FASE 3 PASO 1
// Verificación completa del estado actual del sistema

import 'dotenv/config';
import { db } from './db.js';
import { eq } from 'drizzle-orm';
import { agencies, properties } from '@shared/schema';

interface VerificationResult {
  success: boolean;
  message: string;
  details?: any;
}

class SystemVerifier {
  async verifyDatabaseSchema(): Promise<VerificationResult> {
    console.log('\n🔍 Verificando Database Schema...');
    
    try {
      // Check if agencies table has required columns
      const agencyColumnsResult = await db.execute(`
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'agencies' 
        AND column_name IN ('stripe_customer_id', 'stripe_subscription_id', 'property_limit', 'property_count')
        ORDER BY column_name
      `);
      
      const agencyColumnsData = agencyColumnsResult as any;
      const agencyColumns = agencyColumnsData.rows;
      const requiredColumns = ['stripe_customer_id', 'stripe_subscription_id', 'property_limit', 'property_count'];
      const existingColumns = agencyColumns.map((col: any) => col.column_name);
      
      const missingColumns = requiredColumns.filter(col => !existingColumns.includes(col));
      
      if (missingColumns.length > 0) {
        return {
          success: false,
          message: `Faltan columnas en agencies table: ${missingColumns.join(', ')}`,
          details: { existingColumns, missingColumns }
        };
      }
      
      // Check agencies data
      const agencyData = await db.select().from(agencies).limit(5);
      
      return {
        success: true,
        message: `Database schema OK. Encontradas ${agencyData.length} agencias.`,
        details: { columns: existingColumns, sampleData: agencyData }
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Error verificando database schema: ${error.message}`,
        details: { error: error.stack }
      };
    }
  }

  async verifyEnvironmentVariables(): Promise<VerificationResult> {
    console.log('\n🔍 Verificando Environment Variables...');
    
    const requiredVars = [
      'STRIPE_SECRET_KEY',
      'VITE_STRIPE_PUBLIC_KEY',
      'STRIPE_BASIC_PRICE_ID',
      'STRIPE_PROFESSIONAL_PRICE_ID',
      'STRIPE_ENTERPRISE_PRICE_ID',
      'STRIPE_WEBHOOK_SECRET'
    ];
    
    const missing: string[] = [];
    const present: string[] = [];
    
    for (const varName of requiredVars) {
      if (process.env[varName]) {
        present.push(varName);
        // Mask sensitive values for logging
        if (varName.includes('SECRET_KEY')) {
          console.log(`✅ ${varName}: ${process.env[varName]?.substring(0, 10)}...`);
        } else {
          console.log(`✅ ${varName}: ${process.env[varName]}`);
        }
      } else {
        missing.push(varName);
        console.log(`❌ ${varName}: NOT SET`);
      }
    }
    
    return {
      success: missing.length === 0,
      message: missing.length === 0 
        ? 'Todas las variables de entorno están configuradas'
        : `Faltan ${missing.length} variables de entorno`,
      details: { present, missing }
    };
  }

  async verifyAgencyData(): Promise<VerificationResult> {
    console.log('\n🔍 Verificando Datos de Agencias...');
    
    try {
      const agencyData = await db.select().from(agencies);
      
      const issues: string[] = [];
      const validAgencies: any[] = [];
      
      for (const agency of agencyData) {
        const agencyIssues: string[] = [];
        
        // Check required fields
        if (!agency.propertyLimit) agencyIssues.push('propertyLimit is null');
        if (agency.propertyCount === undefined || agency.propertyCount === null) {
          agencyIssues.push('propertyCount is null');
        }
        if (!agency.subscriptionPlan) agencyIssues.push('subscriptionPlan is null');
        if (agency.isActive === undefined || agency.isActive === null) {
          agencyIssues.push('isActive is null');
        }
        
        if (agencyIssues.length === 0) {
          validAgencies.push({
            id: agency.id,
            name: agency.name,
            plan: agency.subscriptionPlan,
            limit: agency.propertyLimit,
            count: agency.propertyCount,
            active: agency.isActive,
            usage: `${agency.propertyCount}/${agency.propertyLimit} (${Math.round(agency.propertyCount! / agency.propertyLimit! * 100)}%)`
          });
        } else {
          issues.push(`Agency ${agency.name}: ${agencyIssues.join(', ')}`);
        }
      }
      
      // Check property counts consistency
      const propertyCountsResult = await db.execute(`
        SELECT agency_id, COUNT(*) as actual_count
        FROM properties 
        GROUP BY agency_id
      `);
      
      const propertyCountsData = propertyCountsResult as any;
      const propertyCounts = propertyCountsData.rows;
      const countIssues: string[] = [];
      const consistencyLogs: string[] = [];
      for (const agency of agencyData) {
        const actualCountStr = propertyCounts.find((pc: any) => pc.agency_id === agency.id)?.actual_count || "0";
        const actualCount = parseInt(actualCountStr, 10);
        consistencyLogs.push(`Agency ${agency.name}: cached_count=${agency.propertyCount}, actual=${actualCount}`);
        if (agency.propertyCount !== actualCount) {
          countIssues.push(`Agency ${agency.name}: cached_count=${agency.propertyCount}, actual=${actualCount} (DISCREPANCIA)`);
        }
      }
      
      const hasRealIssues = issues.length > 0 || countIssues.length > 0;
      
      return {
        success: !hasRealIssues,
        message: `Verificación de ${agencyData.length} agencias completada`,
        details: {
          totalAgencies: agencyData.length,
          validAgencies: validAgencies.length,
          issues: hasRealIssues ? [...issues, ...countIssues] : undefined,
          consistency: consistencyLogs,
          agencies: validAgencies
        }
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Error verificando datos de agencias: ${error.message}`,
        details: { error: error.stack }
      };
    }
  }

  async verifyEndpoints(): Promise<VerificationResult> {
    console.log('\n🔍 Verificando Endpoints Críticos...');
    
    const baseUrl = 'http://localhost:5000';
    const endpoints = [
      { path: '/api/agencies', method: 'GET', description: 'Listar agencias' },
      { path: '/api/subscribe/plans', method: 'GET', description: 'Obtener planes' },
      { path: '/api/stripe/webhook', method: 'POST', description: 'Webhook endpoint' }
    ];
    
    const results: any[] = [];
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`${baseUrl}${endpoint.path}`, {
          method: endpoint.method,
          headers: { 'Content-Type': 'application/json' }
        });
        
        const success = response.status < 500; // Accept 4xx as endpoint exists
        results.push({
          ...endpoint,
          status: response.status,
          success,
          message: success ? 'OK' : `Error ${response.status}`
        });
        
        console.log(`${success ? '✅' : '⚠️'} ${endpoint.method} ${endpoint.path}: ${response.status}`);
      } catch (error: any) {
        results.push({
          ...endpoint,
          status: 'ERROR',
          success: false,
          message: error.message
        });
        console.log(`❌ ${endpoint.method} ${endpoint.path}: ${error.message}`);
      }
    }
    
    const allWorking = results.every(r => r.success);
    
    return {
      success: allWorking,
      message: allWorking ? 'Todos los endpoints responden correctamente' : 'Algunos endpoints tienen problemas',
      details: { results }
    };
  }

  async verifyStripeIntegration(): Promise<VerificationResult> {
    console.log('\n🔍 Verificando Integración con Stripe...');
    
    try {
      const Stripe = (await import('stripe')).default;
      
      if (!process.env.STRIPE_SECRET_KEY) {
        return {
          success: false,
          message: 'STRIPE_SECRET_KEY no está configurada'
        };
      }
      
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      
      // Test basic API access
      const account = await stripe.accounts.retrieve();
      
      // Verify price IDs exist
      const priceIds = [
        process.env.STRIPE_BASIC_PRICE_ID,
        process.env.STRIPE_PROFESSIONAL_PRICE_ID,
        process.env.STRIPE_ENTERPRISE_PRICE_ID
      ].filter(Boolean);
      
      const priceChecks = [];
      for (const priceId of priceIds) {
        try {
          const price = await stripe.prices.retrieve(priceId!);
          priceChecks.push({
            priceId,
            exists: true,
            amount: price.unit_amount,
            currency: price.currency
          });
          console.log(`✅ Price ID ${priceId}: ${price.unit_amount} ${price.currency}`);
        } catch (error: any) {
          priceChecks.push({
            priceId,
            exists: false,
            error: error.message
          });
          console.log(`❌ Price ID ${priceId}: ${error.message}`);
        }
      }
      
      return {
        success: true,
        message: 'Integración con Stripe verificada',
        details: {
          accountId: account.id,
          country: account.country,
          priceChecks
        }
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Error verificando Stripe: ${error.message}`,
        details: { error: error.stack }
      };
    }
  }

  async runFullVerification(): Promise<void> {
    console.log('🚀 INICIANDO VERIFICACIÓN COMPLETA DEL SISTEMA');
    console.log('='.repeat(60));
    
    const results = {
      database: await this.verifyDatabaseSchema(),
      environment: await this.verifyEnvironmentVariables(),
      agencyData: await this.verifyAgencyData(),
      endpoints: await this.verifyEndpoints(),
      stripe: await this.verifyStripeIntegration()
    };
    
    console.log('\n📊 RESUMEN DE VERIFICACIÓN');
    console.log('='.repeat(60));
    
    const allSuccess = Object.values(results).every(r => r.success);
    
    for (const [category, result] of Object.entries(results)) {
      console.log(`\n${result.success ? '✅' : '❌'} ${category.toUpperCase()}: ${result.message}`);
      
      if (!result.success && result.details) {
        console.log('   Detalles:', JSON.stringify(result.details, null, 2));
      }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log(`🎯 ESTADO GENERAL: ${allSuccess ? '✅ SISTEMA LISTO PARA TESTING' : '❌ HAY PROBLEMAS QUE RESOLVER'}`);
    
    if (!allSuccess) {
      console.log('\n⚠️  ACCIONES REQUERIDAS:');
      for (const [category, result] of Object.entries(results)) {
        if (!result.success) {
          console.log(`   - ${category}: ${result.message}`);
        }
      }
    }
    
    process.exit(allSuccess ? 0 : 1);
  }
}

// Run verification if this script is executed directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  SystemVerifier.prototype.runFullVerification = async function() {
    console.log('🚀 INICIANDO VERIFICACIÓN COMPLETA DEL SISTEMA');
    console.log('='.repeat(60));
    
    const results = {
      database: await this.verifyDatabaseSchema(),
      environment: await this.verifyEnvironmentVariables(),
      agencyData: await this.verifyAgencyData(),
      endpoints: await this.verifyEndpoints(),
      stripe: await this.verifyStripeIntegration()
    };
    
    console.log('\n📊 RESUMEN DE VERIFICACIÓN');
    console.log('='.repeat(60));
    
    const allSuccess = Object.values(results).every(r => r.success);
    
    for (const [category, result] of Object.entries(results)) {
      console.log(`\n${result.success ? '✅' : '❌'} ${category.toUpperCase()}: ${result.message}`);
      
      if (!result.success && result.details) {
        console.log('   Detalles:', JSON.stringify(result.details, null, 2));
      }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log(`🎯 ESTADO GENERAL: ${allSuccess ? '✅ SISTEMA LISTO PARA TESTING' : '❌ HAY PROBLEMAS QUE RESOLVER'}`);
    
    if (!allSuccess) {
      console.log('\n⚠️  ACCIONES REQUERIDAS:');
      for (const [category, result] of Object.entries(results)) {
        if (!result.success) {
          console.log(`   - ${category}: ${result.message}`);
        }
      }
    }
    
    process.exit(allSuccess ? 0 : 1);
  };

  const verifier = new SystemVerifier();
  verifier.runFullVerification();
}

export { SystemVerifier };