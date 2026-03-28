# Restaurant Boilerplate Design

**Date:** 2026-02-17
**Status:** Approved
**Approach:** Hybrid — keep 6 proven generic components, rebuild everything else

---

## Overview

Convert the Commonwealth Coffee website into a reusable restaurant boilerplate. Strip all client-specific content, rebuild pages as Sanity CMS-driven, add Visual Editing, and ship with placeholder seed data.

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Pages | Home, Menu, About, Contact, FAQ, Privacy, 404 | Core set + FAQ and Privacy for production readiness |
| Studio route | `/studio` | Sanity convention, clean separation |
| Fonts | Inter + Playfair Display | Clean sans + elegant serif, universally appropriate |
| Contact form | Resend + reCAPTCHA v3 | Proven pattern, free tier friendly |
| Color palette | Neutral elegant | Cream/charcoal/warm gold, easy to customize via CSS variables |
| Approach | Hybrid | Keep Container, MobileNav, Button, Card, MenuItem, FAQAccordion; rebuild the rest |
| Menu schema | Reference-based | Items reference categories; enables reuse (featured on home + menu page) |

## Remove (Client-Specific)

- All Shopify code: `lib/shopify.ts`, `lib/shopify-test.ts`, `components/ui/SubscriptionCard.tsx`
- Pages: `/subscription`, `/gift-cards`, `/events`
- API routes: `/api/shopify-status`
- All `/content` directory (static JSON/MD — replaced by Sanity)
- All `/public/images` Commonwealth brand assets (73 files)
- All `/public/videos` (3 files)
- Legacy Sanity schemas: `menuItem.ts`, `menuCategory.ts`, `menuTab.ts`, `dietaryKey.ts`
- Scripts: `migrate-menu-to-inline.ts`, `test-shopify.ts`
- Docs: `DESIGN_AUDIT.md`, `QUICK_START.md`, `SANITY_SETUP.md`, `SANITY_MIGRATION.md`
- Old sanity schema simplification design doc

## Keep (Generic Components)

- `components/layout/Container.tsx` — layout wrapper
- `components/layout/MobileNav.tsx` — props-driven mobile nav
- `components/ui/Button.tsx` — multi-variant button
- `components/ui/Card.tsx` — content card with image
- `components/ui/MenuItem.tsx` — menu item display
- `components/ui/FAQAccordion.tsx` — accordion with Framer Motion

## Architecture

```
bonsai-boilerplate/
├── app/
│   ├── layout.tsx                    # Root layout (Inter + Playfair Display)
│   ├── page.tsx                      # Home
│   ├── menu/page.tsx                 # Menu
│   ├── about/page.tsx                # About
│   ├── contact/page.tsx              # Contact
│   ├── faq/page.tsx                  # FAQ
│   ├── privacy/page.tsx              # Privacy
│   ├── not-found.tsx                 # 404
│   ├── sitemap.ts                    # Dynamic sitemap
│   ├── studio/[[...tool]]/page.tsx   # Sanity Studio
│   └── api/
│       ├── contact/route.ts          # Resend + reCAPTCHA
│       └── draft/route.ts            # Visual Editing draft mode
├── components/
│   ├── layout/
│   │   ├── Container.tsx             # Keep
│   │   ├── Header.tsx                # Rebuild: Sanity-driven
│   │   ├── Footer.tsx                # Rebuild: Sanity-driven
│   │   └── MobileNav.tsx             # Keep
│   ├── ui/
│   │   ├── Button.tsx                # Keep
│   │   ├── Card.tsx                  # Keep
│   │   ├── MenuItem.tsx              # Keep
│   │   ├── FAQAccordion.tsx          # Keep
│   │   ├── TestimonialCard.tsx       # New
│   │   ├── TeamCard.tsx              # New
│   │   └── GalleryGrid.tsx           # New
│   └── sanity/
│       ├── VisualEditing.tsx         # Visual Editing overlay
│       └── SanityImage.tsx           # Sanity CDN image helper
├── sanity/
│   ├── env.ts                        # Centralized env vars
│   ├── lib/
│   │   ├── client.ts                 # Sanity client
│   │   ├── queries.ts                # All GROQ queries
│   │   ├── image.ts                  # Image URL builder
│   │   └── live.ts                   # Visual Editing / live content
│   └── schemaTypes/
│       ├── index.ts                  # Schema registry
│       ├── documents/
│       │   ├── menuItem.ts
│       │   ├── menuCategory.ts
│       │   ├── page.ts
│       │   ├── teamMember.ts
│       │   ├── testimonial.ts
│       │   ├── faqItem.ts
│       │   └── galleryImage.ts
│       ├── singletons/
│       │   ├── siteSettings.ts
│       │   └── homePage.ts
│       └── objects/
│           ├── portableText.ts
│           ├── socialLink.ts
│           ├── openingHours.ts
│           └── seo.ts
├── lib/
│   ├── animations.ts                 # Framer Motion variants
│   └── utils.ts                      # General utilities
├── types/
│   └── index.ts                      # TypeScript definitions
└── public/
    ├── images/placeholder-*.jpg
    └── favicon.ico
```

## Sanity Schemas

### Singletons

