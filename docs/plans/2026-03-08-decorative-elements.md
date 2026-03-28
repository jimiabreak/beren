# Decorative Elements Refinement — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refine all wireframe decorative elements to closely match Blake Juras source wireframes — buttons, frames, badges, monogram, arrows.

**Architecture:** Single-file update to `components/wireframe/WireframeBox.tsx`. All decorative components are refined in place. No new files, no new dependencies.

**Tech Stack:** CSS (mask-image, clip-path, radial-gradient), inline SVG, Tailwind utility classes.

---

### Task 1: Refine ScallopFrame — tighter zigzag bumps

The source (image 04, left column) shows small, tight triangular zigzag bumps — not large semicircles. The bumps are more like a postage stamp edge.

**Files:**
- Modify: `components/wireframe/WireframeBox.tsx:60-78`

**Step 1: Replace ScallopFrame implementation**

Replace the current ScallopFrame with tighter scallop parameters — smaller circles (3.5px instead of 5px) for denser bumps, and slightly thinner border (2px):

```tsx
/* ── Frame Style 1: Scalloped / postage-stamp edge (warm/featured content) ── */
export function ScallopFrame({ color = '#D4848A', children, className = '' }: { color?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative p-3 ${className}`}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          border: `2px solid ${color}`,
          borderRadius: '10px',
          mask: `radial-gradient(circle 3.5px at 3.5px 0, transparent 3px, black 3.5px) -3.5px 0/7px 51% repeat-x,
                 radial-gradient(circle 3.5px at 3.5px 100%, transparent 3px, black 3.5px) -3.5px 100%/7px 51% repeat-x,
                 radial-gradient(circle 3.5px at 0 3.5px, transparent 3px, black 3.5px) 0 -3.5px/51% 7px repeat-y,
                 radial-gradient(circle 3.5px at 100% 3.5px, transparent 3px, black 3.5px) 100% -3.5px/51% 7px repeat-y`,
        }}
      />
      {children}
    </div>
  )
}
```

**Step 2: Verify** — run `npm run typecheck`

**Step 3: Commit** — `git add components/wireframe/WireframeBox.tsx && git commit -m "refine: tighter scallop frame bumps to match source wireframes"`

---

### Task 2: Refine RoundedFrame — proper double-line border

Source (image 04, center column) shows a smooth rounded-rect with clear outer and inner border lines with visible gap. The inner line is softer/lighter.

**Files:**
- Modify: `components/wireframe/WireframeBox.tsx:80-103`

**Step 1: Replace RoundedFrame implementation**

Increase the gap between outer and inner borders to 5px, make inner border lighter at 0.4 opacity, and use consistent border-radius:

```tsx
/* ── Frame Style 2: Smooth double-line rounded-rect (cool/editorial content) ── */
export function RoundedFrame({ color = '#8BA4A8', children, className = '' }: { color?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative p-4 ${className}`}>
      {/* Outer border */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          border: `2px solid ${color}`,
          borderRadius: '14px',
        }}
      />
      {/* Inner border */}
      <div
        className="absolute pointer-events-none"
        style={{
          inset: '5px',
          border: `1px solid ${color}`,
          borderRadius: '10px',
          opacity: 0.4,
        }}
      />
      {children}
    </div>
  )
}
```

**Step 2: Verify** — run `npm run typecheck`

---

### Task 3: Refine ClippedFrame — solid border, better proportions

Source (image 04, right column) shows solid border (not dotted), with clipped corners creating an octagonal shape. Border has a slight dash pattern on the edges.

**Files:**
- Modify: `components/wireframe/WireframeBox.tsx:105-120`

**Step 1: Replace ClippedFrame implementation**

Switch from dotted to solid border, increase clip size to 14px for more visible chamfer:

```tsx
/* ── Frame Style 3: Clipped-corner / chamfered (dark/utility content) ── */
export function ClippedFrame({ color = '#5A534B', children, className = '' }: { color?: string; children: React.ReactNode; className?: string }) {
  const c = '14px'
  return (
    <div className={`relative p-3 ${className}`}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          border: `2px solid ${color}`,
          clipPath: `polygon(${c} 0, calc(100% - ${c}) 0, 100% ${c}, 100% calc(100% - ${c}), calc(100% - ${c}) 100%, ${c} 100%, 0 calc(100% - ${c}), 0 ${c})`,
        }}
      />
      {children}
    </div>
  )
}
```

**Step 2: Verify** — run `npm run typecheck`

---

### Task 4: Refine ShopMyPicksButton — ornate scalloped pill

Source (image 02, row 2) shows a pill-shaped button with decorative scalloped/zigzag edges on top and bottom. The button has an inner text area surrounded by a decorative border treatment. It looks like a vintage ticket or ornate label.

**Files:**
- Modify: `components/wireframe/WireframeBox.tsx:229-248`

**Step 1: Replace ShopMyPicksButton implementation**

Create a more ornate scalloped pill with tighter zigzag pattern on top/bottom edges using mask-image, plus an inner border for the double-line effect:

```tsx
export function ShopMyPicksButton({ href, color = '#3D3832' }: { href: string; color?: string }) {
  return (
    <Link href={href} className="inline-block">
      <span
        className="relative inline-block px-10 py-3 text-[10px] tracking-[0.18em] uppercase font-medium"
        style={{ color }}
      >
        {/* Outer scalloped border */}
        <span
          className="absolute inset-0 pointer-events-none"
          style={{
            border: `2px solid ${color}`,
            borderRadius: '999px',
            mask: `radial-gradient(circle 3px at 3px 0, transparent 2.5px, black 3px) -3px 0/6px 51% repeat-x,
                   radial-gradient(circle 3px at 3px 100%, transparent 2.5px, black 3px) -3px 100%/6px 51% repeat-x,
                   linear-gradient(black, black) 0 0/51% 100% no-repeat,
                   linear-gradient(black, black) 100% 0/51% 100% no-repeat`,
          }}
        />
        {/* Inner border line */}
        <span
          className="absolute pointer-events-none"
          style={{
            inset: '4px',
            border: `1px solid ${color}`,
            borderRadius: '999px',
            opacity: 0.35,
          }}
        />
        Shop My Picks
      </span>
    </Link>
  )
}
```

**Step 2: Verify** — run `npm run typecheck`

---

### Task 5: Refine ViewAllButton — rounded corners

Source (image 02, row 1) shows "VIEW ALL" in a pill/rounded-rect outline — not a sharp rectangle.

**Files:**
- Modify: `components/wireframe/WireframeBox.tsx:217-227`

**Step 1: Replace ViewAllButton implementation**

Add rounded corners and slightly adjust proportions:

```tsx
export function ViewAllButton({ href, className = '' }: { href: string; className?: string }) {
  return (
    <Link
      href={href}
      className={`inline-block border-2 border-[#3D3832] rounded px-6 py-2 text-[10px] tracking-[0.2em] uppercase font-medium text-[#3D3832] hover:bg-[#3D3832] hover:text-[#FAF9F6] transition-colors ${className}`}
    >
      View All
    </Link>
  )
}
```

**Step 2: Verify** — run `npm run typecheck`

---

### Task 6: Refine ArrowButton — circles instead of squares

Source (image 02, row 3) shows arrow navigation as outlined circles, not squares.

**Files:**
- Modify: `components/wireframe/WireframeBox.tsx:146-153`

**Step 1: Replace ArrowButton implementation**

Change from square to circle with `rounded-full`:

```tsx
export function ArrowButton({ direction = 'left', className = '' }: { direction?: 'left' | 'right'; className?: string }) {
  return (
    <span className={`shrink-0 w-10 h-10 rounded-full border-2 border-[#3D3832] flex items-center justify-center text-[#3D3832] text-base cursor-pointer hover:bg-[#3D3832] hover:text-[#FAF9F6] transition-colors ${className}`}>
      {direction === 'left' ? '\u2190' : '\u2192'}
    </span>
  )
}
```

**Step 2: Verify** — run `npm run typecheck`

---

### Task 7: Refine PostCard "read more" badge — decorative cartouche

Source (image 02, cards) shows "read more" inside a decorative shape — a rounded rect with a small pointed tab at bottom center, like a vintage label.

**Files:**
- Modify: `components/wireframe/WireframeBox.tsx:182-188`

**Step 1: Replace the "read more" badge in PostCard**

Use an SVG-based cartouche shape as background:

```tsx
      {/* "Read more" cartouche badge */}
      <span className="inline-flex items-center justify-center mt-2 relative">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 80 30" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M4 1h72a3 3 0 013 3v16a3 3 0 01-3 3H44l-4 5-4-5H4a3 3 0 01-3-3V4a3 3 0 013-3z"
            stroke={categoryColor}
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
        <span
          className="relative px-4 py-1.5 pb-2 text-[11px] italic font-serif"
          style={{ color: categoryColor }}
        >
          read more
        </span>
      </span>
```

**Step 2: Verify** — run `npm run typecheck`

---

### Task 8: Refine NWGMonogram — cleaner proportions

Source (image 02, card bottoms) shows a compact lamp icon between serif N and G. The lamp is simpler — a trapezoid shade on a thin stem with a small base.

**Files:**
- Modify: `components/wireframe/WireframeBox.tsx:197-215`

**Step 1: Replace NWGMonogram SVG**

Cleaner, thinner lamp with better letter positioning:

```tsx
export function NWGMonogram({ color = '#C0B9AE', size = 28 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Lamp shade — thin trapezoid */}
      <path d="M14.5 4L18 1L21.5 4H14.5Z" fill={color} opacity="0.7" />
      <path d="M13 4H23L21 9H15L13 4Z" fill={color} opacity="0.5" />
      {/* Lamp stem */}
      <rect x="17" y="9" width="2" height="3" fill={color} opacity="0.5" />
      {/* Lamp base */}
      <rect x="15" y="12" width="6" height="1.5" rx="0.75" fill={color} opacity="0.6" />
      {/* Letters */}
      <text x="0" y="26" fontSize="10" fontWeight="500" fontFamily="serif" fill={color} opacity="0.8">N</text>
      <text x="27" y="26" fontSize="10" fontWeight="500" fontFamily="serif" fill={color} opacity="0.8">G</text>
    </svg>
  )
}
```

**Step 2: Verify** — run `npm run typecheck`

**Step 3: Final commit** — `git add components/wireframe/WireframeBox.tsx && git commit -m "refine: decorative elements to match Blake Juras source wireframes"`

---

## Verification

After all tasks:
1. `npm run typecheck` passes
2. `npm run lint` passes
3. Browse `/w/home` — "Shop My Picks" has ornate scalloped pill shape
4. Browse `/w/blog` — PostCards have cartouche "read more" badge, refined scallop frames, NWG monogram
5. Browse `/w/blog-interiors` — PostCards show double-line rounded frames
6. Browse `/w/things-we-love` — Products show clipped-corner frames
7. Browse `/w/about` — press uses rounded frames, partnerships use clipped frames
8. Arrow buttons are circles on homepage and house tour carousels
