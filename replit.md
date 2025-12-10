# BuscoInmueble.click - Real Estate SaaS Platform

## Overview

**BuscoInmueble.click** is a multi-tenant real estate SaaS platform designed for the Argentine market (specifically the Bahía Blanca region and surroundings). The platform enables real estate agencies and construction companies (constructoras) to list and manage properties, while users can search, browse, and view property listings.

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

### Project Structure

```
├── client/                    # Frontend React application
│   ├── public/
│   │   ├── assets/           # Static images (locations, banners, logo)
│   │   └── attached_assets/  # User-uploaded assets
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── ui/          # shadcn/ui components
│   │   │   ├── auth-menu.tsx        # Login modal with dual auth
│   │   │   ├── auth-overlay.tsx     # Auth protection overlay
│   │   │   ├── property-card.tsx    # Property listing card
│   │   │   ├── featured-properties-section.tsx  # Carousel section
│   │   │   ├── hero-search.tsx      # Main search component
│   │   │   ├── header.tsx           # Navigation header
│   │   │   └── subscription-plans.tsx  # Pricing plans
│   │   ├── hooks/
│   │   │   ├── useAuth.ts          # Authentication hook
│   │   │   └── use-toast.ts        # Toast notifications
│   │   ├── lib/
│   │   │   ├── queryClient.ts      # TanStack Query config
│   │   │   ├── property-images.ts  # Unsplash CDN image helper
│   │   │   └── utils.ts            # Utility functions (cn, etc.)
│   │   ├── pages/
│   │   │   ├── landing.tsx         # Main landing page
│   │   │   ├── properties.tsx      # Property listings
│   │   │   ├── property-detail.tsx # Single property view
│   │   │   ├── admin-dashboard.tsx # Admin panel
│   │   │   ├── agency-dashboard.tsx # Agency management
│   │   │   ├── subscribe.tsx       # Subscription checkout
│   │   │   └── map-search.tsx      # Map-based search
│   │   ├── stores/
│   │   │   └── auth-modal-store.ts # Zustand store for auth modal
│   │   ├── App.tsx                 # Main app with routes
│   │   └── index.css               # Global styles + Tailwind
│   └── index.html
├── server/
│   ├── db.ts                      # Database connection (Neon)
│   ├── index.ts                   # Express server entry
│   ├── routes.ts                  # API route definitions
│   ├── storage.ts                 # Database storage layer (IStorage)
│   ├── replitAuth.ts              # Auth setup (OIDC + Local + Session)
│   ├── vite.ts                    # Vite dev server integration
│   └── seed.ts                    # Database seeding
├── shared/
│   └── schema.ts                  # Drizzle schema + types + Zod schemas
├── scripts/                       # Utility scripts for data management
├── design_guidelines.md           # UI/UX design specifications
├── drizzle.config.ts              # Drizzle ORM config
├── tailwind.config.ts             # Tailwind CSS config
└── vite.config.ts                 # Vite bundler config
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
- `createdAt`, `updatedAt`

#### `agencies`
- `id` (varchar, PK, UUID)
- `name`, `email`, `phone`, `address`, `website`, `description`, `logo`
- `type` (enum: 'inmobiliaria' | 'constructora')
- `isActive` (boolean) - activated after subscription
- `subscriptionPlan` (enum: 'basic' | 'professional' | 'enterprise')
- `subscriptionStatus` ('pending' | 'active' | etc.)
- `ownerId` (FK -> users.id)

#### `properties`
- `id` (varchar, PK, UUID)
- `code` (varchar, unique) - Format: "PROP-XXXXX"
- `title`, `description`, `price`, `currency`
- `area`, `bedrooms`, `bathrooms`, `garages`
- `address`, `latitude`, `longitude`
- `images` (text array) - Array of image URLs
- `operationType` (enum: 'venta' | 'alquiler' | 'temporario')
- `developmentStatus` (enum: 'pozo' | 'construccion' | 'terminado') - for constructoras
- `isFeatured`, `isCreditSuitable`, `isActive` (booleans)
- `agencyId` (FK), `locationId` (FK), `categoryId` (FK)

#### `locations`
- `id`, `name`, `slug`, `province`, `country`
- `latitude`, `longitude`, `imageUrl`
- Pre-seeded with cities: Bahía Blanca, Tres Arroyos, Monte Hermoso, Pehuen-Có, etc.

#### `propertyCategories`
- `id`, `name`, `slug`, `description`
- Types: casa, departamento, terreno, local, oficina, campo, emprendimiento, etc.

#### `banners`
- Advertising banner management
- `position`, `size`, `isActive`, `startDate`, `endDate`

#### `sessions`
- Express session storage for PostgreSQL

### Relations
- User → Agency (1:1 ownership)
- Agency → Properties (1:N)
- Agency → Banners (1:N)
- Property → Location (N:1)
- Property → Category (N:1)

---

## Authentication System

### Dual Authentication Support

1. **Replit OIDC (Primary)**
   - Passport.js with OpenID Connect
   - "Iniciar Sesión con Google" button
   - Redirects to `/api/login` → Replit OIDC flow

2. **Local Login (Testing/Demo)**
   - Passport-local strategy
   - POST `/api/login/local` with email/password
   - Test credentials: `test@inmogestion.com` / `admin123`
   - Creates session with 7-day expiration

### Auth Modal Behavior
- Modal opens automatically when user is not authenticated
- Cannot be dismissed without logging in (blocks interaction)
- Located in `auth-menu.tsx` with Zustand state (`auth-modal-store.ts`)

### Session Management
- PostgreSQL-backed sessions (`connect-pg-simple`)
- 7-day TTL with auto-renewal
- Secure cookies (httpOnly, secure)

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/login` | Initiate Replit OIDC login |
| POST | `/api/login/local` | Local login (email/password) |
| GET | `/api/callback` | OIDC callback |
| GET | `/api/logout` | End session |
| GET | `/api/auth/user` | Get current user (protected) |

