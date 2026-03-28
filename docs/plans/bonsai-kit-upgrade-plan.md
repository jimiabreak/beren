# Bonsai Kit → Sprout Competitor
## Senior Developer Plan + Claude Code Prompts

*Gap analysis based on Gardener's Sprout boilerplate feature set (non-ecomm) vs current Bonsai Kit state.*

---

## Current State Assessment

**Bonsai Kit has:** Next.js 14 App Router, Sanity v3, Tailwind CSS variables, Framer Motion, 7 pages, Resend contact form, dynamic sitemap, basic SEO meta/OG, TypeScript strict, Visual Editing (Presentation API), menu system, GA env var.

**Bonsai Kit is missing:** Modular page builder, page transitions, ISR revalidation webhooks, Next.js cache invalidation, CMS-driven redirects, cookie/promo banners, newsletter integration, rich text with tables/video, Mux video, Zustand, full analytics (GA4/FB), A/B testing infra, responsive lazy images with blur, LLM files (llms.txt), advanced SEO (JSON-LD, canonical, schema.org), launch checklist, ADA baseline.

---

## Phase 1: Modular Page Builder (THE BIG ONE)

*This is what sells $20-60k projects. Clients need to self-serve marketing pages without calling you.*

### What to build
A Sanity "sections" system — an array of typed references that map to React components on the frontend. Each page document has a `sections` field that's an array of section objects. The client drags and drops sections in Sanity to compose pages.

### Sanity schemas to create

**Section types (objects):**
- `hero` — headline, subhead, CTA button(s), background image/video, layout variant (centered/left-aligned/split)
- `featureGrid` — heading, array of feature cards (icon, title, description), 2/3/4 column options
- `richTextBlock` — enhanced Portable Text with custom table blocks, code blocks, callout boxes
- `imageGallery` — array of images, layout (grid/masonry/carousel), lightbox toggle
- `testimonialCarousel` — array of testimonial refs, auto-play toggle, display count
- `ctaBanner` — heading, body text, button(s), background color/image
- `videoSection` — Mux video or YouTube/Vimeo embed, poster image, autoplay/loop options
- `teamGrid` — heading, array of teamMember refs, layout variant
- `faqAccordion` — heading, array of faqItem refs or inline Q&A pairs
- `statsBar` — array of stat objects (number, label, prefix/suffix), animated count-up toggle
- `logoBar` — heading, array of logos, grayscale toggle
- `contactForm` — heading, description, form field config, submission endpoint
- `spacer` — height options (sm/md/lg/xl), mobile/desktop independent
- `codeEmbed` — raw HTML/script injection for third-party widgets

**New document type:**
- `modularPage` — title, slug, sections array, seo object

### Claude Code prompt

```
Read the existing Sanity schema files in sanity/schemaTypes/ to understand the current 
patterns and conventions used in this project. Then:

1. Create a new directory sanity/schemaTypes/sections/ 

2. Create the following section object schemas, each as its own file, following the 
existing defineType/defineField pattern:
   - hero.ts (headline, subheadline, ctaButtons array of {label, url, variant}, 
     backgroundImage, backgroundVideo, layout enum: centered|left|split)
   - featureGrid.ts (heading, subheading, features array of {icon string, title, 
     description}, columns enum: 2|3|4)
   - richTextBlock.ts (heading optional, content using enhanced portableText with 
     table support and callout blocks)
   - imageGallery.ts (heading, images array with alt/caption, layout enum: 
     grid|masonry|carousel)
   - testimonialCarousel.ts (heading, testimonials ref array to testimonial docs, 
     autoPlay boolean, displayCount number)
   - ctaBanner.ts (heading, body portableText, buttons array, backgroundImage, 
     backgroundColor)
   - videoSection.ts (heading, muxVideo or externalUrl string, posterImage, 
     autoplay boolean, loop boolean)
   - teamGrid.ts (heading, subheading, members ref array to teamMember, layout 
     enum: grid|list)
   - faqAccordion.ts (heading, items ref array to faqItem OR inline array of 
     {question, answer})
   - statsBar.ts (heading, stats array of {value number, label, prefix, suffix}, 
     animateOnScroll boolean)
   - logoBar.ts (heading, logos array of images, grayscale boolean)
   - contactFormSection.ts (heading, description, fields config)
   - spacer.ts (desktopSize enum: sm|md|lg|xl, mobileSize enum: sm|md|lg|xl)
   - codeEmbed.ts (title for CMS label, code text field)

3. Create sanity/schemaTypes/documents/modularPage.ts — a document type with:
   - title (string, required)
   - slug (slug, from title)
   - sections (array of all section types above)
   - seo (reference the existing seo object type)
   
4. Register all new types in sanity/schemaTypes/index.ts

5. Create the frontend rendering:
   - components/sections/SectionRenderer.tsx — takes a section array, maps each 
     to its component by _type
   - Create a component for each section type in components/sections/
   - Each component should accept its typed props and render with Tailwind + 
     Framer Motion animations

6. Create app/[slug]/page.tsx — a dynamic catch-all route that:
   - Fetches modularPage by slug from Sanity
   - Passes sections to SectionRenderer
   - Generates metadata from the seo field
   - Handles 404 via notFound()

Make sure all section components respect prefers-reduced-motion and use the existing 
animation patterns from lib/animations.ts.
```

