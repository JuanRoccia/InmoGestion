# Flujo de Pagos Stripe - Análisis Completo

## 1. Journey del Usuario - Mapeo Completo

### 🎯 **Fase 1: Pre-registro (Acceso Básico)**

#### **Estado Inicial**
- **Usuario**: No autenticado
- **Acceso**: Ninguno
- **Estado BD**: `registrationStatus: null`

#### **Flujo de Pre-registro**
```
1. Landing Page → Click "Acceder"
2. Modal Auth → Tab "Registrarse"
3. Formulario: email + password (mínimo 6 chars)
4. POST /api/register/pre
   - Validación: Zod schema
   - Verificación: email único
   - Hash password bcrypt
   - Crear usuario: registrationStatus: 'pre-registered'
5. Auto-login POST /api/login/local
6. ✅ Estado: Pre-registrado con acceso básico
```

#### **Puntos de Fricción**
- **Validación email**: Errores de formato o duplicados
- **Password hashing**: Timeout en registros masivos
- **Auto-login**: Fallo de sincronización de sesión

#### **Estados Transicionales**
- `pre-registered` → Puede explorar, no puede crear agencia
- `completed` → Acceso completo
- `failed` → Requiere intervención manual

---

### 🏢 **Fase 2: Creación de Agencia (Modo Restringido)**

#### **Precondiciones**
- ✅ Usuario autenticado
- ✅ `registrationStatus: 'pre-registered'`
- ❌ Sin agencia asociada

#### **Flujo de Creación**
```
1. Dashboard → "Crear Primera Propiedad"
2. Alert: "Acceso Restringido" → Redirección a registro
3. Formulario Agencia: name, email, phone, address, description
4. POST /api/agencies
   - Validación: insertAgencySchema
   - Creación: isActive: false, subscriptionStatus: 'pending'
5. Redirección: /subscribe
6. ✅ Estado: Agencia creada, modo restringido
```

#### **Puntos de Fricción**
- **Validación**: Email duplicado (error 409)
- **Permisos**: Usuario sin agency creation
- **Sincronización**: Retraso en actualización de UI

#### **Estados de Agencia**
- `pending` → Esperando suscripción
- `active` → Suscripción activa
- `inactive` → Suscripción cancelada/expirada

---

### 💳 **Fase 3: Proceso de Suscripción (Activación)**

#### **Endpoints Clave**
```typescript
POST /api/get-or-create-subscription
- Verifica: user.stripeSubscriptionId
- Si existe: retrieve subscription actual
- Si no existe: 
  1. Crear customer en Stripe
  2. Crear subscription con payment_behavior: 'default_incomplete'
  3. Actualizar BD: stripeCustomerId, stripeSubscriptionId
```

#### **Flujo de Pago**
```
1. Selección de plan (default: professional)
2. POST /api/get-or-create-subscription → clientSecret
3. Stripe Elements: PaymentElement
4. confirmPayment()
   - Success: return_url = /subscribe?payment_success=true
   - Error: manejo local
5. Webhook (si existe) → Verificación final
6. POST /api/agencies/verify-subscription
   - Check: subscription.status === 'active'
   - Update: agency.isActive = true
7. ✅ Estado: Suscripción activa
```

#### **Estados Intermedios**
- `incomplete` → Esperando confirmación de pago
- `trialing` → Período de prueba
- `active` → Pagando activamente
- `past_due` → Pago atrasado
- `canceled` → Cancelada
- `unpaid` → No pagada

---

## 2. Edge Cases - Escenarios Críticos

### 🔴 **Casos de Falla Críticos**

#### **1. Usuario Cierra Ventana de Pago**
```typescript
// Escenario: Usuario en medio del pago cierra ventana
Estado: subscription creada en Stripe con status 'incomplete'
Usuario: sin clientSecret guardado localmente
Riesgo: Suscripción huérfana

Manejo:
- Recuperar subscription existente en /api/get-or-create-subscription
- Timeout: 30 min para completar pago
- Cleanup: Cron job para limpiar incomplete > 24h
```

