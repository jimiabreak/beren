# UI Rules Critical Fixes — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix 8 MUST-level accessibility and UX violations identified by auditing the codebase against `.claude/rules/ui-rules.md`.

**Architecture:** Targeted edits to existing components — no new dependencies, no structural changes. A thin client wrapper component is added for Framer Motion's `MotionConfig`. All fixes are additive CSS/JSX changes.

**Tech Stack:** Next.js 14, React, Tailwind CSS, Framer Motion

---

### Task 1: Skip-to-content link + `id="main"` on all pages

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/page.tsx:16`
- Modify: `app/about/page.tsx:28`
- Modify: `app/contact/page.tsx:19`
- Modify: `app/menu/page.tsx:22`
- Modify: `app/faq/page.tsx:23`
- Modify: `app/privacy/page.tsx:23`

**Step 1: Add skip link to layout.tsx**

In `app/layout.tsx`, add as first child inside `<body>`:

```tsx
<a
  href="#main"
  className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:text-sm focus:uppercase focus:tracking-wider"
>
  Skip to content
</a>
```

**Step 2: Add `id="main"` to all `<main>` elements**

In each page file, change `<main ...>` to `<main id="main" ...>`. Files:
- `app/page.tsx:16` — `<main>` → `<main id="main">`
- `app/about/page.tsx:28` — add `id="main"`
- `app/contact/page.tsx:19` — add `id="main"`
- `app/menu/page.tsx:22` — add `id="main"`
- `app/faq/page.tsx:23` — add `id="main"`
- `app/privacy/page.tsx:23` — add `id="main"`

**Step 3: Verify**

Run: `npm run build`
Expected: Builds without errors. Tab into any page — skip link appears on focus.

**Step 4: Commit**

```bash
git add app/layout.tsx app/page.tsx app/about/page.tsx app/contact/page.tsx app/menu/page.tsx app/faq/page.tsx app/privacy/page.tsx
git commit -m "a11y: add skip-to-content link and id=main on all pages"
```

---

### Task 2: Mobile nav focus trap, Escape key, close button, dialog role

**Files:**
- Modify: `components/layout/MobileNav.tsx`
- Modify: `components/layout/Header.tsx`

**Step 1: Rewrite MobileNav.tsx**

Replace the full content of `components/layout/MobileNav.tsx` with:

```tsx
'use client'

import { useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { NavLink } from '@/types'

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
  links: NavLink[]
  triggerRef: React.RefObject<HTMLButtonElement | null>
}

export default function MobileNav({ isOpen, onClose, links, triggerRef }: MobileNavProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  // Focus trap + Escape handler
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
      // Focus close button on open
      requestAnimationFrame(() => closeButtonRef.current?.focus())
      document.addEventListener('keydown', handleKeyDown)
    } else {
      document.body.style.overflow = 'unset'
      // Return focus to hamburger button
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
        className="fixed inset-0 bg-charcoal-900/50 z-40 md:hidden animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className="fixed top-[72px] right-0 bottom-0 w-64 bg-cream shadow-xl z-50 md:hidden animate-slide-in overscroll-contain"
      >
        <div className="flex flex-col py-6 px-4 space-y-4">
          {/* Close button */}
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close menu"
            className="self-end touch-target flex items-center justify-center"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <nav role="navigation" aria-label="Mobile navigation">
            <div className="flex flex-col space-y-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-lg font-sans text-charcoal-900 hover:text-coffee-700 transition-colors py-2 touch-target"
                  onClick={onClose}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </>
  )
}
```

**Step 2: Add triggerRef to Header.tsx**

In `components/layout/Header.tsx`:

1. Add `useRef` to import: change `import { useState } from 'react'` to `import { useState, useRef } from 'react'`

2. Add ref inside the component: `const menuButtonRef = useRef<HTMLButtonElement>(null)`

3. Add `ref={menuButtonRef}` to the hamburger `<button>` (line 79)

4. Pass `triggerRef={menuButtonRef}` to `<MobileNav>` (line 91)

Specifically, the hamburger button becomes:
```tsx
<button
  ref={menuButtonRef}
  className="md:hidden touch-target flex items-center justify-center"
  onClick={() => setMobileNavOpen(true)}
  aria-label="Open menu"
