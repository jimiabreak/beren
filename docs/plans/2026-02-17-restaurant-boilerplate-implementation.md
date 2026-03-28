# Restaurant Boilerplate Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Convert the Commonwealth Coffee site into a reusable restaurant boilerplate with Sanity CMS, Visual Editing, and 7 pages.

**Architecture:** Hybrid approach — keep 6 generic components (Container, MobileNav, Button, Card, MenuItem, FAQAccordion), rebuild everything else. All content pulled from Sanity. Visual Editing via Presentation API for click-to-edit. Neutral elegant color system with CSS variables.

**Tech Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, Sanity v3, next-sanity, Resend, reCAPTCHA v3

**Design doc:** `docs/plans/2026-02-17-restaurant-boilerplate-design.md`

---

## Phase 1: Strip Client-Specific Code

### Task 1: Remove Shopify and client-specific files

**Files:**
- Delete: `lib/shopify.ts`
- Delete: `lib/shopify-test.ts`
- Delete: `components/ui/SubscriptionCard.tsx`
- Delete: `app/subscription/page.tsx`
- Delete: `app/gift-cards/page.tsx`
- Delete: `app/gift-cards/layout.tsx`
- Delete: `app/events/page.tsx`
- Delete: `app/api/shopify-status/route.ts`
- Delete: `scripts/migrate-menu-to-inline.ts`
- Delete: `scripts/test-shopify.ts`
- Delete: `hooks/useSanityMenu.ts`
- Delete: `content/` directory (all files: menu.json, contact.json, faq.json, home.json, info.md)
- Delete: `docs/DESIGN_AUDIT.md`
- Delete: `docs/QUICK_START.md`
- Delete: `SANITY_SETUP.md`
- Delete: `SANITY_MIGRATION.md`
- Delete: `SANITY-AGENT.md`
- Delete: `docs/plans/2026-01-20-sanity-schema-simplification-design.md`
- Delete: `docs/plans/2026-01-24-contact-form-recaptcha-design.md`

**Step 1: Delete all Shopify-related files**

```bash
rm lib/shopify.ts lib/shopify-test.ts
rm components/ui/SubscriptionCard.tsx
rm -rf app/subscription app/gift-cards
rm app/api/shopify-status/route.ts
```

**Step 2: Delete client-specific scripts and hooks**

```bash
rm scripts/migrate-menu-to-inline.ts scripts/test-shopify.ts
rm hooks/useSanityMenu.ts
```

**Step 3: Delete static content directory (replaced by Sanity)**

```bash
rm -rf content/
```

**Step 4: Delete client-specific docs**

```bash
rm docs/DESIGN_AUDIT.md docs/QUICK_START.md
rm SANITY_SETUP.md SANITY_MIGRATION.md SANITY-AGENT.md
rm docs/plans/2026-01-20-sanity-schema-simplification-design.md
rm docs/plans/2026-01-24-contact-form-recaptcha-design.md
```

**Step 5: Delete client-specific pages**

```bash
rm app/events/page.tsx app/info/page.tsx app/privacy/page.tsx app/faq/page.tsx
```

**Step 6: Remove legacy Sanity schemas**

```bash
rm sanity/schemaTypes/menuItem.ts
rm sanity/schemaTypes/menuCategory.ts
rm sanity/schemaTypes/menuTab.ts
rm sanity/schemaTypes/dietaryKey.ts
rm sanity/schemaTypes/food-menu.ts
rm sanity/schemaTypes/drinks-menu.ts
rm sanity/schemaTypes/seasonal-features.ts
rm -rf sanity/schemaTypes/shared/
```

**Step 7: Clear public assets (keep favicon only)**

```bash
rm -rf public/images/ public/videos/ public/og-image.jpg
mkdir -p public/images
```

**Step 8: Commit**

```bash
git add -A
git commit -m "chore: strip all client-specific code and assets

Remove Shopify integration, Commonwealth Coffee content, brand assets,
legacy Sanity schemas, client-specific pages, and documentation.
Keep generic components: Container, MobileNav, Button, Card, MenuItem, FAQAccordion."
```

---

### Task 2: Update package.json and dependencies

**Files:**
- Modify: `package.json`

**Step 1: Update package.json**

Change name from `coffee-roaster` to `restaurant-boilerplate`. Remove unused dependencies (`gray-matter`, `remark`, `remark-html`, `styled-components`). Add needed dependencies (`@sanity/image-url`, `@portabletext/react` — already included via next-sanity but explicit is better). Install `@sanity/presentation` for Visual Editing.

```json
{
  "name": "restaurant-boilerplate",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typegen": "sanity schema extract && sanity typegen generate --enforce-required-fields",
    "typecheck": "tsc --noEmit",
    "seed": "npx tsx scripts/seed-sanity.ts"
  }
}
```

**Step 2: Remove unused packages, add presentation tool**

```bash
npm uninstall gray-matter remark remark-html styled-components
npm install @sanity/image-url @portabletext/react
```

**Step 3: Verify install**

```bash
npm run typecheck
```

Expected: May have errors from deleted files — that's fine, we'll fix in subsequent tasks.

**Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: update dependencies for restaurant boilerplate

Remove gray-matter, remark, remark-html, styled-components.
Add @sanity/image-url, @portabletext/react.
Rename package to restaurant-boilerplate."
```

---

## Phase 2: Foundation — Design Tokens, Sanity Config, Animation Library

### Task 3: New design tokens and global styles

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`

**Step 1: Rewrite tailwind.config.ts**

