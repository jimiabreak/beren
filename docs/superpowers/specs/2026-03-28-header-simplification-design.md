# Header Simplification — Flat Nav for Beren

**Date:** 2026-03-28
**Status:** Approved
**Scope:** Rewrite Header.tsx and simplify MobileNav.tsx to match Beren's Figma nav design.

---

## Desktop Nav Layout

Three zones across a full-width terracotta bar (no sticky, no backdrop blur, no border-bottom):

```
[LEFT]                        [CENTER]                           [RIGHT]
OUR STORY 🍂 THE MENU 🌿      🌊 ANCESTRAL MEDITERRANEAN          [RESERVE]
                                  COOKING MEZE & GRILL HOUSE
```

### Left Zone
- Two text links: "OUR STORY" → `/our-story`, "THE MENU" → `/menu`
- Decorative SVG icons between/after links:
  - `Vector 76.svg` (orange leaf, 28x28) between the two links
  - `Group 1000002677.svg` (green plant, 29x31) after "THE MENU"
- Text: uppercase, `text-foreground` (`#DCDBC4`), tracking-wider, font-mono for the distinctive display style

### Center Zone
- Wave icon: `Vector 77.svg` (blue wave, 32x11) above or beside the tagline
- Two-line tagline: "ANCESTRAL MEDITERRANEAN COOKING" / "MEZE & GRILL HOUSE"
- Source: `siteSettings.tagline` (split on `/` or newline), fallback to hardcoded text
- Entire center block links to `/`
- Text: smaller size, uppercase, tracking-wider, `text-foreground`

### Right Zone
- "RESERVE" button with `text-accent border-accent` outline style
- Links to `siteSettings.reservationUrl` or `cta.href` from HEADER_QUERY
- Opens in new tab if external URL

### Mobile
- Hamburger icon replaces desktop nav below `md` breakpoint
- Slide-out drawer from right with flat link list: Our Story, The Menu, Reserve
- Keep existing a11y: focus trap, escape key close, body scroll lock, aria-modal
- Remove: accordion groups, mega-menu rendering, `expandedGroup` state

---

## Files to Modify

### `components/layout/Header.tsx` — Full Rewrite

**Remove:**
- All dropdown state (`openDropdown`, `handleDropdownEnter`, `handleDropdownLeave`, `dropdownTimeoutRef`)
- Secondary nav bar rendering
- Mega-menu group iteration and dropdown rendering
- `defaultNavLinks` array
- `fadeInUp` animation import and motion wrapper
- `usePathname` (no active state needed for 2 links)
- `useCallback` (no dropdown handlers)

**New structure (~80 lines):**
```tsx
'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { stegaClean } from '@sanity/client/stega'
import MobileNav from './MobileNav'
import type { SanityImageSource } from '@sanity/image-url'

interface HeaderProps {
  siteSettings?: {
    name?: string
    logo?: SanityImageSource
    tagline?: string
    reservationUrl?: string
  }
  cta?: { label: string; href: string }
}

// Three-zone flat nav: [Left links] [Center tagline] [Right CTA]
```

**Key implementation details:**
- Left zone uses `next/image` for the SVG icons (no inline SVGs)
- Center tagline splits on ` / ` to render two lines
- Reserve button: `border border-accent text-accent px-6 py-2 uppercase tracking-wider text-sm hover:bg-accent hover:text-background transition-colors`
- No `motion` import — static header, no entrance animation

### `components/layout/MobileNav.tsx` — Simplify

**Remove:**
- `expandedGroup` state and all accordion logic
- `megaNavigation` prop and mega-nav group rendering
- `MegaMenuGroup` type import

**Keep:**
- Focus trap, escape key, body scroll lock
- Overlay + panel structure
- `links` prop for flat link list
- `triggerRef` for focus return

**Simplified props (drops `pathname` and `megaNavigation`):**
```tsx
interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
  links: Array<{ href: string; label: string; isButton?: boolean }>
  triggerRef: React.RefObject<HTMLButtonElement | null>
}
```

- `pathname` removed — no `aria-current` active state needed for 3 links in a drawer
- `isButton` flag on the Reserve link renders it with accent outline styling in the mobile drawer
- Header constructs the links array: `[{ href: '/our-story', label: 'Our Story' }, { href: '/menu', label: 'The Menu' }, { href: reserveUrl, label: 'Reserve', isButton: true }]`

### Page Files — Remove Unused Header Props

The new `HeaderProps` drops `megaNavigation` and `secondaryNavigation`. TypeScript will error if callers still pass these. Update all 4 consumer pages to stop passing them:

- `app/(site)/page.tsx`
- `app/(site)/[slug]/page.tsx`
- `app/(site)/faq/page.tsx`
- `app/(site)/contact/page.tsx`

Each page currently does:
```tsx
<Header siteSettings={settings} megaNavigation={headerData?.megaNavigation} secondaryNavigation={headerData?.secondaryNavigation} cta={headerData?.cta} />
```

Change to:
```tsx
<Header siteSettings={settings} cta={headerData?.cta} />
```

Note: `tagline` is added to the `HeaderProps.siteSettings` shape. The `siteSettings` object from `SITE_SETTINGS_QUERY` already includes `tagline`, so no query changes are needed — it's just an interface expansion.

### No Changes Needed
- `types/index.ts` — `MegaMenuGroup` type can remain (harmless dead code, remove in a later cleanup)
- `sanity/lib/queries.ts` — `HEADER_QUERY` stays as-is (still fetches cta, megaNavigation — unused fields ignored)
- `components/layout/ThemedHeader.tsx` — wrapper component, not affected by this change (passes props through)
- `Logo.svg` in `public/images/nav/` — this is the full BEREN wordmark; not used in the header nav (the center zone uses the tagline text, not the logo SVG)

---

## What Gets Deleted (code volume)
- ~180 lines of dropdown/mega-menu logic from Header.tsx
- ~70 lines of accordion logic from MobileNav.tsx
- Net reduction: ~250 lines removed, ~80 lines added = ~170 fewer lines
