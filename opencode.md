# BuscoInmueble.click - Análisis Completo del Codebase

## 📋 Resumen Ejecutivo

BuscoInmueble.click es una plataforma SaaS multi-tenant inmobiliaria diseñada para el mercado argentino, específicamente enfocada en la región de Bahía Blanca. La plataforma conecta agencias inmobiliarias, constructoras y buscadores de propiedades mediante una interfaz moderna y funcionalidades completas.

---

## 🏗️ Arquitectura del Sistema

### Patrón Arquitectónico
**Aplicación Monolítica Full-Stack** con clara separación de capas:

1. **Capa Frontend**: SPA (Single Page Application) con React y routing cliente
2. **Capa API**: RESTful APIs con Express.js
3. **Capa de Datos**: PostgreSQL con Drizzle ORM
4. **Capa de Autenticación**: Sistema híbrido (Replit OIDC + autenticación local)

### Estructura de Directorios
```
/home/runner/workspace/
├── client/                    # Aplicación React frontend
│   ├── src/
│   │   ├── components/        # Componentes React (UI + pages)
│   │   │   ├── ui/           # Componentes shadcn/ui (50+ componentes)
│   │   │   ├── dashboard/    # Componentes de dashboard
│   │   │   ├── header.tsx    # Navegación principal
│   │   │   ├── footer-inmo.tsx # Footer
│   │   │   ├── property-form.tsx # Formulario CRUD propiedades
│   │   │   ├── property-card.tsx # Tarjeta de propiedad
│   │   │   ├── search-filters.tsx # Filtros de búsqueda
│   │   │   ├── auth-menu.tsx # Menú login/register
│   │   │   ├── FeatureGate.tsx # Control de permisos
│   │   │   ├── ProtectedRoute.tsx # Rutas protegidas
│   │   │   └── admin-table.tsx # Tabla admin
│   │   ├── pages/
│   │   │   ├── home.tsx      # Landing page
│   │   │   ├── properties.tsx # Listado propiedades
│   │   │   ├── property-detail.tsx # Detalles propiedad
│   │   │   ├── agency-dashboard.tsx # Dashboard agencia
│   │   │   ├── admin-dashboard.tsx # Panel admin
│   │   │   ├── subscribe.tsx # Página suscripciones
│   │   │   └── agencies.tsx  # Listado agencias
│   │   ├── hooks/
│   │   │   ├── useAuth.ts    # Hook autenticación
│   │   │   ├── useAccessPermissions.ts # Permisos
│   │   │   └── use-toast.ts  # Notificaciones toast
│   │   ├── lib/
│   │   │   ├── queryClient.ts # TanStack Query client
│   │   │   ├── authUtils.ts  # Utilidades auth
│   │   │   └── utils.ts      # Utilidades generales
│   │   ├── stores/
│   │   │   └── auth-modal-store.ts # Estado modal auth
│   │   └── styles/          # Estilos CSS
│   ├── public/              # Assets estáticos
│   └── test-limits.ts       # Tests de límites
├── server/                  # Backend API Node.js
│   ├── index.ts             # Entry point Express
│   ├── routes.ts            # Definición de rutas API
│   ├── storage.ts           # Operaciones DB (DatabaseStorage class)
│   ├── db.ts                # Conexión Neon PostgreSQL
│   ├── replitAuth.ts        # Auth OIDC + local (Passport.js)
│   ├── stripe-webhook.ts    # Webhook handler Stripe
│   ├── auth-utils.ts        # Password hashing (bcryptjs)
│   ├── vite.ts              # Dev server Vite
│   ├── middleware/
│   │   ├── logger.ts        # Logging de requests
│   │   └── registration-status.ts # Check registro
│   └── (scripts de test/seed)
├── shared/                  # Código compartido
│   └── schema.ts            # Esquema Drizzle + tipos Zod
├── migrations/              # Migraciones SQL
│   ├── 0000_init.sql       # Schema inicial
│   └── add_building_units.sql # Units de edificio
├── scripts/                 # Scripts utilitarios
├── docs/                    # Documentación (Stripe)
├── attached_assets/        # Imágenes
├── logs/                   # Logs aplicación
└── dist/                   # Build output
```

---

## 💻 Stack Tecnológico