Replace all CW brand colors with the neutral elegant palette. Replace Inria font references with Inter/Playfair Display. Keep animations, accessibility tokens, and generic spacing.

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",
        primary: {
          DEFAULT: "var(--color-primary)",
          light: "var(--color-primary-light)",
        },
        muted: {
          DEFAULT: "var(--color-muted)",
          foreground: "var(--color-muted-foreground)",
        },
        border: "var(--color-border)",
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
      },
      minHeight: {
        touch: '44px',
      },
      minWidth: {
        touch: '44px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-up': 'fadeUp 0.5s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
```

**Step 2: Rewrite globals.css**

Replace all CW-specific styles with the neutral elegant palette and Inter/Playfair Display references.

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-background: #FAFAF8;
  --color-foreground: #1A1A1A;
  --color-primary: #B8860B;
  --color-primary-light: #D4A843;
  --color-muted: #F5F5F0;
  --color-muted-foreground: #737373;
  --color-border: #E5E5E0;
}

body {
  color: var(--color-foreground);
  background: var(--color-background);
}

/* Accessibility: minimum touch targets */
@layer utilities {
  .touch-target {
    min-height: 44px;
    min-width: 44px;
  }
}

/* Focus visible for keyboard navigation */
*:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Hide reCAPTCHA badge (disclose in privacy policy) */
.grecaptcha-badge {
  visibility: hidden;
}
```

**Step 3: Rewrite app/layout.tsx**

Replace Inria fonts with Inter + Playfair Display. Remove all CW metadata. Set up generic restaurant metadata.

```tsx
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Restaurant Name",
    template: "%s | Restaurant Name",
  },
  description: "A fine dining experience crafted with passion and quality ingredients.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
```

**Step 4: Commit**

```bash
git add tailwind.config.ts app/globals.css app/layout.tsx
git commit -m "feat: new design tokens and global styles

Neutral elegant palette (cream, charcoal, warm gold).
Inter + Playfair Display fonts via next/font.
CSS variable-based theming for easy customization."
```

---

### Task 4: Sanity environment config and client

**Files:**
- Create: `sanity/env.ts`
- Create: `sanity/lib/client.ts`
- Create: `sanity/lib/image.ts`
- Create: `sanity/lib/live.ts`
- Delete: `lib/sanity.client.ts`
- Delete: `lib/sanity.queries.ts`
- Delete: `lib/menu-utils.ts`
- Modify: `sanity.config.ts`
- Modify: `sanity.cli.js`
- Modify: `.env.local.example`

**Step 1: Create sanity/env.ts** — centralized env var access

```typescript
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01'
export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET'
)
export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
)

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }
  return v
}
```

**Step 2: Create sanity/lib/client.ts** — Sanity client

```typescript
import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
  stega: {
    studioUrl: '/studio',
  },
})
```

**Step 3: Create sanity/lib/image.ts** — image URL builder

```typescript
import createImageUrlBuilder from '@sanity/image-url'
import { dataset, projectId } from '../env'

const builder = createImageUrlBuilder({ projectId, dataset })

export function urlFor(source: any) {
  return builder.image(source)
}
```

**Step 4: Create sanity/lib/live.ts** — Visual Editing live content

```typescript
import { defineLive } from 'next-sanity'
import { client } from './client'

const token = process.env.SANITY_API_READ_TOKEN

export const { sanityFetch, SanityLive } = defineLive({
  client: client.withConfig({
    token,
    stega: {
      studioUrl: '/studio',
    },
  }),
  serverToken: token,
  browserToken: token,
})
```

**Step 5: Delete old Sanity lib files**

```bash
rm lib/sanity.client.ts lib/sanity.queries.ts lib/menu-utils.ts
```

**Step 6: Update sanity.config.ts** — change basePath to /studio, add presentation tool, remove CW title

```typescript
'use client'

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { presentationTool } from 'sanity/presentation'
import { schemaTypes } from './sanity/schemaTypes'
import { apiVersion, dataset, projectId } from './sanity/env'

export default defineConfig({
  name: 'default',
  title: 'Restaurant CMS',

  projectId,
  dataset,

  basePath: '/studio',

  plugins: [
    structureTool(),
    presentationTool({
      previewUrl: {
        draftMode: {
          enable: '/api/draft/enable',
        },
      },
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],

  schema: {
    types: schemaTypes,
  },
})
```

**Step 7: Update sanity.cli.js**

```javascript
import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  },
  studioHost: 'restaurant-boilerplate',
})
```

**Step 8: Update .env.local.example**

```env
# =============================================================================
# SANITY CMS (Required)
# Get these from https://sanity.io/manage
# =============================================================================
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_READ_TOKEN=

# =============================================================================
# CONTACT FORM (Required for contact page)
# =============================================================================
# Resend: https://resend.com/api-keys
RESEND_API_KEY=
CONTACT_EMAIL_TO=hello@yourrestaurant.com
CONTACT_EMAIL_FROM=noreply@yourrestaurant.com

# reCAPTCHA v3: https://www.google.com/recaptcha/admin
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=
RECAPTCHA_SECRET_KEY=

# =============================================================================
# OPTIONAL
# =============================================================================
NEXT_PUBLIC_SITE_URL=https://yourrestaurant.com
NEXT_PUBLIC_GA_ID=
```

**Step 9: Commit**

```bash
git add -A
git commit -m "feat: set up Sanity config with Visual Editing support

Centralized env vars in sanity/env.ts.
Client, image builder, and live content in sanity/lib/.
Presentation tool for click-to-edit Visual Editing.
Studio mounted at /studio instead of /admin."
```

---

### Task 5: Framer Motion animation library

**Files:**
- Create: `lib/animations.ts`

**Step 1: Create lib/animations.ts**

```typescript
import { Variants } from 'framer-motion'

// Check if user prefers reduced motion
const prefersReducedMotion =
  typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false

// Fade in from below — use for section entrances
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

// Simple fade — use for overlays, images
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
}

// Stagger children — wrap parent in this, children get fadeInUp
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: prefersReducedMotion ? 0 : 0.1,
    },
  },
}

// Hover/tap scale — use on cards, buttons
export const scaleOnHover = prefersReducedMotion
  ? {}
  : {
      whileHover: { scale: 1.02 },
      whileTap: { scale: 0.98 },
      transition: { type: 'spring', stiffness: 300, damping: 20 },
    }

// Page transition — use with AnimatePresence
export const pageTransition: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
}
```

**Step 2: Commit**

```bash
git add lib/animations.ts
git commit -m "feat: shared Framer Motion animation library

fadeInUp, fadeIn, staggerContainer, scaleOnHover, pageTransition.
All variants respect prefers-reduced-motion."
```

---

## Phase 3: Sanity Schemas

### Task 6: Object types (shared building blocks)

**Files:**
- Create: `sanity/schemaTypes/objects/portableText.ts`
- Create: `sanity/schemaTypes/objects/socialLink.ts`
- Create: `sanity/schemaTypes/objects/openingHours.ts`
- Create: `sanity/schemaTypes/objects/seo.ts`

**Step 1: Create portableText.ts** — rich text block type

```typescript
import { defineType, defineArrayMember } from 'sanity'

// Rich text editor for content blocks (about page, FAQ answers, etc.)
// Supports: headings (h2-h4), bold, italic, links, images
export default defineType({
  name: 'portableText',
  title: 'Rich Text',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
        { title: 'H4', value: 'h4' },
        { title: 'Quote', value: 'blockquote' },
      ],
      marks: {
        decorators: [
          { title: 'Bold', value: 'strong' },
          { title: 'Italic', value: 'em' },
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
              {
                name: 'href',
                type: 'url',
                title: 'URL',
                validation: (Rule) =>
                  Rule.uri({ allowRelative: true, scheme: ['http', 'https', 'mailto', 'tel'] }),
              },
              {
                name: 'blank',
                type: 'boolean',
                title: 'Open in new tab',
                initialValue: false,
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt text',
          description: 'Describe the image for screen readers',
          validation: (Rule) => Rule.required(),
        },
      ],
    }),
  ],
})
```

**Step 2: Create socialLink.ts**

```typescript
import { defineType } from 'sanity'

// Social media link — used in siteSettings.socialLinks array
export default defineType({
  name: 'socialLink',
  title: 'Social Link',
  type: 'object',
  fields: [
    {
      name: 'platform',
      title: 'Platform',
      type: 'string',
      options: {
        list: [
          { title: 'Facebook', value: 'facebook' },
          { title: 'Instagram', value: 'instagram' },
          { title: 'Twitter / X', value: 'twitter' },
          { title: 'TikTok', value: 'tiktok' },
          { title: 'Yelp', value: 'yelp' },
          { title: 'Google', value: 'google' },
          { title: 'YouTube', value: 'youtube' },
        ],
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: (Rule) => Rule.required().uri({ scheme: ['http', 'https'] }),
    },
  ],
  preview: {
    select: { title: 'platform', subtitle: 'url' },
  },
})
```

**Step 3: Create openingHours.ts**

```typescript
import { defineType } from 'sanity'

// Opening hours for a single day — used in siteSettings.hours array
// Set closed=true to show "Closed" instead of times
export default defineType({
  name: 'openingHours',
  title: 'Opening Hours',
  type: 'object',
  fields: [
    {
      name: 'day',
      title: 'Day',
      type: 'string',
      options: {
        list: [
          'Monday', 'Tuesday', 'Wednesday', 'Thursday',
          'Friday', 'Saturday', 'Sunday',
        ],
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'openTime',
      title: 'Open',
      type: 'string',
      description: 'e.g., "11:00 AM"',
      hidden: ({ parent }) => parent?.closed,
    },
    {
      name: 'closeTime',
      title: 'Close',
      type: 'string',
      description: 'e.g., "10:00 PM"',
      hidden: ({ parent }) => parent?.closed,
    },
    {
      name: 'closed',
      title: 'Closed this day',
      type: 'boolean',
      initialValue: false,
    },
  ],
  preview: {
    select: { day: 'day', open: 'openTime', close: 'closeTime', closed: 'closed' },
    prepare({ day, open, close, closed }) {
      return {
        title: day,
        subtitle: closed ? 'Closed' : `${open} – ${close}`,
      }
    },
  },
})
```

**Step 4: Create seo.ts**

```typescript
import { defineType } from 'sanity'

// SEO metadata — used on pages and siteSettings for defaults
export default defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    {
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      description: 'Override the page title for search engines (max 60 chars)',
      validation: (Rule) => Rule.max(60).warning('Keep under 60 characters for best SEO'),
    },
    {
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      description: 'Brief description for search results (max 160 chars)',
      validation: (Rule) => Rule.max(160).warning('Keep under 160 characters for best SEO'),
    },
    {
      name: 'ogImage',
      title: 'Social Share Image',
      type: 'image',
      description: 'Image shown when shared on social media (1200x630px recommended)',
    },
  ],
})
```

**Step 5: Commit**

```bash
git add sanity/schemaTypes/objects/
git commit -m "feat: Sanity object types — portableText, socialLink, openingHours, seo

Shared building blocks used across document and singleton schemas."
```

---

### Task 7: Singleton schemas (siteSettings, homePage)

**Files:**
- Create: `sanity/schemaTypes/singletons/siteSettings.ts`
- Create: `sanity/schemaTypes/singletons/homePage.ts`

**Step 1: Create siteSettings.ts**

```typescript
import { CogIcon } from '@sanity/icons'
import { defineType, defineField } from 'sanity'

// Global restaurant settings — one document, always exists.
// Contains: name, contact info, hours, social links, branding.
// Used by Header, Footer, Contact page, and sitemap.
export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Restaurant Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'Short tagline shown in header or hero (e.g., "Farm to Table Since 2010")',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: { hotspot: true },
      description: 'Main logo (used on light backgrounds)',
    }),
    defineField({
      name: 'logoAlt',
      title: 'Logo (Dark Background)',
      type: 'image',
      options: { hotspot: true },
      description: 'Alternate logo for dark backgrounds (optional)',
    }),
    defineField({
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'object',
      fields: [
        { name: 'street', title: 'Street', type: 'string' },
        { name: 'city', title: 'City', type: 'string' },
        { name: 'state', title: 'State', type: 'string' },
        { name: 'zip', title: 'ZIP Code', type: 'string' },
        { name: 'country', title: 'Country', type: 'string', initialValue: 'US' },
      ],
    }),
    defineField({
      name: 'location',
      title: 'Map Location',
      type: 'geopoint',
      description: 'Used for the embedded map on the contact page',
    }),
    defineField({
      name: 'hours',
      title: 'Opening Hours',
      type: 'array',
      of: [{ type: 'openingHours' }],
      description: 'Set hours for each day of the week',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Media Links',
      type: 'array',
      of: [{ type: 'socialLink' }],
    }),
    defineField({
      name: 'reservationUrl',
      title: 'Reservation URL',
      type: 'url',
      description: 'Link to OpenTable, Resy, or other reservation system (optional)',
      validation: (Rule) => Rule.uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'seo',
      title: 'Default SEO',
      type: 'seo',
      description: 'Default SEO settings (used when pages don\'t have their own)',
    }),
  ],
  preview: {
    select: { title: 'name' },
  },
})
```

**Step 2: Create homePage.ts**

```typescript
import { HomeIcon } from '@sanity/icons'
import { defineType, defineField } from 'sanity'

// Home page content — one document, always exists.
// Sections: hero, about preview, featured menu, testimonials, CTA banner.
export default defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  icon: HomeIcon,
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'object',
      fields: [
        { name: 'heading', title: 'Heading', type: 'string', validation: (Rule) => Rule.required() },
        { name: 'subheading', title: 'Subheading', type: 'text', rows: 2 },
        { name: 'image', title: 'Background Image', type: 'image', options: { hotspot: true } },
        { name: 'ctaText', title: 'Button Text', type: 'string' },
        { name: 'ctaLink', title: 'Button Link', type: 'string', description: 'e.g., /menu or /contact' },
      ],
    }),
    defineField({
      name: 'aboutPreview',
      title: 'About Preview Section',
      type: 'object',
      fields: [
        { name: 'heading', title: 'Heading', type: 'string' },
        { name: 'body', title: 'Body', type: 'portableText' },
        { name: 'image', title: 'Image', type: 'image', options: { hotspot: true } },
      ],
    }),
    defineField({
      name: 'featuredMenuHeading',
      title: 'Featured Menu Heading',
      type: 'string',
      description: 'e.g., "From Our Kitchen"',
    }),
    defineField({
      name: 'featuredMenuItems',
      title: 'Featured Menu Items',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'menuItem' }] }],
      description: 'Select 3-6 items to feature on the home page',
      validation: (Rule) => Rule.max(6),
    }),
    defineField({
      name: 'testimonialHeading',
      title: 'Testimonials Heading',
      type: 'string',
      description: 'e.g., "What Our Guests Say"',
    }),
    defineField({
      name: 'featuredTestimonials',
      title: 'Featured Testimonials',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'testimonial' }] }],
      validation: (Rule) => Rule.max(6),
    }),
    defineField({
      name: 'ctaSection',
      title: 'Call to Action Section',
      type: 'object',
      fields: [
        { name: 'heading', title: 'Heading', type: 'string' },
        { name: 'body', title: 'Body Text', type: 'text', rows: 3 },
        { name: 'ctaText', title: 'Button Text', type: 'string' },
        { name: 'ctaLink', title: 'Button Link', type: 'string' },
        { name: 'backgroundImage', title: 'Background Image', type: 'image', options: { hotspot: true } },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Home Page' }
    },
  },
})
```

**Step 3: Commit**

```bash
git add sanity/schemaTypes/singletons/
git commit -m "feat: Sanity singletons — siteSettings and homePage

siteSettings: restaurant name, hours, address, social links, reservation URL, SEO.
homePage: hero, about preview, featured menu items, testimonials, CTA."
```

---

### Task 8: Document schemas (menuCategory, menuItem, teamMember, testimonial, faqItem, galleryImage, page)

**Files:**
- Create: `sanity/schemaTypes/documents/menuCategory.ts`
- Create: `sanity/schemaTypes/documents/menuItem.ts`
- Create: `sanity/schemaTypes/documents/teamMember.ts`
- Create: `sanity/schemaTypes/documents/testimonial.ts`
- Create: `sanity/schemaTypes/documents/faqItem.ts`
- Create: `sanity/schemaTypes/documents/galleryImage.ts`
- Create: `sanity/schemaTypes/documents/page.ts`

**Step 1: Create menuCategory.ts**

```typescript
import { ThListIcon } from '@sanity/icons'
import { defineType, defineField } from 'sanity'

// Menu category — groups menu items (e.g., "Appetizers", "Mains", "Cocktails")
// menuSection field determines which tab the category appears under
export default defineType({
  name: 'menuCategory',
  title: 'Menu Category',
  type: 'document',
  icon: ThListIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Category Name',
      type: 'string',
      description: 'e.g., "Appetizers", "Mains", "Cocktails"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
      description: 'Optional description shown below the category heading',
    }),
    defineField({
      name: 'menuSection',
      title: 'Menu Section',
      type: 'string',
      description: 'Which tab/section this category belongs to',
      options: {
        list: [
          { title: 'Food', value: 'food' },
          { title: 'Drinks', value: 'drinks' },
          { title: 'Desserts', value: 'desserts' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first',
      validation: (Rule) => Rule.required().integer().min(0),
    }),
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'name', section: 'menuSection', order: 'order' },
    prepare({ title, section, order }) {
      return {
        title,
        subtitle: `${section} · #${order}`,
      }
    },
  },
})
```

**Step 2: Create menuItem.ts**

```typescript
import { DocumentTextIcon } from '@sanity/icons'
import { defineType, defineField } from 'sanity'