---

## Phase 2: ISR + Cache Invalidation + Webhooks

*This is what makes the CMS changes go live in seconds instead of requiring a full rebuild.*

### What to build
- Sanity webhook → Next.js API route that calls `revalidateTag()` or `revalidatePath()`
- Tag-based caching on all Sanity fetches
- On-demand ISR so changed pages rebuild in seconds

### Claude Code prompt

```
Set up ISR revalidation with Sanity webhooks in the Bonsai Kit project:

1. Update sanity/lib/client.ts:
   - Add a `sanityFetch` wrapper function that accepts GROQ query, params, and 
     an array of cache tags
   - Use Next.js `unstable_cache` or `fetch` with `next: { tags: [...] }` for 
     tag-based revalidation
   - Default revalidation time of 60 seconds as fallback

2. Create app/api/revalidate/route.ts:
   - POST endpoint that receives Sanity webhook payloads
   - Validate the webhook signature using SANITY_WEBHOOK_SECRET env var
   - Parse the document type and slug from the payload
   - Call revalidateTag() for the affected document type
   - Call revalidatePath() for specific page paths when possible
   - Return appropriate status codes
   - Log revalidation events for debugging

3. Update all existing page data fetches to use the new sanityFetch wrapper with 
   appropriate cache tags (e.g., 'siteSettings', 'homePage', 'menuItems', 'faq', 
   'pages')

4. Update .env.local.example with SANITY_WEBHOOK_SECRET

5. Add a docs/setup-webhooks.md file explaining how to configure the webhook in 
   Sanity dashboard (URL, secret, projection filter, trigger events)

6. Add revalidation for the new modularPage type and all section types
```

---

## Phase 3: CMS-Driven Redirects

*Gardener manages 301/302 redirects directly in Sanity. No code deploys needed for URL changes.*

### Claude Code prompt

```
Add CMS-managed redirects to Bonsai Kit:

1. Create sanity/schemaTypes/documents/redirect.ts:
   - source (string, required) — the incoming path e.g. "/old-page"
   - destination (string, required) — the target path or full URL
   - permanent (boolean, default true) — 301 vs 302
   - isActive (boolean, default true) — toggle without deleting
   - notes (text, optional) — internal notes for content team
   - Add validation that source starts with "/"
   - Add ordering by source path

2. Register the redirect type in the schema index

3. Update next.config.mjs:
   - Add an async redirects() function that fetches all active redirects from 
     Sanity at build time
   - Map them to Next.js redirect format

4. Create middleware.ts at project root:
   - On each request, check against a cached set of redirects
   - Fetch redirects from Sanity with ISR caching (revalidate every 60s)
   - Apply 301/302 redirects as configured
   - This handles redirects dynamically without requiring a rebuild

5. Add a "Redirects" section to the Sanity desk structure
```

---

## Phase 4: Cookie Consent + Promo Banners

*CMS-managed announcement bars and GDPR cookie consent — every client needs these.*

### Claude Code prompt