**siteSettings**
- `name`: string — restaurant name
- `tagline`: string — short tagline
- `logo`: image — main logo
- `logoAlt`: image — alternate/dark version
- `phone`: string
- `email`: string
- `address`: object { street, city, state, zip, country }
- `location`: geopoint — for map embed
- `hours`: array of openingHours { day, openTime, closeTime, closed }
- `socialLinks`: array of socialLink { platform, url }
- `reservationUrl`: url — optional (OpenTable, Resy, etc.)
- `seo`: seo object { metaTitle, metaDescription, ogImage }

**homePage**
- `hero`: object { heading, subheading, image, ctaText, ctaLink }
- `aboutPreview`: object { heading, body (portableText), image }
- `featuredMenuHeading`: string
- `featuredMenuItems`: array of references → menuItem
- `testimonialHeading`: string
- `featuredTestimonials`: array of references → testimonial
- `ctaSection`: object { heading, body, ctaText, ctaLink, backgroundImage }

### Documents

**menuCategory**
- `name`: string (required)
- `slug`: slug (auto from name)
- `description`: text (optional)
- `menuSection`: string selection — food | drinks | desserts (for tab grouping)
- `order`: number

**menuItem**
- `name`: string (required)
- `description`: text
- `price`: string (e.g., "14" or "8/12")
- `image`: image (optional)
- `category`: reference → menuCategory (required)
- `dietaryTags`: array of strings (V, VG, GF, GFA, DF, N)
- `featured`: boolean
- `available`: boolean (default true — 86 toggle)
- `order`: number

**teamMember**
- `name`: string (required)
- `role`: string
- `bio`: portableText
- `image`: image (required)
- `order`: number

**testimonial**
- `author`: string (required)
- `quote`: text (required)
- `rating`: number (1-5, optional)
- `source`: string (optional)
- `date`: date

**faqItem**
- `question`: string (required)
- `answer`: portableText (required)
- `order`: number
- `category`: string (optional grouping)

**galleryImage**
- `image`: image (required)
- `caption`: string (optional)
- `alt`: string (required)
- `order`: number

**page** (generic content pages)
- `title`: string (required)
- `slug`: slug (required)
- `body`: portableText
- `seo`: seo object

### Object Types

- `portableText` — rich text: headings, links, bold/italic, images
- `socialLink` — { platform: dropdown (facebook, instagram, twitter, tiktok, yelp, google), url }
- `openingHours` — { day: dropdown (Mon-Sun), openTime: string, closeTime: string, closed: boolean }
- `seo` — { metaTitle, metaDescription, ogImage }

## Visual Editing

1. `presentationTool()` plugin in `sanity.config.ts` — iframe preview with click-to-edit
2. `/api/draft/route.ts` — `defineEnableDraftMode` from `next-sanity`
3. `SanityLive` client component in root layout — real-time updates in draft mode
4. `sanityFetch()` from `defineLive` — auto-handles draft vs published in server components
5. `VisualEditing` component from `next-sanity` — renders overlay only in draft mode
6. Stega encoding — invisible metadata in text fields for click-to-edit mapping

## Pages

**Home:** Hero (full-width image, heading, CTA) → About preview (2-col) → Featured menu items (grid) → Testimonials → CTA banner

**Menu:** Category tabs → Items grouped by category → Name, price, description, dietary tags, optional image → `available: false` items hidden

**About:** Story section (portableText from page doc) → Team grid (teamMember cards) → Gallery (galleryImage masonry grid)

**Contact:** Form (name, email, phone, message) via Resend + reCAPTCHA → Map from siteSettings.location → Hours from siteSettings.hours → Reservation CTA if reservationUrl exists

**FAQ:** Accordion from faqItem docs sorted by order, optionally grouped by category

**Privacy:** Rendered from page document (slug: "privacy") via portableText

**404:** Styled error page with "Return Home" button

## Animations

Shared `lib/animations.ts`:
- `fadeInUp` — opacity 0/y:20 → opacity 1/y:0
- `fadeIn` — opacity 0 → 1
- `staggerContainer` — stagger children by 0.1s
- `scaleOnHover` — scale 1.02 on hover, 0.98 on tap

Applied:
- Page transitions via AnimatePresence (fade between routes)
- Scroll-triggered sections via whileInView + fadeInUp
- Staggered lists for menu items, testimonials, team cards
- Subtle hover on cards/buttons
- All animations respect prefers-reduced-motion

## Color System

```css
:root {
  --color-background: #FAFAF8;
  --color-foreground: #1A1A1A;
  --color-primary: #B8860B;
  --color-primary-light: #D4A843;
  --color-muted: #F5F5F0;
  --color-muted-foreground: #737373;
  --color-border: #E5E5E0;
  --font-sans: 'Inter', sans-serif;
  --font-serif: 'Playfair Display', serif;
}
```

## Environment Variables

```env
# Required — Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_READ_TOKEN=

# Required — Contact Form
RESEND_API_KEY=
CONTACT_EMAIL_TO=
CONTACT_EMAIL_FROM=
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=
RECAPTCHA_SECRET_KEY=

# Optional
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_GA_ID=
```

## Seed Data

Placeholder content so the studio isn't empty on first run:
- siteSettings: "The Restaurant", placeholder address, Mon-Sun 11am-10pm
- homePage: hero heading, about preview, CTA
- 4 menuCategories: Appetizers, Mains, Desserts, Drinks
- 12-16 menuItems: 3-4 per category with realistic names/prices
- 2 teamMembers: Head Chef, General Manager
- 3 testimonials
- 5 faqItems: generic restaurant FAQs
- Placeholder gallery images (Unsplash references)
- Privacy policy page template
- About page template