### Frontend
- **React 18**: Framework de UI con hooks modernos
- **TypeScript**: Seguridad de tipos en toda la aplicación
- **Vite**: Herramienta rápida de desarrollo y build
- **Wouter**: Routing cliente ligero
- **TanStack Query**: Gestión de estado servidor y caching
- **Zustand**: Gestión de estado UI ligera
- **shadcn/ui**: Librería de componentes moderna basada en Radix UI
- **Tailwind CSS**: Framework CSS utility-first

### Backend
- **Express.js**: Framework web para APIs
- **Drizzle ORM**: Operaciones de base de datos type-safe
- **PostgreSQL**: Base de datos primaria (Neon serverless)
- **Passport.js**: Middleware de autenticación (estrategias OIDC + local)
- **bcryptjs**: Hashing de contraseñas
- **Stripe**: Procesamiento de pagos
- **express-session**: Gestión de sesiones
- **Zod**: Validación de datos

### Base de Datos
- **PostgreSQL**: Base de datos relacional principal
- **Neon**: Hosting serverless de PostgreSQL
- **Drizzle Kit**: Gestión de migraciones y schema

### Servicios Externos
- **Stripe**: Procesamiento de pagos y suscripciones
- **Replit Auth**: Proveedor de autenticación OIDC (Google)

---

## 🎯 Funcionalidades Principales

### Plataforma de Propiedades
1. **Listados de Propiedades**: Navegación, búsqueda, filtrado de propiedades
2. **Detalles de Propiedades**: Información completa con imágenes
3. **Búsqueda Avanzada**: Múltiples criterios de filtro (ubicación, precio, tipo, etc.)
4. **Gestión de Propiedades**: Operaciones CRUD completas para agencias
5. **Building Units**: Soporte para unidades dentro de edificios (ej: "UF1108")

### Características Multi-Tenant
1. **Registro de Agencias**: Onboarding para agencias inmobiliarias
2. **Planes de Suscripción**: Tres niveles de precios (Basic $29, Professional $79, Enterprise $149)
3. **Dashboard de Agencia**: Gestión de propiedades por agencia
4. **Tipos de Agencia**: `inmobiliaria` (agencias estándar) vs `constructora` (empresas constructoras)
5. **Límites por Plan**: Control de cantidad de propiedades según suscripción

### Características de Constructoras
1. **Development Status**: Propiedades pueden tener estado (pozo, construccion, terminado)
2. **Edificios**: Permiten crear propiedades padre con múltiples unidades

### Experiencia de Usuario
1. **Diseño Responsivo**: Enfoque mobile-first
2. **Idioma**: Español (Argentina)
3. **Propiedades Destacadas**: Listados destacados

### Administración
1. **Dashboard Admin**: Panel de gestión (EN DESARROLLO - stats hardcodeados)
2. **Gestión de Agencias**: Listado, edición, eliminación de agencias
3. **Gestión de Contenido**: Banners publicitarios

---

## 🔀 Flujo de Datos y Arquitectura

### Flujo de Datos Principal
```
Interfaz Usuario → Componentes React → Llamadas API → Rutas Express → Capa Storage → Base de Datos PostgreSQL
                      ↓
                TanStack Query (caching)
                      ↓
                Zustand (estado UI)
```

### Flujo de Autenticación
1. **Pre-registro** (`/api/register/pre`): Usuario crea cuenta con email/password, estado `pre-registered`
2. **Login Local** (`/api/login/local`): Autenticación email/password
3. **Login OIDC** (`/api/login`): OAuth via Google (Replit OIDC)
4. **Sesiones**: express-session con PostgreSQL store (7 días TTL)

### Flujo de Suscripción
1. Pre-registro → acceso básico de browsing
2. Crear agencia → modo preview (sin propiedades)
3. Seleccionar plan → Stripe checkout
4. Payment succeed → Webhook activa agencia
5. Acceso completo a gestión de propiedades

### Módulos Principales y Relaciones

#### Frontend:
- **Sistema de Autenticación**: Replit OIDC + fallback local
- **Gestión de Propiedades**: Listado, búsqueda, filtrado, detalles, CRUD
- **Dashboard de Agencia**: Gestión de propiedades para agencias
- **Dashboard Admin**: Tabla de agencias (funcional)
- **Sistema de Suscripciones**: Integración Stripe Elements

#### Backend:
- **Gestión de Usuarios**: Registro, autenticación, perfiles
- **Gestión de Agencias**: Cuentas multi-tenant
- **CRUD de Propiedades**: Gestión completa del ciclo de vida
- **Building Units**: Propiedades padre/hijo para edificios
- **Procesamiento de Pagos**: Stripe con webhook handler

---

