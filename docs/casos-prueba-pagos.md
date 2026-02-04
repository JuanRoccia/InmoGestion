# Casos de Prueba Específicos - Flujo de Pagos Stripe

## 🎯 Test Cases por Componente

### 1. Pre-registro de Usuario

#### **TC-001: Pre-registro Exitoso**
```typescript
describe('TC-001: Pre-registro Exitoso', () => {
  test('debe crear usuario con status pre-registered', async () => {
    const userData = {
      email: 'newuser@test.com',
      password: 'password123'
    };

    const response = await request(app)
      .post('/api/register/pre')
      .send(userData);

    // Assertions
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.user.email).toBe(userData.email);
    expect(response.body.user.registrationStatus).toBe('pre-registered');
    expect(response.body.user.password).toBeUndefined(); // No exponer password
    
    // Verify DB state
    const dbUser = await storage.getUserByEmail(userData.email);
    expect(dbUser.registrationStatus).toBe('pre-registered');
    expect(dbUser.password).not.toBe(userData.password); // Hashed
  });
});
```

#### **TC-002: Email Duplicado**
```typescript
describe('TC-002: Email Duplicado', () => {
  test('debe rechazar pre-registro con email existente', async () => {
    // Crear usuario existente
    await storage.upsertUser({
      email: 'existing@test.com',
      password: 'hashed',
      registrationStatus: 'pre-registered'
    });

    const response = await request(app)
      .post('/api/register/pre')
      .send({
        email: 'existing@test.com',
        password: 'password123'
      });

    expect(response.status).toBe(409);
    expect(response.body.message).toContain('email ya está registrado');
  });
});
```

#### **TC-003: Validación de Password**
```typescript
describe('TC-003: Validación de Password', () => {
  test.each([
    { password: '123', expected: 'La contraseña debe tener al menos 6 caracteres' },
    { password: '', expected: 'La contraseña es requerida' },
    { password: '   ', expected: 'La contraseña es requerida' }
  ])('debe rechazar password: $password', async ({ password, expected }) => {
    const response = await request(app)
      .post('/api/register/pre')
      .send({
        email: 'test@test.com',
        password
      });

    expect(response.status).toBe(400);
    expect(response.body.errors).toContain(
      expect.objectContaining({
        message: expected
      })
    );
  });
});
```

---

### 2. Creación de Agencia

#### **TC-004: Creación de Agencia Exitosa**
```typescript
describe('TC-004: Creación de Agencia Exitosa', () => {
  test('debe crear agencia con modo restringido', async () => {
    // Setup user con sesión
    const user = await createTestUser({ registrationStatus: 'pre-registered' });
    const token = generateTestToken(user.id);

    const agencyData = {
      name: 'Test Inmobiliaria',
      email: 'contact@testinmo.com',
      phone: '2914567890',
      address: 'Calle 123, Bahía Blanca'
    };

    const response = await request(app)
      .post('/api/agencies')
      .set('Authorization', `Bearer ${token}`)
      .send(agencyData);

    expect(response.status).toBe(201);
    expect(response.body.name).toBe(agencyData.name);
    expect(response.body.isActive).toBe(false);
    expect(response.body.subscriptionStatus).toBe('pending');
    expect(response.body.ownerId).toBe(user.id);

    // Verificar relación
    const userAgency = await storage.getAgencyByOwnerId(user.id);
    expect(userAgency.name).toBe(agencyData.name);
  });
});
```

#### **TC-005: Permisos Insuficientes**
```typescript
describe('TC-005: Permisos Insuficientes', () => {
  test('debe rechazar creación sin autenticación', async () => {
    const response = await request(app)
      .post('/api/agencies')
      .send({
        name: 'Test Agency',
        email: 'test@test.com'
      });

    expect(response.status).toBe(401);
  });

  test('debe rechazar creación con email duplicado', async () => {
    // Crear agencia existente
    await storage.createAgency({
      name: 'Existing Agency',
      email: 'existing@test.com',
      ownerId: 'user1'
    });

    const response = await request(app)
      .post('/api/agencies')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'New Agency',
        email: 'existing@test.com'
      });

    expect(response.status).toBe(400);
    expect(response.body.errors).toContain(
      expect.objectContaining({
        message: expect.stringContaining('email')
      })
    );
  });
});
```

---

### 3. Proceso de Suscripción