// Individual menu item — references a category for grouping.
// The "available" toggle lets staff 86 items without deleting them.
// The "featured" flag marks items for the home page featured section.
export default defineType({
  name: 'menuItem',
  title: 'Menu Item',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Item Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'string',
      description: 'Use format: "14" for single price, "8/12" for small/large',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Optional — not all menu items need photos',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'menuCategory' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'dietaryTags',
      title: 'Dietary Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Vegetarian', value: 'V' },
          { title: 'Vegan', value: 'VG' },
          { title: 'Gluten Free', value: 'GF' },
          { title: 'Gluten Free Available', value: 'GFA' },
          { title: 'Dairy Free', value: 'DF' },
          { title: 'Contains Nuts', value: 'N' },
          { title: 'Spicy', value: 'S' },
        ],
        layout: 'grid',
      },
    }),
    defineField({
      name: 'featured',
      title: 'Featured on Home Page',
      type: 'boolean',
      initialValue: false,
      description: 'Show this item in the featured section on the home page',
    }),
    defineField({
      name: 'available',
      title: 'Available',
      type: 'boolean',
      initialValue: true,
      description: 'Toggle off to 86 this item (hides from menu without deleting)',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Sort position within its category (lower = first)',
      validation: (Rule) => Rule.integer().min(0),
    }),
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'name',
      price: 'price',
      category: 'category.name',
      available: 'available',
      media: 'image',
    },
    prepare({ title, price, category, available, media }) {
      return {
        title: `${available === false ? '🚫 ' : ''}${title}`,
        subtitle: `$${price} · ${category || 'No category'}`,
        media,
      }
    },
  },
})
```

**Step 3: Create teamMember.ts**

```typescript
import { UsersIcon } from '@sanity/icons'
import { defineType, defineField } from 'sanity'

