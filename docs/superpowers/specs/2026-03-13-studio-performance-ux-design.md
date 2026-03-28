# Studio Performance & Client UX Improvements

**Date:** 2026-03-13
**Status:** Draft
**Goal:** Make the embedded Sanity Studio at `/studio` fast, stable, and intuitive for non-technical clients who spend all their time in the CMS.

---

## Problem Statement

The embedded Studio at `/studio` exhibits "strange refreshing" on every click and load — both in the Structure tool (navigating documents) and Presentation tool (live preview). The root cause is that the Studio inherits the root Next.js layout, which wraps it in Framer Motion animations, SanityLive subscriptions, VisualEditing overlays, cookie consent, and analytics scripts — none of which belong in the Studio context.

Additionally, schemas lack the descriptions, placeholders, validation warnings, and guardrails that non-technical clients need to edit confidently and quickly.

---

## Part 1: Studio Route Isolation (Performance Fix)

### What

Use Next.js route groups to give the Studio its own root layout, completely isolated from the site's frontend wrappers.

### File Changes

**Move all site routes into `(site)/` route group:**
```
app/
  not-found.tsx         ← stays at app root (global 404 for unknown URLs)
  globals.css           ← stays at app root (shared by both layouts)
  (site)/
    layout.tsx          ← current root layout (animations, SanityLive, VisualEditing, etc.)
    page.tsx            ← home
    [slug]/
    blog/
    contact/
    faq/
    preview/
    api/                ← all API routes (route handlers don't render through layouts)
    sitemap.ts          ← metadata files don't render through layouts either
    robots.ts
    llms.txt/
    llms-full.txt/
  (studio)/
    studio/
      [[...tool]]/
        page.tsx        ← existing NextStudio page (unchanged)
    layout.tsx          ← NEW: bare-bones <html><body>{children}</body></html>
```

**Note:** API route handlers (`route.ts`) and metadata files (`sitemap.ts`, `robots.ts`) don't render through layouts — they return raw responses. Moving them into `(site)/` has no functional impact. Route group names are invisible to URLs.