#### **2. Pago Fallido (Card Declined)**
```typescript
// Response handling
if (error.type === 'card_error') {
  // Mostrar error específico al usuario
  toast({ title: "Tarjeta rechazada", description: error.message });
} else if (error.type === 'validation_error') {
  // Error de validación de Stripe
  toast({ title: "Error de validación", description: error.message });
}

// Estado en Stripe: subscription.status = 'incomplete'
// Acción: Permitir reintento con nueva tarjeta
```

#### **3. Timeout de Conexión**
```typescript
// Escenario: Pérdida de conexión durante confirmPayment
Estado local: isProcessing = true
Estado Stripe: payment_intent.processing

Manejo:
- Loading timeout: 30s max
- Refresh con verification: /api/agencies/verify-subscription
- Fallback: Mostrar "Procesando, verificando..."
```

#### **4. Doble Submit/Pago Duplicado**
```typescript
// Escenario: Usuario click múltiple veces
Prevención:
- Deshabilitar botón: disabled={isProcessing || !stripe}
- Stripe automatically handles duplicate payment_intents
- Idempotency key en webhook handler
```

#### **5. Webhook no Recibido**
```typescript
// Escenario: Webhook de Stripe no llega
Fallback:
- Verificación manual: POST /api/agencies/verify-subscription
- Polling: Cada 5s por 2 min después de payment_success
- Manual override: Admin panel para activación manual
```

---

### 🟡 **Casos de Manejo de Estados**

#### **1. Usuario con Suscripción Expirada**
```typescript
// Detection: subscription.status = 'past_due'
Action:
- Banner en dashboard: "Renovar suscripción"
- Bloquear creación de propiedades nuevas
- Permitir ver/editar existentes (grace period)
- Auto-cancel después de 7 días past_due
```

#### **2. Upgrade/Downgrade de Plan**
```typescript
// Current: No implementado (FUTURE)
Escenario:
- Usuario quiere cambiar de plan
- Proration: Stripe calcula diferencia
- Inmediato o al siguiente billing cycle
```

#### **3. Múltiples Intentos Fallidos**
```typescript
// Policy: Después de 3 intentos fallidos
Action:
- Temporarily block payment attempts: 15 min
- Suggest alternative payment method
- Email support: multiple_failed_attempts@company.com
```

---

## 3. Testing Scenarios - Casos de Prueba

### 🧪 **Unit Tests**

#### **1. API Endpoints**
```typescript
// POST /api/register/pre
describe('Pre-registration', () => {
  test('debe crear usuario con status pre-registered', async () => {
    const response = await request(app)
      .post('/api/register/pre')
      .send({ email: 'test@test.com', password: 'password123' });
    
    expect(response.status).toBe(201);
    expect(response.body.user.registrationStatus).toBe('pre-registered');
  });

  test('debe rechazar email duplicado', async () => {
    // Create user first
    await storage.upsertUser({
      email: 'duplicate@test.com',
      password: 'hashed',
      registrationStatus: 'pre-registered'
    });

    const response = await request(app)
      .post('/api/register/pre')
      .send({ email: 'duplicate@test.com', password: 'password123' });
    
    expect(response.status).toBe(409);
  });
});

// POST /api/get-or-create-subscription
describe('Subscription Creation', () => {
  test('debe crear nueva subscription si no existe', async () => {
    // Mock Stripe calls
    stripe.customers.create.mockResolvedValue({ id: 'cus_test' });
    stripe.subscriptions.create.mockResolvedValue({
      id: 'sub_test',
      latest_invoice: { payment_intent: { client_secret: 'secret_test' } }
    });

    const response = await request(app)
      .post('/api/get-or-create-subscription')
      .set('Authorization', 'Bearer valid_token');
    
    expect(response.body.subscriptionId).toBe('sub_test');
    expect(response.body.clientSecret).toBe('secret_test');
  });
});
```