### Agencies
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/agencies` | List agencies (with search) |
| GET | `/api/agencies/:id` | Get agency by ID |
| POST | `/api/agencies` | Create agency (protected) |
| PUT | `/api/agencies/:id` | Update agency (protected, owner only) |
| DELETE | `/api/agencies/:id` | Delete agency (protected, owner only) |
| POST | `/api/agencies/verify-subscription` | Verify Stripe subscription |

### Properties
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/properties` | List with filters + pagination |
| GET | `/api/properties/featured` | Featured properties by type |
| GET | `/api/properties/:id` | Get property by ID |
| GET | `/api/properties/code/:code` | Get by property code |
| POST | `/api/properties` | Create property (protected) |
| PUT | `/api/properties/:id` | Update property (protected) |
| DELETE | `/api/properties/:id` | Delete property (protected) |

### Other
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/locations` | List all locations |
| GET | `/api/categories` | List property categories |
| GET | `/api/banners` | Get active banners |
| POST | `/api/get-or-create-subscription` | Stripe subscription flow |

### Query Parameters (Properties)
- `operationType` - 'venta', 'alquiler', 'temporario'
- `locationId`, `categoryId`, `agencyId`
- `isFeatured`, `isCreditSuitable`
- `minPrice`, `maxPrice`, `price`
- `limit`, `offset`

---

## Frontend Components

### Key Components

| Component | Purpose |
|-----------|---------|
| `Header` | Navigation with logo, search, auth menu |
| `HeroSearch` | Landing hero with property search form |
| `FeaturedPropertiesSection` | Horizontal carousel (6 cards desktop) |
| `PropertyCard` | Property thumbnail with price, specs, badges |
| `AuthMenu` | Login modal with dual auth options |
| `SubscriptionPlans` | 3-tier pricing cards |
| `LocationGrid` | Grid of clickable location cards |

### Carousel Implementation
- Uses Embla Carousel via shadcn/ui
- 6 cards visible on desktop (`lg:basis-1/6`)
- Responsive: 4 on tablet, 2 on mobile
- Separate carousels for: Venta, Alquiler, Terrenos, Emprendimientos, Temporario

### Property Images
- Fallback to Unsplash CDN images when no images provided
- Direct CDN URLs (no API calls): `images.unsplash.com/photo-{id}`
- Consistent image per property via hash function

---

## Stripe Integration

### Configuration
- `STRIPE_SECRET_KEY` - Server-side API key
- `VITE_STRIPE_PUBLIC_KEY` - Client-side publishable key

### Subscription Flow
1. User selects plan on `/subscribe`
2. `POST /api/get-or-create-subscription` creates Stripe customer + subscription
3. Stripe Elements handles payment
4. `POST /api/agencies/verify-subscription` activates agency

### Subscription Plans
| Plan | Price | Properties | Features |
|------|-------|------------|----------|
| Basic | $29/mo | Up to 10 | Basic dashboard, email support |
| Professional | $79/mo | Up to 50 | Analytics, featured listings |
| Enterprise | $149/mo | Unlimited | API, white-label, 24/7 support |

---

## Design System

### Brand Colors
- **Primary Orange**: `#FF5733` / `#ff2e06` (CTAs, buttons)
- **Secondary Purple**: `#7E57C2` (badges, accents)
- **Background**: Dark theme (`240 10% 8%`)
- **Cards/Surfaces**: `240 8% 12%`

### Typography
- Font: Inter (Google Fonts)
- Hero: text-5xl/text-6xl font-bold
- Section: text-3xl font-semibold
- Card titles: text-xl font-semibold
- Body: text-base

### Component Patterns
- Cards: `rounded-xl border border-border bg-surface`
- Buttons: Primary (orange), Secondary (outline), Ghost
- Badges: Small pills with contrasting colors
- Forms: Labeled inputs with focus states

---

## Environment Variables

### Required Secrets
| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string |
| `SESSION_SECRET` | Express session encryption |
| `STRIPE_SECRET_KEY` | Stripe API key (server) |
| `VITE_STRIPE_PUBLIC_KEY` | Stripe publishable key (client) |

### Auto-populated (Replit)
| Variable | Purpose |
|----------|---------|
| `REPLIT_DOMAINS` | Domain list for OIDC |
| `REPL_ID` | Replit app identifier |
| `ISSUER_URL` | OIDC issuer (default: Replit) |
| `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE` | DB config |

---

## Running the Project

### Development
```bash
npm run dev  # Starts Express + Vite (port 5000)
```

### Database
```bash
npm run db:push      # Push schema changes
npm run db:push --force  # Force sync (careful!)
npm run db:studio    # Open Drizzle Studio
```

### Workflows
- **Start application**: `npm run dev` - Main development server

---

## Key Implementation Notes

1. **No Docker/Containers**: Replit uses Nix environment
2. **Port 5000**: Frontend binds here (Express + Vite proxy)
3. **Drizzle Migrations**: Use `db:push` not manual SQL
4. **ID Types**: All use varchar with UUID default (don't change!)
5. **Sessions**: PostgreSQL-backed, 7-day TTL
6. **Images**: Unsplash CDN fallback for demo data

---

## Recent Changes (December 2024)

- Implemented dual authentication (OIDC + Local login)
- Added test credentials: `test@inmogestion.com` / `admin123`
- Login modal with email/password form + Google OAuth option
- 7-day session persistence with auto-renewal
- Property carousels with Unsplash CDN images
- Subscription plans component ($29/$79/$149)