```
Add CMS-driven banners to Bonsai Kit:

1. Create sanity/schemaTypes/documents/promoBanner.ts:
   - message (portableText, simplified — bold/italic/links only)
   - ctaText (string, optional)
   - ctaUrl (string, optional)
   - backgroundColor (color string)
   - textColor (color string)
   - isActive (boolean)
   - startDate (datetime, optional)
   - endDate (datetime, optional)
   - dismissible (boolean, default true)
   - position (enum: top|bottom)

2. Create components/ui/PromoBanner.tsx:
   - Client component that fetches the active promo banner
   - Renders sticky bar at top/bottom of page
   - Dismissible with cookie/localStorage to remember dismissal
   - Animate in/out with Framer Motion
   - Respects date range if set

3. Create components/ui/CookieConsent.tsx:
   - GDPR-compliant cookie consent banner
   - Options: Accept All, Reject Non-Essential, Customize
   - Stores preference in cookie
   - Gates GA4 and FB pixel loading on consent
   - Animate in from bottom with Framer Motion

4. Add Zustand store (lib/store.ts):
   - Install zustand
   - Create a UIStore with: bannerDismissed, cookieConsent status, 
     mobileNavOpen, and any other global UI state
   - Migrate any existing client-side state to use this store

5. Integrate PromoBanner and CookieConsent into app/layout.tsx
```

---

## Phase 5: Newsletter Integration

### Claude Code prompt

```
Add newsletter signup integration to Bonsai Kit:

1. Create app/api/newsletter/route.ts:
   - POST endpoint that accepts email (and optional name, source)
   - Support multiple providers via env var NEWSLETTER_PROVIDER (klaviyo|mailchimp|convertkit)
   - Klaviyo: POST to Klaviyo API v2 subscribe endpoint using KLAVIYO_API_KEY 
     and KLAVIYO_LIST_ID
   - Mailchimp: POST to Mailchimp API using MAILCHIMP_API_KEY, 
     MAILCHIMP_SERVER_PREFIX, MAILCHIMP_LIST_ID
   - ConvertKit: POST to ConvertKit API using CONVERTKIT_API_KEY and 
     CONVERTKIT_FORM_ID
   - Validate email format server-side
   - Rate limiting (basic, via headers)
   - Return appropriate success/error responses

2. Create components/ui/NewsletterSignup.tsx:
   - Client component with email input + submit button
   - Loading/success/error states with smooth transitions
   - Customizable heading, description, button text via props
   - Also create a section version (components/sections/NewsletterSection.tsx) 
     for the page builder

3. Update .env.local.example with all provider env vars (commented out by default)
```

---

## Phase 6: Enhanced Rich Text + Video

*Sprout has custom table blocks, Mux video, and rich content blocks. Bonsai Kit's Portable Text is basic.*

### Claude Code prompt

```
Enhance the Portable Text implementation and add video support:

1. Update sanity/schemaTypes/objects/portableText.ts:
   - Add custom block types:
     - table: rows array of cells array of text (simple table editor)
     - callout: type enum (info|warning|success|tip), title, body text
     - codeBlock: code text, language string (for syntax highlighting display)
     - buttonGroup: array of {label, url, variant enum: primary|secondary|outline}
   - Add inline annotations:
     - internalLink: reference to modularPage or page documents
   - Keep existing marks (bold, italic, links)

2. Create components/sanity/PortableTextComponents.tsx:
   - Custom renderers for all block types above
   - Table renders as responsive HTML table with overflow scroll on mobile
   - Callout renders with icon, colored left border, background
   - CodeBlock renders with syntax highlighting (use a lightweight lib or 
     just styled <pre><code>)
   - ButtonGroup renders as flex row of styled buttons
   - InternalLink resolves to Next.js Link with proper href

3. Add Mux video support:
   - Install sanity-plugin-mux-input
   - Add muxVideo field type to section schemas that use video (hero, 
     videoSection)
   - Create components/ui/MuxPlayer.tsx client component using @mux/mux-player-react
   - Fallback to poster image when Mux is not configured
   - Also support plain URL embed (YouTube/Vimeo) as alternative via an 
     externalVideoUrl field

4. Update .env.local.example with MUX_TOKEN_ID and MUX_TOKEN_SECRET
```

