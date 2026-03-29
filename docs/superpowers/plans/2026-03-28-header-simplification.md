# Header Simplification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the mega-menu Header with a flat 3-zone nav bar matching Beren's Figma design.

**Architecture:** Rewrite Header.tsx as a simple 3-zone layout (left nav links + decorative icons, center tagline, right Reserve CTA). Simplify MobileNav.tsx to flat link list. Update 4 page files to remove dropped props.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS

**Spec:** `docs/superpowers/specs/2026-03-28-header-simplification-design.md`

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `components/layout/Header.tsx` | Rewrite | 3-zone flat nav with SVG icons |
| `components/layout/MobileNav.tsx` | Rewrite | Simple slide-out drawer with flat links |
| `app/(site)/page.tsx:32` | Modify | Remove unused Header props |
| `app/(site)/[slug]/page.tsx:61` | Modify | Remove unused Header props |
| `app/(site)/faq/page.tsx:34` | Modify | Remove unused Header props |
| `app/(site)/contact/page.tsx:22` | Modify | Remove unused Header props |

---

### Task 1: Rewrite Header.tsx

**Files:**
- Rewrite: `components/layout/Header.tsx` (currently 267 lines → ~90 lines)

- [ ] **Step 1: Replace Header.tsx with the flat nav implementation**

Write the complete new file:

```tsx
'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { stegaClean } from '@sanity/client/stega'
import MobileNav from './MobileNav'

interface HeaderProps {
  siteSettings?: {
    name?: string
    tagline?: string
    reservationUrl?: string
  }
  cta?: { label: string; href: string }
}

export default function Header({ siteSettings, cta }: HeaderProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  const reserveHref = stegaClean(cta?.href || siteSettings?.reservationUrl || '')
  const isExternal = reserveHref.startsWith('http')

  // Split tagline on " / " for two-line rendering
  const tagline = siteSettings?.tagline || 'Ancestral Mediterranean Cooking / Meze & Grill House'
  const taglineParts = tagline.split(' / ')

  const mobileLinks = [
    { href: '/our-story', label: 'Our Story' },
    { href: '/menu', label: 'The Menu' },
    ...(reserveHref ? [{ href: reserveHref, label: 'Reserve', isButton: true }] : []),
  ]

  return (
    <header className="bg-background">
      {/* Desktop Nav */}
      <div className="hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 lg:h-24">
            {/* Left Zone: Nav links with decorative icons */}
            <nav className="flex items-center gap-4 lg:gap-6">
              <Link
                href="/our-story"
                className="text-foreground uppercase tracking-wider text-sm lg:text-base font-mono leading-tight"
              >
                Our<br />Story
              </Link>
              <Image
                src="/images/nav/Vector 76.svg"
                alt=""
                width={20}
                height={20}
                className="w-5 h-5 lg:w-6 lg:h-6"
                aria-hidden="true"
              />
              <Link
                href="/menu"
                className="text-foreground uppercase tracking-wider text-sm lg:text-base font-mono leading-tight"
              >
                The<br />Menu
              </Link>
              <Image
                src="/images/nav/Group 1000002677.svg"
                alt=""
                width={22}
                height={24}
                className="w-5 h-6 lg:w-6 lg:h-7"
                aria-hidden="true"
              />
            </nav>

            {/* Center Zone: Tagline + wave icon */}
            <Link href="/" className="flex flex-col items-center gap-1 text-center">
              <Image
                src="/images/nav/Vector 77.svg"
                alt=""
                width={32}
                height={11}
                className="w-8 h-3"
                aria-hidden="true"
              />
              {taglineParts.map((part, i) => (
                <span
                  key={i}
                  className="text-foreground uppercase tracking-[0.2em] text-[10px] lg:text-xs leading-tight"
                >
                  {part.trim()}
                </span>
              ))}
            </Link>

            {/* Right Zone: Reserve CTA */}
            {reserveHref && (
              <a
                href={reserveHref}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                className="border border-accent text-accent px-6 py-2 uppercase tracking-wider text-sm hover:bg-accent hover:text-background transition-colors"
              >
                Reserve
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <div className="md:hidden">
        <div className="flex items-center justify-between h-16 px-4">
          <Link href="/" className="flex flex-col items-center gap-0.5">
            <Image
              src="/images/nav/Vector 77.svg"
              alt=""
              width={24}
              height={8}
              className="w-6 h-2"
              aria-hidden="true"
            />
            <span className="text-foreground uppercase tracking-[0.15em] text-[8px] leading-tight">
              {taglineParts[0]?.trim()}
            </span>
          </Link>
          <button
            ref={menuButtonRef}
            className="touch-target flex items-center justify-center text-foreground"
            onClick={() => setMobileNavOpen(true)}
            aria-expanded={mobileNavOpen}
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
        triggerRef={menuButtonRef}
        links={mobileLinks}
      />
    </header>
  )
}
```