#### **TC-006: Creación de Nueva Suscripción**
```typescript
describe('TC-006: Creación de Nueva Suscripción', () => {
  test('debe crear customer y subscription en Stripe', async () => {
    // Mock Stripe responses
    const mockCustomer = { id: 'cus_test123' };
    const mockSubscription = {
      id: 'sub_test123',
      latest_invoice: {
        payment_intent: {
          client_secret: 'pi_test_secret'
        }
      }
    };

    stripe.customers.create.mockResolvedValue(mockCustomer);
    stripe.subscriptions.create.mockResolvedValue(mockSubscription);

    const user = await createTestUser({ 
      registrationStatus: 'pre-registered',
      email: 'test@test.com'
    });
    const token = generateTestToken(user.id);

    const response = await request(app)
      .post('/api/get-or-create-subscription')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.subscriptionId).toBe('sub_test123');
    expect(response.body.clientSecret).toBe('pi_test_secret');

    // Verificar llamadas a Stripe
    expect(stripe.customers.create).toHaveBeenCalledWith({
      email: 'test@test.com',
      name: ' '
    });

    expect(stripe.subscriptions.create).toHaveBeenCalledWith({
      customer: 'cus_test123',
      items: [{
        price: process.env.STRIPE_PRICE_ID
      }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent']
    });

    // Verificar actualización en BD
    const updatedUser = await storage.getUser(user.id);
    expect(updatedUser.stripeCustomerId).toBe('cus_test123');
    expect(updatedUser.stripeSubscriptionId).toBe('sub_test123');
    expect(updatedUser.registrationStatus).toBe('completed');
  });
});
```

#### **TC-007: Recuperación de Suscripción Existente**
```typescript
describe('TC-007: Recuperación de Suscripción Existente', () => {
  test('debe recuperar subscription existente sin crear nueva', async () => {
    const mockSubscription = {
      id: 'sub_existing',
      latest_invoice: {
        payment_intent: {
          client_secret: 'pi_existing_secret'
        }
      }
    };

    stripe.subscriptions.retrieve.mockResolvedValue(mockSubscription);

    const user = await createTestUser({
      stripeCustomerId: 'cus_existing',
      stripeSubscriptionId: 'sub_existing',
      registrationStatus: 'completed'
    });
    const token = generateTestToken(user.id);

    const response = await request(app)
      .post('/api/get-or-create-subscription')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.subscriptionId).toBe('sub_existing');

    // Verificar que no se creó nuevo customer
    expect(stripe.customers.create).not.toHaveBeenCalled();
    expect(stripe.subscriptions.create).not.toHaveBeenCalled();

    // Verificar que se llamó retrieve
    expect(stripe.subscriptions.retrieve).toHaveBeenCalledWith('sub_existing', {
      expand: ['latest_invoice.payment_intent']
    });
  });
});
```

#### **TC-008: Verificación de Suscripción Activa**
```typescript
describe('TC-008: Verificación de Suscripción Activa', () => {
  test('debe activar agencia cuando subscription está active', async () => {
    // Setup
    const user = await createTestUser({
      stripeSubscriptionId: 'sub_active_test'
    });
    const agency = await storage.createAgency({
      name: 'Test Agency',
      email: 'test@test.com',
      ownerId: user.id,
      isActive: false,
      subscriptionStatus: 'pending'
    });
    const token = generateTestToken(user.id);

    // Mock Stripe response
    stripe.subscriptions.retrieve.mockResolvedValue({
      id: 'sub_active_test',
      status: 'active'
    });

    const response = await request(app)
      .post('/api/agencies/verify-subscription')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.isActive).toBe(true);
    expect(response.body.subscriptionStatus).toBe('active');

    // Verificar estado en BD
    const updatedAgency = await storage.getAgency(agency.id);
    expect(updatedAgency.isActive).toBe(true);
    expect(updatedAgency.subscriptionStatus).toBe('active');
  });

  test('debe mantener agencia inactiva cuando subscription no está active', async () => {
    const user = await createTestUser({
      stripeSubscriptionId: 'sub_inactive_test'
    });
    const agency = await storage.createAgency({
      name: 'Test Agency',
      email: 'test@test.com',
      ownerId: user.id,
      isActive: false,
      subscriptionStatus: 'pending'
    });
    const token = generateTestToken(user.id);

    stripe.subscriptions.retrieve.mockResolvedValue({
      id: 'sub_inactive_test',
      status: 'incomplete'
    });

    const response = await request(app)
      .post('/api/agencies/verify-subscription')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toContain('not active yet');
    expect(response.body.status).toBe('incomplete');

    // Verificar que no se activó
    const unchangedAgency = await storage.getAgency(agency.id);
    expect(unchangedAgency.isActive).toBe(false);
  });
});
```

---

### 4. Manejo de Errores y Edge Cases

