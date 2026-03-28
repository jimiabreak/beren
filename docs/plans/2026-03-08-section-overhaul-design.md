# Section Overhaul & Visual Refresh

## Summary
Strip the starter kit to its core, redesign all sections with a cohesive editorial aesthetic, and replace restaurant-themed seed content with generic agency/studio language.

## Color System (2 colors only)
| Token | Value |
|-------|-------|
| `--color-background` | `#D5D0CB` |
| `--color-foreground` | `#1A1A1A` |
| `--color-muted` | `#C8C3BE` |
| `--color-muted-foreground` | `#6B6560` |
| `--color-border` | `#B8B3AE` |

Remove `--color-primary` and `--color-primary-light` entirely. All components use only the two-tone palette.

## Typography
- **Headings:** Shirakaba Semibold (display), Shirakaba Medium (subheadings)
- **Body:** Shirakaba Body
- **Mono/UI accents:** Shirakaba Mono
- Load via `@font-face` in globals.css, expose as CSS variables + Tailwind `font-sans`, `font-serif` (repurpose), `font-mono`

## Remove Sections (8)
- roomSection, diyStep, houseTourCards
- productCarousel, productGrid, partnershipHighlight
- categoryHeader, categoryBanner

Delete: schema, component, query projection, SectionRenderer entry, types.

## Keep & Redesign Sections (17)
All sections get the two-tone treatment, generous whitespace, typography-forward design:
- hero, featureGrid, richTextBlock, imageGallery, testimonialCarousel
- ctaBanner, videoSection, teamGrid, faqAccordion, statsBar
- logoBar, spacer, newsletterSection, splitContent, contactForm
- embed, blogGrid

## Homepage Seed (3 sections)
1. Hero (text-only) — bold headline, brief subline
2. featureGrid or blogGrid — placeholder project cards
3. ctaBanner — "Ready to start?" + CTA

## Design Language
- Generous whitespace (py-24 / py-32 between sections)
- Subtle borders, no shadows
- Hover: opacity shifts, subtle transforms
- Smooth easing (cubic-bezier .19,1,.22,1)
- Typography carries the design — large, bold, confident