## 📊 Modelo de Negocio

### Propósito y Objetivos
BuscoInmueble.click busca ser la plataforma inmobiliaria premier del mercado argentino, específicamente enfocada en la región de Bahía Blanca. La plataforma sirve como marketplace conectando agencias inmobiliarias, constructoras y buscadores de propiedades.

### Usuarios Objetivo

#### Usuarios Primarios:
1. **Agencias Inmobiliarias** (`inmobiliaria`):
   - Listar y gestionar propiedades en venta/alquiler
   - Generar presencia online

2. **Constructoras** (`constructora`):
   - Mostrar desarrollos (pozo, construcción, terminado)
   - Marketing de nuevos proyectos
   - Gestionar unidades de edificios

3. **Buscadores de Propiedades**:
   - Buscar propiedades para comprar/alquilar
   - Comparar opciones entre agencias

#### Usuarios Secundarios:
1. **Administradores de Plataforma**:
   - Gestionar agencias
   - Monitorear salud de la plataforma

### Modelo de Monetización

#### Flujo de Ingresos:
1. **Niveles de Suscripción** (Ingresos Recurrentes Mensuales):
   - **Basic**: $29/mes - 20 propiedades máximo
   - **Professional**: $79/mes - 50 propiedades máximo
   - **Enterprise**: $149/mes - Ilimitado

2. **Oportunidades Futuras**:
   - Listados de propiedades destacadas
   - Publicidad en banners
   - Colocación premium en resultados de búsqueda

---

## 🔐 Seguridad y Acceso

### Sistema de Autenticación
- **Primario**: Replit OIDC (Google)
- **Fallback**: Autenticación local con email/contraseña
- **Hashing**: bcryptjs para contraseñas
- **Sesiones**: express-session con PostgreSQL store

### Niveles de Acceso
- **Pre-registered**: Solo browsing (propiedades, agencias)
- **Completed registration**: Acceso completo a dashboard de agencia
- **Admin**: Dashboard admin (email hardcodeado: `test@inmogestion.com`)

### Validación y Sanitización
- **Zod**: Validación de schemas de entrada
- **TypeScript**: Seguridad de tipos en tiempo de compilación
- **Middleware Express**: Validación de requests

---

## 🗄️ Modelo de Datos

### Esquema Principal
```typescript
// Tablas principales (shared/schema.ts)

sessions         // Almacenamiento de sesiones (Replit Auth)
users            // Usuarios de la plataforma
agencies         // Agencias inmobiliarias (multi-tenant)
properties       // Listados de propiedades
locations        // Ubicaciones/Barrios
property_categories // Categorías de propiedades
banners          // Banners publicitarios
```

### Campos Relevantes

#### Users
- id, email, firstName, lastName, profileImageUrl
- stripeCustomerId, stripeSubscriptionId
- password (hash)
- registrationStatus: 'pre-registered' | 'completed'

#### Agencies
- id, name, email, phone, address, website, description, logo
- type: 'inmobiliaria' | 'constructora'
- isActive, subscriptionPlan, subscriptionStatus
- propertyLimit, propertyCount
- stripeCustomerId, stripeSubscriptionId

#### Properties
- id, code (unique, ej: "PROP-12345")
- title, description, price, currency
- area, coveredArea
- bedrooms, bathrooms, garages
- address, latitude, longitude
- videoUrl, images[], services[]
- operationType: 'venta' | 'alquiler' | 'temporario'
- rentPrice (para alquiler)
- developmentStatus: 'pozo' | 'construccion' | 'terminado' (constructoras)
- unitIdentifier (ej: "UF1108") - para building units
- parentPropertyId - FK a propiedad padre (edificio)
- isFeatured, isCreditSuitable, isActive
- agencyId, locationId, categoryId

### Relaciones Clave
- **Users → Agencies**: Uno-a-uno (owner)
- **Agencies → Properties**: Uno-a-muchos (multi-tenant)
- **Properties → Properties**: Uno-a-muchos (building units)
- **Locations → Properties**: Uno-a-muchos
- **PropertyCategories → Properties**: Uno-a-muchos
- **Agencies → Banners**: Uno-a-muchos

---

## 🚀 Workflows de Usuario

### Workflow de Agencia
1. **Pre-registro**: Crear cuenta con email/contraseña
2. **Registro completado**: Completar perfil
3. **Crear agencia**: Registrar inmobiliaria/constructora
4. **Suscripción**: Seleccionar y pagar plan Stripe
5. **Gestión de Propiedades**: CRUD completo

