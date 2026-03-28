# Bonsai Kit Phases 4-13 Design

Phases 1-3 (modular page builder, ISR + webhooks, CMS redirects) are complete. This design covers the remaining 10 phases, grouped into 5 implementation batches.

## Simplifications from Original Plan

- **No Zustand** — `localStorage` + cookies for all UI state
- **No Mux video** — YouTube/Vimeo embeds already work from Phase 1
- **No FB Pixel** — GA4 only; FB Pixel can be added per-client
- **No server-side tracking endpoint** — over-engineering for a boilerplate
- **No full AnimatePresence page transitions** — unreliable with App Router streaming
- **No Sanity media plugin** — built-in asset management works fine
- **GA4 only for analytics** — consent-gated, no abstraction layer

## Batch A: SEO + LLM + Structured Data (Phases 9, partial 10)

### New Files

- `app/llms.txt/route.ts` — Dynamic route returning plain text. Fetches siteSettings + all modularPage/page titles+descriptions. `revalidate: 3600`.
- `app/llms-full.txt/route.ts` — Extended version. Extracts Portable Text to plain text using `@portabletext/toolkit` `toPlainText()`. Includes FAQ answers, team bios.
- `app/robots.ts` — Dynamic `MetadataRoute.Robots`. Allows all crawlers. References sitemap.xml and llms.txt. LLM bot directives (GPTBot, Google-Extended, Anthropic, ClaudeBot).
- `lib/structuredData.ts` — Pure functions returning typed JSON-LD:
  - `organizationJsonLd(settings)` — Organization
  - `webSiteJsonLd(settings)` — WebSite
  - `webPageJsonLd(title, description, url)` — WebPage
  - `localBusinessJsonLd(settings)` — LocalBusiness (address, hours, phone)
  - `faqPageJsonLd(items)` — FAQPage
  - `breadcrumbJsonLd(items)` — BreadcrumbList
- `components/seo/JsonLd.tsx` — Server component rendering `<script type="application/ld+json">`

### Modified Files

- `sanity/schemaTypes/objects/seo.ts` — Add `canonicalUrl` (string), `noIndex` (boolean), `noFollow` (boolean) fields
- `app/layout.tsx` — Add Organization + WebSite JSON-LD
- All page files — Add page-specific JSON-LD + canonical URLs in `generateMetadata`
- `sanity/lib/queries.ts` — Add queries for llms.txt (all pages with titles/descriptions)

## Batch B: Rich Text + Performance (Phases 6 without Mux, 12)

### Enhanced Portable Text

Update `sanity/schemaTypes/objects/portableText.ts` to add custom block types:
- `table` — rows array of cells array of text
- `callout` — type enum (info/warning/success/tip), title, body
- `codeBlock` — code text, language string
- `buttonGroup` — array of {label, url, variant}
- `internalLink` annotation — reference to page/modularPage

### New Files

- `components/sanity/PortableTextComponents.tsx` — Custom renderers:
  - Table: `<div className="overflow-x-auto"><table>` responsive
  - Callout: colored left border + tinted background + icon
  - CodeBlock: styled `<pre><code>` (no external lib)
  - ButtonGroup: flex row of Button components
  - InternalLink: Next.js `<Link>` with resolved href

### SanityImage Enhancement

- Update GROQ queries to fetch `asset->metadata.lqip` for blur placeholders
- Update `components/sanity/SanityImage.tsx` to pass `blurDataURL` + `placeholder="blur"`
- Update `next.config.mjs` to add `formats: ['image/avif', 'image/webp']`

## Batch C: Banners + Analytics + Consent (Phases 4 without Zustand, 7 GA4 only)

### New Files

- `sanity/schemaTypes/documents/promoBanner.ts` — message (simplified portableText), ctaText, ctaUrl, backgroundColor, textColor, isActive, startDate, endDate, dismissible, position (top/bottom)
- `components/ui/PromoBanner.tsx` — Client component. `localStorage` for dismissal. Date range check. Framer Motion. Sticky positioning.
- `components/ui/CookieConsent.tsx` — Client component. Accept All / Reject / Customize. Cookie storage. Framer Motion slide-up.
- `lib/consent.ts` — `getConsent()` / `setConsent()` utilities reading/writing cookie
- `components/analytics/GoogleAnalytics.tsx` — Client component. Loads GA4 when env var set AND consent allows. `usePathname()` for page views.
- `sanity/lib/queries.ts` — Add `PROMO_BANNER_QUERY`

### Modified Files

- `sanity/schemaTypes/index.ts` — Register promoBanner
- `sanity/structure/index.ts` — Add promoBanner to desk
- `app/layout.tsx` — Add PromoBanner + CookieConsent + GoogleAnalytics
- `.env.local.example` — Add `NEXT_PUBLIC_GA_ID` docs (already exists but document consent behavior)

## Batch D: Newsletter + ADA + Page Transitions (Phases 5, 11, 8 minimal)

### Newsletter

- `app/api/newsletter/route.ts` — POST endpoint. `NEWSLETTER_PROVIDER` env var selects:
  - Klaviyo: `POST https://a.klaviyo.com/api/v2/list/{list_id}/subscribe`
  - Mailchimp: `POST https://{dc}.api.mailchimp.com/3.0/lists/{list_id}/members`
  - ConvertKit: `POST https://api.convertkit.com/v3/forms/{form_id}/subscribe`
- `components/ui/NewsletterSignup.tsx` — Email input + button, loading/success/error states
- `components/sections/NewsletterSection.tsx` — Page builder section wrapper
- `sanity/schemaTypes/sections/newsletterSection.ts` — Schema for page builder
- Register in modularPage sections array + SectionRenderer

### ADA Audit

- Verify `aria-expanded` on mobile nav, FAQ accordions, testimonial carousel
- Add `aria-current="page"` to active nav links
- Verify icon-only buttons have `aria-label`
- Add `aria-live="polite"` to form feedback regions
- Create `docs/accessibility.md` checklist

### Page Transitions (Minimal)

- `components/animations/PageTransition.tsx` — Simple opacity fade on pathname change. No `AnimatePresence` (breaks App Router streaming). Already wrapped in `MotionConfig reducedMotion="user"`.
- Update `app/layout.tsx` to wrap children

## Batch E: Launch Docs + CLAUDE.md (Phase 13)

### New Files

- `docs/launch-checklist.md` — Pre-launch, CMS setup, deployment, post-launch checkboxes
- `docs/client-handoff.md` — Template with CMS training, deployment process, support terms
- `docs/deployment.md` — Vercel/Netlify steps, env var reference, webhook setup, custom domains

### Modified Files

- `README.md` — Generalize language, feature list, architecture overview, link to docs
- `CLAUDE.md` — Add architecture notes for page builder, ISR, analytics, redirects, SEO

## Dependencies Between Batches

- **Batch C depends on nothing** from other batches (consent + analytics are self-contained)
- **Batch B is independent** (rich text + images)
- **Batch A is independent** (SEO)
- **Batch D** newsletter section registration depends on Phase 1 patterns (already done)
- **Batch E** should be last (captures everything)

Recommended execution order: A → B → C → D → E
