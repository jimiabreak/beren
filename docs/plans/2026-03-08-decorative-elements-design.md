# Decorative Element Refinement — Design

Refine all wireframe decorative elements (buttons, frames, badges, monogram) to closely match the Blake Juras source wireframes while maintaining elegant balance. One cohesive style per element type, consistent shapes across all 7 color themes.

## Source Reference

- `1217-NWG-Website-Wireframes-REVIEW-02.jpg` — Buttons / Text Boxes (7 color columns)
- `1217-NWG-Website-Wireframes-REVIEW-04.jpg` — Frames / Containers / Backgrounds (3 style variants)
- `1217-NWG-Website-Wireframes-REVIEW-05.jpg` — Homepage mockup with real styling

## Elements

### 1. "Shop My Picks" Button

The signature decorative button. Rounded pill shape with scalloped/punched top and bottom edges — resembles a vintage ticket stub or decorative label.

**CSS approach:** Pill shape via `border-radius: 999px`. Top and bottom scalloped edges via `mask-image` with repeating `radial-gradient` circles punching into the border edges. Border via `box-shadow` or `outline` since mask clips the element.

**Behavior:** Color adapts to context (white on dark backgrounds, theme color on light). Hover slightly increases opacity or adds subtle fill.

**Where used:** Homepage holiday CTA, house tour sections, anywhere "shop" is the primary action.

### 2. "View All" Button

The understated counterpart. Clean rounded-rect outline, no decoration.

**CSS approach:** `border: 2px solid`, `border-radius: 4px`, uppercase `letter-spacing: 0.2em`, `font-size: 10px`. Hover fills with border color, text inverts.

**Where used:** Category pages, section footers, anywhere "see more" is needed.

### 3. Frame Styles (3 variants)

Each frame style has a distinct personality. All accept a `color` prop for the border/accent color.

#### 3a. Scallop Frame (warm/featured content)

Tighter, more defined scallop bumps than current implementation. Source shows small, evenly-spaced semicircular bumps along all 4 edges with rounded corners.

**CSS approach:** Refine the existing `mask` radial-gradient. Reduce circle size from 5px to 3.5-4px for denser scallops. Keep `border-radius: 12px` on the underlying border. Border width 2-3px.

**Where used:** Featured blog posts on homepage, PostCard images on Food & pink-themed pages, house tour room photos.

#### 3b. Rounded Double-Line Frame (cool/editorial content)

Smooth rounded rectangle with a double-line border effect — outer border + inner inset border with visible gap.

**CSS approach:** Outer element gets `border: 2px solid {color}` with `border-radius: 16px`. Inner pseudo-element (or nested div) gets `border: 1px solid {color}` with `border-radius: 12px` at `opacity: 0.5`, inset 4px from outer. Creates a refined double-line effect.

**Where used:** PostCard images on Interiors/brown-themed pages, press mentions on About, Partnerships hero.

#### 3c. Clipped-Corner Frame (dark/utility content)

Architectural feel — straight edges with chamfered (clipped) corners. Solid border, not dotted.

**CSS approach:** `clip-path: polygon(...)` with ~12px corner clips creating an octagonal shape. Solid `border: 2px solid {color}`. Clean and geometric.

**Where used:** Things We Love product cards, partnership cards on About, PostCard images on charcoal-themed pages.

### 4. "Read More" Badge on PostCard

Small decorative cartouche — a rounded rectangle with a subtle pointed notch at the bottom center, like a vintage label or location pin.

**CSS approach:** Small inline element with `clip-path` creating a rounded-rect body with a downward-pointing triangle at bottom-center. Border color matches category theme. Text is italic serif inside.

**Dimensions:** ~80px wide, ~28px tall (plus ~6px point). Subtle — should not overpower the card.

**Where used:** Every PostCard across all category pages.

### 5. NWG Monogram on PostCard

Refined SVG mark — the NWG lamp icon centered between serif N and G letters. Current implementation is rough; refine proportions.

**Refinements:**
- Thinner lamp shade (triangle) and base shapes
- Better letter spacing — N and G further apart with lamp centered
- Overall size stays small (28px)
- Color matches category theme at reduced opacity

**Where used:** Bottom of every PostCard.

## Files to Modify

- `components/wireframe/WireframeBox.tsx` — all 5 elements live here (ScallopFrame, RoundedFrame, ClippedFrame, PostCard, ShopMyPicksButton, ViewAllButton, NWGMonogram)

No new files needed. All changes are refinements to existing components.

## Success Criteria

- Decorative elements are visually distinct from generic CSS
- Each frame style is clearly different from the others
- "Shop My Picks" reads as ornate/decorative at a glance
- "Read more" badge adds character without dominating the card
- Consistent within each element type across all color themes
- No broken layouts or overflow issues