### Workflow de Constructoras
1. Same as agency +:
2. **Crear edificio**: Propiedad tipo "edificio"
3. **Agregar unidades**: Propiedades con parentPropertyId
4. **Gestionar desarrollo**: Estado pozo/construccion/terminado

### Workflow de Usuario Final
1. **Descubrimiento de Propiedades**: Navegar/buscar
2. **Filtrado**: Aplicar criterios de búsqueda
3. **Detalles de Propiedad**: Ver información completa
4. **Contacto**: Ver información de agencia

### Workflow Administrativo
1. **Gestión de Agencias**: Supervisar listados
2. **Edición/Eliminación**: Modificar agencias
3. **Monitoreo**: Stats básicos (EN DESARROLLO)

---

## ⚠️ Limitaciones y Features Pendientes

### Funcionalidades NO Implementadas
1. **Mapa Interactivo**: No hay integración con Leaflet/map library
2. **Calculadora de Créditos**: No existe
3. **Sistema de Tutoriales/Onboarding**: No implementado
4. **Password Reset Flow**: No existe
5. **Email Verification**: No implementado
6. **Favoritos/Wishlist**: No implementado
7. **Property Inquiries/Contact Forms**: No se almacenan
8. **Image Upload**: Solo URLs externas
9. **Property Reports**: No existen
10. **Multi-language**: Solo español

### Admin Dashboard
- Stats (agencias, usuarios, propiedades, ingresos) hardcodeados a 0
- Solo tabla de agencias funciona correctamente

### Sistema de Pagos
- ⚠️ **Sin Retry Logic**: Si pago exitoso pero usuario cierra ventana, no hay reintento
- ⚠️ **Sin Validación Server-side de Planes**: Precios definidos solo en frontend
- ⚠️ **Sin Monitoring Dashboard**: No hay métricas en tiempo real
- ✅ Webhook handler implementado

---

## 🔧 Configuración y Despliegue

### Archivos de Configuración Clave
- `package.json`: Dependencias y scripts
- `drizzle.config.ts`: Configuración Drizzle ORM
- `shared/schema.ts`: Esquema y tipos
- `vite.config.ts`: Configuración Vite
- `tailwind.config.ts`: Configuración Tailwind
- `.env`: Variables de entorno

### Variables de Entorno Requeridas
- `DATABASE_URL`: Conexión PostgreSQL Neon
- `STRIPE_SECRET_KEY`: API key Stripe
- `STRIPE_WEBHOOK_SECRET`: Webhook signing
- `VITE_STRIPE_PUBLIC_KEY`: Public key frontend
- `STRIPE_BASIC/PRFESSIONAL/ENTERPRISE_PRICE_ID`: Price IDs
- `SESSION_SECRET`: Secret para sesiones

---

## 📈 Estado del Proyecto

### ✅ Completado
- Arquitectura multi-tenant funcional
- Autenticación híbrida (OIDC + local)
- CRUD completo de propiedades
- Building units para constructoras
- Suscripciones Stripe con webhook
- Dashboard de agencia funcional
- Tabla admin de agencias

### ⚠️ En Desarrollo
- Admin dashboard stats
- Sistema de pagos robusto (retry, validación)

### ❌ Pendiente
- Mapa interactivo
- Calculadora de créditos
- Sistema de tutoriales
- Features de usuario final (favoritos, inquiries)

---

## 🎯 Conclusiones

BuscoInmueble.click es una plataforma SaaS inmobiliaria con una **base sólida** para el mercado argentino. La arquitectura es moderna y escalable, con un sistema multi-tenant funcional y integración Stripe operativa.

**Puntos Fuertes:**
- Stack tecnológico actualizado
- Sistema de suscripciones con webhook
- Building units para constructoras
- Separación clara de responsabilidades

**Areas de Mejora:**
- Admin dashboard requiere implementación de stats reales
- Sistema de pagos necesita retry logic y validación server-side
- Faltan features de UX (mapa, calculator, tutoriales)
- Documentación técnica para desarrolladores

---

## 📝 Metadatos del Análisis

- **Fecha del Análisis**: 13 de Febrero de 2026
- **Versión del Codebase**: Current main branch
- **Herramienta de Análisis**: opencode big-pickle
- **Metodología**: Análisis exploratorio comprensivo
- **Cobertura**: 100% del codebase y arquitectura del sistema
- **Actualizado**: Corrections based on code review vs documentation
