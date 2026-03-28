# Bug Fixes & Page Builder Consolidation

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix all critical/important bugs found in code review, then consolidate the two page builder systems into one (modular wins).

**Architecture:** Two phases. Phase 1 fixes bugs in-place without changing architecture. Phase 2 removes the legacy page builder system entirely, migrates `homePage` to use modular sections, removes hardcoded page routes in favor of `[slug]` dynamic routing, and wires up CMS-driven Header/Footer navigation.

**Tech Stack:** Next.js 14 (App Router), Sanity v3, TypeScript, Framer Motion, Tailwind CSS

---

## Phase 1: Bug Fixes

### Task 1: Fix GA consent violation (GDPR)

**Files:**
- Modify: `components/analytics/GoogleAnalytics.tsx`

**Context:** The GA scripts load unconditionally and the init script calls `gtag('config')` before the consent check in `useEffect`. The entire script block must be gated on consent.

**Step 1: Rewrite GoogleAnalytics to gate scripts on consent**

```tsx
'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Script from 'next/script'
import { getConsent } from '@/lib/consent'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID

export default function GoogleAnalytics() {
  const pathname = usePathname()
  const [hasConsent, setHasConsent] = useState(false)

  useEffect(() => {
    const consent = getConsent()
    setHasConsent(consent?.analytics === true)
  }, [])

  useEffect(() => {
    if (!GA_ID || !hasConsent) return
    window.gtag?.('config', GA_ID, { page_path: pathname })
  }, [pathname, hasConsent])

  // Listen for consent changes (user grants consent after initial load)
  useEffect(() => {
    const handleStorage = () => {
      const consent = getConsent()
      setHasConsent(consent?.analytics === true)
    }
    window.addEventListener('storage', handleStorage)
    // Also check on cookie consent custom event
    window.addEventListener('consent-updated', handleStorage)
    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('consent-updated', handleStorage)
    }
  }, [])

  if (!GA_ID || !hasConsent) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { page_path: window.location.pathname });
        `}
      </Script>
    </>
  )
}
```

**Step 2: Check if CookieConsent dispatches a custom event when consent is granted**

Read `components/ui/CookieConsent.tsx`. If it doesn't dispatch `consent-updated`, add `window.dispatchEvent(new Event('consent-updated'))` after it sets the cookie.

**Step 3: Verify**

Run: `npm run build`
Expected: Compiles without error. GA scripts only render when consent is granted.

**Step 4: Commit**

```bash
git add components/analytics/GoogleAnalytics.tsx components/ui/CookieConsent.tsx
git commit -m "fix: gate GA scripts on consent state (GDPR compliance)"
```

---

### Task 2: Fix SectionRenderer double `<section>` wrapping

**Files:**
- Modify: `components/sections/SectionRenderer.tsx`

**Context:** `SectionRenderer` wraps each component in `<section>`, but most modular components already render their own `<section>` or `<motion.section>`. This produces invalid nested `<section>` elements. The fix: render components directly (matching `PageBuilder`'s pattern).

**Step 1: Remove the outer `<section>` wrapper**

Replace lines 49-53 in `SectionRenderer.tsx`:

```tsx
// Before:
return (
  <section key={section._key}>
    <Component {...section} />
  </section>
)

// After:
return <Component key={section._key} {...section} />
```

**Step 2: Verify SpacerSection has aria-hidden**

Read `components/sections/SpacerSection.tsx`. Confirm it renders a `<div aria-hidden="true">` (not a `<section>`). No change needed if so.

**Step 3: Verify**

Run: `npm run build`

**Step 4: Commit**

```bash
git add components/sections/SectionRenderer.tsx
git commit -m "fix: remove double section wrapping in SectionRenderer"
```

---

### Task 3: Fix home page missing metadata

**Files:**
- Modify: `app/page.tsx`

**Context:** Home page has no `metadata` or `generateMetadata`. Should pull from `homePage.seo` in Sanity.

**Step 1: Add generateMetadata to home page**

Add before the default export in `app/page.tsx`:

```tsx
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const { data: page } = await sanityFetch({ query: HOME_PAGE_QUERY, tags: ['homePage'] })
  return {
    title: page?.seo?.metaTitle || 'Home',
    description: page?.seo?.metaDescription || undefined,
    openGraph: {
      title: page?.seo?.metaTitle || 'Home',
      description: page?.seo?.metaDescription || undefined,
    },
  }
}
```

**Step 2: Verify**

Run: `npm run build`

**Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "fix: add generateMetadata to home page using CMS SEO fields"
```

