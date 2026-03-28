# Section Overhaul Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Strip the starter kit to its editorial core — 2-color palette, Shirakaba fonts, remove 8 niche sections, redesign all remaining sections, replace restaurant seed content with generic agency content.

**Architecture:** Update globals.css color system + font-face declarations, update tailwind.config.ts, update layout.tsx font loading, then systematically remove niche sections (8 files x 4 locations each), redesign 17 remaining section components, update Button, update seed script.

**Tech Stack:** Next.js 14, Tailwind CSS, Framer Motion, Sanity v3

---

### Task 1: Fonts — Shirakaba @font-face + Tailwind

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`
- Modify: `tailwind.config.ts`

Replace Google Fonts (Inter, Playfair Display) with local Shirakaba fonts via @font-face. Four weights: Body (400), Medium (500), Semibold (600), Mono. Expose as CSS variables `--font-sans`, `--font-serif` (reuse for Semibold headings), `--font-mono`.

### Task 2: Color System — 2-tone warm gray + black

**Files:**
- Modify: `app/globals.css`
- Modify: `tailwind.config.ts`
- Modify: `components/ui/Button.tsx`

Strip `--color-primary` and `--color-primary-light`. New palette:
- `--color-background: #D5D0CB`
- `--color-foreground: #1A1A1A`
- `--color-muted: #C8C3BE`
- `--color-muted-foreground: #6B6560`
- `--color-border: #B8B3AE`

Update Button variants: primary → foreground bg, secondary → transparent + border, outline → keep. Update focus-visible to use foreground color.

### Task 3: Remove 8 Niche Sections

Delete files + remove all references for:
- `categoryHeader`, `categoryBanner`
- `productCarousel`, `productGrid`, `partnershipHighlight`
- `houseTourCards`, `roomSection`, `diyStep`

Locations to clean per section:
1. `sanity/schemaTypes/sections/*.ts` (delete file)
2. `sanity/schemaTypes/index.ts` (remove import + array entry)
3. `sanity/schemaTypes/singletons/homePage.ts` (remove defineArrayMember)
4. `sanity/schemaTypes/documents/modularPage.ts` (remove defineArrayMember)
5. `sanity/lib/queries.ts` (remove from MODULAR_PAGE_SECTIONS_PROJECTION)
6. `components/sections/SectionRenderer.tsx` (remove import + map entry)
7. `components/sections/*.tsx` (delete component file)
8. `types/index.ts` (remove interface + union member)

### Task 4: Redesign All Remaining Section Components

Redesign 17 sections with consistent editorial treatment:
- Generous spacing (py-24 md:py-32)
- Typography-forward (large headings, font-serif for display)
- Two-tone only (no color accents)
- Subtle border treatments, no shadows
- Smooth transitions (cubic-bezier .19,1,.22,1)
- Hover: opacity shifts, subtle transforms

Sections: hero, featureGrid, richTextBlock, imageGallery, testimonialCarousel, ctaBanner, videoSection, teamGrid, faqAccordion, statsBar, logoBar, spacer, newsletterSection, splitContent, contactForm, embed, blogGrid

### Task 5: Update Seed Content

**Files:**
- Modify: `scripts/seed-sanity.ts`

Replace restaurant-themed content with generic agency/studio:
- Homepage: 3 sections (hero text, feature grid, CTA)
- Hero: "Build something worth remembering."
- Generic team, testimonials, FAQs
- About page: studio story, not restaurant

### Task 6: Update References to Primary Color

**Files:** ~31 files that reference `primary` color class. Update all to use foreground/background two-tone system.

### Task 7: Update CLAUDE.md

Remove references to deleted sections, update color table, update font info.