---

## Phase 7: Full Analytics + Tracking

*Gardener installs GA4, FB pixel, and event tracking. Bonsai Kit just has an env var.*

### Claude Code prompt

```
Build a proper analytics system for Bonsai Kit:

1. Create lib/analytics.ts:
   - Abstraction layer for analytics events
   - Functions: pageView(), trackEvent(name, properties), identify(userId, traits)
   - Each function checks for user consent (from Zustand store / cookie) before 
     firing
   - Each function fires to all configured providers

2. Create components/analytics/GoogleAnalytics.tsx:
   - Server component that renders the GA4 script tag
   - Only loads if NEXT_PUBLIC_GA_ID is set AND user has consented
   - Handles page view tracking on route changes using usePathname()

3. Create components/analytics/FacebookPixel.tsx:
   - Loads FB pixel script if NEXT_PUBLIC_FB_PIXEL_ID is set AND consented
   - Fires PageView on route changes
   - Exposes trackFBEvent for custom conversions

4. Create components/analytics/AnalyticsProvider.tsx:
   - Client component wrapper that:
     - Initializes analytics on mount
     - Listens for route changes and fires pageView
     - Provides analytics context to child components
   - Wrap the app in this provider in layout.tsx

5. Create app/api/track/route.ts:
   - Server-side event endpoint for tracking events that shouldn't be 
     client-side (form submissions, etc.)

6. Update .env.local.example with NEXT_PUBLIC_FB_PIXEL_ID, 
   NEXT_PUBLIC_GTM_ID (optional GTM support too)
```

---

## Phase 8: Page Transitions

*Sprout has smooth page transitions via Framer Motion. Bonsai Kit has animations but not route transitions.*

### Claude Code prompt

```
Add smooth page transitions to Bonsai Kit:

1. Create components/animations/PageTransition.tsx:
   - Client component using Framer Motion's AnimatePresence
   - Wraps page content with fade + subtle slide transitions
   - Uses usePathname() as the key to trigger transitions
   - Transition duration ~300ms, ease-out curve
   - Respect prefers-reduced-motion (disable animation if set)

2. Create components/animations/TransitionLayout.tsx:
   - Wrapper component that goes in app/layout.tsx around {children}
   - Handles the AnimatePresence logic
   - Optionally supports different transition types per route (can default 
     to a single smooth fade for now)

3. Update app/layout.tsx to wrap children in TransitionLayout

4. Add a CSS class for preventing scroll during transitions if needed

5. Ensure the transition doesn't break:
   - Sanity Visual Editing / Presentation mode
   - Draft mode
   - Static generation / ISR
   - Scroll position restoration
```

---

## Phase 9: SEO + LLM Files + Structured Data

*This is where Bonsai Kit can actually SURPASS Sprout. LLM optimization is new territory.*

### Claude Code prompt

```
Upgrade SEO and add LLM optimization to Bonsai Kit:

1. Create app/llms.txt/route.ts:
   - Dynamic route that generates an llms.txt file
   - Fetch site settings, all published modularPages, and standard pages 
     from Sanity
   - Output structured text that describes the site, its pages, services, 
     and key content for LLM consumption
   - Format: site name, description, page list with descriptions, contact 
     info, key offerings
   - Cache with ISR (revalidate: 3600)

2. Create app/llms-full.txt/route.ts:
   - Extended version with full page content extracted from Portable Text
   - Sanitized to plain text (no HTML)
   - Include all modular page content, FAQ answers, team bios

3. Update app/robots.ts (convert from static robots.txt):
   - Dynamic robots.txt generation
   - Allow all crawlers by default
   - Add specific LLM bot directives (GPTBot, Google-Extended, Anthropic, etc.)
   - Reference sitemap.xml and llms.txt
   - Read NEXT_PUBLIC_SITE_URL for absolute URLs

4. Enhance app/sitemap.ts:
   - Add modularPage URLs with lastmod from Sanity _updatedAt
   - Add priority and changefreq values
   - Add image sitemap entries for pages with hero images

5. Create lib/structuredData.ts:
   - Helper functions to generate JSON-LD for:
     - Organization (from siteSettings)
     - WebSite (with SearchAction if applicable)
     - WebPage (per page)
     - LocalBusiness (from siteSettings — address, hours, phone)
     - FAQPage (from FAQ items)
     - BreadcrumbList (from route structure)
   - Each function returns a typed object

6. Create components/seo/JsonLd.tsx:
   - Server component that renders <script type="application/ld+json">
   - Takes structured data object as prop

7. Update app/layout.tsx:
   - Add Organization and WebSite JSON-LD to root layout
   - Add canonical URL generation

8. Update all page files:
   - Add page-specific JSON-LD (LocalBusiness on home, FAQPage on FAQ, etc.)
   - Add canonical URLs in generateMetadata
   - Ensure all OG images are absolute URLs

9. Create sanity/schemaTypes/objects/seo.ts enhancements:
   - Add canonicalUrl field (optional override)
   - Add noIndex boolean
   - Add noFollow boolean  
   - Add focusKeyword field (for content team guidance)
   - Add Sanity validation warnings when title > 60 chars or description > 160 chars
```

