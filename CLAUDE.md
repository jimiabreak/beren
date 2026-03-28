# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Beren — a restaurant website for a Turkish/Mediterranean restaurant in Texas, built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, and **Sanity v3**. Built on the Bonsai starter kit, customized for Beren's specific needs: a modular **page builder** system, CMS-driven navigation, embedded Sanity Studio at `/studio`, Visual Editing via the Presentation API + next-sanity, tag-based ISR with webhook revalidation, CMS-driven redirects, consent-gated GA4, JSON-LD structured data (Restaurant type), and a newsletter system.

**This is NOT a blog site.** There is no blog system, no blog routes, no blog categories/tags. All blog-related code from the starter kit should be removed or ignored.

Content is managed entirely from the CMS — no code changes needed for content updates or new pages.

### Figma Design Reference

- **Figma file:** https://www.figma.com/design/9TlEiXE64NJ6TBbTmr1tVr/BEREN?node-id=260-35
- Always reference the Figma when building or modifying sections/pages

## Site Pages

| Page | Route | Description |
|------|-------|-------------|
| **Home** | `/` | Hero with "A Taste of Turkey in Texas" tagline, large BEREN logo, food photography grid, location teaser, newsletter signup |
| **Our Menu** | `/menu` | Tab-based PDF menu viewer — each tab loads a different PDF (e.g., Breakfast, Lunch, Dinner, Drinks). No inline text menus. |
| **Our Story** | `/our-story` | Team/founders photo, image gallery grid, story text sections about the restaurant and its roots |
| **Catering** | `/catering` | Catering services info, food photography, descriptive text, CTA to contact |
| **Get In Touch** | `/contact` | Contact form (Resend), "Getting There" section with address/map, business hours |

### Menu Page — PDF Tab Structure

The Menu page is a **custom page route** (not a modular page) with a tab interface:

- Each tab represents a menu category (e.g., Breakfast, Lunch, Dinner, Drinks, Desserts)
- Tabs are CMS-driven — a Sanity document type `menuCategory` stores the tab label + PDF file asset
- Clicking a tab displays the corresponding PDF inline (embedded viewer or image-rendered PDF)
- No text-based menu items — menus are uploaded as PDF files in Sanity

### Removed from Starter Kit

The following Bonsai Blog features are **not used** and should be ignored/removed:

- Blog system (routes: `/blog`, `/blog/[slug]`, `/blog/category/[slug]`)
- Blog-related Sanity schemas: `blogPost`, `category`, `tag`
- Blog-related components: `BlogPostCard`, `BlogPostGrid`, `Pagination`, `CategoryFilter`
- `BlogGridSection` page builder section
- Blog-related GROQ queries and projections
- `llms.txt` and `llms-full.txt` routes (unless repurposed)

## Development Commands

```bash
npm run dev          # Start Next.js development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # ESLint
npm run typecheck    # TypeScript validation (tsc --noEmit)
npm run typegen      # Sanity schema extract + TypeScript type generation
```

## Architecture

### Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS with CSS custom properties
- **Animations:** Framer Motion
- **CMS:** Sanity v3 (embedded Studio at `/studio`, Visual Editing via Presentation API)
- **Email:** Resend (contact form + newsletter)
- **Fonts:** TBD — update once Beren's brand fonts are confirmed (the Figma uses a distinctive rounded/geometric display font for "BEREN" and a clean body font)

### Data Flow

Server components fetch data via `sanityFetch()` (from `@/sanity/lib/live`) with `tags` for ISR cache invalidation. Every page fetches `siteSettings` for shared data, plus `HEADER_QUERY` and `FOOTER_QUERY` for CMS-driven navigation and footer content (Header/Footer fall back to hardcoded defaults if CMS data is missing). The root layout also fetches the active `promoBanner`. The contact form API writes submission documents to Sanity in parallel with sending email via Resend.

### File Structure