#### **2. Component Tests**
```typescript
// SubscribeForm Component
describe('SubscribeForm', () => {
  test('debe deshabilitar botón durante procesamiento', async () => {
    render(<SubscribeForm selectedPlan={mockPlan} />);
    
    const submitButton = screen.getByTestId('submit-payment');
    fireEvent.click(submitButton);
    
    expect(submitButton).toBeDisabled();
    expect(screen.getByText(/Procesando.../)).toBeInTheDocument();
  });

  test('debe mostrar error de pago', async () => {
    const mockStripe = {
      confirmPayment: jest.fn().mockResolvedValue({
        error: { message: 'Card declined' }
      })
    };

    render(<SubscribeForm selectedPlan={mockPlan} />);
    fireEvent.submit(screen.getByRole('form'));
    
    await waitFor(() => {
      expect(screen.getByText(/Card declined/)).toBeInTheDocument();
    });
  });
});
```

---

### 🔄 **Integration Tests**

#### **1. Flujo Completo de Usuario**
```typescript
describe('User Journey: Pre-registro → Suscripción Activa', () => {
  test('flujo completo exitoso', async () => {
    // 1. Pre-registro
    const registerResponse = await request(app)
      .post('/api/register/pre')
      .send({ email: 'fulljourney@test.com', password: 'password123' });
    
    expect(registerResponse.status).toBe(201);

    // 2. Login
    const loginResponse = await request(app)
      .post('/api/login/local')
      .send({ email: 'fulljourney@test.com', password: 'password123' });
    
    expect(loginResponse.status).toBe(200);

    // 3. Crear agencia
    const agencyResponse = await request(app)
      .post('/api/agencies')
      .set('Authorization', 'Bearer valid_token')
      .send({
        name: 'Test Agency',
        email: 'agency@test.com',
        phone: '123456789',
        address: 'Test Address'
      });
    
    expect(agencyResponse.status).toBe(201);

    // 4. Crear suscripción (mock)
    const subscriptionResponse = await request(app)
      .post('/api/get-or-create-subscription')
      .set('Authorization', 'Bearer valid_token');
    
    expect(subscriptionResponse.status).toBe(200);

    // 5. Verificar suscripción activa
    const verifyResponse = await request(app)
      .post('/api/agencies/verify-subscription')
      .set('Authorization', 'Bearer valid_token');
    
    expect(verifyResponse.body.subscriptionStatus).toBe('active');
  });
});
```

#### **2. Edge Cases Integration**
```typescript
describe('Edge Cases Integration', () => {
  test('manejo de subscription huérfana', async () => {
    // Crear subscription en BD sin customer en Stripe
    await storage.updateUserStripeInfo(userId, 'nonexistent_customer', 'sub_test');
    
    const response = await request(app)
      .post('/api/agencies/verify-subscription')
      .set('Authorization', 'Bearer valid_token');
    
    expect(response.status).toBe(400);
    expect(response.body.message).toContain('No active subscription');
  });

  test('timeout en procesamiento de pago', async () => {
    // Mock Stripe para que no responda
    stripe.subscriptions.retrieve.mockImplementation(() => 
      new Promise(resolve => setTimeout(resolve, 35000))
    );

    const startTime = Date.now();
    const response = await request(app)
      .post('/api/get-or-create-subscription')
      .set('Authorization', 'Bearer valid_token');
    
    const endTime = Date.now();
    expect(endTime - startTime).toBeLessThan(32000); // Timeout handling
  });
});
```

---

### 🎭 **E2E Tests (Playwright/Cypress)**

