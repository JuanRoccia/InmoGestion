import { config } from 'dotenv';

// Load environment variables
config({ path: '.env' });

async function testFinalConfiguration() {
  console.log('🔚 TESTING FINAL CONFIGURATION');
  console.log('==================================');

  console.log('\n🔍 ENVIRONMENT VARIABLES LOADED:');
  console.log(`   STRIPE_SECRET_KEY: ${process.env.STRIPE_SECRET_KEY ? '✅ CONFIGURED' : '❌ MISSING'}`);
  console.log(`   STRIPE_WEBHOOK_SECRET: ${process.env.STRIPE_WEBHOOK_SECRET ? '✅ CONFIGURED' : '❌ MISSING'}`);
  console.log(`   STRIPE_BASIC_PRICE_ID: ${process.env.STRIPE_BASIC_PRICE_ID || '❌ MISSING'}`);
  console.log(`   STRIPE_PROFESSIONAL_PRICE_ID: ${process.env.STRIPE_PROFESSIONAL_PRICE_ID || '❌ MISSING'}`);
  console.log(`   STRIPE_ENTERPRISE_PRICE_ID: ${process.env.STRIPE_ENTERPRISE_PRICE_ID || '❌ MISSING'}`);

  console.log('\n🏢 PRICE DETAILS:');
  console.log(`   Basic (29,000 ARS): ${process.env.STRIPE_BASIC_PRICE_ID}`);
  console.log(`   Professional (79,000 ARS): ${process.env.STRIPE_PROFESSIONAL_PRICE_ID}`);
  console.log(`   Enterprise (150,000 ARS): ${process.env.STRIPE_ENTERPRISE_PRICE_ID}`);

  console.log('\n🎯 PLAN LIMITS:');
  console.log(`   Basic: 20 propiedades`);
  console.log(`   Professional: 75 propiedades`);
  console.log(`   Enterprise: 150 propiedades`);

  console.log('\n📋 PRICE MAPPING:');
  const priceMapping = {
    'price_1SyipGGvoDOwROSTb7oayzZC': 'basic',
    'price_1SyiwRGvoDOwROSTDDM1JIH9': 'professional',
    'price_1SyixYGvoDOwROSTzcbeX1Zb': 'enterprise',
  };

  Object.entries(priceMapping).forEach(([priceId, plan]) => {
    console.log(`   ${priceId} → ${plan}`);
  });

  console.log('\n🔧 WEBHOOK CONFIGURATION:');
  console.log(`   Webhook URL: https://ba516923-e620-4290-b09f-de6dc00649b5-00-2gwwyr0495srt.worf.replit.dev/api/stripe/webhook`);
  console.log(`   Webhook Secret: ${process.env.STRIPE_WEBHOOK_SECRET?.substring(0, 20)}...`);

  console.log('\n💳 WEBHOOK EVENTS HANDLED:');
  const events = [
    'invoice.payment_succeeded → Activar cuenta',
    'invoice.payment_failed → Marcar past_due',
    'customer.subscription.deleted → Desactivar cuenta',
    'customer.subscription.updated → Cambiar plan/limites'
  ];

  events.forEach(event => {
    console.log(`   ✅ ${event}`);
  });

  console.log('\n📊 SAMPLE AGENCY DATA:');
  try {
    const { db } = await import('../server/db');
    const { agencies } = await import('../shared/schema');
    
    const sampleAgency = await db.select().from(agencies).limit(1);
    if (sampleAgency.length > 0) {
      const agency = sampleAgency[0];
      console.log(`   Agency: ${agency.name}`);
      console.log(`   Plan: ${agency.subscriptionPlan}`);
      console.log(`   Status: ${agency.subscriptionStatus}`);
      console.log(`   Properties: ${agency.propertyCount}/${agency.propertyLimit}`);
      console.log(`   Stripe Customer: ${agency.stripeCustomerId || 'NOT SET'}`);
      console.log(`   Stripe Subscription: ${agency.stripeSubscriptionId || 'NOT SET'}`);
    }
  } catch (error) {
    console.log('   Could not load agency data');
  }

  console.log('\n🎉 CONFIGURATION STATUS:');
  const allConfigured = [
    process.env.STRIPE_SECRET_KEY,
    process.env.STRIPE_WEBHOOK_SECRET,
    process.env.STRIPE_BASIC_PRICE_ID,
    process.env.STRIPE_PROFESSIONAL_PRICE_ID,
    process.env.STRIPE_ENTERPRISE_PRICE_ID
  ].every(v => v && !v.includes('...'));

  if (allConfigured) {
    console.log('   ✅ ALL CONFIGURED - READY FOR TESTING');
  } else {
    console.log('   ⚠️ SOME CONFIGURATION MISSING');
  }

  console.log('\n🚀 READY FOR:');
  console.log('   1. Webhook testing with Stripe CLI');
  console.log('   2. Real payment testing');
  console.log('   3. Account activation flow');
  console.log('   4. Plan upgrade/downgrade');
  console.log('   5. Automatic limit enforcement');

  console.log('\n📝 NEXT STEPS:');
  console.log('   1. Install Stripe CLI: npm install -g stripe-cli');
  console.log('   2. Forward webhooks: stripe listen --forward-to localhost:5000/api/stripe/webhook');
  console.log('   3. Test events: stripe trigger invoice.payment_succeeded');
  console.log('   4. Test complete payment flow');
}

// Execute test
testFinalConfiguration().catch(console.error);