// Team member profile — shown on the About page
export default defineType({
  name: 'teamMember',
  title: 'Team Member',
  type: 'document',
  icon: UsersIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      description: 'e.g., "Head Chef", "Sommelier", "General Manager"',
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'portableText',
    }),
    defineField({
      name: 'image',
      title: 'Photo',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      validation: (Rule) => Rule.integer().min(0),
    }),
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'name', subtitle: 'role', media: 'image' },
  },
})
```

**Step 4: Create testimonial.ts**

```typescript
import { StarIcon } from '@sanity/icons'
import { defineType, defineField } from 'sanity'

// Customer testimonial — shown on Home page and optionally on a dedicated section
export default defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  icon: StarIcon,
  fields: [
    defineField({
      name: 'author',
      title: 'Author Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'rating',
      title: 'Rating',
      type: 'number',
      description: '1-5 stars (optional)',
      validation: (Rule) => Rule.min(1).max(5).integer(),
    }),
    defineField({
      name: 'source',
      title: 'Source',
      type: 'string',
      description: 'e.g., "Google", "Yelp", "TripAdvisor"',
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
    }),
  ],
  preview: {
    select: { title: 'author', subtitle: 'quote', rating: 'rating' },
    prepare({ title, subtitle, rating }) {
      return {
        title,
        subtitle: rating ? `${'★'.repeat(rating)} — ${subtitle}` : subtitle,
      }
    },
  },
})
```

**Step 5: Create faqItem.ts**

```typescript
import { HelpCircleIcon } from '@sanity/icons'
import { defineType, defineField } from 'sanity'

// FAQ entry — rendered as accordion on the FAQ page
export default defineType({
  name: 'faqItem',
  title: 'FAQ',
  type: 'document',
  icon: HelpCircleIcon,
  fields: [
    defineField({
      name: 'question',
      title: 'Question',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'answer',
      title: 'Answer',
      type: 'portableText',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      description: 'Optional grouping (e.g., "Reservations", "Dietary", "General")',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      validation: (Rule) => Rule.integer().min(0),
    }),
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'question', subtitle: 'category' },
  },
})
```

**Step 6: Create galleryImage.ts**

```typescript
import { ImageIcon } from '@sanity/icons'
import { defineType, defineField } from 'sanity'

