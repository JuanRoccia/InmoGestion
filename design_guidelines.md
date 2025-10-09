# Design Guidelines: Real Estate Multi-Tenant SaaS Platform

## Design Approach
**Selected Framework:** Reference-Based (Airbnb + Zillow patterns) with custom brand identity
Modern real estate platforms prioritize visual storytelling through property imagery while maintaining professional credibility for B2B SaaS users.

## Core Design Elements

### A. Color Palette

**Primary Colors:**
- Brand Orange: 16 89% 60% (primary actions, CTAs, active states)
- Brand Purple: 263 48% 55% (secondary elements, badges, highlights)

**Supporting Neutrals:**
- Background Dark: 240 10% 8% (main background)
- Surface Dark: 240 8% 12% (cards, elevated surfaces)
- Border Dark: 240 6% 20% (dividers, card borders)
- Text Primary: 0 0% 95% (headings, primary text)
- Text Secondary: 240 5% 65% (descriptions, metadata)

**Accent States:**
- Success: 142 76% 45% (available properties)
- Warning: 38 92% 50% (pending/reserved)

### B. Typography

**Font Family:** Inter via Google Fonts (professional, excellent screen readability)

**Type Scale:**
- Hero/Display: text-5xl/text-6xl font-bold (property hero titles)
- Section Headings: text-3xl/text-4xl font-semibold
- Card Titles: text-xl font-semibold
- Body Text: text-base font-normal
- Metadata/Labels: text-sm font-medium
- Micro Copy: text-xs font-medium (badges, tags)

### C. Layout System

**Spacing Units:** Tailwind units of 2, 4, 6, 8, 12, 16, 24 for consistent rhythm

**Container Strategy:**
- Full-width sections with inner max-w-7xl mx-auto px-6
- Property cards: Consistent 16:10 aspect ratio for main images
- Horizontal carousels: gap-6 with snap-x scroll behavior
- Grid layouts: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 for property grids

### D. Component Library

**Navigation:**
- Sticky header with glass-morphism effect (backdrop-blur-xl bg-surface/80)
- Logo left, main nav center, user menu + agency switcher right
- Mobile: Slide-in drawer with agency context at top

**Property Cards (Critical Component):**
- Elevated surface (bg-surface border border-border) with rounded-xl
- 16:10 aspect ratio image with object-cover
- Hover: Subtle lift (translate-y-[-4px] transition-transform)
- Top-right badges: Operation type (VENTA/ALQUILER/TEMPORARIO) in brand-orange with white text
- Bottom overlay gradient for price visibility
- Price: Large, bold, white text with backdrop-blur
- Below image: Location (text-sm text-secondary), property type, key specs (bed/bath/sqm) with icons

**Horizontal Carousels:**
- Section title + "Ver todas" link in brand-purple
- Overflow-x-auto with snap-x snap-mandatory
- Cards: min-w-[320px] md:min-w-[380px] with gap-6
- Custom scrollbar: thin, rounded, brand-orange thumb
- Scroll indicators: Gradient fade edges (left/right)

**Filters & Search:**
- Sticky filter bar below header on listing pages
- Pill-style filter chips with brand-purple active state
- Price range slider with dual thumbs in brand-orange
- Search input: Large, prominent with icon-left pattern

**Dashboard Components (Multi-tenant SaaS):**
- Agency switcher dropdown: Cards showing agency logos + names
- Stats cards: Metric number (brand-orange), label (text-secondary), trend indicator
- Activity feed: Timeline pattern with property thumbnails
- Quick actions: Floating action button (FAB) brand-orange for "+ Nueva Propiedad"

**Forms:**
- Input fields: bg-surface border-border focus:border-orange
- Labels: text-sm font-medium text-secondary mb-2
- Multi-step property upload: Progress stepper with brand-purple completed states

### E. Images & Media

**Hero Section:**
- Large hero with property showcase montage or cityscape
- Height: 70vh with gradient overlay (bottom to top, dark to transparent)
- Centered search bar overlaid on hero
- Floating property count badge: "12,500+ Propiedades Activas"

**Property Images:**
- Thumbnail gallery: Horizontal scroll below main image on detail pages
- Lazy loading with blur-up placeholder effect
- Lightbox gallery for full-screen viewing

**Placement Strategy:**
- Hero: Wide cityscape or property collage
- Property cards: High-quality exterior/interior shots
- Agency profiles: Logo + cover photo in dashboard
- Empty states: Illustrative icons or subtle illustrations

### F. Interactions & Micro-animations

**Minimal Animation Philosophy:**
- Card hover: Subtle lift (4px) + shadow increase
- Filter selection: Scale pulse (1.05) on click
- Carousel auto-scroll: Smooth momentum with pause on hover
- Loading states: Skeleton screens matching card structure
- NO gratuitous scroll animations or parallax effects

## Viewport & Responsive Strategy

**Desktop (lg+):**
- 3-column property grids
- Horizontal carousels show 3.5 cards (creating scroll affordance)
- Side-by-side filter panel + results

**Tablet (md):**
- 2-column grids
- Carousels show 2.2 cards
- Collapsible filter drawer

**Mobile (base):**
- Single column stacking
- Carousels show 1.2 cards with peek
- Bottom sheet filters
- Sticky CTA bar for actions

## Page-Specific Layouts

**Landing/Marketing:**
- Hero with search (70vh)
- Featured carousels by operation type (3 sections: Venta, Alquiler, Temporario)
- Trust indicators: Agency count, property count, cities served
- CTA section: Dual path (Agencies: "Comenzar Gratis" / Users: "Explorar Propiedades")

**Dashboard (SaaS Admin):**
- Top: KPI cards (4-column grid)
- Middle: Recent properties table + Activity timeline (2-column)
- Right sidebar: Quick actions + Notifications

**Property Listing:**
- Sticky filter bar
- Results grid with infinite scroll
- Map view toggle (split-screen option)

**Property Detail:**
- Full-width image gallery
- 2-column layout: Details left (60%), Agent contact card right (40%)
- Suggested properties carousel at bottom

## Accessibility

- Dark mode throughout (primary design)
- Focus indicators: 2px brand-orange outline with offset
- Alt text required for all property images
- Keyboard navigation for carousels (arrow keys)
- ARIA labels on all interactive elements
- High contrast maintained: 4.5:1 minimum for text