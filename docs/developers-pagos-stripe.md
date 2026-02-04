# Documentación para Desarrolladores - Flujos de Pago Stripe

## 📋 Overview del Sistema

Esta documentación detalla la implementación del sistema de pagos Stripe para la plataforma BuscoInmuebles.click, cubriendo el flujo completo desde pre-registro hasta activación de suscripción.

---

## 🏗️ Arquitectura del Sistema

### Componentes Principales

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API    │    │   Stripe API    │
│                 │    │                  │    │                 │
│ - React UI      │◄──►│ - Express.js     │◄──►│ - Payments      │
│ - Stripe Elements│   │ - Database       │    │ - Subscriptions │
│ - State Mgmt    │    │ - Auth           │    │ - Webhooks      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
        │                       │                       │
        └───────────────────────┼───────────────────────┘
                                │
                       ┌──────────────────┐
                       │   PostgreSQL     │
                       │                  │
                       │ - Users          │
                       │ - Agencies       │
                       │ - Properties     │
                       └──────────────────┘
```

### Estados del Sistema

```typescript
interface UserStates {
  registrationStatus: 'pre-registered' | 'completed';
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}

interface AgencyStates {
  isActive: boolean;
  subscriptionStatus: 'pending' | 'active' | 'inactive' | 'past_due';
  subscriptionPlan: 'basic' | 'professional' | 'enterprise';
}
```

---

## 🔐 Authentication & Authorization

### Flujo de Autenticación

```typescript
// 1. Pre-registro
POST /api/register/pre
{
  "email": "user@test.com",
  "password": "password123"
}

// Response
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@test.com",
    "registrationStatus": "pre-registered"
  }
}

// 2. Login (autenticación temporal)
POST /api/login/local
{
  "email": "user@test.com",
  "password": "password123"
}

// 3. Middleware para rutas protegidas
const isAuthenticated = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};
```

### Validación de Permisos

```typescript
// Helper functions para verificar permisos
export const userPermissions = {
  canCreateAgency: (user: User) => {
    return user.registrationStatus === 'pre-registered';
  },
  
  canSubscribe: (user: User) => {
    return user.registrationStatus === 'completed' && 
           !user.stripeSubscriptionId;
  },
  
  canAccessDashboard: (user: User, agency?: Agency) => {
    return user.registrationStatus === 'completed' && agency;
  },
  
  canCreateProperties: (agency: Agency) => {
    return agency.isActive && agency.subscriptionStatus === 'active';
  }
};
```

---

## 💳 Integración con Stripe

### Configuración Inicial

```typescript
// server/routes.ts
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-08-27.basil",
});

// Variables de entorno requeridas
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
VITE_STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_PRICE_ID=price_...
```

### Creación de Suscripción

```typescript
// POST /api/get-or-create-subscription
app.post('/api/get-or-create-subscription', isAuthenticated, async (req: any, res) => {
  const user = req.user;

  // 1. Verificar si ya existe suscripción
  if (user.stripeSubscriptionId) {
    const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId, {
      expand: ['latest_invoice.payment_intent'],
    });
    
    return res.send({
      subscriptionId: subscription.id,
      clientSecret: extractClientSecret(subscription),
    });
  }

  // 2. Crear nuevo customer en Stripe
  const customer = await stripe.customers.create({
    email: user.claims.email,
    name: `${user.claims.first_name || ''} ${user.claims.last_name || ''}`.trim(),
  });

  // 3. Crear suscripción con payment_behavior: 'default_incomplete'
  const subscription = await stripe.subscriptions.create({
    customer: customer.id,
    items: [{
      price: process.env.STRIPE_PRICE_ID,
    }],
    payment_behavior: 'default_incomplete',
    expand: ['latest_invoice.payment_intent'],
  });

  // 4. Actualizar BD con IDs de Stripe
  await storage.updateUserStripeInfo(user.claims.sub, customer.id, subscription.id);

  res.send({
    subscriptionId: subscription.id,
    clientSecret: extractClientSecret(subscription),
  });
});