// Gallery image — displayed on the About page gallery section
export default defineType({
  name: 'galleryImage',
  title: 'Gallery Image',
  type: 'document',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'alt',
      title: 'Alt Text',
      type: 'string',
      description: 'Describe the image for accessibility (required)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      description: 'Optional caption shown below the image',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      validation: (Rule) => Rule.integer().min(0),
    }),
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'alt', media: 'image' },
  },
})
```

**Step 7: Create page.ts**

```typescript
import { DocumentIcon } from '@sanity/icons'
import { defineType, defineField } from 'sanity'

// Generic content page — used for Privacy Policy, About, and any future pages.
// Content is rendered as Portable Text (rich text with images, links, headings).
export default defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'portableText',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'slug.current' },
    prepare({ title, subtitle }) {
      return { title, subtitle: `/${subtitle}` }
    },
  },
})
```

**Step 8: Update schema index to register all types**

Modify `sanity/schemaTypes/index.ts`:

```typescript
// Object types (shared building blocks)
import portableText from './objects/portableText'
import socialLink from './objects/socialLink'
import openingHours from './objects/openingHours'
import seo from './objects/seo'

// Singleton documents (one of each)
import siteSettings from './singletons/siteSettings'
import homePage from './singletons/homePage'

// Document types (multiple entries)
import menuCategory from './documents/menuCategory'
import menuItem from './documents/menuItem'
import teamMember from './documents/teamMember'
import testimonial from './documents/testimonial'
import faqItem from './documents/faqItem'
import galleryImage from './documents/galleryImage'
import page from './documents/page'

export const schemaTypes = [
  // Objects
  portableText,
  socialLink,
  openingHours,
  seo,
  // Singletons
  siteSettings,
  homePage,
  // Documents
  menuCategory,
  menuItem,
  teamMember,
  testimonial,
  faqItem,
  galleryImage,
  page,
]
```

**Step 9: Commit**

```bash
git add sanity/schemaTypes/
git commit -m "feat: all Sanity document schemas

Documents: menuCategory, menuItem, teamMember, testimonial, faqItem, galleryImage, page.
Schema index registers all 4 objects + 2 singletons + 7 documents."
```

---

### Task 9: GROQ queries

**Files:**
- Create: `sanity/lib/queries.ts`

**Step 1: Create queries.ts** — all GROQ queries in one file

```typescript
import { defineQuery } from 'next-sanity'

// ─── Site Settings ──────────────────────────────────────────────
export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings"][0] {
    name,
    tagline,
    logo,
    logoAlt,
    phone,
    email,
    address,
    location,
    hours,
    socialLinks,
    reservationUrl,
    seo
  }
`)

// ─── Home Page ──────────────────────────────────────────────────
export const HOME_PAGE_QUERY = defineQuery(`
  *[_type == "homePage"][0] {
    hero,
    aboutPreview {
      heading,
      body,
      image
    },
    featuredMenuHeading,
    featuredMenuItems[]-> {
      _id,
      name,
      description,
      price,
      image,
      dietaryTags,
      category-> { name }
    },
    testimonialHeading,
    featuredTestimonials[]-> {
      _id,
      author,
      quote,
      rating,
      source
    },
    ctaSection
  }
`)

// ─── Menu ───────────────────────────────────────────────────────
// Fetches all categories with their items, grouped by menuSection
export const MENU_QUERY = defineQuery(`
  {
    "categories": *[_type == "menuCategory"] | order(order asc) {
      _id,
      name,
      slug,
      description,
      menuSection,
      "items": *[_type == "menuItem" && references(^._id) && available != false] | order(order asc) {
        _id,
        name,
        description,
        price,
        image,
        dietaryTags
      }
    }
  }
`)

// ─── About Page ─────────────────────────────────────────────────
export const ABOUT_PAGE_QUERY = defineQuery(`
  {
    "page": *[_type == "page" && slug.current == "about"][0] {
      title,
      body,
      seo
    },
    "team": *[_type == "teamMember"] | order(order asc) {
      _id,
      name,
      role,
      bio,
      image
    },
    "gallery": *[_type == "galleryImage"] | order(order asc) {
      _id,
      image,
      alt,
      caption
    }
  }
`)

// ─── FAQ ────────────────────────────────────────────────────────
export const FAQ_QUERY = defineQuery(`
  *[_type == "faqItem"] | order(order asc) {
    _id,
    question,
    answer,
    category
  }
`)

// ─── Generic Page (Privacy, etc.) ───────────────────────────────
export const PAGE_QUERY = defineQuery(`
  *[_type == "page" && slug.current == $slug][0] {
    title,
    body,
    seo
  }
`)

// ─── Sitemap ────────────────────────────────────────────────────
export const SITEMAP_SLUGS_QUERY = defineQuery(`
  *[_type == "page" && defined(slug.current)] {
    "slug": slug.current,
    _updatedAt
  }
`)
```

**Step 2: Commit**

```bash
git add sanity/lib/queries.ts
git commit -m "feat: GROQ queries for all pages

Queries: siteSettings, homePage, menu (categories + items), about (page + team + gallery),
FAQ, generic page by slug, sitemap slugs."
```

---

## Phase 4: Visual Editing & Studio Setup

### Task 10: Visual Editing infrastructure

**Files:**
- Create: `app/api/draft/enable/route.ts`
- Create: `app/api/draft/disable/route.ts`
- Create: `components/sanity/VisualEditing.tsx`
- Create: `components/sanity/SanityImage.tsx`
- Modify: `app/layout.tsx` (add SanityLive + VisualEditing)
- Create: `app/studio/[[...tool]]/page.tsx`
- Delete: `app/admin/[[...tool]]/page.tsx`

**Step 1: Create draft mode enable route**

```typescript
// app/api/draft/enable/route.ts
import { defineEnableDraftMode } from 'next-sanity/draft-mode'
import { client } from '@/sanity/lib/client'

export const { GET } = defineEnableDraftMode({
  client: client.withConfig({ token: process.env.SANITY_API_READ_TOKEN }),
})
```

**Step 2: Create draft mode disable route**

```typescript
// app/api/draft/disable/route.ts
import { draftMode } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  draftMode().disable()
  return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'))
}
```

**Step 3: Create VisualEditing component**

```typescript
// components/sanity/VisualEditing.tsx
'use client'

import { VisualEditing as SanityVisualEditing } from 'next-sanity'

export default function VisualEditing() {
  return <SanityVisualEditing />
}
```

**Step 4: Create SanityImage component**