---

## Phase 10: Advanced Sanity Studio UX

*Gardener's Studio experience is polished. Content teams need guardrails and a great editing experience.*

### Claude Code prompt

```
Improve the Sanity Studio experience in Bonsai Kit:

1. Create a custom desk structure (sanity/deskStructure.ts):
   - Group documents logically:
     - "Site Settings" (singleton) at top
     - "Pages" group: homePage, modularPages
     - "Content" group: menuCategories, menuItems, teamMembers, testimonials, 
       faqItems, galleryImages
     - "SEO & Marketing" group: redirects, promoBanner
   - Use icons from @sanity/icons for each group
   - Configure the structure plugin in sanity.config.ts

2. Add Sanity field validations across all schemas:
   - Required fields should use Rule.required() with clear error messages
   - Image fields: warn if no alt text is provided
   - Slug fields: validate uniqueness
   - URL fields: validate format
   - SEO title: warn if > 60 characters
   - SEO description: warn if > 160 characters
   - Add character counters where helpful

3. Add field descriptions to ALL schema fields:
   - Every field should have a description property explaining what it does 
     and any constraints
   - Use markdown in descriptions for formatting tips

4. Add Sanity document actions:
   - "Open Preview" action on modularPage that opens the frontend URL in a 
     new tab
   - Duplicate page action

5. Add ordering to list views:
   - menuCategory: by sortOrder
   - menuItem: by category then name
   - modularPage: alphabetical by title
   - redirect: by source path

6. Configure Sanity media plugin (@sanity/asset-utils or similar) for 
   better image management in the Studio
```

---

## Phase 11: ADA / Accessibility Baseline

*Gardener has a whole checklist. Bonsai Kit needs the fundamentals baked in.*

### Claude Code prompt

```
Add accessibility foundations to Bonsai Kit:

1. Add skip-to-content link in components/layout/Header.tsx:
   - Visually hidden link at very top of page
   - Becomes visible on focus (keyboard tab)
   - Links to #main-content anchor
   - Style: positioned off-screen, slides in on focus

2. Add id="main-content" to the main content wrapper in layout.tsx or each page

3. Audit and fix all interactive elements:
   - Ensure all buttons are <button> elements (not <a> or <div>)
   - Ensure all navigation links use Next.js <Link>
   - Add aria-label to icon-only buttons
   - Add aria-expanded to toggle elements (mobile nav, accordions, etc.)
   - Add aria-current="page" to active nav links

4. Add focus management:
   - Visible focus rings on all interactive elements (already in Tailwind 
     via focus-visible:ring-2)
   - Focus trap for mobile nav overlay and any modals
   - Return focus to trigger element when closing overlays

5. Create a keyboard navigation test checklist in docs/accessibility.md:
   - Tab through entire page
   - Enter/Space to activate buttons
   - Escape to close overlays
   - Arrow keys for carousels/accordions

6. Add aria-live regions for dynamic content:
   - Form submission success/error messages
   - Newsletter signup feedback
   - Toast notifications

7. Ensure all Framer Motion animations have:
   - prefers-reduced-motion support (already partially done, verify all 
     section components)
```

