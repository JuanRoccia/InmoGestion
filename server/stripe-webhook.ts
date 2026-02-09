// WEBHOOK HANDLER IMPLEMENTATION

import Stripe from 'stripe';
import { storage } from './storage';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10' as any,
});

// Environment variables needed
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET; // whsec_nyFaMn0GMLkIZL6MAsXrZVlCceP1I121

// Plan configuration (en pesos argentinos)
const PLAN_LIMITS: Record<string, number> = {
  basic: 20,        // ARS 29,000/mes
  professional: 75, // ARS 79,000/mes  
  enterprise: 150, // ARS 150,000/mes
};

// Price ID mapping configurados en .env
const PRICE_ID_TO_PLAN: Record<string, string> = {
  [process.env.STRIPE_BASIC_PRICE_ID || 'price_1SyipGGvoDOwROSTb7oayzZC']: 'basic',
  [process.env.STRIPE_PROFESSIONAL_PRICE_ID || 'price_1SyiwRGvoDOwROSTDDM1JIH9']: 'professional',
  [process.env.STRIPE_ENTERPRISE_PRICE_ID || 'price_1SyixYGvoDOwROSTzcbeX1Zb']: 'enterprise',
};

// Helper functions
function getPlanFromPriceId(priceId: string): string {
  return PRICE_ID_TO_PLAN[priceId] || 'basic';
}

function getLimitFromPlan(plan: string): number {
  return PLAN_LIMITS[plan] || 20;
}

// Webhook handler function
export async function handleStripeWebhook(req: any, res: any) {
  const sig = req.headers['stripe-signature'];
  
  if (!sig || !STRIPE_WEBHOOK_SECRET) {
    console.error('❌ Missing signature or webhook secret');
    return res.status(400).send('Missing signature or secret');
  }
  
  let event: Stripe.Event;
  
  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      STRIPE_WEBHOOK_SECRET
    );
    
    console.log(`🔔 Webhook received: ${event.type}`);
    
  } catch (err: any) {
    console.error('⚠️ Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  try {
    // Handle events
    switch (event.type) {
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;
        
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;
        
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
        
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
        
      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }
    
    res.json({ received: true });
    
  } catch (error) {
    console.error('❌ Error processing webhook:', error);
    res.status(500).send('Webhook processing failed');
  }
}

// Event handlers
async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('💰 Processing payment succeeded...');
  
  const subscriptionId = (invoice as any).subscription as string;
  if (!subscriptionId) {
    console.log('❌ No subscription ID in invoice');
    return;
  }
  
  try {
    // Get subscription details
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const customerId = subscription.customer as string;
    
    console.log(`🔍 Looking for agency with customerId: ${customerId}`);
    
    // Find agency by customer ID
    const agency = await storage.getAgencyByCustomerId(customerId);
    if (!agency) {
      console.error('❌ Agency not found for customer:', customerId);
      return;
    }
    
    // Get plan from price ID
    const priceId = subscription.items.data[0].price.id;
    const plan = getPlanFromPriceId(priceId);
    const limit = getLimitFromPlan(plan);
    
    console.log(`📊 Updating agency ${agency.name}: ${plan} plan (${limit} properties)`);
    
    // Update agency with active subscription
    await storage.updateAgency(agency.id, {
      subscriptionStatus: 'active',
      subscriptionPlan: plan as any,
      propertyLimit: limit,
      stripeSubscriptionId: subscriptionId,
      subscriptionUpdatedAt: new Date(),
      isActive: true
    });
    
    // Also update user's registration status
    if (agency.ownerId) {
      await storage.updateUserStripeInfo(
        agency.ownerId,
        customerId,
        subscriptionId
      );
    }
    
    console.log(`✅ Agency ${agency.name} activated successfully!`);
    
  } catch (error) {
    console.error('❌ Error in handlePaymentSucceeded:', error);
    throw error;
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  console.log('💸 Processing payment failed...');
  
  const subscriptionId = (invoice as any).subscription as string;
  if (!subscriptionId) return;
  
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const customerId = subscription.customer as string;
    const agency = await storage.getAgencyByCustomerId(customerId);
    
    if (!agency) return;
    
    console.log(`⚠️ Marking agency ${agency.name} as past_due`);
    
    await storage.updateAgency(agency.id, {
      subscriptionStatus: 'past_due',
      subscriptionUpdatedAt: new Date(),
    });
    
    console.log(`✅ Agency ${agency.name} marked as past_due`);
    
  } catch (error) {
    console.error('❌ Error in handlePaymentFailed:', error);
    throw error;
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('🗑️ Processing subscription deleted...');
  
  const customerId = subscription.customer as string;
  const agency = await storage.getAgencyByCustomerId(customerId);
  
  if (!agency) return;
  
  console.log(`❌ Deactivating agency ${agency.name}`);
  
  await storage.updateAgency(agency.id, {
    subscriptionStatus: 'canceled',
    isActive: false,
    subscriptionPlan: 'basic' as any, // Reset to basic
    propertyLimit: 20, // Reset to basic limit
    subscriptionUpdatedAt: new Date(),
  });
  
  console.log(`✅ Agency ${agency.name} subscription canceled`);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('🔄 Processing subscription updated...');
  
  const customerId = subscription.customer as string;
  const agency = await storage.getAgencyByCustomerId(customerId);
  
  if (!agency) return;
  
  const priceId = subscription.items.data[0].price.id;
  const plan = getPlanFromPriceId(priceId);
  const limit = getLimitFromPlan(plan);
  
  console.log(`📊 Updating agency ${agency.name} to ${plan} plan (${limit} properties)`);
  
  await storage.updateAgency(agency.id, {
    subscriptionPlan: plan as any,
    propertyLimit: limit,
    subscriptionUpdatedAt: new Date(),
  });
  
  console.log(`✅ Agency ${agency.name} plan updated successfully`);
}

export { stripe, PLAN_LIMITS, PRICE_ID_TO_PLAN };