#### **TC-009: Error de Tarjeta Declinada**
```typescript
describe('TC-009: Error de Tarjeta Declinada', () => {
  test('debe manejar card_error correctamente', async () => {
    const user = await createTestUser({
      stripeCustomerId: 'cus_test',
      stripeSubscriptionId: 'sub_test'
    });

    // Mock Stripe con error
    stripe.subscriptions.retrieve.mockResolvedValue({
      id: 'sub_test',
      latest_invoice: {
        payment_intent: {
          client_secret: 'pi_test_secret'
        }
      }
    });

    const mockError = {
      type: 'card_error',
      message: 'Your card was declined.',
      code: 'card_declined'
    };

    // Mock confirmPayment para devolver error
    const mockStripe = {
      confirmPayment: jest.fn().mockResolvedValue({ error: mockError })
    };

    // Simular componente React
    const { result } = renderHook(() => useStripePayment(), {
      wrapper: ({ children }) => (
        <StripeContext.Provider value={{ stripe: mockStripe, elements: {} }}>
          {children}
        </StripeContext.Provider>
      )
    });

    await act(async () => {
      await result.current.handlePayment();
    });

    expect(mockStripe.confirmPayment).toHaveBeenCalled();
    // Verificar que se muestra error al usuario (dependerá de implementación)
  });
});
```

#### **TC-010: Timeout de Conexión**
```typescript
describe('TC-010: Timeout de Conexión', () => {
  test('debe manejar timeout en llamadas a Stripe', async () => {
    // Mock Stripe para que nunca responda
    stripe.subscriptions.create.mockImplementation(() => 
      new Promise(resolve => setTimeout(resolve, 35000))
    );

    const user = await createTestUser();
    const token = generateTestToken(user.id);

    const startTime = Date.now();
    const response = await request(app)
      .post('/api/get-or-create-subscription')
      .set('Authorization', `Bearer ${token}`)
      .timeout(30000); // 30s timeout

    const endTime = Date.now();
    const duration = endTime - startTime;

    expect(duration).toBeLessThan(32000); // Considerando overhead
    expect(response.status).toBe(504); // Gateway timeout
  });
});
```

#### **TC-011: Suscripción Huérfana**
```typescript
describe('TC-011: Suscripción Huérfana', () => {
  test('debe manejar subscription que no existe en Stripe', async () => {
    const user = await createTestUser({
      stripeSubscriptionId: 'sub_nonexistent'
    });
    const token = generateTestToken(user.id);

    // Mock Stripe para devolver error de not found
    stripe.subscriptions.retrieve.mockRejectedValue(
      new Error('No such subscription: sub_nonexistent')
    );

    const response = await request(app)
      .post('/api/agencies/verify-subscription')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(500);
    expect(response.body.message).toContain('Failed to verify subscription');
  });
});
```

---

### 5. Pruebas de Integración Completa

#### **TC-012: Flujo Completo Exitoso**
```typescript
describe('TC-012: Flujo Completo Exitoso', () => {
  test('debe completar todo el journey: pre-registro → agencia → suscripción activa', async () => {
    // Step 1: Pre-registro
    const registerResponse = await request(app)
      .post('/api/register/pre')
      .send({
        email: 'fulljourney@test.com',
        password: 'password123'
      });

    expect(registerResponse.status).toBe(201);
    const userId = registerResponse.body.user.id;

    // Step 2: Login
    const loginResponse = await request(app)
      .post('/api/login/local')
      .send({
        email: 'fulljourney@test.com',
        password: 'password123'
      });

    expect(loginResponse.status).toBe(200);
    const token = loginResponse.body.token;

    // Step 3: Crear agencia
    const agencyResponse = await request(app)
      .post('/api/agencies')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Full Journey Agency',
        email: 'contact@fulljourney.com',
        phone: '2914567890',
        address: 'Test Address 123'
      });

    expect(agencyResponse.status).toBe(201);
    const agencyId = agencyResponse.body.id;

    // Step 4: Crear suscripción (mock Stripe)
    const mockCustomer = { id: 'cus_fulljourney' };
    const mockSubscription = {
      id: 'sub_fulljourney',
      status: 'active',
      latest_invoice: {
        payment_intent: {
          client_secret: 'pi_fulljourney_secret'
        }
      }
    };

    stripe.customers.create.mockResolvedValue(mockCustomer);
    stripe.subscriptions.create.mockResolvedValue(mockSubscription);

    const subResponse = await request(app)
      .post('/api/get-or-create-subscription')
      .set('Authorization', `Bearer ${token}`);

    expect(subResponse.status).toBe(200);

    // Step 5: Verificar activación
    stripe.subscriptions.retrieve.mockResolvedValue(mockSubscription);

    const verifyResponse = await request(app)
      .post('/api/agencies/verify-subscription')
      .set('Authorization', `Bearer ${token}`);

    expect(verifyResponse.status).toBe(200);
    expect(verifyResponse.body.isActive).toBe(true);

    // Final verification en BD
    const user = await storage.getUser(userId);
    const agency = await storage.getAgency(agencyId);

    expect(user.registrationStatus).toBe('completed');
    expect(user.stripeCustomerId).toBe('cus_fulljourney');
    expect(user.stripeSubscriptionId).toBe('sub_fulljourney');
    expect(agency.isActive).toBe(true);
    expect(agency.subscriptionStatus).toBe('active');
  });
});
```