---

## Phase 12: Performance + Responsive Images

### Claude Code prompt

```
Optimize image handling and performance in Bonsai Kit:

1. Create components/ui/SanityImage.tsx (or enhance existing):
   - Wrapper around next/image that uses Sanity's image pipeline
   - Auto-generates blur placeholder from Sanity's LQIP (Low Quality Image 
     Placeholder) metadata
   - Responsive srcset generation using Sanity's image URL builder with 
     width params (400, 800, 1200, 1600, 2000)
   - Lazy loading by default, eager option for above-fold images
   - Art direction support via Sanity hotspot/crop data
   - WebP/AVIF format auto-negotiation via Sanity's auto=format

2. Update all section components to use the enhanced SanityImage

3. Add loading priority hints:
   - Hero images: priority={true}, fetchPriority="high"
   - Below-fold images: loading="lazy" (default)

4. Update next.config.mjs:
   - Configure remotePatterns for Sanity CDN (cdn.sanity.io)
   - Set image optimization formats: ['image/avif', 'image/webp']

5. Add performance monitoring script to docs/performance.md:
   - How to run Lighthouse CI
   - Target scores: Performance 90+, Accessibility 95+, SEO 95+, Best Practices 95+
   - Commands to test locally before deploy
```

---

## Phase 13: Launch Checklist + Project Docs

*Gardener has a comprehensive launch list built over years. Build yours now.*

### Claude Code prompt

```
Create project documentation and launch process for Bonsai Kit:

1. Create docs/launch-checklist.md with sections:

   ## Pre-Launch
   - [ ] All pages reviewed and content populated
   - [ ] SEO fields filled (title, description, OG image) on all pages
   - [ ] Redirects configured for any old URLs
   - [ ] Contact form tested with real email delivery
   - [ ] Newsletter integration tested
   - [ ] Analytics verified (GA4 firing page views, FB pixel loading)
   - [ ] Cookie consent working and gating analytics correctly
   - [ ] All images have alt text
   - [ ] Favicon and app icons set
   - [ ] robots.txt allowing crawlers
   - [ ] sitemap.xml generating correctly
   - [ ] llms.txt generating correctly
   - [ ] JSON-LD structured data validating (test with Google Rich Results)
   - [ ] OpenGraph previews tested (Facebook Debugger, Twitter Card Validator)
   - [ ] Responsive testing: mobile, tablet, desktop
   - [ ] Browser testing: Chrome, Firefox, Safari (last 2 versions)
   - [ ] Performance audit: Lighthouse scores meet targets
   - [ ] Accessibility audit: keyboard nav, screen reader basics
   - [ ] Forms spam protection active (reCAPTCHA)
   - [ ] Error pages working (404, 500)
   - [ ] Console errors cleared
   
   ## CMS Setup
   - [ ] Sanity webhook configured for revalidation
   - [ ] Draft preview mode working
   - [ ] All singleton documents created (siteSettings, homePage)
   - [ ] Content team trained on CMS
   - [ ] CMS permissions configured
   
   ## Deployment
   - [ ] Environment variables set in hosting platform
   - [ ] Custom domain configured
   - [ ] SSL certificate active
   - [ ] DNS records updated
   - [ ] Old site archived/redirected
   - [ ] Verify build succeeds in production
   
   ## Post-Launch
   - [ ] Submit sitemap to Google Search Console
   - [ ] Verify Google Analytics receiving data
   - [ ] Monitor error tracking for first 48 hours
   - [ ] Test all forms with real submissions
   - [ ] Run final Lighthouse audit on production URL
   - [ ] Add domain to Facebook verified domains
   - [ ] Set up uptime monitoring

2. Create docs/client-handoff.md:
   - Template for handoff documentation
   - Links to: CMS, hosting, codebase, DNS
   - CMS training guide outline
   - Deployment process (auto-deploy on push)
   - How to add/edit pages in Sanity
   - How to manage redirects
   - How to update promo banners
   - Support period terms

3. Create docs/deployment.md:
   - Vercel deployment steps
   - Netlify deployment steps
   - Environment variable reference (all vars with descriptions)
   - Sanity webhook setup
   - Custom domain configuration
   - Preview deployment workflow

4. Update README.md:
   - Remove restaurant-specific language where possible, generalize to 
     "business website boilerplate"
   - Add feature list reflecting all new capabilities
   - Add architecture diagram section (text-based)
   - Link to all docs
   - Add "What's included" section highlighting the page builder, 
     SEO, analytics, etc.
```