```typescript
// components/sanity/SanityImage.tsx
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'

interface SanityImageProps {
  image: any
  alt: string
  width?: number
  height?: number
  fill?: boolean
  sizes?: string
  className?: string
  priority?: boolean
}

export default function SanityImage({
  image,
  alt,
  width,
  height,
  fill,
  sizes,
  className,
  priority = false,
}: SanityImageProps) {
  if (!image?.asset) return null

  const imageUrl = urlFor(image)
    .auto('format')
    .quality(80)
    .url()

  if (fill) {
    return (
      <Image
        src={imageUrl}
        alt={alt}
        fill
        sizes={sizes || '100vw'}
        className={className}
        priority={priority}
      />
    )
  }

  return (
    <Image
      src={imageUrl}
      alt={alt}
      width={width || 800}
      height={height || 600}
      sizes={sizes}
      className={className}
      priority={priority}
    />
  )
}
```

**Step 5: Create Studio page at /studio**

```typescript
// app/studio/[[...tool]]/page.tsx
'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '@/sanity.config'

export default function StudioPage() {
  return <NextStudio config={config} />
}
```

**Step 6: Delete old admin route**

```bash
rm -rf app/admin/
```

**Step 7: Update app/layout.tsx** — add SanityLive and conditional VisualEditing

```tsx
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { draftMode } from "next/headers";
import { SanityLive } from "@/sanity/lib/live";
import VisualEditing from "@/components/sanity/VisualEditing";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Restaurant Name",
    template: "%s | Restaurant Name",
  },
  description: "A fine dining experience crafted with passion and quality ingredients.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
        <SanityLive />
        {(await draftMode()).isEnabled && <VisualEditing />}
      </body>
    </html>
  );
}
```

**Step 8: Commit**

```bash
git add -A
git commit -m "feat: Visual Editing infrastructure

Draft mode enable/disable routes, VisualEditing overlay,
SanityImage helper, Studio at /studio, SanityLive in root layout."
```

---

## Phase 5: Layout Components

### Task 11: Header and Footer (Sanity-driven)

**Files:**
- Rewrite: `components/layout/Header.tsx`
- Rewrite: `components/layout/Footer.tsx`

**Step 1: Rewrite Header.tsx**

```tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { fadeInUp } from '@/lib/animations'
import MobileNav from './MobileNav'
import SanityImage from '@/components/sanity/SanityImage'

interface HeaderProps {
  siteSettings?: {
    name?: string
    logo?: any
    reservationUrl?: string
  }
}

const navLinks = [
  { href: '/menu', label: 'Menu' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export default function Header({ siteSettings }: HeaderProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <motion.header
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo / Name */}
          <Link href="/" className="flex items-center gap-3">
            {siteSettings?.logo ? (
              <SanityImage
                image={siteSettings.logo}
                alt={siteSettings.name || 'Restaurant'}
                width={40}
                height={40}
                className="h-8 w-auto sm:h-10"
              />
            ) : (
              <span className="font-serif text-xl sm:text-2xl font-bold">
                {siteSettings?.name || 'Restaurant'}
              </span>
            )}
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm uppercase tracking-wider hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {siteSettings?.reservationUrl && (
              <a
                href={siteSettings.reservationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary text-white px-4 py-2 text-sm uppercase tracking-wider hover:bg-primary-light transition-colors"
              >
                Reserve
              </a>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden touch-target flex items-center justify-center"
            onClick={() => setMobileNavOpen(true)}
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      <MobileNav
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        links={[
          ...navLinks,
          ...(siteSettings?.reservationUrl
            ? [{ href: siteSettings.reservationUrl, label: 'Reserve a Table' }]
            : []),
        ]}
      />
    </motion.header>
  )
}
```

**Step 2: Rewrite Footer.tsx**

```tsx
import Link from 'next/link'
import SanityImage from '@/components/sanity/SanityImage'

interface FooterProps {
  siteSettings?: {
    name?: string
    logo?: any
    phone?: string
    email?: string
    address?: {
      street?: string
      city?: string
      state?: string
      zip?: string
    }
    socialLinks?: Array<{ platform: string; url: string }>
  }
}

const socialIcons: Record<string, string> = {
  facebook: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  instagram: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z',
  twitter: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  tiktok: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z',
  yelp: 'M20.16 12.594l-4.995 1.98c-.53.212-.74.674-.46 1.012l3.678 4.456c.263.318.696.378.946.13l2.948-2.946c.248-.25.188-.682-.13-.944l-1.987-3.688zm-7.842-1.174l3.65-3.792c.316-.327.253-.756-.14-.94L12.83 5.19c-.392-.183-.82-.06-.94.27l-1.74 4.97c-.12.33.16.71.528.69l1.64-.07zm-1.076 2.716l-4.57-2.436c-.362-.193-.774-.048-.9.318l-1.5 4.346c-.126.366.05.764.383.87l3.946 1.248c.332.105.706-.098.82-.445l1.82-3.9zm3.166 1.474l1.056 5.103c.083.4-.162.76-.536.79l-4.432.344c-.373.03-.698-.24-.71-.59l-.168-5.3c-.013-.35.29-.632.66-.614l3.13.147c.37.018.67.33.7.7l.3-.58zm-2.748-7.99l-2.198-4.68c-.175-.371-.58-.503-.89-.29l-3.66 2.526c-.31.214-.382.634-.158.918l3.37 4.264c.224.284.674.318.984.075l2.552-2.814z',
  google: 'M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z',
  youtube: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z',
}

export default function Footer({ siteSettings }: FooterProps) {
  const address = siteSettings?.address

  return (
    <footer className="bg-foreground text-background py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            {siteSettings?.logo ? (
              <SanityImage
                image={siteSettings.logo}
                alt={siteSettings.name || 'Restaurant'}
                width={120}
                height={40}
                className="h-8 w-auto mb-4 invert"
              />
            ) : (
              <span className="font-serif text-2xl font-bold block mb-4">
                {siteSettings?.name || 'Restaurant'}
              </span>
            )}
            {address && (
              <p className="text-sm opacity-70 leading-relaxed">
                {address.street}<br />
                {address.city}, {address.state} {address.zip}
              </p>
            )}
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-serif text-lg mb-4">Navigate</h3>
            <nav className="flex flex-col gap-2">
              {[
                { href: '/menu', label: 'Menu' },
                { href: '/about', label: 'About' },
                { href: '/contact', label: 'Contact' },
                { href: '/faq', label: 'FAQ' },
                { href: '/privacy', label: 'Privacy Policy' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm opacity-70 hover:opacity-100 transition-opacity"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact + Social */}
          <div>
            <h3 className="font-serif text-lg mb-4">Contact</h3>
            {siteSettings?.phone && (
              <a href={`tel:${siteSettings.phone}`} className="block text-sm opacity-70 hover:opacity-100 mb-1">
                {siteSettings.phone}
              </a>
            )}
            {siteSettings?.email && (
              <a href={`mailto:${siteSettings.email}`} className="block text-sm opacity-70 hover:opacity-100 mb-4">
                {siteSettings.email}
              </a>
            )}
            {siteSettings?.socialLinks && siteSettings.socialLinks.length > 0 && (
              <div className="flex gap-4 mt-4">
                {siteSettings.socialLinks.map((social) => (
                  <a
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.platform}
                    className="opacity-70 hover:opacity-100 transition-opacity"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d={socialIcons[social.platform] || ''} />
                    </svg>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-background/20 text-center text-sm opacity-50">
          &copy; {new Date().getFullYear()} {siteSettings?.name || 'Restaurant'}. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
```