**New `app/(studio)/layout.tsx`:**
```tsx
import type { Metadata } from 'next'
import '../globals.css'

export const metadata: Metadata = {
  title: 'Studio',
}

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

No MotionProvider, no PageTransition, no SanityLive, no VisualEditing, no CookieConsent, no GoogleAnalytics. The Studio ships its own UI — it doesn't need any of these.

**Existing `app/(site)/layout.tsx`** — the current `app/layout.tsx` moves here. Update the `globals.css` import path from `./globals.css` to `../globals.css`.

### Why This Works

- Route groups in Next.js App Router are invisible to the URL (`/studio` stays `/studio`, `/blog` stays `/blog`)
- Each route group can have its own root layout with its own `<html>` tag
- The Studio loads in complete isolation — no competing subscriptions, no animation wrappers, no unnecessary client-side JS
- This is the Next.js-recommended pattern for embedding Sanity Studio

---

## Part 2: Presentation Tool Configuration Fix

### What

Fix the `presentationTool` config in `sanity.config.ts` to include the draft mode `disable` endpoint.

### Changes

```ts
// sanity.config.ts
presentationTool({
  previewUrl: {
    draftMode: {
      enable: '/api/draft/enable',
      disable: '/api/draft/disable',
    },
  },
}),
```

The disable endpoint already exists at `app/api/draft/disable/route.ts` — it's just not wired up in the config.

### Why

Without `disable`, the Presentation tool can't cleanly exit preview mode. This can cause the preview iframe to refresh unexpectedly or hang in draft state.

---

## Part 3: Studio Loading State

### What

Add `app/(studio)/studio/[[...tool]]/loading.tsx` so the Studio shows a dark background on initial load instead of flashing white. Note: this only applies to the first page load — once the Studio SPA boots, it handles all internal navigation client-side.

### Implementation

```tsx
export default function StudioLoading() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#101112',
      fontFamily: 'system-ui, sans-serif',
    }}>
      <div style={{ color: '#8a8a8a', fontSize: '14px' }}>
        Loading Studio…
      </div>
    </div>
  )
}
```

Uses Sanity Studio's dark background color so the transition feels seamless.

---

## Part 4: Schema UX Polish

**Constraint:** The Sanity desk structure (navigation menu, grouping) is NOT changing. Only field-level UX improvements within existing schemas.

### 4a. Add Array Max Limits

Unbounded arrays let clients add too many items, breaking layouts. Add `max` validation:

| Schema | Array Field | Max |
|--------|-------------|-----|
| `featureGrid` | `features` | 12 |
| `logoBar` | `logos` | 20 |
| `statsBar` | `stats` | 6 |
| `testimonialCarousel` | `testimonials` | 12 |
| `blogGrid` | `posts` (manual) | 12 |
| `header` | `megaNavigation` | 8 |
| `header` | `secondaryNavigation` | 6 |
| `megaMenuGroup` | `children` | 10 |
| `footer` | `columns` | 5 |
| `footer` columns | `links` | 10 |
| `siteSettings` | `socialLinks` | 10 |
| `portableText` | `buttons` (buttonGroup) | 4 |

### 4b. Add Field Descriptions

Add descriptions to fields that currently lack them. Only fields confirmed missing (many schemas already have good descriptions — don't touch those):

- **`siteSettings`** — `name`, `phone`, `address.street`, `address.city`, `address.state`, `address.zip`
- **`footer`** — `tagline`, `columns`, nested `title`/`links`/`label`/`href`, `copyrightText`
- **`splitContent`** — `heading`, `body`, `image`, `imagePosition`, `cta`
- **`contactForm`** — `heading`, `subheading`
- **`embed`** — `heading`, `embedType`, `embedUrl`
- **`blogGrid`** — `heading`, `source`
- **`teamMember`** — `name`, `role`, `bio`, `order`
- **`testimonial`** — `author`, `quote`, `date`
- **`faqItem`** — `question`, `answer`, `order`
- **`galleryImage`** — `image`, `order`
- **`category`** — `title`, `slug`, `description`, `image`
- **`tag`** — `title`, `slug`
- **`cta` object** — `label`
- **`megaMenuGroup`** — `label`, `children`, nested `label`/`href`
- **`socialLink`** — `platform`, `url`
- **`openingHours`** — `day`, `closed`
- **`portableText`** — callout `type`/`title`/`body`, code `code`

Note: `hero`, `header`, `siteSettings.tagline/logo/logoAlt/location/hours/seo`, and `blogPost` fields already have descriptions — skip those.

### 4c. Add Placeholders

Add `placeholder` to all string/text/url fields with example content. Examples:

- Headings: `"Your headline here…"`
- URLs: `"/about or https://example.com"`
- Email: `"hello@example.com"`
- Phone: `"(555) 123-4567"`
- Colors: `"#1A1A1A"`

### 4d. Add Validation Warnings

Character length warnings to guide clients toward good content:

| Field | Warning At |
|-------|-----------|
| Hero headline | 80 chars |
| Hero subheadline | 200 chars |
| Feature title | 40 chars |
| Feature description | 120 chars |
| CTA banner heading | 60 chars |
| Blog post title | 70 chars |
| Category title | 30 chars |
| Testimonial quote | 300 chars |
| Promo banner CTA text | 25 chars |
| Site tagline | 120 chars |

### 4e. Add Document Orderings

Add `orderings` to document types so clients can sort lists:

| Document Type | Sort Options |
|---------------|-------------|
| `blogPost` | Date (newest), Date (oldest), Title A-Z |
| `modularPage` | Title A-Z, Recently updated |
| `category` | Title A-Z, Order |
| `tag` | Title A-Z |
| `testimonial` | Date (newest), Rating (highest) |
| `teamMember` | Name A-Z, Order |
| `faqItem` | Order, Question A-Z |
| `promoBanner` | Active first, Start date |

### 4f. Add Groups to Dense Schemas

| Schema | Groups |
|--------|--------|
| `siteSettings` | Identity, Contact, Hours, Social, SEO |
| `promoBanner` | Content, Appearance, Schedule |
| `testimonial` | Content, Meta |
| `category` | Content, Appearance |
| `modularPage` | Page (title, slug), Content (sections), SEO (seo) |

**Why `modularPage` grouping matters:** This separates three independent concerns — identity (what the page is called and where it lives), composition (what sections it contains), and discoverability (how search engines find it). A layout change never touches the URI. An SEO override never alters composition. This follows the contract-based content modeling pattern where each concern evolves independently: an editor can restructure the entire page without risk of accidentally changing the slug, and a marketing team member can tweak meta descriptions without seeing the page builder at all.

### 4g. Add Color Field Validation

All hex color string fields get regex validation:
```ts
validation: (Rule) => Rule.regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/).error('Must be a valid hex color (e.g. #1A1A1A)')
```

Affected: `category.color`, `promoBanner.backgroundColor`, `promoBanner.textColor`, `ctaBanner.backgroundColor`, `ctaBanner.textColor`, `newsletterSection.backgroundColor`.

Also update any field descriptions that currently say "CSS color value" to say "Hex color" to match the validation constraint.

### 4h. Initial Values for Order Fields

All `order` fields default to `0`:
- `teamMember.order`
- `faqItem.order`
- `galleryImage.order`
- `category.order`

### 4i. Homepage Singleton Treatment

The homepage is already partially treated as a singleton — it has a dedicated `homePage` document type, is presented as a fixed item in the desk structure (`S.document().schemaType('homePage').documentId('homePage')`), and is filtered from `newDocumentOptions`. The `document.actions` config in `sanity.config.ts` already strips `delete` and `duplicate` actions for all types in the `SINGLETONS` array, which includes `homePage`.

However, the singleton enforcement should be verified and documented as an explicit contract. Editors must not be able to create, duplicate, or delete the homepage. It exists at a fixed URL (`/`) with a fixed role. From a data modeling perspective it behaves like a `modularPage` (same page builder sections, same SEO fields), but from an editorial perspective its role is unambiguous — there is exactly one homepage.

**Current enforcement (already in place):**
```ts
// sanity/structure/index.ts
export const SINGLETONS = ['siteSettings', 'homePage', 'header', 'footer', 'redirects']