---

### 6. Pruebas de Componentes Frontend

#### **TC-013: SubscribeForm Component**
```typescript
describe('TC-013: SubscribeForm Component', () => {
  test('debe mostrar formulario de pago correctamente', () => {
    const selectedPlan = {
      id: 'professional',
      name: 'Plan Profesional',
      price: 79
    };

    render(
      <Elements stripe={stripePromise} options={{ clientSecret: 'test_secret' }}>
        <SubscribeForm selectedPlan={selectedPlan} />
      </Elements>
    );

    expect(screen.getByText(/Plan seleccionado: Plan Profesional/)).toBeInTheDocument();
    expect(screen.getByText(/\$79\/mes/)).toBeInTheDocument();
    expect(screen.getByTestId('submit-payment')).toBeInTheDocument();
  });

  test('debe deshabilitar botón durante procesamiento', async () => {
    const selectedPlan = { id: 'professional', price: 79 };
    
    render(
      <Elements stripe={stripePromise} options={{ clientSecret: 'test_secret' }}>
        <SubscribeForm selectedPlan={selectedPlan} />
      </Elements>
    );

    const submitButton = screen.getByTestId('submit-payment');
    const form = screen.getByRole('form');

    fireEvent.submit(form);

    expect(submitButton).toBeDisabled();
    expect(screen.getByText(/Procesando.../)).toBeInTheDocument();
  });
});
```

#### **TC-014: AgencyDashboard Component**
```typescript
describe('TC-014: AgencyDashboard Component', () => {
  test('debe mostrar modo restringido cuando subscription no está active', async () => {
    const mockUser = { id: '1', registrationStatus: 'completed' };
    const mockAgency = { 
      id: 'agency1', 
      subscriptionStatus: 'pending',
      isActive: false 
    };

    jest.spyOn(require('@/hooks/useAuth'), 'useAuth').mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false
    });

    jest.spyOn(require('@tanstack/react-query'), 'useQuery')
      .mockReturnValueOnce({ data: [mockAgency] }) // agencies query
      .mockReturnValueOnce({ data: [] }); // properties query

    render(<AgencyDashboard />);

    expect(screen.getByText(/Modo Vista Previa/)).toBeInTheDocument();
    expect(screen.getByText(/Tu agencia está pendiente de activación/)).toBeInTheDocument();
    expect(screen.getByText(/Activar Suscripción/)).toBeInTheDocument();
  });

  test('no debe mostrar modo restringido cuando subscription está active', async () => {
    const mockUser = { id: '1', registrationStatus: 'completed' };
    const mockAgency = { 
      id: 'agency1', 
      subscriptionStatus: 'active',
      isActive: true 
    };

    jest.spyOn(require('@/hooks/useAuth'), 'useAuth').mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false
    });

    jest.spyOn(require('@tanstack/react-query'), 'useQuery')
      .mockReturnValueOnce({ data: [mockAgency] })
      .mockReturnValueOnce({ data: [] });

    render(<AgencyDashboard />);

    expect(screen.queryByText(/Modo Vista Previa/)).not.toBeInTheDocument();
  });
});
```

---

## 📋 Checklist de Testing

### Pruebas Funcionales
- [ ] TC-001: Pre-registro exitoso
- [ ] TC-002: Email duplicado
- [ ] TC-003: Validación de password
- [ ] TC-004: Creación de agencia exitosa
- [ ] TC-005: Permisos insuficientes
- [ ] TC-006: Creación de nueva suscripción
- [ ] TC-007: Recuperación de suscripción existente
- [ ] TC-008: Verificación de suscripción activa
- [ ] TC-009: Error de tarjeta declinada
- [ ] TC-010: Timeout de conexión
- [ ] TC-011: Suscripción huérfana
- [ ] TC-012: Flujo completo exitoso

### Pruebas de UI/UX
- [ ] TC-013: SubscribeForm component
- [ ] TC-014: AgencyDashboard component
- [ ] Pruebas de responsive design
- [ ] Pruebas de accesibilidad
- [ ] Pruebas de navegación

### Pruebas de Performance
- [ ] Load testing: 100 usuarios concurrentes
- [ ] Stress testing: picos de tráfico
- [ ] Memory leak testing
- [ ] Database performance under load

### Pruebas de Seguridad
- [ ] SQL injection prevention
- [ ] XSS prevention
- [ ] CSRF token validation
- [ ] Rate limiting
- [ ] Data encryption at rest

### Pruebas de Compatibilidad
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile devices
- [ ] Screen readers