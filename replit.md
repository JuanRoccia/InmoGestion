# BuscoInmueble.click - Real Estate SaaS Platform

## Overview

**BuscoInmueble.click** is a comprehensive multi-tenant real estate SaaS platform designed for the Argentine market (specifically Bahía Blanca region and surroundings). The platform enables real estate agencies and construction companies to list and manage properties, while users can search, browse, and view property listings with advanced filtering capabilities.

### Core Business Model
- **Multi-tenant SaaS**: Real estate agencies subscribe to publish properties
- **Subscription Plans**: Three tiers - Basic ($29/mo), Professional ($79/mo), Enterprise ($149/mo)
- **Agency Types**: 
  - `inmobiliaria` (standard real estate agency)
  - `constructora` (construction company - limited to development properties with status: pozo/construccion/terminado)

### Current State
- Landing page with hero search and featured property carousels
- Dual authentication system (Replit OIDC + Local test login)
- Subscription management via Stripe integration
- Admin and Agency dashboards (protected routes)
- Property listings with filters, search, and map view
- Responsive design following Airbnb/Zillow patterns
- Interactive map with property markers
- Advanced property management with image uploads
- Comprehensive security logging and monitoring

---

## User Preferences

- **Language**: Spanish (Argentina) for all user-facing content
- **Communication Style**: Simple, everyday language
- **Design Reference**: Modern real estate platforms (Airbnb, Zillow)
- **Primary Colors**: Orange (#FF5733 / #ff2e06) and Purple (#7E57C2)

---

## System Architecture

### Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS + shadcn/ui (Radix primitives) |
| Routing | Wouter (client-side) |
| State | TanStack Query v5 (server state) + Zustand (UI state) |
| Backend | Express.js + TypeScript |
| Database | PostgreSQL (Neon serverless) |
| ORM | Drizzle ORM |
| Auth | Replit OIDC + Passport.js + Local Strategy |
| Payments | Stripe (subscriptions) |
| Session | express-session with PostgreSQL store |
| Maps | Leaflet + React-Leaflet |
| Forms | React Hook Form + Zod validation |
| Real-time | WebSockets (ws) |

### Project Structure

```
├── client/                    # Frontend React application
│   ├── public/
│   │   ├── assets/           # Static images (locations, banners, logo)
│   │   └── attached_assets/  # User-uploaded assets
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── ui/          # shadcn/ui components (button, card, dialog, etc.)
│   │   │   ├── dashboard/   # Dashboard-specific components
│   │   │   │   ├── dashboard-nav.tsx      # Navigation with logo and utilities
│   │   │   │   ├── stats-cards.tsx       # Metrics display (total, active, etc.)
│   │   │   │   ├── action-bar.tsx        # Action buttons for CRUD operations
│   │   │   │   └── promo-banner.tsx      # Subscription promotion banner
│   │   │   ├── auth-menu.tsx              # Login modal with dual auth
│   │   │   ├── auth-overlay.tsx           # Auth protection overlay
│   │   │   ├── property-card.tsx          # Property listing card
│   │   │   ├── property-form.tsx          # Comprehensive property CRUD form
│   │   │   ├── search-filters.tsx         # Advanced search filters
│   │   │   ├── featured-properties-section.tsx  # Carousel section
│   │   │   ├── hero-search.tsx            # Main search component
│   │   │   ├── properties-map.tsx        # Interactive map with markers
│   │   │   ├── header.tsx                 # Navigation header
│   │   │   ├── subscription-plans.tsx     # Pricing plans
│   │   │   ├── protected-route.tsx        # Route protection wrapper
│   │   │   ├── feature-gate.tsx           # Feature access control
│   │   │   └── custom-scrollbar.tsx        # Custom scrollbar styling
│   │   ├── hooks/
│   │   │   ├── useAuth.ts                 # Authentication hook
│   │   │   └── use-toast.ts               # Toast notifications
│   │   ├── lib/
│   │   │   ├── queryClient.ts             # TanStack Query config
│   │   │   ├── property-images.ts         # Unsplash CDN image helper
│   │   │   └── utils.ts                   # Utility functions (cn, etc.)
│   │   ├── pages/
│   │   │   ├── landing.tsx                # Main landing page
│   │   │   ├── home.tsx                   # Home page with stats
│   │   │   ├── properties.tsx             # Property listings with filters
│   │   │   ├── property-detail.tsx        # Single property view
│   │   │   ├── admin-dashboard.tsx         # Admin panel
│   │   │   ├── agency-dashboard.tsx       # Agency management
│   │   │   ├── subscribe.tsx              # Subscription checkout
│   │   │   ├── map-search.tsx             # Map-based search
│   │   │   ├── solicitar-inmueble.tsx      # Property request form
│   │   │   ├── property-preview-page.tsx  # Property preview
│   │   │   ├── agencies.tsx               # Agencies listing
│   │   │   ├── contact.tsx                # Contact page
│   │   │   └── not-found.tsx              # 404 page
│   │   ├── stores/
│   │   │   └── auth-modal-store.ts        # Zustand store for auth modal
│   │   ├── App.tsx                        # Main app with routes
│   │   └── index.css                      # Global styles + Tailwind
│   └── index.html
├── server/
│   ├── index.ts                   # Express server entry
│   ├── routes.ts                  # API route definitions (578 lines)
│   ├── db.ts                      # Database connection (Neon)
│   ├── storage.ts                 # Database storage layer (IStorage, 422 lines)
│   ├── replitAuth.ts              # Auth setup (OIDC + Local + Session)
│   ├── auth-utils.ts              # Password hashing/comparison utilities
│   ├── vite.ts                    # Vite dev server integration
│   ├── middleware/                # Security and logging middleware
│   │   ├── logger.ts              # Access and security logging
│   │   └── registration-status.ts # Registration status middleware
│   ├── seed.ts                    # Database seeding
│   ├── seed-test-data.ts          # Test data generation
│   └── [utility scripts].ts       # Development and testing utilities
├── shared/
│   └── schema.ts                  # Drizzle schema + types + Zod schemas (243 lines)
├── scripts/                       # Utility scripts for data management
├── migrations/                    # Database migrations
├── logs/                         # Security and access logs
├── design_guidelines.md           # UI/UX design specifications
├── drizzle.config.ts              # Drizzle ORM config
├── tailwind.config.ts             # Tailwind CSS config
├── vite.config.ts                 # Vite bundler config
└── tsconfig.json                  # TypeScript configuration
```

---

## Database Schema

### Core Tables

#### `users`
- `id` (varchar, PK) - UUID or Replit user ID
- `email` (varchar, unique)
- `firstName`, `lastName`, `profileImageUrl`
- `stripeCustomerId`, `stripeSubscriptionId`
- `password` (varchar, nullable - for local auth)
- `registrationStatus` (enum: 'pre-registered' | 'completed')
- `createdAt`, `updatedAt`

#### `agencies`
- `id` (varchar, PK, UUID)
- `name`, `email`, `phone`, `address`, `website`, `description`, `logo`
- `type` (enum: 'inmobiliaria' | 'constructora')
- `isActive` (boolean) - activated after subscription
- `subscriptionPlan` (enum: 'basic' | 'professional' | 'enterprise')
- `subscriptionStatus` ('pending' | 'active' | etc.)
- `ownerId` (FK -> users.id)
- `createdAt`, `updatedAt`

#### `properties`
- `id` (varchar, PK, UUID)
- `code` (varchar, unique) - Format: "PROP-XXXXX"
- `title`, `description`, `price`, `currency`
- `area`, `coveredArea`, `bedrooms`, `bathrooms`, `garages`
- `address`, `latitude`, `longitude`
- `unitIdentifier` (varchar, 50) - Unit identifier for buildings
- `images` (text array) - Array of image URLs
- `services` (text array) - Array of available services
- `videoUrl` (text) - URL for property videos
- `operationType` (enum: 'venta' | 'alquiler' | 'temporario')
- `developmentStatus` (enum: 'pozo' | 'construccion' | 'terminado') - for constructoras
- `rentPrice` (decimal) - Separate rent price for units
- `isFeatured`, `isCreditSuitable`, `isActive` (booleans)
- `agencyId` (FK), `locationId` (FK), `categoryId` (FK)
- `parentPropertyId` (FK) - For building units
- `createdAt`, `updatedAt`

#### `locations`
- `id`, `name`, `slug`, `province`, `country`
- `latitude`, `longitude`, `imageUrl`
- Pre-seeded with cities: Bahía Blanca, Tres Arroyos, Monte Hermoso, Pehuen-Có, etc.

#### `propertyCategories`
- `id`, `name`, `slug`, `description`
- Types: casa, departamento, terreno, local, oficina, campo, emprendimiento, etc.

#### `banners`
- Advertising banner management
- `title`, `imageUrl`, `linkUrl`, `size`, `position`
- `isActive`, `agencyId` (nullable for platform banners)
- `startDate`, `endDate`, `createdAt`

#### `sessions`
- Express session storage for PostgreSQL
- `sid` (PK), `sess` (jsonb), `expire` (timestamp)

### Relations
- User → Agency (1:1 ownership)
- Agency → Properties (1:N)
- Agency → Banners (1:N)
- Property → Location (N:1)
- Property → Category (N:1)
- Property → Units (self-referential for buildings)

---

## Authentication & Authorization

### Dual Authentication System

1. **Replit OIDC (Primary)**
   - Passport.js with OpenID Connect
   - "Iniciar Sesión con Google" button
   - Redirects to `/api/login` → Replit OIDC flow

2. **Local Login (Testing/Demo)**
   - Passport-local strategy
   - POST `/api/login/local` with email/password
   - Test credentials: `test@inmogestion.com` / `admin123`
   - Creates session with 7-day expiration

### Registration Flow
1. **Pre-registration**: Basic signup with limited access
2. **Agency Creation**: Complete agency information
3. **Subscription**: Stripe subscription activation
4. **Full Access**: Complete property management capabilities

### Session Management
- PostgreSQL-backed sessions (`connect-pg-simple`)
- 7-day TTL with auto-renewal
- Secure cookies (httpOnly, secure)
- Hybrid token system (OAuth + refresh tokens)

### Access Control
- `requirePreRegistered` - Basic access for pre-registered users
- `requireCompletedRegistration` - Full access for subscribed users
- `isAuthenticated` middleware - Session validation
- `ProtectedRoute` components - Frontend route protection

---

## API Architecture

### Route Categories

#### Authentication Routes
- `GET /api/login` - Initiate Replit OIDC login
- `POST /api/login/local` - Local login (email/password)
- `GET /api/callback` - OIDC callback
- `GET /api/logout` - End session
- `GET /api/auth/user` - Get current user (protected)
- `POST /api/register/pre` - Pre-registration
- `POST /api/auth/set-password` - Set/change password

#### Agency Management
- `GET /api/agencies` - List agencies (with search)
- `GET /api/agencies/:id` - Get agency by ID
- `POST /api/agencies` - Create agency (protected)
- `PUT /api/agencies/:id` - Update agency (protected, owner only)
- `DELETE /api/agencies/:id` - Delete agency (protected, owner only)
- `POST /api/agencies/verify-subscription` - Verify Stripe subscription

#### Property Management
- `GET /api/properties` - List with advanced filters + pagination
- `GET /api/properties/featured` - Featured properties by type
- `GET /api/properties/:id` - Get property by ID
- `GET /api/properties/:id/units` - Get building units
- `GET /api/properties/code/:code` - Get by property code
- `POST /api/properties` - Create property (protected)
- `PUT /api/properties/:id` - Update property (protected)
- `DELETE /api/properties/:id` - Delete property (protected)

#### Support Data
- `GET /api/locations` - List all locations
- `GET /api/categories` - List property categories
- `GET /api/banners` - Get active banners

#### Payment Integration
- `POST /api/get-or-create-subscription` - Stripe subscription flow

### Advanced Filtering (Properties)
- `operationType` - 'venta', 'alquiler', 'temporario'
- `locationId`, `categoryId`, `agencyId`
- `isFeatured`, `isCreditSuitable`
- `minPrice`, `maxPrice`, `price`
- `minArea`, `maxArea`
- `bedrooms`, `bathrooms`
- `services` filter
- `limit`, `offset` for pagination

---

## Frontend Architecture

### Component Hierarchy

#### UI Components (`components/ui/`)
Based on shadcn/ui with Radix UI primitives:
- **Form Components**: button, input, textarea, form, select, checkbox
- **Layout**: card, dialog, sheet, sidebar, separator
- **Navigation**: navigation-menu, breadcrumb, tabs
- **Feedback**: toast, alert, progress, badge
- **Data Display**: table, pagination, carousel
- **Media**: avatar, aspect-ratio
- **Interaction**: dropdown-menu, tooltip, hover-card, popover

#### Business Components

**Authentication & Access Control**
- `AuthMenu` - Dual authentication modal with tabs
- `ProtectedRoute` - Route protection with registration status checks
- `FeatureGate` - Conditional rendering based on subscription
- `AuthOverlay` - Interaction-blocking overlay for unauthenticated users

**Dashboard Components**
- `DashboardNav` - Sticky navigation with logo, utilities, auth
- `StatsCards` - Metrics display (total properties, active, featured)
- `ActionBar` - Quick actions for property management
- `PromoBanner` - Subscription promotion with carousel

**Property Management**
- `PropertyCard` - Property listing card with badges and hover effects
- `PropertyForm` - Comprehensive 6-section form with validation
- `SearchFilters` - Advanced filtering sidebar with active filter badges
- `PropertiesMap` - Interactive map with clustered markers

**Search & Discovery**
- `HeroSearch` - Landing hero with operation tabs and quick search
- `FeaturedPropertiesSection` - Horizontal carousel by operation type
- `LocationGrid` - Visual location selector with images

### State Management
- **Server State**: TanStack Query with caching, invalidation, optimistic updates
- **UI State**: Zustand for modal states, component state for local UI
- **Auth State**: React Context with custom hooks (`useAuth`)
- **Form State**: React Hook Form with Zod validation

### Routing Strategy
- **Wouter** for client-side routing
- **Protected routes** with authentication checks
- **Lazy loading** for performance optimization
- **URL-based state** for filters and search parameters

---

## Security Architecture

### Multi-Layer Security

#### 1. Request Logging System
- **Access Logger**: Logs ALL HTTP requests with timestamps
- **Security Logger**: Detects and logs suspicious patterns
- **Attack Detection**: 
  - Code injection (`eval()`, `Function()`)
  - Prototype pollution (`__proto__`, `constructor.prototype`)
  - XSS attempts (`<script>`, `javascript:`)
  - SQL injection patterns
  - Path traversal (`../`)
  - Command injection attempts

#### 2. Authentication Security
- **Session Management**: PostgreSQL-backed, httpOnly, secure cookies
- **Password Security**: bcrypt hashing with salt rounds
- **Hybrid Auth**: OAuth + refresh tokens with automatic renewal
- **Rate Limiting**: Built-in session and request limiting

#### 3. Data Validation
- **Input Validation**: Zod schemas for all API endpoints
- **Type Safety**: TypeScript throughout the stack
- **SQL Injection Prevention**: Drizzle ORM with parameterized queries
- **XSS Prevention**: Proper sanitization and CSP headers

#### 4. Environment Security
- **Secret Management**: Environment variables for all sensitive data
- **Database Security**: Connection pooling, SSL connections
- **API Security**: CORS configuration, secure headers

---

## Payment & Subscription System

### Stripe Integration

#### Configuration
- `STRIPE_SECRET_KEY` - Server-side API key
- `VITE_STRIPE_PUBLIC_KEY` - Client-side publishable key
- Webhook handling for subscription events

#### Subscription Flow
1. User selects plan on `/subscribe`
2. `POST /api/get-or-create-subscription` creates Stripe customer + subscription
3. Stripe Elements handles secure payment processing
4. `POST /api/agencies/verify-subscription` activates agency
5. User gains full access based on plan features

#### Subscription Plans
| Plan | Price | Properties | Features |
|------|-------|------------|----------|
| Basic | $29/mo | Up to 10 | Basic dashboard, email support |
| Professional | $79/mo | Up to 50 | Analytics, featured listings |
| Enterprise | $149/mo | Unlimited | API, white-label, 24/7 support |

#### Feature Gating
- **Basic Users**: Limited property uploads, basic dashboard
- **Professional Users**: Advanced analytics, priority support
- **Enterprise Users**: API access, custom branding, dedicated support

---

## Map & Location System

### Interactive Maps
- **Technology**: Leaflet + React-Leaflet
- **Features**:
  - Clustered property markers
  - Popup cards with property previews
  - Auto-fit bounds for search results
  - Interactive filtering
  - Location-based search

### Location Data
- **Pre-seeded Cities**: Bahía Blanca, Tres Arroyos, Monte Hermoso, Pehuen-Có
- **Geographic Data**: Coordinates, province information
- **Property Association**: Properties linked to locations for filtering
- **Visual Integration**: Location cards with images in search interface

---

## Design System

### Brand Identity
- **Primary Orange**: `#ff2e06` (CTAs, buttons, highlights)
- **Secondary Purple**: `#7E57C2` (badges, accents)
- **Dark Theme**: `240 10% 8%` (background)
- **Surface Colors**: `240 8% 12%` (cards, panels)

### Typography
- **Font**: Inter (Google Fonts)
- **Hero**: text-5xl/text-6xl font-bold
- **Section Headers**: text-3xl font-semibold
- **Card Titles**: text-xl font-semibold
- **Body Text**: text-base

### Component Patterns
- **Cards**: `rounded-xl border border-border bg-surface`
- **Buttons**: Primary (orange), Secondary (outline), Ghost variants
- **Badges**: Small pills with contrasting colors
- **Forms**: Labeled inputs with focus states and validation
- **Feedback**: Toast notifications, loading states, error handling

### Responsive Design
- **Mobile-first approach**
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Grid Systems**: Responsive grids for properties, locations, dashboards
- **Touch Optimization**: Mobile-friendly interactions and navigation

---

## Development Workflow

### Environment Setup

#### Required Environment Variables
```bash
DATABASE_URL=          # PostgreSQL connection string
SESSION_SECRET=        # Express session encryption
STRIPE_SECRET_KEY=     # Stripe API key (server)
VITE_STRIPE_PUBLIC_KEY= # Stripe publishable key (client)
```

#### Development Commands
```bash
npm run dev              # Start development server (port 5000)
npm run build            # Build for production
npm run check            # TypeScript type checking
npm run db:push          # Push schema changes
npm run db:studio        # Open Drizzle Studio
npm run seed:test        # Populate test data
```

### Database Management
- **ORM**: Drizzle with automatic migrations
- **Schema Management**: TypeScript-first schema definition
- **Type Safety**: Shared types between frontend and backend
- **Data Seeding**: Automated test data generation

### Development Features
- **Hot Module Replacement**: Vite HMR for fast development
- **Type Checking**: Real-time TypeScript validation
- **Code Splitting**: Automatic bundle optimization
- **Error Handling**: Comprehensive error boundaries and logging

---

## Performance Optimizations

### Frontend Performance
- **Code Splitting**: Lazy loading for routes and components
- **Image Optimization**: WebP support, responsive images
- **Caching Strategy**: TanStack Query with SWR patterns
- **Bundle Optimization**: Vite tree-shaking and minification

### Backend Performance
- **Database Optimization**: Indexed queries, connection pooling
- **Query Efficiency**: Optimized Drizzle queries with filters
- **Caching**: Response caching for static data
- **Compression**: Gzip compression for responses

### Monitoring & Analytics
- **Performance Monitoring**: Request timing and database queries
- **Security Logging**: Real-time threat detection
- **Error Tracking**: Comprehensive error logging and reporting
- **User Analytics**: Property views, search patterns, conversion tracking

---

## Testing & Quality Assurance

### Test Data Management
- **Test User**: `test@inmogestion.com` / `admin123`
- **Sample Agency**: "Inmobiliaria Demo" with full property set
- **Property Variety**: 5+ properties across different categories
- **Location Coverage**: Multiple cities and neighborhoods

### Quality Assurance
- **Type Safety**: Full TypeScript coverage
- **Input Validation**: Zod schemas for all user inputs
- **Error Handling**: Comprehensive error boundaries
- **Security Testing**: OWASP guidelines implementation

---

## Deployment & Production

### Production Build
```bash
npm run build           # Build client and server
npm run start           # Start production server
```

### Environment Configuration
- **Replit Platform**: Automated deployment with Nix environment
- **Database**: Neon PostgreSQL serverless
- **Static Assets**: Served from `/dist/public` in production
- **SSL**: Automatic HTTPS with Replit infrastructure

### Monitoring & Maintenance
- **Log Management**: Structured logging with timestamps
- **Security Monitoring**: Real-time attack detection
- **Performance Metrics**: Database query performance, response times
- **Backup Strategy**: Automated database backups through Neon

---

## Recent Enhancements (January 2025)

### Major Features Added
- **Interactive Map System**: Full-featured property map with clustering
- **Advanced Property Management**: Comprehensive CRUD with 6-section form
- **Security Logging System**: Multi-layer attack detection and prevention
- **Enhanced Dashboard**: Stats cards, action bars, promotional banners
- **Feature Gating**: Subscription-based access control
- **Image Management**: Multiple images per property with validation

### Technical Improvements
- **Enhanced Middleware**: Security and access logging
- **Optimized Database**: Improved queries and indexing
- **Better UX**: Loading states, error handling, responsive design
- **Type Safety**: Complete TypeScript coverage with shared schemas
- **Performance**: Code splitting, caching optimizations

### Business Features
- **Subscription Verification**: Automated Stripe integration
- **Agency Management**: Complete agency lifecycle management
- **Property Categories**: Expanded property types and services
- **Location Coverage**: Extended geographic coverage

---

## Key Technical Decisions

### Architecture Choices
1. **Monorepo Structure**: Shared types and schemas across frontend/backend
2. **TypeScript Everywhere**: Full type safety from database to UI
3. **Component-Based UI**: Reusable shadcn/ui components with Radix primitives
4. **Server-Side Rendering Ready**: Vite configuration supports SSR migration
5. **Security-First**: Comprehensive logging and attack prevention

### Technology Rationale
- **React 18**: Latest features with concurrent rendering
- **Express.js**: Mature backend ecosystem with extensive middleware
- **PostgreSQL (Neon)**: Serverless, scalable, with excellent TypeScript support
- **Drizzle ORM**: Type-safe, performant, with excellent DX
- **Tailwind CSS**: Utility-first design with consistent theming
- **Stripe**: Industry-standard payment processing

This architecture provides a solid foundation for a scalable, secure, and maintainable real estate SaaS platform with excellent user experience and business value.