---

### Task 4: Fix iframe missing title in Embed.tsx

**Files:**
- Modify: `components/sections/Embed.tsx:26`

**Step 1: Add title attribute using heading prop**

Change line 26:
```tsx
// Before:
<iframe src={cleanUrl} className="..." allow="..." allowFullScreen />

// After:
<iframe src={cleanUrl} title={heading || 'Embedded content'} className="..." allow="..." allowFullScreen />
```

**Step 2: Commit**

```bash
git add components/sections/Embed.tsx
git commit -m "fix: add title attribute to iframe in Embed section (a11y)"
```

---

### Task 5: Fix testimonial carousel dot hit targets

**Files:**
- Modify: `components/sections/TestimonialCarouselSection.tsx:73`

**Context:** Dot buttons are `w-2 h-2` (8px). UI rules require >= 44px on mobile.

**Step 1: Expand hit target with padding**

Replace line 73:
```tsx
// Before:
<button key={i} onClick={() => setCurrent(i)} className={`w-2 h-2 rounded-full transition-colors ${i === current ? 'bg-primary' : 'bg-border'}`} aria-label={`Go to testimonial ${i + 1}`} />

// After:
<button key={i} onClick={() => setCurrent(i)} className="p-3 -m-1" aria-label={`Go to testimonial ${i + 1}`}>
  <span className={`block w-2 h-2 rounded-full transition-colors ${i === current ? 'bg-primary' : 'bg-border'}`} />
</button>
```

**Step 2: Commit**

```bash
git add components/sections/TestimonialCarouselSection.tsx
git commit -m "fix: expand testimonial dot hit targets to meet a11y minimum"
```

---

### Task 6: Fix FAQ accordion height animation

**Files:**
- Modify: `components/sections/FaqAccordionSection.tsx:41`
- Modify: `components/sections/FAQ.tsx:34`

**Context:** Animating `height` causes layout reflows. Use CSS `grid-template-rows` trick instead.

**Step 1: Replace height animation in FaqAccordionSection.tsx**

Replace the `AnimatePresence` block (lines 39-46) in `FaqAccordionSection.tsx`:

```tsx
<div
  className="grid transition-[grid-template-rows] duration-200 ease-out"
  style={{ gridTemplateRows: openId === item._id ? '1fr' : '0fr' }}
>
  <div className="overflow-hidden">
    <div className="pb-5 prose prose-sm text-muted-foreground">
      {Array.isArray(item.answer) ? <PortableText value={item.answer} /> : <p>{String(item.answer)}</p>}
    </div>
  </div>
</div>
```

Remove the `AnimatePresence` import if no longer used. Keep `motion` for the parent stagger.

**Step 2: Apply the same fix to FAQ.tsx**

Same pattern for lines 32-39 in `FAQ.tsx`.

**Step 3: Verify**

Run: `npm run build`

**Step 4: Commit**

```bash
git add components/sections/FaqAccordionSection.tsx components/sections/FAQ.tsx
git commit -m "fix: replace height animation with CSS grid-template-rows in FAQ accordions"
```

---

### Task 7: Fix live.ts revalidate interval

**Files:**
- Modify: `sanity/lib/live.ts:15`

**Context:** `revalidate: 60` causes pages to rebuild every 60 seconds regardless of webhooks. Use `false` so tag-based ISR is the only invalidation mechanism.

**Step 1: Change revalidate to false**

```tsx
fetchOptions: {
  revalidate: false,
},
```

**Step 2: Commit**

```bash
git add sanity/lib/live.ts
git commit -m "fix: set revalidate to false — rely on tag-based ISR via webhook"
```

---

### Task 8: Fix newsletter PII logging