---

### Task 2: Rewrite MobileNav.tsx

**Files:**
- Rewrite: `components/layout/MobileNav.tsx` (currently 196 lines → ~90 lines)

- [ ] **Step 1: Replace MobileNav.tsx with the simplified flat-link implementation**

Write the complete new file:

```tsx
'use client'

import { useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
  links: Array<{ href: string; label: string; isButton?: boolean }>
  triggerRef: React.RefObject<HTMLButtonElement | null>
}

export default function MobileNav({ isOpen, onClose, links, triggerRef }: MobileNavProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab') return

      const panel = panelRef.current
      if (!panel) return
      const focusable = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    },
    [onClose]
  )

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      requestAnimationFrame(() => closeButtonRef.current?.focus())
      document.addEventListener('keydown', handleKeyDown)
    } else {
      document.body.style.overflow = 'unset'
      triggerRef.current?.focus()
    }

    return () => {
      document.body.style.overflow = 'unset'
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, handleKeyDown, triggerRef])

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-foreground/50 z-40 md:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className="fixed top-0 right-0 bottom-0 w-72 bg-background shadow-xl z-50 md:hidden overscroll-contain overflow-y-auto"
      >
        <div className="flex flex-col py-6 px-4">
          {/* Close button */}
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close menu"
            className="self-end touch-target flex items-center justify-center text-foreground mb-4"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <nav role="navigation" aria-label="Mobile navigation">
            <div className="flex flex-col space-y-1">
              {links.map((link) =>
                link.isButton ? (
                  <a
                    key={link.href}
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="border border-accent text-accent text-center uppercase tracking-wider py-3 mt-4 touch-target hover:bg-accent hover:text-background transition-colors"
                    onClick={onClose}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-lg font-mono uppercase tracking-wider text-foreground py-3 touch-target"
                    onClick={onClose}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </div>
          </nav>
        </div>
      </div>
    </>
  )
}
```

---

### Task 3: Update page files to remove unused Header props

**Files:**
- Modify: `app/(site)/page.tsx:32`
- Modify: `app/(site)/[slug]/page.tsx:61`
- Modify: `app/(site)/faq/page.tsx:34`
- Modify: `app/(site)/contact/page.tsx:22`

- [ ] **Step 1: Update all 4 pages**

In each file, find:
```tsx
<Header siteSettings={settings} megaNavigation={headerData?.megaNavigation} secondaryNavigation={headerData?.secondaryNavigation} cta={headerData?.cta} />
```

Replace with:
```tsx
<Header siteSettings={settings} cta={headerData?.cta} />
```

Files and line numbers:
- `app/(site)/page.tsx` line 32
- `app/(site)/[slug]/page.tsx` line 61
- `app/(site)/faq/page.tsx` line 34
- `app/(site)/contact/page.tsx` line 22

---

### Task 4: Typecheck and commit

- [ ] **Step 1: Run typecheck**

```bash
npm run typecheck
```

Expected: zero errors.

- [ ] **Step 2: Commit**

```bash
git add components/layout/Header.tsx components/layout/MobileNav.tsx app/\(site\)/page.tsx app/\(site\)/\[slug\]/page.tsx app/\(site\)/faq/page.tsx app/\(site\)/contact/page.tsx
git commit -m "Simplify Header to flat 3-zone nav for Beren

Replace mega-menu with flat nav: left links with decorative SVG
icons, center tagline, right Reserve CTA button. Simplify MobileNav
to flat link list. Remove unused mega-menu props from page files."
```