function extractClientSecret(subscription: Stripe.Subscription): string | null {
  const latestInvoice = subscription.latest_invoice;
  if (typeof latestInvoice === 'object' && latestInvoice?.payment_intent) {
    const paymentIntent = typeof latestInvoice.payment_intent === 'object' 
      ? latestInvoice.payment_intent 
      : null;
    return paymentIntent?.client_secret || null;
  }
  return null;
}
```

### Verificación de Suscripción

```typescript
// POST /api/agencies/verify-subscription
app.post('/api/agencies/verify-subscription', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const user = await storage.getUser(userId);

    if (!user?.stripeSubscriptionId) {
      return res.status(400).json({ message: "No active subscription found" });
    }

    const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);

    if (subscription.status === 'active') {
      const agency = await storage.getAgencyByOwnerId(userId);
      if (agency) {
        const updatedAgency = await storage.updateAgency(agency.id, {
          isActive: true,
          subscriptionStatus: 'active'
        });
        return res.json(updatedAgency);
      }
    }

    res.json({ 
      message: "Subscription not active yet", 
      status: subscription.status 
    });
  } catch (error) {
    console.error("Error verifying subscription:", error);
    res.status(500).json({ message: "Failed to verify subscription" });
  }
});
```

---

## 🎨 Frontend Implementation

### Componente de Suscripción

```typescript
// client/src/pages/subscribe.tsx
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const SubscribeForm = ({ selectedPlan }: { selectedPlan: any }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/subscribe?payment_success=true`,
      },
    });

    if (error) {
      // Manejar error
      toast({
        title: "Error en el pago",
        description: error.message,
        variant: "destructive",
      });
    } else {
      // Éxito - la verificación se manejará en useEffect
      toast({
        title: "¡Registro completado!",
        description: "Tu suscripción ha sido activada.",
      });
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <Button 
        type="submit" 
        disabled={!stripe || isProcessing}
      >
        {isProcessing ? "Procesando..." : `Suscribirse por $${selectedPlan.price}/mes`}
      </Button>
    </form>
  );
};
```

### Manejo de Estados en Dashboard

```typescript
// client/src/pages/agency-dashboard.tsx
export default function AgencyDashboard() {
  // Verificar suscripción si retorna de pago
  useEffect(() => {
    const params = new URLSearchParams(search);
    if (params.get('payment_success')) {
      apiRequest("POST", "/api/agencies/verify-subscription")
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ["/api/agencies"] });
          toast({
            title: "¡Suscripción Activa!",
            description: "Tu agencia ha sido activada correctamente.",
          });
          setLocation("/agency-dashboard");
        })
        .catch((err) => {
          console.error("Verification failed", err);
        });
    }
  }, [search, queryClient, toast, setLocation]);

  // Mostrar modo restringido si no está activo
  if (agency?.subscriptionStatus !== 'active') {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg">
        <p className="font-bold">Modo Vista Previa</p>
        <p className="text-sm">Tu agencia está pendiente de activación. Suscríbete para publicar tus propiedades.</p>
        <Button onClick={() => setLocation("/subscribe")}>
          Activar Suscripción
        </Button>
      </div>
    );
  }
}
```

---

## 🗄️ Database Schema

### Tablas Principales

```sql
-- Users Table
CREATE TABLE users (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE,
  password VARCHAR,
  registration_status VARCHAR DEFAULT 'pre-registered',
  stripe_customer_id VARCHAR,
  stripe_subscription_id VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Agencies Table  
CREATE TABLE agencies (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  phone VARCHAR,
  address TEXT,
  is_active BOOLEAN DEFAULT false,
  subscription_status VARCHAR DEFAULT 'pending',
  subscription_plan VARCHAR DEFAULT 'basic',
  owner_id VARCHAR REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes para performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_stripe_customer ON users(stripe_customer_id);
CREATE INDEX idx_agencies_owner_id ON agencies(owner_id);
CREATE INDEX idx_agencies_subscription_status ON agencies(subscription_status);
```

### Migrations Importantes

```typescript
// Ejemplo de migration para agregar campos de Stripe
export async function up(db: any) {
  await db.schema
    .alterTable('users')
    .addColumn('stripe_customer_id', 'varchar')
    .addColumn('stripe_subscription_id', 'varchar')
    .execute();
    
  await db.schema
    .alterTable('agencies')
    .addColumn('subscription_status', 'varchar', { default: 'pending' })
    .addColumn('subscription_plan', 'varchar', { default: 'basic' })
    .execute();
}
```

---

## 🔧 Endpoints API Reference

### Authentication Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/register/pre` | Pre-registro de usuario | No |
| POST | `/api/login/local` | Login con email/password | No |
| POST | `/api/auth/set-password` | Establecer/ cambiar contraseña | Sí |
| GET | `/api/auth/user` | Obtener datos del usuario actual | Sí |

### Agency Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/agencies` | Listar agencias | No |
| POST | `/api/agencies` | Crear nueva agencia | Sí |
| GET | `/api/agencies/:id` | Obtener agencia específica | No |
| PUT | `/api/agencies/:id` | Actualizar agencia | Sí (owner) |
| DELETE | `/api/agencies/:id` | Eliminar agencia | Sí (owner) |

### Payment Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/get-or-create-subscription` | Crear o recuperar suscripción | Sí |
| POST | `/api/agencies/verify-subscription` | Verificar estado de suscripción | Sí |

### Response Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request (validación)
- `401`: Unauthorized
- `403`: Forbidden (permisos)
- `404`: Not Found
- `409`: Conflict (duplicados)
- `500`: Internal Server Error

---

## 🚨 Error Handling

### Tipos de Errores Comunes

```typescript
// Payment Errors
interface PaymentError {
  type: 'card_error' | 'validation_error' | 'api_error';
  message: string;
  code?: string;
  decline_code?: string;
}

// API Errors
interface APIError {
  status: number;
  code: string;
  message: string;
  details?: any;
}

// Database Errors
interface DatabaseError {
  constraint: string;
  detail: string;
  table: string;
}
```

### Manejo Centralizado de Errores

```typescript
// utils/errorHandler.ts
export class APIError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export const handleStripeError = (error: any): APIError => {
  if (error.type === 'card_error') {
    return new APIError(400, 'CARD_ERROR', error.message);
  } else if (error.type === 'validation_error') {
    return new APIError(400, 'VALIDATION_ERROR', error.message);
  } else {
    return new APIError(500, 'STRIPE_ERROR', 'Payment processing failed');
  }
};

// Middleware de error
export const errorHandler = (err: any, req: any, res: any, next: any) => {
  if (err instanceof APIError) {
    return res.status(err.status).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details
      }
    });
  }

  console.error('Unhandled error:', err);
  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred'
    }
  });
};
```

---

## 🔄 Webhooks Implementation

### Configuración de Webhooks

```typescript
// server/routes.ts - Webhook endpoint
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  let event: Stripe.Event;
  
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    console.log(`Webhook signature verification failed:`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'invoice.payment_succeeded':
      await handlePaymentSucceeded(event.data.object);
      break;
      
    case 'invoice.payment_failed':
      await handlePaymentFailed(event.data.object);
      break;
      
    case 'customer.subscription.deleted':
      await handleSubscriptionCanceled(event.data.object);
      break;
      
    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(event.data.object);
      break;
      
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
});

// Event handlers
async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const subscriptionId = invoice.subscription as string;
  
  // Find user by subscription ID
  const user = await findUserBySubscriptionId(subscriptionId);
  if (!user) return;

  // Activate agency
  const agency = await storage.getAgencyByOwnerId(user.id);
  if (agency) {
    await storage.updateAgency(agency.id, {
      isActive: true,
      subscriptionStatus: 'active'
    });
  }

  console.log(`Payment succeeded for user ${user.id}, agency ${agency?.id}`);
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const subscriptionId = invoice.subscription as string;
  const user = await findUserBySubscriptionId(subscriptionId);
  
  if (user) {
    const agency = await storage.getAgencyByOwnerId(user.id);
    if (agency) {
      await storage.updateAgency(agency.id, {
        subscriptionStatus: 'past_due'
      });
    }
  }
}

async function handleSubscriptionCanceled(subscription: Stripe.Subscription) {
  const user = await findUserBySubscriptionId(subscription.id);
  
  if (user) {
    const agency = await storage.getAgencyByOwnerId(user.id);
    if (agency) {
      await storage.updateAgency(agency.id, {
        isActive: false,
        subscriptionStatus: 'canceled'
      });
    }
    
    // Clear Stripe data
    await storage.updateUserStripeInfo(user.id, '', '');
  }
}

async function findUserBySubscriptionId(subscriptionId: string): Promise<User | undefined> {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.stripeSubscriptionId, subscriptionId));
  return user;
}
```

---

## 🧪 Testing Guidelines

### Unit Tests

```typescript
// tests/unit/subscription.test.ts
describe('Subscription Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should create new subscription for user', async () => {
    const mockUser = { id: 'user1', email: 'test@test.com' };
    const mockCustomer = { id: 'cus_123' };
    const mockSubscription = {
      id: 'sub_123',
      latest_invoice: {
        payment_intent: { client_secret: 'secret_123' }
      }
    };

    stripe.customers.create.mockResolvedValue(mockCustomer);
    stripe.subscriptions.create.mockResolvedValue(mockSubscription);

    const result = await subscriptionService.createSubscription(mockUser);

    expect(result.subscriptionId).toBe('sub_123');
    expect(result.clientSecret).toBe('secret_123');
    expect(stripe.customers.create).toHaveBeenCalledWith({
      email: 'test@test.com',
      name: ''
    });
  });
});
```

### Integration Tests

```typescript
// tests/integration/payment-flow.test.ts
describe('Payment Flow Integration', () => {
  test('complete user journey', async () => {
    // 1. Pre-register
    const registerResponse = await request(app)
      .post('/api/register/pre')
      .send({ email: 'journey@test.com', password: 'password123' })
      .expect(201);

    // 2. Login
    const loginResponse = await request(app)
      .post('/api/login/local')
      .send({ email: 'journey@test.com', password: 'password123' })
      .expect(200);

    // 3. Create agency
    const agencyResponse = await request(app)
      .post('/api/agencies')
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .send({
        name: 'Test Agency',
        email: 'agency@test.com'
      })
      .expect(201);

    // 4. Create subscription (mocked)
    stripe.customers.create.mockResolvedValue({ id: 'cus_test' });
    stripe.subscriptions.create.mockResolvedValue({
      id: 'sub_test',
      latest_invoice: { payment_intent: { client_secret: 'secret' } }
    });

    const subResponse = await request(app)
      .post('/api/get-or-create-subscription')
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .expect(200);

    expect(subResponse.body.subscriptionId).toBe('sub_test');
  });
});
```

---

## 🔍 Debugging & Monitoring

### Logging Strategy

```typescript
// utils/logger.ts
import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// Usage in payment endpoints
logger.info('Payment attempt', {
  userId: user.id,
  subscriptionId: subscription.id,
  amount: subscription.items.data[0].price.unit_amount,
  currency: subscription.currency,
  timestamp: new Date().toISOString()
});
```

### Monitoring Metrics

```typescript
// monitoring/metrics.ts
export class PaymentMetrics {
  static paymentAttempts = 0;
  static paymentSuccesses = 0;
  static paymentFailures = 0;
  static subscriptionCreations = 0;

  static recordPaymentAttempt() {
    this.paymentAttempts++;
  }

  static recordPaymentSuccess() {
    this.paymentSuccesses++;
  }

  static recordPaymentFailure(error: string) {
    this.paymentFailures++;
    logger.error('Payment failure', { error });
  }

  static getSuccessRate(): number {
    return (this.paymentSuccesses / this.paymentAttempts) * 100;
  }

  static getMetrics() {
    return {
      attempts: this.paymentAttempts,
      successes: this.paymentSuccesses,
      failures: this.paymentFailures,
      successRate: this.getSuccessRate(),
      subscriptions: this.subscriptionCreations
    };
  }
}
```

### Health Checks

```typescript
// routes/health.ts
app.get('/api/health', async (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    checks: {
      database: await checkDatabase(),
      stripe: await checkStripe(),
      redis: await checkRedis()
    }
  };

  const allHealthy = Object.values(health.checks).every(check => check.status === 'ok');
  res.status(allHealthy ? 200 : 503).json(health);
});

async function checkStripe(): Promise<{ status: string }> {
  try {
    await stripe.accounts.retrieve();
    return { status: 'ok' };
  } catch (error) {
    return { status: 'error', error: error.message };
  }
}
```

---

## 📝 Best Practices

### Security

1. **Nunviar exponer claves de Stripe en frontend**
   - Usar variables de entorno
   - Validar server-side

2. **Validar todos los inputs**
   - Schema validation con Zod
   - Sanitización de datos

3. **Implementar rate limiting**
   - Prevención de abuse
   - Protection contra ataques

4. **Usar HTTPS siempre**
   - Certificados SSL
   - HSTS headers

### Performance

1. **Database optimization**
   - Índices apropiados
   - Query optimization
   - Connection pooling

2. **Caching strategy**
   - Redis para sesiones
   - Cache de resultados frecuentes

3. **Async processing**
   - Background jobs
   - Queue system para webhooks

### Reliability

1. **Retry mechanisms**
   - Exponential backoff
   - Circuit breaker pattern

2. **Graceful degradation**
   - Fallbacks cuando Stripe está down
   - Modo offline temporal

3. **Data consistency**
   - Transactions atómicas
   - Reconciliation jobs

---

## 🚀 Deployment Considerations

### Environment Variables

```bash
# Production
NODE_ENV=production
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
VITE_STRIPE_PUBLIC_KEY=pk_live_...
DATABASE_URL=postgresql://...
REDIS_URL=redis://...

# Development
NODE_ENV=development
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
VITE_STRIPE_PUBLIC_KEY=pk_test_...
```

### Database Migrations

```bash
# Run migrations
npm run migrate:up

# Rollback if needed
npm run migrate:down

# Generate new migration
npm run migrate:generate
```

### Monitoring Setup

```typescript
// production-monitoring.ts
if (process.env.NODE_ENV === 'production') {
  // Sentry for error tracking
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: 'production'
  });

  // Application monitoring
  const metrics = require('prom-client');
  const register = new metrics.Registry();
  
  metrics.collectDefaultMetrics({ register });
  
  app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  });
}
```

---

## 📞 Support & Troubleshooting

### Common Issues

1. **"No such subscription" error**
   - Verificar subscription ID en BD
   - Check Stripe dashboard
   - Re-sync de datos

2. **Payment element not loading**
   - Verificar Stripe public key
   - Check CORS settings
   - Validate client secret

3. **Webhook not triggering**
   - Verificar endpoint URL
   - Check webhook secret
   - Review Stripe logs

### Debug Commands

```bash
# Check database state
psql $DATABASE_URL -c "SELECT * FROM users WHERE email='test@test.com';"

# Verify Stripe subscription
stripe subscriptions retrieve sub_xxx

# Test webhook
stripe trigger invoice.payment_succeeded --stripe-account=acct_xxx

# Check logs
tail -f /var/log/app/error.log
```

### Contact Information

- **Tech Lead**: tech@buscoinmuebles.click
- **Emergency Support**: emergencies@buscoinmuebles.click
- **Documentation**: https://docs.buscoinmuebles.click