**Step 3: Commit**

```bash
git add components/layout/Header.tsx components/layout/Footer.tsx
git commit -m "feat: Sanity-driven Header and Footer

Header: logo/name from siteSettings, nav links, reservation CTA, mobile nav.
Footer: address, contact, social icons, navigation."
```

---

### Task 12: Update kept components for new design tokens

**Files:**
- Modify: `components/ui/MenuItem.tsx`
- Modify: `components/ui/Button.tsx`

**Step 1: Update MenuItem.tsx** — replace CW-specific color tokens

Replace `text-cream` with `text-inherit` and `text-menu-item-title` / `text-menu-item-description` with standard Tailwind sizes so the component works in any color context.

```tsx
interface MenuItemProps {
  name: string
  price: number | string
  description: string
  dietaryTags?: string[]
  className?: string
}

export default function MenuItem({ name, price, description, dietaryTags, className = '' }: MenuItemProps) {
  return (
    <div className={`flex flex-col gap-2 w-full ${className}`}>
      <div className="flex items-baseline justify-between w-full gap-4">
        <h3 className="font-sans text-lg sm:text-xl font-medium">
          {name}
          {dietaryTags && dietaryTags.length > 0 && (
            <span className="text-sm font-normal opacity-60 ml-2">
              {dietaryTags.map((tag) => `(${tag})`).join(' ')}
            </span>
          )}
        </h3>
        <span className="font-sans text-lg whitespace-nowrap">{price}</span>
      </div>
      {description && (
        <p className="text-sm opacity-70 max-w-prose">{description}</p>
      )}
      <div className="w-full h-px bg-current opacity-10 mt-2" />
    </div>
  )
}
```

**Step 2: Update Button.tsx** — replace CW color tokens with CSS variable colors

Replace `coffee-700`, `cream`, `charcoal-900` references with the new design token names (`primary`, `background`, `foreground`).

Update the variant styles to use the new color system. The component structure stays the same, just the color values change.

**Step 3: Commit**

```bash
git add components/ui/MenuItem.tsx components/ui/Button.tsx
git commit -m "refactor: update kept components for new design tokens

MenuItem: use standard Tailwind sizes, add dietaryTags prop, color-context agnostic.
Button: use CSS variable colors instead of CW brand tokens."
```

---

## Phase 6: New UI Components

### Task 13: TestimonialCard, TeamCard, GalleryGrid

**Files:**
- Create: `components/ui/TestimonialCard.tsx`
- Create: `components/ui/TeamCard.tsx`
- Create: `components/ui/GalleryGrid.tsx`

**Step 1: Create TestimonialCard.tsx**

Displays a customer testimonial with optional star rating and source. Uses motion for scroll-triggered entrance.

```tsx
'use client'

import { motion } from 'framer-motion'
import { fadeInUp } from '@/lib/animations'

interface TestimonialCardProps {
  author: string
  quote: string
  rating?: number
  source?: string
}

export default function TestimonialCard({ author, quote, rating, source }: TestimonialCardProps) {
  return (
    <motion.blockquote
      variants={fadeInUp}
      className="bg-muted p-6 sm:p-8 rounded-sm"
    >
      {rating && (
        <div className="flex gap-1 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={i < rating ? 'text-primary' : 'text-border'}>★</span>
          ))}
        </div>
      )}
      <p className="font-serif text-lg italic leading-relaxed mb-4">"{quote}"</p>
      <footer className="text-sm">
        <span className="font-medium">{author}</span>
        {source && <span className="opacity-60 ml-2">· {source}</span>}
      </footer>
    </motion.blockquote>
  )
}
```

**Step 2: Create TeamCard.tsx**

Displays a team member with photo, name, role. Uses SanityImage for CDN-optimized images.

```tsx
import SanityImage from '@/components/sanity/SanityImage'

interface TeamCardProps {
  name: string
  role?: string
  image: any
}

export default function TeamCard({ name, role, image }: TeamCardProps) {
  return (
    <div className="text-center">
      <div className="relative aspect-[3/4] overflow-hidden rounded-sm mb-4">
        <SanityImage
          image={image}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
      </div>
      <h3 className="font-serif text-xl">{name}</h3>
      {role && <p className="text-sm text-muted-foreground mt-1">{role}</p>}
    </div>
  )
}
```

**Step 3: Create GalleryGrid.tsx**

Responsive masonry-style grid for gallery images. Uses SanityImage.

```tsx
'use client'

import { motion } from 'framer-motion'
import { staggerContainer, fadeInUp } from '@/lib/animations'
import SanityImage from '@/components/sanity/SanityImage'

interface GalleryImage {
  _id: string
  image: any
  alt: string
  caption?: string
}

interface GalleryGridProps {
  images: GalleryImage[]
}

export default function GalleryGrid({ images }: GalleryGridProps) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      className="columns-1 sm:columns-2 lg:columns-3 gap-4"
    >
      {images.map((item) => (
        <motion.figure key={item._id} variants={fadeInUp} className="mb-4 break-inside-avoid">
          <div className="overflow-hidden rounded-sm">
            <SanityImage
              image={item.image}
              alt={item.alt}
              width={600}
              height={400}
              className="w-full h-auto hover:scale-105 transition-transform duration-500"
            />
          </div>
          {item.caption && (
            <figcaption className="text-sm text-muted-foreground mt-2">{item.caption}</figcaption>
          )}
        </motion.figure>
      ))}
    </motion.div>
  )
}
```

**Step 4: Commit**

```bash
git add components/ui/TestimonialCard.tsx components/ui/TeamCard.tsx components/ui/GalleryGrid.tsx
git commit -m "feat: new UI components — TestimonialCard, TeamCard, GalleryGrid

TestimonialCard: quote with stars and source. TeamCard: photo + name + role.
GalleryGrid: masonry layout with Framer Motion stagger."
```

---

## Phase 7: Pages

### Task 14: Home page

**Files:**
- Rewrite: `app/page.tsx`

Build the home page with 5 sections: Hero, About Preview, Featured Menu, Testimonials, CTA. All data from Sanity via `sanityFetch`. Use `fadeInUp` and `staggerContainer` for scroll-triggered animations.

Server component fetching from `HOME_PAGE_QUERY` and `SITE_SETTINGS_QUERY`. Render Header/Footer with siteSettings. Each section uses `motion.section` with `whileInView`.

**Commit:**
```bash
git add app/page.tsx
git commit -m "feat: home page — hero, about, featured menu, testimonials, CTA

All content from Sanity. Framer Motion scroll-triggered animations.
Server component with sanityFetch."
```

