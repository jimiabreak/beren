# Accessibility Checklist

## Keyboard Navigation
- [x] All interactive elements focusable via Tab
- [x] Visible focus rings (`:focus-visible`)
- [x] Skip-to-content link in root layout
- [x] FAQ accordion toggle with Enter/Space

## ARIA Attributes
- [x] `aria-expanded` on FAQ accordion buttons
- [x] `aria-expanded` on mobile nav toggle
- [x] `aria-current="page"` on active nav links
- [x] `aria-label` on icon-only buttons (nav toggle, carousel, dismiss)
- [x] `aria-live="polite"` on form feedback (newsletter, contact)
- [x] `role="dialog"` on cookie consent banner
- [x] `role="banner"` on promo banner
- [x] `role="note"` on callout blocks

## Images
- [x] All images have alt text (enforced by Sanity schema validation)
- [x] Decorative elements use `aria-hidden="true"`

## Forms
- [x] Labels associated with inputs (sr-only where visual labels omitted)
- [x] Error messages inline next to fields
- [x] Loading buttons show spinner and keep original label
- [x] `autocomplete` attributes on email inputs

## Motion
- [x] `MotionConfig reducedMotion="user"` wraps all animated content
- [x] No autoplay animations that can't be stopped

## Color & Contrast
- [x] Primary text on background meets WCAG AA
- [x] Interactive state changes increase contrast