**Files:**
- Modify: `app/api/newsletter/route.ts:82`

**Step 1: Remove email from log message**

```tsx
// Before:
console.log(`[newsletter] No provider configured. Email: ${email}`)

// After:
console.log('[newsletter] No provider configured — subscription logged only')
```

**Step 2: Commit**

```bash
git add app/api/newsletter/route.ts
git commit -m "fix: remove PII from newsletter fallback log message"
```

---

### Task 9: Fix contact API Resend key guard and email subject escaping

**Files:**
- Modify: `app/api/contact/route.ts`

**Step 1: Move Resend initialization inside the handler and guard the key**

```tsx
// Remove line 6: const resend = new Resend(process.env.RESEND_API_KEY)

// Inside the POST handler, before sending email:
const apiKey = process.env.RESEND_API_KEY
if (!apiKey) {
  console.error('[contact] RESEND_API_KEY is not set')
  return NextResponse.json(
    { error: 'Email service not configured' },
    { status: 503 }
  )
}
const resend = new Resend(apiKey)
```

**Step 2: Fix email subject — don't HTML-escape plain text**

```tsx
// Before:
subject: `Contact form: ${escapeHtml(name)}`,

// After:
subject: `Contact form: ${name}`,
```

**Step 3: Commit**

```bash
git add app/api/contact/route.ts
git commit -m "fix: guard Resend API key and remove HTML escaping from email subject"
```

---

### Task 10: Fix revalidation tag mismatch for header/footer

**Files:**
- Modify: `app/api/revalidate/route.ts:8-9`

**Step 1: Give header and footer their own revalidation tags**

```tsx
// Before:
header: ['siteSettings'],
footer: ['siteSettings'],

// After:
header: ['header', 'siteSettings'],
footer: ['footer', 'siteSettings'],
```

This way, when header/footer queries are wired up with `tags: ['header']` / `tags: ['footer']`, they'll revalidate correctly. Including `siteSettings` maintains backward compat for now since the components currently read from siteSettings.

**Step 2: Commit**

```bash
git add app/api/revalidate/route.ts
git commit -m "fix: add dedicated revalidation tags for header and footer"
```

---

### Task 11: Remove unused structured data functions

**Files:**
- Modify: `lib/structuredData.ts`

**Step 1: Remove `localBusinessJsonLd` and `breadcrumbJsonLd`**

Delete the `localBusinessJsonLd` function (lines 51-87) and `breadcrumbJsonLd` function (lines 104-115). These are unused dead code.

**Step 2: Verify no imports exist**

Run: `grep -r "localBusinessJsonLd\|breadcrumbJsonLd" --include="*.tsx" --include="*.ts" app/ components/ lib/`