---

## Execution Order (Priority Ranked)

| Priority | Phase | Impact | Effort | Why |
|----------|-------|--------|--------|-----|
| 1 | **Phase 1: Modular Page Builder** | 🔴 Critical | 3-4 days | This IS the product. Without it, you're selling a template, not a platform. |
| 2 | **Phase 9: SEO + LLM Files** | 🔴 Critical | 1 day | Differentiator vs Sprout. Nobody else is doing llms.txt in boilerplates yet. |
| 3 | **Phase 2: ISR + Webhooks** | 🔴 Critical | 0.5 days | Makes the CMS actually work in production. Non-negotiable for client sites. |
| 4 | **Phase 10: Sanity Studio UX** | 🟠 High | 1 day | Clients live in the Studio. A polished desk structure sells the project. |
| 5 | **Phase 6: Rich Text + Video** | 🟠 High | 1 day | Content teams need tables, callouts, and video. Basic Portable Text isn't enough. |
| 6 | **Phase 3: CMS Redirects** | 🟠 High | 0.5 days | Every migration needs redirects. Every client asks for this. |
| 7 | **Phase 12: Performance + Images** | 🟠 High | 0.5 days | Blur placeholders and optimized images are table stakes for premium work. |
| 8 | **Phase 4: Banners + Zustand** | 🟡 Medium | 1 day | Cookie consent is legally required in many markets. Promo bars are expected. |
| 9 | **Phase 7: Analytics** | 🟡 Medium | 0.5 days | Every client needs GA4 at minimum. Consent-gated is the right way. |
| 10 | **Phase 11: ADA Baseline** | 🟡 Medium | 0.5 days | Skip-to-content, ARIA, focus management. Protects you and the client. |
| 11 | **Phase 5: Newsletter** | 🟡 Medium | 0.5 days | Multi-provider support is a nice selling point. |
| 12 | **Phase 8: Page Transitions** | 🟢 Polish | 0.5 days | Nice to have, makes demos feel premium. |
| 13 | **Phase 13: Launch Checklist + Docs** | 🟢 Polish | 0.5 days | Do this as you go. Formalize after the first real client build. |

**Total estimated effort: ~11-12 days of focused Claude Code work.**

---

## CLAUDE.md Update

After all phases, update the project's CLAUDE.md with the new architecture context so future Claude Code sessions understand the full system.

```
Add the following to CLAUDE.md:

## Architecture Notes

### Modular Page Builder
Pages are composed of "sections" — typed Sanity objects rendered by 
SectionRenderer.tsx. To add a new section type:
1. Create schema in sanity/schemaTypes/sections/
2. Create component in components/sections/
3. Register in schema index and SectionRenderer switch

### ISR + Revalidation
All Sanity fetches go through sanityFetch() in sanity/lib/client.ts with 
cache tags. Sanity webhook hits /api/revalidate to invalidate specific tags.

### Analytics
Analytics are consent-gated via CookieConsent component + Zustand UIStore.
All tracking goes through lib/analytics.ts abstraction layer.

### Redirects
CMS-managed via Sanity redirect documents. Applied in middleware.ts with 
ISR-cached redirect map.

### SEO
JSON-LD structured data via lib/structuredData.ts. llms.txt and llms-full.txt 
are dynamic routes. robots.txt is dynamic. Sitemap includes all CMS pages.
```

---

## What This Gets You

After these phases, Bonsai Kit will have feature parity with Sprout on everything except ecommerce, PLUS advantages Sprout doesn't have: LLM optimization files, consent-gated analytics, multi-provider newsletter support, and a documented launch process. 

The positioning: **"A $20-60k website in a box, minus the $20-60k."** For clients, it means faster timelines and lower costs. For you, it means every project starts at 80% done and you're customizing the last 20%.