---

### Task 15: Menu page

**Files:**
- Rewrite: `app/menu/page.tsx`

Build the menu page with tabbed navigation (Food/Drinks/Desserts) and categories with items. Fetch all categories + items via `MENU_QUERY`. Client component for tab state. Use `staggerContainer` for item entrance animations.

Categories grouped by `menuSection`. Items show name, price, description, dietary tags via the updated `MenuItem` component. Items with `available: false` are excluded by the GROQ query.

**Commit:**
```bash
git add app/menu/page.tsx
git commit -m "feat: menu page — tabbed categories with items from Sanity

Tab navigation (Food/Drinks/Desserts), category grouping,
dietary tags, staggered entrance animations."
```

---

### Task 16: About page

**Files:**
- Create: `app/about/page.tsx`

Build the about page with 3 sections: Story (portableText), Team Grid, Gallery. Fetch via `ABOUT_PAGE_QUERY`. Uses `TeamCard` and `GalleryGrid` components. Render portableText with `@portabletext/react`.

**Commit:**
```bash
git add app/about/page.tsx
git commit -m "feat: about page — story, team grid, gallery

Story from Sanity page document. Team members with TeamCard.
Gallery with masonry GalleryGrid. Portable text rendering."
```

---

### Task 17: Contact page

**Files:**
- Rewrite: `app/contact/page.tsx`
- Modify: `app/api/contact/route.ts`

Rebuild the contact form page. Fetch siteSettings for hours, address, map. Form sends to `/api/contact` with reCAPTCHA v3. Show hours from `siteSettings.hours`. Show reservation CTA if `reservationUrl` exists.

Update `api/contact/route.ts` to use `CONTACT_EMAIL_TO` and `CONTACT_EMAIL_FROM` env vars instead of hardcoded CW emails.

**Commit:**
```bash
git add app/contact/page.tsx app/api/contact/route.ts
git commit -m "feat: contact page — form, hours, map, reservation CTA

Resend + reCAPTCHA v3. Hours from siteSettings.
Configurable email via env vars."
```

---

### Task 18: FAQ page

**Files:**
- Create: `app/faq/page.tsx`

Fetch FAQ items from Sanity via `FAQ_QUERY`. Group by category if categories exist. Render with `FAQAccordion` component. Portable text answers.

**Commit:**
```bash
git add app/faq/page.tsx
git commit -m "feat: FAQ page — accordion from Sanity with optional category grouping"
```

---

### Task 19: Privacy page

**Files:**
- Create: `app/privacy/page.tsx`

Fetch from `page` document where `slug.current == "privacy"` via `PAGE_QUERY`. Render body with `@portabletext/react`.

**Commit:**
```bash
git add app/privacy/page.tsx
git commit -m "feat: privacy page — Sanity-driven content via portable text"
```

---

### Task 20: 404 page and sitemap

**Files:**
- Modify: `app/not-found.tsx` (update styling for new design tokens)
- Rewrite: `app/sitemap.ts` (remove hardcoded CW URL, use env var, add dynamic page slugs)

**Commit:**
```bash
git add app/not-found.tsx app/sitemap.ts
git commit -m "feat: updated 404 page and dynamic sitemap

404 with new design tokens. Sitemap uses NEXT_PUBLIC_SITE_URL env var
and includes dynamic page slugs from Sanity."
```

---

## Phase 8: Seed Data & TypeScript

### Task 21: Seed script

**Files:**
- Create: `scripts/seed-sanity.ts`

Script that creates placeholder content in Sanity:
- 1 siteSettings document
- 1 homePage document
- 4 menuCategories (Appetizers, Mains, Desserts, Drinks)
- 12-16 menuItems (3-4 per category)
- 2 teamMembers
- 3 testimonials
- 5 faqItems
- 2 pages (about, privacy)

Uses Sanity client with write token. Run via `npm run seed`.

**Commit:**
```bash
git add scripts/seed-sanity.ts
git commit -m "feat: Sanity seed script with placeholder content

Creates siteSettings, homePage, 4 categories, 16 menu items,
2 team members, 3 testimonials, 5 FAQs, about + privacy pages.
Run with: npm run seed"
```

---

### Task 22: TypeScript types

**Files:**
- Rewrite: `types/index.ts`

Clean type definitions for all Sanity document types and component props. Remove all Shopify types.

**Commit:**
```bash
git add types/index.ts
git commit -m "refactor: clean TypeScript types — remove Shopify, add all Sanity document types"
```

---

## Phase 9: Developer Experience & Documentation

### Task 23: Clean up next.config and .env files

**Files:**
- Modify: `next.config.mjs`
- Rewrite: `.env.local` (replace CW secrets with placeholder comments)
- Rewrite: `.env.local.example`

Remove CW-specific config. Ensure `.env.local` has no live secrets (replace with placeholder values or comments). Update `.env.local.example` with the full documented variable list.

**Commit:**
```bash
git add next.config.mjs .env.local.example
git commit -m "chore: clean next.config and env var documentation"
```

---

### Task 24: README

**Files:**
- Rewrite: `README.md`

Thorough README with:
- Project description (restaurant boilerplate)
- Tech stack overview
- Setup instructions (clone, install, Sanity project setup, env vars)
- Running development server
- Sanity Studio access at /studio
- Seed data script
- Deployment (Vercel)
- Project structure overview
- Customization guide (colors, fonts, adding pages)
- Environment variable reference table

**Commit:**
```bash
git add README.md
git commit -m "docs: comprehensive README with setup, customization, and deployment guides"
```

---

### Task 25: CLAUDE.md

**Files:**
- Rewrite: `CLAUDE.md`

Instructions for Claude Code working in this project:
- Component patterns and naming conventions
- How to add new pages/sections
- Sanity schema conventions (where to put new schemas, how to name them)
- GROQ query patterns
- Animation usage guide
- CSS variable theming system
- File structure reference
- Testing checklist

**Commit:**
```bash
git add CLAUDE.md
git commit -m "docs: CLAUDE.md with project conventions for Claude Code"
```

---

### Task 26: Final verification build

**Step 1: Run type check**

```bash
npm run typecheck
```

Expected: 0 errors

**Step 2: Run lint**

```bash
npm run lint
```

Expected: 0 errors

**Step 3: Run build**

```bash
npm run build
```

Expected: Successful build (pages may show Sanity data warnings if no project is connected — that's expected)

**Step 4: Manual spot check**

- Start dev server: `npm run dev`
- Visit `/` — home page loads with placeholder/empty sections
- Visit `/studio` — Sanity Studio loads
- Visit `/menu` — menu page loads
- Visit `/about` — about page loads
- Visit `/contact` — contact form renders
- Visit `/faq` — FAQ page loads
- Visit `/nonexistent` — 404 page shows

**Step 5: Final commit if any fixes needed**

```bash
git add -A
git commit -m "fix: address build and type errors from final verification"
```