// sanity.config.ts — strips delete/duplicate for singletons
document: {
  newDocumentOptions: (prev) => prev.filter(({ templateId }) => !SINGLETONS.includes(templateId)),
  actions: (input, context) => {
    if (SINGLETONS.includes(context.schemaType)) {
      return input.filter(({ action }) => action && !['delete', 'duplicate'].includes(action))
    }
    return input
  },
}
```

**What to verify during implementation:**
1. Confirm `homePage` does not appear in the "Create new document" menu (it shouldn't, given the `newDocumentOptions` filter)
2. Confirm the desk structure presents it as a fixed item, not a list (it does: `S.document().schemaType('homePage').documentId('homePage')`)
3. Confirm delete and duplicate actions are stripped (they are, via the `SINGLETONS` check)

If any of these checks fail, fix them. The specific implementation depends on what's already in place, but the contract is: **one homepage, always present, never deletable, never duplicable.**

---

## Out of Scope

- Sanity desk structure / navigation menu layout (explicitly excluded by user)
- New section types or schema additions
- Frontend component changes
- Blog system changes
- API route changes (except wiring up existing draft disable endpoint)

---

## Success Criteria

1. Navigating between documents in the Studio Structure tool has zero flashes or re-renders
2. Presentation tool preview loads cleanly and exits draft mode without hanging
3. Every field a client edits has a description explaining what it does
4. Every text input has a placeholder showing expected format
5. Clients cannot add more items than the layout supports
6. Document lists have sort options that match how clients think about content
7. Homepage is a singleton — editors cannot create duplicates or delete it