```
app/
├── page.tsx                  # Home (server component, uses SectionRenderer)
├── layout.tsx                # Root layout (fonts, SanityLive, VisualEditing)
├── globals.css               # CSS variables + base styles
├── sitemap.ts                # Dynamic sitemap generation
├── not-found.tsx             # 404 page
├── [slug]/page.tsx           # Dynamic modular pages (our-story, catering, etc.)
├── menu/page.tsx             # Menu page — PDF tab viewer (custom route)
├── contact/page.tsx          # Contact page (form + location info)
├── studio/[[...tool]]/       # Embedded Sanity Studio
├── api/contact/route.ts      # Contact form API (Resend + Sanity submissions)
├── api/revalidate/route.ts   # Webhook revalidation endpoint
├── api/newsletter/route.ts   # Newsletter subscription endpoint
└── api/draft/                # Draft mode enable/disable endpoints
middleware.ts                 # Edge middleware for CMS-driven redirects
components/
├── layout/                   # Header, Footer, Container, MobileNav, ThemedHeader
├── ui/                       # Button, Card, NewsletterSignup, CookieConsent, PromoBanner
├── menu/                     # MenuTabs, PdfViewer — tab-based PDF menu components
├── sanity/
│   ├── SanityImage.tsx            # Sanity image component
│   ├── VisualEditing.tsx          # Visual editing integration
│   └── PortableTextComponents.tsx # Custom portable text renderers
├── sections/                 # Page builder section components
│   ├── SectionRenderer.tsx            # Maps section _type to React components
│   ├── HeroSection.tsx                # hero
│   ├── FeatureGridSection.tsx         # featureGrid
│   ├── RichTextBlockSection.tsx       # richTextBlock
│   ├── ImageGallerySection.tsx        # imageGallery
│   ├── TestimonialCarouselSection.tsx # testimonialCarousel
│   ├── CtaBannerSection.tsx           # ctaBanner
│   ├── VideoSection.tsx               # videoSection
│   ├── StatsBarSection.tsx            # statsBar
│   ├── LogoBarSection.tsx             # logoBar
│   ├── SpacerSection.tsx              # spacer
│   ├── NewsletterSectionBlock.tsx     # newsletterSection
│   ├── SplitContent.tsx               # splitContent
│   ├── ContactForm.tsx                # contactForm
│   ├── Embed.tsx                      # embed
│   └── CateringSection.tsx            # catering info section (new)
├── animations/
│   └── PageTransition.tsx    # Page transition animation wrapper
├── analytics/
│   └── GoogleAnalytics.tsx   # Consent-gated GA4
├── seo/
│   └── JsonLd.tsx            # JSON-LD structured data renderer
└── MotionProvider.tsx        # Framer Motion LazyMotion provider
sanity/
├── env.ts                    # Environment variable assertions
├── lib/
│   ├── client.ts             # Sanity client instance
│   ├── image.ts              # Image URL builder
│   ├── live.ts               # sanityFetch() and SanityLive (defineLive)
│   └── queries.ts            # All GROQ queries (with MODULAR_PAGE_SECTIONS_PROJECTION)
├── structure/
│   └── index.ts              # Custom desk structure (grouped singletons, documents, sections)
└── schemaTypes/
    ├── index.ts              # Schema registry
    ├── objects/
    │   ├── portableText.ts   # Rich text block type
    │   ├── socialLink.ts     # Social media link
    │   ├── openingHours.ts   # Business hours
    │   ├── seo.ts            # SEO metadata
    │   ├── cta.ts            # Call-to-action button object
    │   └── megaMenuGroup.ts  # Mega menu group object
    ├── sections/             # Page builder section schemas
    │   ├── hero.ts
    │   ├── featureGrid.ts
    │   ├── richTextBlock.ts
    │   ├── imageGallery.ts
    │   ├── testimonialCarousel.ts
    │   ├── ctaBanner.ts
    │   ├── videoSection.ts
    │   ├── statsBar.ts
    │   ├── logoBar.ts
    │   ├── spacer.ts
    │   ├── newsletterSection.ts
    │   ├── splitContent.ts
    │   ├── contactForm.ts
    │   └── embed.ts
    ├── singletons/           # siteSettings, homePage, header, footer, redirects
    └── documents/            # menuCategory (new), teamMember, testimonial, faqItem, galleryImage, modularPage, submission, redirect, promoBanner
lib/
├── animations.ts             # Shared Framer Motion variants
├── consent.ts                # Cookie consent read/write utilities
└── structuredData.ts         # JSON-LD generators (Restaurant, WebSite, WebPage)
sanity.config.ts              # Sanity Studio configuration
```

## Key Patterns

### Server/Client Component Split

- **Server components** (page.tsx files): data fetching with `sanityFetch()`, SEO metadata, layout composition
- **Client components** (marked `"use client"`): interactivity (forms, tabs, accordions, animations)
- **Pattern:** server component fetches data and passes it as props to a client component

```tsx
// app/page.tsx (server) — typical page pattern
const [{ data: settings }, { data: headerData }, { data: footerData }, { data: page }] = await Promise.all([
  sanityFetch({ query: SITE_SETTINGS_QUERY, tags: ['siteSettings'] }),
  sanityFetch({ query: HEADER_QUERY, tags: ['header'] }),
  sanityFetch({ query: FOOTER_QUERY, tags: ['footer'] }),
  sanityFetch({ query: HOME_PAGE_QUERY, tags: ['homePage'] }),
])
return (
  <>
    <Header siteSettings={settings} megaNavigation={headerData?.megaNavigation} secondaryNavigation={headerData?.secondaryNavigation} cta={headerData?.cta} />
    <main id="main">
      <SectionRenderer sections={page?.sections} />
    </main>
    <Footer siteSettings={settings} footerData={footerData} />
  </>
)
```