Expected: Only the definition in `structuredData.ts` (which you're removing).

**Step 3: Commit**

```bash
git add lib/structuredData.ts
git commit -m "chore: remove unused localBusinessJsonLd and breadcrumbJsonLd"
```

---

### Task 12: Verify and commit Phase 1

**Step 1: Run full build**

```bash
npm run build
```

Expected: Clean build, no errors.

**Step 2: Run typecheck and lint**

```bash
npm run typecheck && npm run lint
```

Expected: Both pass.

---

## Phase 2: Consolidate to Modular Page Builder

The modular system (`modularPage` + `SectionRenderer`) becomes the only page builder. The legacy system (`page` + `homePage` + `PageBuilder`) is removed. All pages become CMS-driven modular pages routed via `[slug]`.

### Task 13: Migrate homePage to use modular sections

**Files:**
- Modify: `sanity/schemaTypes/singletons/homePage.ts`
- Modify: `sanity/lib/queries.ts` — update `HOME_PAGE_QUERY`
- Modify: `app/page.tsx` — switch from `PageBuilder` to `SectionRenderer`

**Step 1: Read the current homePage schema**

Read `sanity/schemaTypes/singletons/homePage.ts` to understand its fields.

**Step 2: Replace the pageBuilder field with modular sections**

In `homePage.ts`, replace the `pageBuilder` import/field with a `sections` array using the modular section types (same array as `modularPage.ts`):

```tsx
defineField({
  name: 'sections',
  title: 'Page Sections',
  type: 'array',
  description: 'Add and arrange sections to build the homepage',
  of: [
    defineArrayMember({ type: 'hero' }),
    defineArrayMember({ type: 'featureGrid' }),
    defineArrayMember({ type: 'richTextBlock' }),
    defineArrayMember({ type: 'imageGallery' }),
    defineArrayMember({ type: 'testimonialCarousel' }),
    defineArrayMember({ type: 'ctaBanner' }),
    defineArrayMember({ type: 'videoSection' }),
    defineArrayMember({ type: 'teamGrid' }),
    defineArrayMember({ type: 'faqAccordion' }),
    defineArrayMember({ type: 'statsBar' }),
    defineArrayMember({ type: 'logoBar' }),
    defineArrayMember({ type: 'spacer' }),
    defineArrayMember({ type: 'newsletterSection' }),
  ],
}),
```

Remove the import of `pageBuilderField` if it was used.

**Step 3: Update HOME_PAGE_QUERY to use modular projections**

In `queries.ts`, replace the `HOME_PAGE_QUERY`:

```tsx
export const HOME_PAGE_QUERY = defineQuery(`
  *[_type == "homePage"][0] {
    title,
    ${MODULAR_PAGE_SECTIONS_PROJECTION},
    seo
  }
`)
```

Note: `MODULAR_PAGE_SECTIONS_PROJECTION` must be accessible (not `const` — it's already module-scoped, so this is fine).

**Step 4: Update app/page.tsx to use SectionRenderer**

```tsx
import { sanityFetch } from '@/sanity/lib/live'
import { SITE_SETTINGS_QUERY, HOME_PAGE_QUERY } from '@/sanity/lib/queries'
import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import SectionRenderer from '@/components/sections/SectionRenderer'
import JsonLd from '@/components/seo/JsonLd'
import { webPageJsonLd } from '@/lib/structuredData'

export async function generateMetadata(): Promise<Metadata> {
  const { data: page } = await sanityFetch({ query: HOME_PAGE_QUERY, tags: ['homePage'] })
  return {
    title: page?.seo?.metaTitle || 'Home',
    description: page?.seo?.metaDescription || undefined,
    openGraph: {
      title: page?.seo?.metaTitle || 'Home',
      description: page?.seo?.metaDescription || undefined,
    },
  }
}

export default async function HomePage() {
  const [{ data: settings }, { data: page }] = await Promise.all([
    sanityFetch({ query: SITE_SETTINGS_QUERY, tags: ['siteSettings'] }),
    sanityFetch({ query: HOME_PAGE_QUERY, tags: ['homePage'] }),
  ])

  return (
    <>
      <Header siteSettings={settings} />
      <main id="main">
        <SectionRenderer sections={page?.sections} />
      </main>
      <Footer siteSettings={settings} />
      <JsonLd data={webPageJsonLd('Home', page?.seo?.metaDescription || undefined, '/')} />
    </>
  )
}
```

**Step 5: Verify**

Run: `npm run build`

**Step 6: Commit**

```bash
git add sanity/schemaTypes/singletons/homePage.ts sanity/lib/queries.ts app/page.tsx
git commit -m "refactor: migrate homePage from legacy pageBuilder to modular sections"
```

---

### Task 14: Wire up CMS-driven Header and Footer

**Files:**
- Modify: `components/layout/Header.tsx`
- Modify: `components/layout/Footer.tsx`
- Modify: `app/layout.tsx` — fetch header/footer data and pass to children
- Modify: all `app/*/page.tsx` — pass header/footer props

**Step 1: Update Header to accept CMS navigation**

Read the `header` singleton schema to understand what fields it provides (`navigation`, `cta`).

Update `HeaderProps` interface:

```tsx
interface HeaderProps {
  siteSettings?: {
    name?: string
    logo?: SanityImageSource
    reservationUrl?: string
  }
  navigation?: Array<{ _key: string; label: string; href: string }>
  cta?: { label: string; href: string }
}
```

Replace the hardcoded `navLinks` constant:

```tsx
// Use CMS navigation with fallback to defaults
const navLinks = navigation?.length
  ? navigation.map((n) => ({ href: stegaClean(n.href), label: n.label }))
  : [
      { href: '/menu', label: 'Menu' },
      { href: '/about', label: 'About' },
      { href: '/contact', label: 'Contact' },
    ]
```

Replace the hardcoded "Reserve" button with CMS CTA:

```tsx
{(cta || siteSettings?.reservationUrl) && (
  <a
    href={stegaClean(cta?.href || siteSettings?.reservationUrl || '')}
    target={cta?.href?.startsWith('http') ? '_blank' : undefined}
    rel={cta?.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
    className="bg-primary text-white px-4 py-2 text-sm uppercase tracking-wider hover:bg-primary-light transition-colors"
  >
    {cta?.label || 'Reserve'}
  </a>
)}
```

**Step 2: Update Footer similarly**

Read the `footer` singleton schema (`tagline`, `columns`, `copyrightText`).

Update `FooterProps` to accept optional `footerData`. Use CMS columns for navigation when available, fall back to current hardcoded links.

**Step 3: Fetch header/footer in each page**

In every page.tsx that renders Header/Footer, add the fetch:

```tsx
const [{ data: settings }, { data: headerData }, { data: footerData }] = await Promise.all([
  sanityFetch({ query: SITE_SETTINGS_QUERY, tags: ['siteSettings'] }),
  sanityFetch({ query: HEADER_QUERY, tags: ['header'] }),
  sanityFetch({ query: FOOTER_QUERY, tags: ['footer'] }),
])
```

Pass to components: `<Header siteSettings={settings} navigation={headerData?.navigation} cta={headerData?.cta} />`

**Step 4: Verify**

Run: `npm run build`

**Step 5: Commit**

```bash
git add components/layout/Header.tsx components/layout/Footer.tsx app/
git commit -m "feat: wire up CMS-driven Header and Footer navigation"
```

---

### Task 15: Convert hardcoded pages to modular pages

**Files:**
- Delete: `app/about/page.tsx`, `app/about/` directory
- Delete: `app/privacy/page.tsx`, `app/privacy/` directory
- Modify: `app/[slug]/page.tsx` — these routes now handled by dynamic route

**Context:** The `about` and `privacy` pages are currently hardcoded routes that fetch `page` documents and render via the legacy `PageBuilder`. They should instead be `modularPage` documents rendered by the existing `[slug]` dynamic route.

Note: `menu`, `faq`, and `contact` pages have specialized rendering needs (menu tabs, FAQ accordion with dedicated query, contact form with siteSettings) — keep these as dedicated routes for now but fix their metadata to use CMS SEO.

**Step 1: Delete `app/about/` directory**

This page will be created as a `modularPage` with slug `about` in Sanity and rendered by `app/[slug]/page.tsx`.

**Step 2: Delete `app/privacy/` directory**

Same — will be a `modularPage` with slug `privacy`.

**Step 3: Fix metadata on remaining hardcoded pages (menu, faq, contact)**

For each of `app/menu/page.tsx`, `app/faq/page.tsx`, `app/contact/page.tsx`:

Replace `export const metadata` with `generateMetadata` that pulls from CMS SEO:

```tsx
// Example for menu/page.tsx
export async function generateMetadata(): Promise<Metadata> {
  // If there's a CMS page with SEO fields, fetch it
  // Otherwise fall back to static defaults
  return {
    title: 'Menu',
    description: 'Explore our menu featuring fresh, seasonal dishes and handcrafted beverages.',
  }
}
```

For menu and contact, these don't have CMS SEO fields since they don't fetch a `page` document. Static metadata is acceptable here. The key fix was the about and privacy pages which _did_ have CMS SEO but ignored it — those are now handled by `[slug]`.

For FAQ, optionally fetch a `modularPage` with slug `faq` for SEO, or keep static. Keeping static is fine for now.

**Step 4: Verify no slug collisions**

The `[slug]` route fetches `modularPage` by `slug.current`. Ensure `menu`, `faq`, and `contact` have dedicated routes that take priority over the dynamic route (Next.js static routes beat dynamic routes, so this is automatic).

**Step 5: Verify**

Run: `npm run build`

**Step 6: Commit**

```bash
git add -A app/about/ app/privacy/ app/menu/page.tsx app/faq/page.tsx app/contact/page.tsx
git commit -m "refactor: remove hardcoded about/privacy pages — now modular pages via [slug]"
```

---

### Task 16: Remove legacy page builder system

**Files:**
- Delete: `sanity/schemaTypes/builders/pageBuilder.ts`
- Delete: `components/sanity/PageBuilder.tsx`
- Delete: All 14 legacy section schemas in `sanity/schemaTypes/objects/sections/`
- Delete: Legacy section components that are duplicated by modular equivalents
- Modify: `sanity/schemaTypes/index.ts` — remove legacy imports
- Modify: `sanity/lib/queries.ts` — remove `PAGE_BUILDER_PROJECTION`, `PAGE_QUERY`, `PAGE_BY_URI_QUERY`, `ABOUT_PAGE_QUERY`
- Modify: `types/index.ts` — remove legacy section types and `PageBuilderSection` union
- Modify: `sanity/structure/index.ts` — remove `page` document type from desk

**Step 1: Remove legacy section schemas**

Delete all files in `sanity/schemaTypes/objects/sections/`:
- `sectionHero.ts`, `sectionSplitContent.ts`, `sectionRichText.ts`, `sectionCta.ts`
- `sectionFeaturedMenu.ts`, `sectionTestimonials.ts`, `sectionFaq.ts`, `sectionTeam.ts`
- `sectionImageGallery.ts`, `sectionContactForm.ts`, `sectionEmbed.ts`
- `sectionMenuSection.ts`, `sectionLogoBar.ts`, `sectionStatsBar.ts`

Delete `sanity/schemaTypes/builders/pageBuilder.ts`.

**Step 2: Remove legacy section components that have modular equivalents**

Components to delete (modular replacement exists):
- `components/sections/Hero.tsx` (replaced by `HeroSection.tsx`)
- `components/sections/RichText.tsx` (replaced by `RichTextBlockSection.tsx`)
- `components/sections/CTA.tsx` (replaced by `CtaBannerSection.tsx`)
- `components/sections/Testimonials.tsx` (replaced by `TestimonialCarouselSection.tsx`)
- `components/sections/FAQ.tsx` (replaced by `FaqAccordionSection.tsx`)
- `components/sections/Team.tsx` (replaced by `TeamGridSection.tsx`)
- `components/sections/ImageGallery.tsx` (replaced by `ImageGallerySection.tsx`)
- `components/sections/LogoBar.tsx` (replaced by `LogoBarSection.tsx`)
- `components/sections/StatsBar.tsx` (replaced by `StatsBarSection.tsx`)

Components to keep (unique to legacy, no modular equivalent — decide per component):
- `components/sections/SplitContent.tsx` — add as new modular section type? Or delete if not needed.
- `components/sections/FeaturedMenu.tsx` — specialized, keep as standalone or add to modular.
- `components/sections/ContactForm.tsx` — keep as standalone or add to modular.
- `components/sections/Embed.tsx` — keep as standalone or add to modular.
- `components/sections/MenuSection.tsx` — specialized, keep.

For each of these unique components, decide: if the section is useful, create a modular schema equivalent and register it. If not, delete it. The modular system should be the **only** section system.

**Step 3: Update `sanity/schemaTypes/index.ts`**

Remove all legacy `sectionXxx` imports (lines 9-22) and their entries in the `schemaTypes` array (lines 67-80).

Remove the `page` document import and entry if the `page` document type is no longer used. Keep it only if existing content needs to be migrated — but for a starter kit with placeholder content, it can be removed.

**Step 4: Update `sanity/lib/queries.ts`**

Remove:
- `PAGE_BUILDER_PROJECTION` constant (lines 4-73)
- `PAGE_QUERY` (lines 201-207)
- `PAGE_BY_URI_QUERY` (lines 135-142)
- `ABOUT_PAGE_QUERY` (lines 166-188)
- `HEADER_QUERY` and `FOOTER_QUERY` if they were wired up in Task 14 — keep them
- Update `HOME_PAGE_QUERY` (done in Task 13)

Keep: `MODULAR_PAGE_SECTIONS_PROJECTION`, `MODULAR_PAGE_QUERY`, all other queries.

Update `SITEMAP_QUERY` to remove `page` type references — only query `modularPage` documents.

Update `LLMS_TXT_QUERY` and `LLMS_FULL_TXT_QUERY` — remove `page` from the `_type in [...]` filter.

**Step 5: Update `types/index.ts`**

Remove:
- All `Section*` interfaces (`SectionHero`, `SectionSplitContent`, etc.)
- The `PageBuilderSection` union type
- The `Page` interface (if `page` document is removed)
- The `HomePage.pageBuilder` field — change to `sections?: ModularPageSection[]`

**Step 6: Remove `PageBuilder.tsx`**

Delete `components/sanity/PageBuilder.tsx`.

**Step 7: Update desk structure**

In `sanity/structure/index.ts`:
- Remove `S.documentTypeListItem('page').title('Pages')` (line 17)
- Rename "Modular Pages" to just "Pages": `S.documentTypeListItem('modularPage').title('Pages')`

**Step 8: Verify**

```bash
npm run typecheck && npm run build
```

Expected: Clean compile and build.

**Step 9: Commit**

```bash
git add -A
git commit -m "refactor: remove legacy page builder system — modular is now the only page builder"
```

---

### Task 17: Add unique legacy sections to modular system

**Context:** Some legacy sections don't have modular equivalents. Evaluate and migrate the useful ones.

**Sections to evaluate:**
1. `sectionSplitContent` — image + text side-by-side. Very common layout. **Add as modular section.**
2. `sectionContactForm` — form section for page builder. **Add as modular section.**
3. `sectionEmbed` — iframe embeds. **Add as modular section.**
4. `sectionFeaturedMenu` — restaurant-specific. **Skip for generic starter kit.**
5. `sectionMenuSection` — restaurant-specific. **Skip for generic starter kit.**

For each section to add:

**Step 1: Create modular schema** in `sanity/schemaTypes/sections/`
**Step 2: Register in `sanity/schemaTypes/index.ts`**
**Step 3: Add to `modularPage.ts` and `homePage.ts` sections arrays**
**Step 4: Add GROQ projection in `MODULAR_PAGE_SECTIONS_PROJECTION`**
**Step 5: Move/rename the React component to follow `*Section.tsx` naming**
**Step 6: Register in `SectionRenderer.tsx`**
**Step 7: Add type to `types/index.ts` and `ModularPageSection` union**

Do this for: `splitContent`, `contactForm`, `embed`.

**Step 8: Verify**

```bash
npm run typecheck && npm run build
```

**Step 9: Commit**

```bash
git add -A
git commit -m "feat: add splitContent, contactForm, and embed to modular page builder"
```

---

### Task 18: Run typegen and final verification

**Step 1: Run typegen**

```bash
npm run typegen
```

**Step 2: Run full check suite**

```bash
npm run typecheck && npm run lint && npm run build
```

**Step 3: Commit generated types**

```bash
git add -A
git commit -m "chore: regenerate Sanity types after page builder consolidation"
```

---

### Task 19: Update CLAUDE.md to match new architecture

**Files:**
- Modify: `CLAUDE.md`

**Step 1: Update to reflect single page builder system**

Key changes:
- Remove all references to "legacy page builder" / "dual system"
- Update file structure to show only modular sections
- Remove `PageBuilder.tsx` from the file tree
- Remove `pageBuilder.ts` builder from file tree
- Update "Adding a New Section" to only describe the modular pattern
- Update queries section to reflect removed queries
- Fix the "animations/ empty" statement
- Add mention of middleware, revalidation, analytics, consent, newsletter
- Update the component file tree to match reality

**Step 2: Verify accuracy**

Read the actual file tree and cross-reference with CLAUDE.md.

**Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: update CLAUDE.md to reflect consolidated modular page builder"
```
