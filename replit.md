# Overview

This is a real estate property listing platform built as a full-stack web application. The system enables real estate agencies to list and manage properties, while users can search, browse, and view property listings. The platform includes subscription-based access control with Stripe payment integration and uses Replit's authentication system for user management.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Technology Stack:**
- React with TypeScript for the UI layer
- Vite as the build tool and development server
- Wouter for client-side routing
- TanStack Query (React Query) for server state management
- Shadcn/ui component library built on Radix UI primitives
- Tailwind CSS for styling with custom design tokens

**Design System:**
- Custom color palette with primary orange/coral (#FF5733) and secondary purple (#7E57C2)
- Neutral base colors for backgrounds and text
- CSS variables for theming support
- Responsive design with mobile-first approach

**State Management:**
- TanStack Query handles all server state with built-in caching
- Local React state for UI-specific concerns
- React Hook Form with Zod validation for form state

## Backend Architecture

**Server Framework:**
- Express.js REST API
- TypeScript for type safety
- Session-based authentication using express-session
- PostgreSQL session store for persistent sessions

**API Design:**
- RESTful endpoints organized by resource type (agencies, properties, locations, etc.)
- Centralized route registration in `server/routes.ts`
- Request/response logging middleware for debugging
- JSON body parsing with raw body preservation for webhooks

**Authentication & Authorization:**
- Replit OpenID Connect (OIDC) integration via Passport.js
- Session-based authentication with secure cookies
- User information stored in PostgreSQL
- Protected routes using `isAuthenticated` middleware

## Data Layer

**Database:**
- PostgreSQL (via Neon serverless)
- Drizzle ORM for type-safe database queries
- Schema-first approach with migrations in `migrations/` directory
- WebSocket connection pooling for serverless compatibility

**Schema Design:**
- `users` - User accounts linked to Replit OIDC
- `agencies` - Real estate agencies with owner relationships
- `properties` - Property listings with rich metadata (location, category, pricing, features)
- `locations` - Geographic locations for property filtering
- `propertyCategories` - Property type taxonomy (casa, departamento, terreno, etc.)
- `banners` - Advertisement/banner management
- `sessions` - Express session storage

**Data Access Pattern:**
- Storage abstraction layer (`server/storage.ts`) provides consistent interface
- Supports filtering, pagination, and search operations
- Type-safe queries using Drizzle's query builder
- Separate schema definitions in `shared/schema.ts` for reuse across client/server

## External Dependencies

**Payment Processing:**
- Stripe integration for subscription management
- Webhook handling for payment events
- Customer and subscription ID tracking in user records
- Three-tier subscription plans (Basic, Professional, Enterprise)

**Authentication Service:**
- Replit OIDC for user authentication
- Automatic session management with PostgreSQL backing
- Secure cookie configuration with HTTP-only and secure flags

**Database Service:**
- Neon serverless PostgreSQL
- Connection via `@neondatabase/serverless` package
- WebSocket-based connection for serverless environments
- Connection pooling for performance

**Third-Party UI Libraries:**
- Radix UI for accessible component primitives
- Stripe Elements for payment UI components
- Google Fonts for typography (Inter, DM Sans, Fira Code, etc.)

**Development Tools:**
- Replit-specific Vite plugins for development experience
- Runtime error overlay for debugging
- Dev banner and cartographer for Replit integration
- ESBuild for production server bundling