#### **1. Flujo de Usuario Real**
```typescript
test('usuario completo: registro → dashboard → suscripción', async ({ page }) => {
  // 1. Visitar landing
  await page.goto('/');
  
  // 2. Click en "Acceder"
  await page.click('[data-testid="button-auth"]');
  
  // 3. Completar registro
  await page.fill('[data-testid="input-register-email"]', 'e2e@test.com');
  await page.fill('[data-testid="input-register-password"]', 'password123');
  await page.click('[data-testid="button-register"]');
  
  // 4. Verificar redirección al dashboard
  await page.waitForURL('/agency-dashboard');
  
  // 5. Verificar mensaje de modo restringido
  await expect(page.locator('text=Modo Vista Previa')).toBeVisible();
  
  // 6. Click en "Activar Suscripción"
  await page.click('text=Activar Suscripción');
  
  // 7. Seleccionar plan y continuar
  await page.click('[data-testid="continue-to-payment"]');
  
  // 8. Completar pago (mock de Stripe)
  await page.fill('[data-testid="card-number"]', '4242424242424242');
  await page.fill('[data-testid="card-expiry"]', '12/25');
  await page.fill('[data-testid="card-cvc"]', '123');
  await page.click('[data-testid="submit-payment"]');
  
  // 9. Verificar éxito
  await expect(page.locator('text=¡Registro completado!')).toBeVisible();
  await page.waitForURL('/agency-dashboard');
  
  // 10. Verificar que no hay mensaje de restricción
  await expect(page.locator('text=Modo Vista Previa')).not.toBeVisible();
});
```

#### **2. Edge Cases E2E**
```typescript
test('manejo de error de tarjeta rechazada', async ({ page }) => {
  // Setup: Usuario pre-registrado con agencia
  await loginUser(page, 'test@test.com');
  await page.goto('/subscribe');
  
  // Mock Stripe para devolver error
  await page.route('**/api/get-or-create-subscription', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        clientSecret: 'pi_test_secret',
        subscriptionId: 'sub_test'
      })
    });
  });
  
  await page.click('[data-testid="continue-to-payment"]');
  
  // Simular error de tarjeta
  await page.evaluate(() => {
    window.stripe = {
      confirmPayment: () => Promise.resolve({
        error: { type: 'card_error', message: 'Your card was declined.' }
      })
    };
  });
  
  await page.click('[data-testid="submit-payment"]');
  
  // Verificar manejo de error
  await expect(page.locator('text=Your card was declined')).toBeVisible();
  await expect(page.locator('[data-testid="submit-payment"]')).not.toBeDisabled();
});
```

---

## 4. Problemas Actuales - Debugging & Testing

### 🔍 **Issues Identificados**

#### **1. Sincronización de Estados**
```typescript
// Problema: Retraso entre Stripe y BD
// Ubicación: /api/agencies/verify-subscription

// Current Issue:
const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
if (subscription.status === 'active') {
  // Update agency
} else {
  // Return "not active yet" pero no se reintentará automáticamente
}

// Solución Propuesta:
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

async function verifySubscriptionWithRetry(userId, retries = 0) {
  const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
  
  if (subscription.status === 'active') {
    return await activateAgency(userId);
  } else if (subscription.status === 'incomplete' && retries < MAX_RETRIES) {
    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
    return verifySubscriptionWithRetry(userId, retries + 1);
  }
  
  throw new Error('Subscription not active after retries');
}
```

#### **2. Manejo de Webhooks**
```typescript
// Problema: No hay webhook handler
// Riesgo: Pagos exitosos no activan agencias si no hay verificación manual

// Missing Endpoint:
app.post('/api/stripe/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  switch (event.type) {
    case 'invoice.payment_succeeded':
      await handleSuccessfulPayment(event.data.object);
      break;
    case 'invoice.payment_failed':
      await handleFailedPayment(event.data.object);
      break;
    case 'customer.subscription.deleted':
      await handleSubscriptionCanceled(event.data.object);
      break;
  }
  
  res.json({ received: true });
});
```