>
```

And the MobileNav usage becomes:
```tsx
<MobileNav
  isOpen={mobileNavOpen}
  onClose={() => setMobileNavOpen(false)}
  triggerRef={menuButtonRef}
  links={[
    ...navLinks,
    ...(siteSettings?.reservationUrl
      ? [{ href: stegaClean(siteSettings.reservationUrl), label: 'Reserve a Table' }]
      : []),
  ]}
/>
```

**Step 3: Verify**

Run: `npm run build`
Test manually: open mobile nav, press Escape (closes), Tab cycles within panel, focus returns to hamburger on close.

**Step 4: Commit**

```bash
git add components/layout/MobileNav.tsx components/layout/Header.tsx
git commit -m "a11y: mobile nav focus trap, Escape key, close button, dialog role"
```

---

### Task 3: Global `prefers-reduced-motion` via MotionConfig

**Files:**
- Create: `components/MotionProvider.tsx`
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`

**Step 1: Create MotionProvider client component**

Create `components/MotionProvider.tsx`:

```tsx
'use client'

import { MotionConfig } from 'framer-motion'

export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}
```

**Step 2: Wrap body content in layout.tsx**

In `app/layout.tsx`, import and wrap:

```tsx
import MotionProvider from '@/components/MotionProvider'
```

Change the `<body>` contents to:
```tsx
<body className="font-sans antialiased bg-background text-foreground">
  <a
    href="#main"
    className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:text-sm focus:uppercase focus:tracking-wider"
  >
    Skip to content
  </a>
  <MotionProvider>
    {children}
  </MotionProvider>
  <SanityLive />
  {(await draftMode()).isEnabled && <VisualEditing />}
</body>
```

**Step 3: Add CSS reduced-motion override for Tailwind keyframe animations**

In `app/globals.css`, add at the end:

```css
/* Respect prefers-reduced-motion for CSS keyframe animations */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Step 4: Verify**

Run: `npm run build`
Expected: Builds without errors. In browser devtools, toggle `prefers-reduced-motion: reduce` — all animations should be suppressed.

**Step 5: Commit**

```bash
git add components/MotionProvider.tsx app/layout.tsx app/globals.css
git commit -m "a11y: global prefers-reduced-motion via MotionConfig + CSS fallback"
```

---

### Task 4: Form accessibility — `aria-live`, focus-first-error, `autocomplete`, trim

**Files:**
- Modify: `components/sections/ContactForm.tsx`
- Modify: `app/contact/ContactContent.tsx`

**Step 1: Fix ContactForm.tsx (page builder section)**

Replace full content of `components/sections/ContactForm.tsx`:

```tsx
'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@/lib/animations'
import Container from '@/components/layout/Container'
import Button from '@/components/ui/Button'

interface ContactFormProps {
  heading?: string
  subheading?: string
}