### Adding a New Page

For most pages, create a `modularPage` document in Sanity with the desired slug — no code changes needed. The `app/[slug]/page.tsx` catch-all route handles all modular pages automatically.

For pages with custom logic (e.g., menu with PDF tabs):

1. Create `app/[page-name]/page.tsx` as a server component
2. Add a GROQ query to `sanity/lib/queries.ts`
3. Fetch data with `sanityFetch()` from `@/sanity/lib/live`
4. Fetch `SITE_SETTINGS_QUERY`, `HEADER_QUERY`, and `FOOTER_QUERY` for Header/Footer
5. Create a client component if the page needs interactivity

### Adding a New Sanity Schema

1. Create the schema file in the appropriate directory:
   - `sanity/schemaTypes/documents/` for document types (multiple entries)
   - `sanity/schemaTypes/singletons/` for singleton documents (one of each)
   - `sanity/schemaTypes/objects/` for reusable object types
2. Register it in `sanity/schemaTypes/index.ts`
3. Add GROQ queries to `sanity/lib/queries.ts`
4. Run `npm run typegen` to regenerate TypeScript types

### Page Builder Pattern

Pages use a modular `sections` field (array of section objects) that is rendered by `<SectionRenderer sections={page?.sections} />`.

**How it works:**

1. In Sanity, `homePage` and `modularPage` documents include a `sections` field — an array of typed section objects.
2. GROQ queries use the shared `MODULAR_PAGE_SECTIONS_PROJECTION` fragment to resolve all section types and their referenced data.
3. The `SectionRenderer` component maps each section's `_type` to the corresponding React component.

**Adding a new section:**

1. Create the schema in `sanity/schemaTypes/sections/mySection.ts`
2. Register it in `sanity/schemaTypes/index.ts`
3. Add `defineArrayMember({ type: 'mySection' })` to `modularPage.ts` and `homePage.ts` sections arrays
4. Add its projection to `MODULAR_PAGE_SECTIONS_PROJECTION` in `sanity/lib/queries.ts`
5. Create the React component in `components/sections/MySectionBlock.tsx`
6. Register the component mapping in `components/sections/SectionRenderer.tsx`
7. Add the TypeScript interface in `types/index.ts` and add it to the `ModularPageSection` union
8. Run `npm run typegen` to regenerate Sanity types

### Animation Pattern

Import shared variants from `@/lib/animations` and use with Framer Motion:

```tsx
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";

<motion.div
  variants={staggerContainer}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
>
  <motion.div variants={fadeInUp}>Child 1</motion.div>
  <motion.div variants={fadeInUp}>Child 2</motion.div>
</motion.div>;
```

Available variants: `fadeInUp`, `fadeIn`, `staggerContainer`, `pageTransition`

## Color System

CSS variables defined in `app/globals.css`, mapped to Tailwind in `tailwind.config.ts`:

| Variable                      | Value     | Tailwind Class            |
| ----------------------------- | --------- | ------------------------- |
| `--color-background`          | `#86351C` | `bg-background`           |
| `--color-background-light`    | `#E8E7DC` | `bg-background-light`     |
| `--color-foreground`          | `#DCDBC4` | `text-foreground`         |
| `--color-foreground-dark`     | `#86351C` | `text-foreground-dark`    |
| `--color-muted`               | `#6E2C17` | `bg-muted`                |
| `--color-muted-foreground`    | `#E8E7DC` | `text-muted-foreground`   |
| `--color-border`              | `#A0543F` | `border-border`           |
| `--color-accent`              | `#FF5B00` | `bg-accent`/`text-accent` |