#### **3. Validación de Frontend vs Backend**
```typescript
// Problema: Plans definidos en frontend sin validación backend
// Ubicación: /subscribe.tsx line 21-55

// Current: Frontend defines plans
const plans = [
  { id: "basic", price: 29 },
  { id: "professional", price: 79 },
  { id: "enterprise", price: 149 }
];

// Backend: Hardcoded price ID
price: process.env.STRIPE_PRICE_ID || 'price_1234567890'

// Solución: Validación de precios
const VALID_PLANS = {
  basic: { price: 29, stripePriceId: 'price_basic_123' },
  professional: { price: 79, stripePriceId: 'price_pro_123' },
  enterprise: { price: 149, stripePriceId: 'price_enterprise_123' }
};

// En POST /api/get-or-create-subscription:
const selectedPlan = req.body.planId || 'professional';
if (!VALID_PLANS[selectedPlan]) {
  return res.status(400).json({ error: 'Invalid plan selected' });
}
```

#### **4. Error Handling Inconsistente**
```typescript
// Problema: Different error handling patterns

// Pattern 1: Try-catch con toast
try {
  // API call
} catch (error: any) {
  toast({ title: "Error", description: error.message });
}

// Pattern 2: Direct error response
if (!response.ok) {
  throw new Error(data.message || 'Error genérico');
}

// Solución: Error handling estandarizado
class APIError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message);
  }
}

// Uso consistente en todos los endpoints
```

---

### 🧰 **Herramientas de Debugging**

#### **1. Logging Estructurado**
```typescript
// Implementar structured logging
import winston from 'winston';

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'payments.log' }),
    new winston.transports.Console()
  ]
});

// En cada endpoint clave
logger.info('Payment attempt', {
  userId: user.id,
  subscriptionId: subscription.id,
  status: subscription.status,
  timestamp: new Date().toISOString()
});
```

#### **2. Monitoring y Alertas**
```typescript
// Métricas importantes para monitorear
const metrics = {
  // Payment成功率
  paymentSuccessRate: (successCount / totalCount) * 100,
  
  // Tiempo promedio de activación
  avgActivationTime: totalActivationTime / activationCount,
  
  // Tasa de abandonos en checkout
  checkoutAbandonmentRate: (abandonedCount / initiatedCount) * 100,
  
  // Subscriptions huérfanas
  orphanedSubscriptions: await countOrphanedSubscriptions(),
};

// Alertas
if (metrics.paymentSuccessRate < 95) {
  alertAdmin('Low payment success rate detected');
}
```

---

## 5. Recomendaciones de Mejora

### 🚀 **Mejoras Críticas (Inmediato)**

1. **Implementar Webhook Handler**
   - Endpoint para recibir eventos de Stripe
   - Manejo de `invoice.payment_succeeded` y `invoice.payment_failed`
   - Logging de todos los eventos

2. **Retry Logic en Verificación**
   - Implementar reintentos automáticos
   - Exponential backoff
   - Timeout máximo de 5 minutos

3. **Estado Consistente**
   - Sincronizar estados entre Stripe y BD
   - Background jobs para reconciliación
   - Health checks periódicos

### 🔄 **Mejoras de Flujo (Corto Plazo)**

1. **Grace Period Management**
   - Permitir acceso limitado después de expiración
   - Notificaciones de renovación
   - Reactivación automática al pago exitoso

2. **Plan Management**
   - Soporte para upgrades/downgrades
   - Prorrateo automático
   - Historial de cambios

3. **Error Recovery**
   - Recuperación de pagos interrumpidos
   - Estado de pago persistente
   - Auto-retry con backoff

### 📊 **Mejoras de Monitoring (Largo Plazo)**

1. **Dashboard de Pagos**
   - Métricas en tiempo real
   - Alertas automáticas
   - Reportes de tendencias

2. **A/B Testing**
   - Optimización de flujo de checkout
   - Testing de diferentes planes
   - Análisis de conversion

3. **Analytics de Comportamiento**
   - Funnel analysis
   - Drop-off points
   - User journey mapping