export default function ContactForm({ heading, subheading }: ContactFormProps) {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget

    // Focus first invalid field (native validation)
    if (!form.checkValidity()) {
      const firstInvalid = form.querySelector<HTMLInputElement | HTMLTextAreaElement>(':invalid')
      firstInvalid?.focus()
      form.reportValidity()
      return
    }

    setFormState('submitting')
    const formData = new FormData(form)
    const data = {
      name: (formData.get('name') as string)?.trim(),
      email: (formData.get('email') as string)?.trim(),
      phone: (formData.get('phone') as string)?.trim() || undefined,
      message: (formData.get('message') as string)?.trim(),
    }
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const result = await res.json()
        throw new Error(result.error || 'Failed to send')
      }
      setFormState('success')
      form.reset()
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong')
      setFormState('error')
    }
  }

  function handleTextareaKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      formRef.current?.requestSubmit()
    }
  }

  return (
    <motion.section variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="py-20 sm:py-28 bg-muted">
      <Container>
        <motion.div variants={fadeInUp} className="max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl sm:text-4xl text-center mb-4">{heading || 'Get in Touch'}</h2>
          {subheading && <p className="text-center text-muted-foreground text-lg mb-12">{subheading}</p>}
          {formState === 'success' ? (
            <div className="text-center py-12" aria-live="polite">
              <p className="text-lg font-medium text-primary">Thank you! We&apos;ll be in touch soon.</p>
            </div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="cf-name" className="block text-sm font-medium mb-2">Name *</label>
                  <input type="text" id="cf-name" name="name" required autoComplete="name" placeholder="Jane Doe…" className="w-full px-4 py-3 border border-border bg-background rounded-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label htmlFor="cf-email" className="block text-sm font-medium mb-2">Email *</label>
                  <input type="email" id="cf-email" name="email" required autoComplete="email" spellCheck={false} placeholder="jane@example.com…" className="w-full px-4 py-3 border border-border bg-background rounded-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
              </div>
              <div>
                <label htmlFor="cf-phone" className="block text-sm font-medium mb-2">Phone</label>
                <input type="tel" id="cf-phone" name="phone" autoComplete="tel" inputMode="tel" placeholder="(555) 123-4567…" className="w-full px-4 py-3 border border-border bg-background rounded-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label htmlFor="cf-message" className="block text-sm font-medium mb-2">Message *</label>
                <textarea id="cf-message" name="message" required rows={5} placeholder="How can we help…" onKeyDown={handleTextareaKeyDown} className="w-full px-4 py-3 border border-border bg-background rounded-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
              </div>
              {formState === 'error' && <p role="alert" className="text-red-600 text-sm">{errorMessage}</p>}
              <Button type="submit" variant="primary" disabled={formState === 'submitting'}>
                {formState === 'submitting' ? 'Sending…' : 'Send Message'}
              </Button>
            </form>
          )}
        </motion.div>
      </Container>
    </motion.section>
  )
}
```

**Step 2: Fix ContactContent.tsx (contact page)**

In `app/contact/ContactContent.tsx`:

1. Change import to: `import { useState, useRef, FormEvent } from 'react'`

2. Add `formRef` inside component: `const formRef = useRef<HTMLFormElement>(null)`

3. In `handleSubmit`, before `setFormState('submitting')`, add validation:
```tsx
if (!form.checkValidity()) {
  const firstInvalid = form.querySelector<HTMLInputElement | HTMLTextAreaElement>(':invalid')
  firstInvalid?.focus()
  form.reportValidity()
  return
}
```

4. Trim all form values in the `body: JSON.stringify({...})` block:
```tsx
body: JSON.stringify({
  name: (formData.get('name') as string)?.trim(),
  email: (formData.get('email') as string)?.trim(),
  phone: (formData.get('phone') as string)?.trim(),
  message: (formData.get('message') as string)?.trim(),
}),
```

5. Add `aria-live="polite"` to the success div (line 73):
```tsx
<div className="bg-muted p-8 rounded-sm text-center" aria-live="polite">
```

6. Change error `<p>` to have `role="alert"`:
```tsx
<p role="alert" className="text-red-600 text-sm">{errorMessage}</p>
```

7. Add `noValidate` to `<form>` tag, add `ref={formRef}`:
```tsx
<form ref={formRef} onSubmit={handleSubmit} className="space-y-6" noValidate>
```

8. Add attributes to inputs:
   - Name input: add `autoComplete="name"` and `placeholder="Jane Doe…"`
   - Email input: add `autoComplete="email"` `spellCheck={false}` and `placeholder="jane@example.com…"`
   - Phone input: add `autoComplete="tel"` `inputMode="tel"` and `placeholder="(555) 123-4567…"`
   - Message textarea: add `placeholder="How can we help…"`

9. Add `handleTextareaKeyDown` function and wire to textarea:
```tsx
function handleTextareaKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
    e.preventDefault()
    formRef.current?.requestSubmit()
  }
}
```
Add `onKeyDown={handleTextareaKeyDown}` to `<textarea>`.

10. Change `'Sending...'` to `'Sending…'` (proper ellipsis character).

**Step 3: Verify**

Run: `npm run build`
Expected: Builds without errors. Forms have autocomplete suggestions, screen readers announce errors.

**Step 4: Commit**

```bash
git add components/sections/ContactForm.tsx app/contact/ContactContent.tsx
git commit -m "a11y: form aria-live, focus-first-error, autocomplete, trim, Cmd+Enter"
```

---

### Task 5: Footer touch targets

**Files:**
- Modify: `components/layout/Footer.tsx`

**Step 1: Expand social icon link hit areas**

In `components/layout/Footer.tsx`, change the social link `<a>` (line 102-113).

Old:
```tsx
className="opacity-70 hover:opacity-100 transition-opacity"
```

New:
```tsx
className="p-2 -m-2 opacity-70 hover:opacity-100 transition-opacity"
```

This adds 8px padding on all sides (20px icon + 16px padding = 36px, still short of 44px so use `p-3 -m-3`):

```tsx
className="p-3 -m-3 opacity-70 hover:opacity-100 transition-opacity"
```

That gives 20px + 24px = 44px. Use `p-3 -m-3`.

**Step 2: Expand contact link hit areas**

For the phone link (line 88) and email link (line 93), add padding:

Phone:
```tsx
<a href={`tel:${stegaClean(siteSettings.phone)}`} className="block text-sm opacity-70 hover:opacity-100 py-1">
```

Email:
```tsx
<a href={`mailto:${stegaClean(siteSettings.email)}`} className="block text-sm opacity-70 hover:opacity-100 py-1 mb-2">
```

(`py-1` adds 4px top+bottom to the text line, reaching ~28px — acceptable for text links which have a MUST threshold of ≥24px, not the 44px mobile button threshold. These are inline text links, not icon-only targets.)

**Step 3: Verify**

Run: `npm run build`
Expected: Builds without errors. Social icons have generous tap targets.

**Step 4: Commit**

```bash
git add components/layout/Footer.tsx
git commit -m "a11y: expand footer social icons and contact links to meet touch target minimums"
```

---

### Task 6: FAQ accordion focus outline fix

**Files:**
- Modify: `components/ui/FAQAccordion.tsx:49`
- Modify: `app/faq/FAQContent.tsx:33`

**Step 1: Fix FAQAccordion.tsx**

In `components/ui/FAQAccordion.tsx` line 49, change:

```tsx
className={`w-full text-left py-6 flex items-center justify-between gap-4 ${textColor} hover:opacity-70 transition-opacity duration-300 focus:outline-none focus-visible:outline-none active:opacity-70`}
```

To:

```tsx
className={`w-full text-left py-6 flex items-center justify-between gap-4 ${textColor} hover:opacity-70 transition-opacity duration-300 active:opacity-70`}
```

(Removed `focus:outline-none focus-visible:outline-none`. The global `:focus-visible` rule in `globals.css` provides the visible focus ring.)

**Step 2: Fix FAQContent.tsx**

In `app/faq/FAQContent.tsx` line 33, change:

```tsx
className="w-full text-left py-6 flex items-center justify-between gap-4 hover:opacity-70 transition-opacity duration-300 focus:outline-none focus-visible:outline-none active:opacity-70"
```

To:

```tsx
className="w-full text-left py-6 flex items-center justify-between gap-4 hover:opacity-70 transition-opacity duration-300 active:opacity-70"
```

**Step 3: Verify**

Run: `npm run build`
Expected: Builds without errors. Tab to FAQ accordion buttons — gold focus ring visible.

**Step 4: Commit**

```bash
git add components/ui/FAQAccordion.tsx app/faq/FAQContent.tsx
git commit -m "a11y: restore visible focus ring on FAQ accordion buttons"
```

---

### Task 7: Bonus — fix `transition-all` on Button.tsx

**Files:**
- Modify: `components/ui/Button.tsx:38`

**Step 1: Replace transition-all**

In `components/ui/Button.tsx` line 38, change:

```tsx
const baseStyles = 'inline-flex items-center justify-center font-sans uppercase tracking-wider transition-all duration-200 min-h-touch'
```

To:

```tsx
const baseStyles = 'inline-flex items-center justify-center font-sans uppercase tracking-wider transition-colors duration-200 min-h-touch'
```

The button only transitions `background-color` and `color` on hover — `transition-colors` is the correct scope.

**Step 2: Verify**

Run: `npm run build`
Expected: Builds without errors. Button hover transitions still work.

**Step 3: Commit**

```bash
git add components/ui/Button.tsx
git commit -m "perf: replace transition-all with transition-colors on Button"
```

---

### Task 8: Final verification

**Step 1: Full build + typecheck**

Run: `npm run build && npm run typecheck`
Expected: Both pass with no errors.

**Step 2: Run lint**

Run: `npm run lint`
Expected: No new lint errors.