Dark terracotta + warm cream two-tone system with bright orange accent. Headlines/nav use `--color-foreground` (#DCDBC4), body copy uses `--color-muted-foreground` (#E8E7DC). Light backgrounds (Menu page) use `bg-background-light` + `text-foreground-dark`.

## Fonts

**TBD — Extract from Figma:** The "BEREN" wordmark uses a distinctive rounded/geometric display typeface. Body text appears to be a clean, warm font. Once confirmed:

- **`font-display`** — BEREN logo/wordmark, major headings
- **`font-sans`** — body text, UI elements
- **`font-mono`** — labels, accents, small UI text (if needed)

Load via `next/font/google` or `next/font/local` in `app/layout.tsx` and expose as CSS variables.

## Environment Variables

| Variable                         | Required | Description                                            |
| -------------------------------- | -------- | ------------------------------------------------------ |
| `NEXT_PUBLIC_SANITY_PROJECT_ID`  | Yes      | Sanity project ID (from sanity.io/manage)              |
| `NEXT_PUBLIC_SANITY_DATASET`     | Yes      | Sanity dataset name (usually `production`)             |
| `NEXT_PUBLIC_SANITY_API_VERSION` | No       | Sanity API version (default: `2024-01-01`)             |
| `SANITY_API_READ_TOKEN`          | Yes      | Sanity read token (for live preview + fetching)        |
| `SANITY_API_WRITE_TOKEN`         | Yes      | Sanity write token (form submissions)                  |
| `RESEND_API_KEY`                 | Yes      | Resend API key (for contact form + newsletter emails)  |
| `CONTACT_EMAIL_TO`               | Yes      | Destination email for contact form submissions         |
| `CONTACT_EMAIL_FROM`             | Yes      | Sender address for contact form emails                 |
| `SANITY_WEBHOOK_SECRET`          | Yes      | Shared secret for webhook signature validation         |
| `NEXT_PUBLIC_SITE_URL`           | No       | Production URL (used in sitemap, SEO)                  |
| `NEXT_PUBLIC_GA_ID`              | No       | Google Analytics measurement ID (consent-gated)        |

See `.env.local.example` for the full template.

## ISR + Webhook Revalidation

All `sanityFetch()` calls use `tags: string[]` for cache invalidation. The `REVALIDATION_MAP` in `app/api/revalidate/route.ts` maps Sanity document `_type` to cache tags:

- `siteSettings` -> `['siteSettings']`
- `modularPage` -> `['modularPages']`
- `homePage` -> `['homePage']`
- `header` -> `['header']`
- `footer` -> `['footer']`
- `promoBanner` -> `['promoBanner']`
- `menuCategory` -> `['menuCategories']`

Sanity webhook posts to `/api/revalidate` with `parseBody` from `next-sanity/webhook` for signature validation.

## New Sanity Schema: menuCategory

A new document type for the PDF menu tab system:

```ts
// sanity/schemaTypes/documents/menuCategory.ts
{
  name: 'menuCategory',
  title: 'Menu Category',
  type: 'document',
  fields: [
    { name: 'title', type: 'string', title: 'Tab Label' },        // e.g., "Breakfast", "Lunch"
    { name: 'slug', type: 'slug', title: 'Slug' },
    { name: 'pdf', type: 'file', title: 'Menu PDF' },              // PDF upload
    { name: 'order', type: 'number', title: 'Display Order' },     // Tab ordering
    { name: 'isActive', type: 'boolean', title: 'Active' },        // Show/hide tab
  ],
  orderings: [{ title: 'Display Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
}
```

## Contact Form + Newsletter

**Contact Form** (`/contact`):
- Collects: name, email, phone (optional), subject, message
- API: `POST /api/contact` — sends email via Resend + writes `submission` doc to Sanity
- Destination: configured via `CONTACT_EMAIL_TO` env var

**Newsletter Signup** (appears on Home page and optionally other pages):
- Collects: email only
- API: `POST /api/newsletter` — sends via Resend
- Can be placed on any page via the `newsletterSection` page builder section

## SEO + Structured Data

- `lib/structuredData.ts` — JSON-LD objects using **Restaurant** schema type (not generic Organization)
- `components/seo/JsonLd.tsx` — renders `<script type="application/ld+json">`
- `app/robots.ts` — dynamic robots
- Include: name, address, cuisine type (Turkish/Mediterranean), opening hours, menu URL, contact info

## Header / Navigation

Simple flat navigation with 5 links: Home, Our Menu, Our Story, Catering, Get In Touch. The mega-menu system from the starter kit can be simplified to a clean nav bar matching the Figma design. Mobile uses a hamburger menu with slide-out drawer.

## Analytics + Consent

- `lib/consent.ts` — reads/writes `cookie-consent` cookie
- `components/ui/CookieConsent.tsx` — consent banner
- `components/analytics/GoogleAnalytics.tsx` — loads GA4 only after analytics consent

## Custom Commands (Designer Skills)

| Command | Purpose |
|---------|---------|
| `/add-section` | Walk through adding a new page builder section (schema + component + registration) |
| `/theme` | Customize colors, fonts, and visual identity |
| `/new-page` | Scaffold a custom page route with data fetching |
| `/audit` | Run accessibility, performance, and SEO audit |
| `/deploy` | Full deployment and go-live checklist |

## Testing Checklist

- Mobile responsive (320px minimum)
- Keyboard navigation works
- Images have alt text
- PDF menu tabs load and display correctly on mobile + desktop
- Contact form validates inputs and sends email
- Newsletter signup works
- SEO meta tags present on every page
- JSON-LD structured data validated (Restaurant type)
- Cookie consent banner appears for new visitors
- Promo banner shows/dismisses correctly
- Lighthouse score 95+ target (all categories)
- Visual Editing works in Sanity Studio (Presentation tool)
