# Phase 2: New Page Builder Sections + Designer Skills — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add 8 new page builder sections to cover the NWG wireframe gaps (product grids, house tours, partnerships, DIY templates), plus 5 designer-focused Claude Code commands (`/add-section`, `/theme`, `/new-page`, `/audit`, `/deploy`).

**Architecture:** Each section follows the existing 7-file pattern: Sanity schema → register in index + modularPage + homePage → GROQ projection → React component → SectionRenderer mapping → TypeScript interface. Skills are `.claude/commands/*.md` files with YAML frontmatter.

**Tech Stack:** Sanity v3 schema definitions, Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, `@sanity/icons`.

---

## Reference: The 7-File Section Pattern

Every new section touches these files in this order:

1. **Create** `sanity/schemaTypes/sections/{name}.ts` — schema definition
2. **Modify** `sanity/schemaTypes/index.ts` — import + register
3. **Modify** `sanity/schemaTypes/documents/modularPage.ts` — add `defineArrayMember`
4. **Modify** `sanity/schemaTypes/singletons/homePage.ts` — add `defineArrayMember`
5. **Modify** `sanity/lib/queries.ts` — add GROQ projection in `MODULAR_PAGE_SECTIONS_PROJECTION`
6. **Create** `components/sections/{Name}Section.tsx` — React component
7. **Modify** `components/sections/SectionRenderer.tsx` — import + mapping
8. **Modify** `types/index.ts` — interface + union member
9. **Run** `npm run typegen` after all schemas are registered

---

## Part A: Page Builder Sections

### Task 1: Create all 8 Sanity schemas

Create these 8 files. Each is a `defineType` with `type: 'object'`.

**Files:**
- Create: `sanity/schemaTypes/sections/categoryHeader.ts`
- Create: `sanity/schemaTypes/sections/productCarousel.ts`
- Create: `sanity/schemaTypes/sections/productGrid.ts`
- Create: `sanity/schemaTypes/sections/partnershipHighlight.ts`
- Create: `sanity/schemaTypes/sections/houseTourCards.ts`
- Create: `sanity/schemaTypes/sections/roomSection.ts`
- Create: `sanity/schemaTypes/sections/diyStep.ts`
- Create: `sanity/schemaTypes/sections/categoryBanner.ts`

**Step 1: Create `sanity/schemaTypes/sections/categoryHeader.ts`**

Patterned background with title + description. Used at top of category listing pages.

```ts
import { defineType, defineField } from 'sanity'
import { TagIcon } from '@sanity/icons'

export default defineType({
  name: 'categoryHeader',
  title: 'Category Header',
  type: 'object',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'backgroundStyle',
      title: 'Background Style',
      type: 'string',
      options: { list: ['solid', 'stripes', 'dots'], layout: 'radio' },
      initialValue: 'solid',
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      description: 'Hex color (e.g. #D9CB8B)',
    }),
    defineField({
      name: 'textColor',
      title: 'Text Color',
      type: 'string',
      description: 'Hex color for heading and description text',
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: title || 'Category Header', subtitle: 'Category Header', media: TagIcon }
    },
  },
})
```

**Step 2: Create `sanity/schemaTypes/sections/productCarousel.ts`**

Horizontal product grid with title, background tint, and affiliate links. Used on house tour detail and room blog posts.

```ts
import { defineType, defineField, defineArrayMember } from 'sanity'
import { BasketIcon } from '@sanity/icons'

export default defineType({
  name: 'productCarousel',
  title: 'Product Carousel',
  type: 'object',
  icon: BasketIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      description: 'Hex color for the tinted container',
    }),
    defineField({
      name: 'products',
      title: 'Products',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'product',
          fields: [
            defineField({ name: 'name', title: 'Product Name', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'price', title: 'Price', type: 'string' }),
            defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
            defineField({ name: 'url', title: 'Affiliate URL', type: 'url', description: 'LTK or external link' }),
          ],
          preview: {
            select: { title: 'name', subtitle: 'price', media: 'image' },
          },
        }),
      ],
    }),
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'number',
      options: { list: [3, 4, 5, 6] },
      initialValue: 5,
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: title || 'Product Carousel', subtitle: 'Product Carousel', media: BasketIcon }
    },
  },
})
```

**Step 3: Create `sanity/schemaTypes/sections/productGrid.ts`**

Flexible product grid — serves both downloads (with buy button) and affiliate (with hover overlay) use cases via a `variant` field.

```ts
import { defineType, defineField, defineArrayMember } from 'sanity'
import { InlineIcon } from '@sanity/icons'

export default defineType({
  name: 'productGrid',
  title: 'Product Grid',
  type: 'object',
  icon: InlineIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
    }),
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'string',
      options: { list: ['downloads', 'affiliate'], layout: 'radio' },
      initialValue: 'affiliate',
      description: '"downloads" shows price + buy button. "affiliate" shows hover overlay + external link.',
    }),
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'number',
      options: { list: [2, 3, 4] },
      initialValue: 3,
    }),
    defineField({
      name: 'products',
      title: 'Products',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'product',
          fields: [
            defineField({ name: 'name', title: 'Product Name', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
            defineField({ name: 'price', title: 'Price', type: 'string' }),
            defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
            defineField({ name: 'url', title: 'Link URL', type: 'url', validation: (Rule) => Rule.required() }),
            defineField({ name: 'buttonText', title: 'Button Text', type: 'string', description: 'e.g. "Buy Now", "Shop"', initialValue: 'Shop' }),
          ],
          preview: {
            select: { title: 'name', subtitle: 'price', media: 'image' },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'heading', variant: 'variant' },
    prepare({ title, variant }) {
      return { title: title || 'Product Grid', subtitle: `Product Grid (${variant || 'affiliate'})`, media: InlineIcon }
    },
  },
})
```

**Step 4: Create `sanity/schemaTypes/sections/partnershipHighlight.ts`**

Featured partner hero — large image + description + external link.

```ts
import { defineType, defineField } from 'sanity'
import { UsersIcon } from '@sanity/icons'

export default defineType({
  name: 'partnershipHighlight',
  title: 'Partnership Highlight',
  type: 'object',
  icon: UsersIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Partner Name',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'portableText',
    }),
    defineField({
      name: 'image',
      title: 'Partner Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'imagePosition',
      title: 'Image Position',
      type: 'string',
      options: { list: ['left', 'right'], layout: 'radio' },
      initialValue: 'left',
    }),
    defineField({
      name: 'cta',
      title: 'CTA Button',
      type: 'cta',
    }),
  ],
  preview: {
    select: { title: 'heading', media: 'image' },
    prepare({ title, media }) {
      return { title: title || 'Partnership Highlight', subtitle: 'Partnership Highlight', media: media || UsersIcon }
    },
  },
})
```

**Step 5: Create `sanity/schemaTypes/sections/houseTourCards.ts`**

Grid of house tour cards with room tag pills. Each card links to a tour detail page.

```ts
import { defineType, defineField, defineArrayMember } from 'sanity'
import { HomeIcon } from '@sanity/icons'

export default defineType({
  name: 'houseTourCards',
  title: 'House Tour Cards',
  type: 'object',
  icon: HomeIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
    }),
    defineField({
      name: 'tours',
      title: 'Tours',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'tour',
          fields: [
            defineField({ name: 'title', title: 'Tour Title', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
            defineField({ name: 'image', title: 'Cover Image', type: 'image', options: { hotspot: true } }),
            defineField({ name: 'href', title: 'Link', type: 'string', description: 'URL to tour detail page' }),
            defineField({
              name: 'rooms',
              title: 'Room Tags',
              type: 'array',
              of: [defineArrayMember({ type: 'string' })],
              description: 'e.g. "Living Room", "Kitchen", "Primary Bedroom"',
            }),
          ],
          preview: {
            select: { title: 'title', media: 'image' },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: title || 'House Tour Cards', subtitle: 'House Tour Cards', media: HomeIcon }
    },
  },
})
```

**Step 6: Create `sanity/schemaTypes/sections/roomSection.ts`**

A single room within a house tour — room photos + product carousel. Designed to be repeated.

```ts
import { defineType, defineField, defineArrayMember } from 'sanity'
import { ImageIcon } from '@sanity/icons'

export default defineType({
  name: 'roomSection',
  title: 'Room Section',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'roomName',
      title: 'Room Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'photos',
      title: 'Room Photos',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
        }),
      ],
      validation: (Rule) => Rule.max(4),
    }),
    defineField({
      name: 'frameStyle',
      title: 'Photo Frame Style',
      type: 'string',
      options: { list: ['none', 'scallop', 'rounded', 'clipped'], layout: 'radio' },
      initialValue: 'none',
    }),
    defineField({
      name: 'frameColor',
      title: 'Frame Color',
      type: 'string',
      description: 'Hex color for the decorative frame',
    }),
    defineField({
      name: 'products',
      title: 'Products to Shop',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'product',
          fields: [
            defineField({ name: 'name', title: 'Product Name', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'price', title: 'Price', type: 'string' }),
            defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
            defineField({ name: 'url', title: 'Affiliate URL', type: 'url' }),
          ],
          preview: {
            select: { title: 'name', subtitle: 'price', media: 'image' },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'roomName' },
    prepare({ title }) {
      return { title: title || 'Room Section', subtitle: 'Room Section', media: ImageIcon }
    },
  },
})
```

**Step 7: Create `sanity/schemaTypes/sections/diyStep.ts`**

A DIY/tutorial step — image + instructions + materials callout box. Designed to be repeated.

```ts
import { defineType, defineField, defineArrayMember } from 'sanity'
import { BulbOutlineIcon } from '@sanity/icons'

export default defineType({
  name: 'diyStep',
  title: 'DIY Step',
  type: 'object',
  icon: BulbOutlineIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Step Title',
      type: 'string',
      description: 'e.g. "Step 1: Prep the Wall"',
    }),
    defineField({
      name: 'instructions',
      title: 'Instructions',
      type: 'portableText',
    }),
    defineField({
      name: 'image',
      title: 'Step Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'imagePosition',
      title: 'Image Position',
      type: 'string',
      options: { list: ['left', 'right'], layout: 'radio' },
      initialValue: 'left',
    }),
    defineField({
      name: 'materials',
      title: 'Materials / Tools',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      description: 'List of materials or tools needed for this step',
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: title || 'DIY Step', subtitle: 'DIY Step', media: BulbOutlineIcon }
    },
  },
})
```

**Step 8: Create `sanity/schemaTypes/sections/categoryBanner.ts`**

Full-width colored accent bar with optional text. Used at the top of category pages.

```ts
import { defineType, defineField } from 'sanity'
import { BlockContentIcon } from '@sanity/icons'

export default defineType({
  name: 'categoryBanner',
  title: 'Category Banner',
  type: 'object',
  icon: BlockContentIcon,
  fields: [
    defineField({
      name: 'color',
      title: 'Banner Color',
      type: 'string',
      description: 'Hex color for the accent bar',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'height',
      title: 'Height',
      type: 'string',
      options: { list: ['thin', 'medium', 'tall'], layout: 'radio' },
      initialValue: 'thin',
      description: 'thin = 6px accent line, medium = 40px bar, tall = 80px bar with optional text',
    }),
    defineField({
      name: 'text',
      title: 'Banner Text',
      type: 'string',
      description: 'Optional text shown on medium/tall banners',
    }),
  ],
  preview: {
    select: { title: 'text', color: 'color' },
    prepare({ title, color }) {
      return { title: title || `Banner (${color || 'no color'})`, subtitle: 'Category Banner', media: BlockContentIcon }
    },
  },
})
```

**Step 9: Verify** — `npm run typecheck` (schemas only, no components yet — should pass since schemas are standalone)

**Step 10: Commit** — `git add sanity/schemaTypes/sections/ && git commit -m "feat: add 8 new page builder section schemas"`

---

### Task 2: Register all schemas and add GROQ projections

**Files:**
- Modify: `sanity/schemaTypes/index.ts`
- Modify: `sanity/schemaTypes/documents/modularPage.ts`
- Modify: `sanity/schemaTypes/singletons/homePage.ts`
- Modify: `sanity/lib/queries.ts`

**Step 1: Add imports and registrations to `sanity/schemaTypes/index.ts`**

Add after the existing section imports (after line 26 `import blogGrid`):

```ts
import categoryHeader from './sections/categoryHeader'
import productCarousel from './sections/productCarousel'
import productGrid from './sections/productGrid'
import partnershipHighlight from './sections/partnershipHighlight'
import houseTourCards from './sections/houseTourCards'
import roomSection from './sections/roomSection'
import diyStep from './sections/diyStep'
import categoryBanner from './sections/categoryBanner'
```

Add to the `schemaTypes` array after `blogGrid`:

```ts
  categoryHeader,
  productCarousel,
  productGrid,
  partnershipHighlight,
  houseTourCards,
  roomSection,
  diyStep,
  categoryBanner,
```

**Step 2: Add to `modularPage.ts` sections array**

Add after `defineArrayMember({ type: 'blogGrid' })` (line 55):

```ts
        defineArrayMember({ type: 'categoryHeader' }),
        defineArrayMember({ type: 'productCarousel' }),
        defineArrayMember({ type: 'productGrid' }),
        defineArrayMember({ type: 'partnershipHighlight' }),
        defineArrayMember({ type: 'houseTourCards' }),
        defineArrayMember({ type: 'roomSection' }),
        defineArrayMember({ type: 'diyStep' }),
        defineArrayMember({ type: 'categoryBanner' }),
```

**Step 3: Add the same 8 lines to `homePage.ts`** sections array after `defineArrayMember({ type: 'blogGrid' })` (line 37).

**Step 4: Add GROQ projections to `sanity/lib/queries.ts`**

Add inside `MODULAR_PAGE_SECTIONS_PROJECTION`, after the `blogGrid` block (after line 151):

```groq
    _type == "categoryHeader" => {
      heading, description, backgroundStyle, backgroundColor, textColor
    },
    _type == "productCarousel" => {
      heading, backgroundColor, columns,
      products[] { name, price, image, url }
    },
    _type == "productGrid" => {
      heading, variant, columns,
      products[] { name, description, price, image, url, buttonText }
    },
    _type == "partnershipHighlight" => {
      heading, description, image, imagePosition, cta
    },
    _type == "houseTourCards" => {
      heading,
      tours[] { title, description, image, href, rooms }
    },
    _type == "roomSection" => {
      roomName, photos, frameStyle, frameColor,
      products[] { name, price, image, url }
    },
    _type == "diyStep" => {
      heading, instructions, image, imagePosition, materials
    },
    _type == "categoryBanner" => {
      color, height, text
    }
```

**Step 5: Verify** — `npm run typecheck`

**Step 6: Commit** — `git commit -am "feat: register 8 new sections in schema index, page documents, and GROQ queries"`

---

### Task 3: Add TypeScript interfaces

**Files:**
- Modify: `types/index.ts`

**Step 1: Add interfaces** after `ModularBlogGrid` (after line 390):

```ts
/** Category header with patterned background */
export interface ModularCategoryHeader {
  _type: 'categoryHeader'
  _key: string
  heading?: string
  description?: string
  backgroundStyle?: 'solid' | 'stripes' | 'dots'
  backgroundColor?: string
  textColor?: string
}

/** Product carousel with affiliate links */
export interface ModularProductCarousel {
  _type: 'productCarousel'
  _key: string
  heading?: string
  backgroundColor?: string
  columns?: number
  products?: Array<{
    name: string
    price?: string
    image?: SanityImage
    url?: string
  }>
}

/** Product grid (downloads or affiliate variant) */
export interface ModularProductGrid {
  _type: 'productGrid'
  _key: string
  heading?: string
  variant?: 'downloads' | 'affiliate'
  columns?: number
  products?: Array<{
    name: string
    description?: string
    price?: string
    image?: SanityImage
    url: string
    buttonText?: string
  }>
}

/** Partnership highlight — featured partner hero */
export interface ModularPartnershipHighlight {
  _type: 'partnershipHighlight'
  _key: string
  heading?: string
  description?: PortableTextBlock
  image?: SanityImage
  imagePosition?: 'left' | 'right'
  cta?: CTA
}

/** House tour cards grid */
export interface ModularHouseTourCards {
  _type: 'houseTourCards'
  _key: string
  heading?: string
  tours?: Array<{
    title: string
    description?: string
    image?: SanityImage
    href?: string
    rooms?: string[]
  }>
}

/** Room section — photos + product carousel */
export interface ModularRoomSection {
  _type: 'roomSection'
  _key: string
  roomName?: string
  photos?: SanityImage[]
  frameStyle?: 'none' | 'scallop' | 'rounded' | 'clipped'
  frameColor?: string
  products?: Array<{
    name: string
    price?: string
    image?: SanityImage
    url?: string
  }>
}

/** DIY step — tutorial step with materials */
export interface ModularDiyStep {
  _type: 'diyStep'
  _key: string
  heading?: string
  instructions?: PortableTextBlock
  image?: SanityImage
  imagePosition?: 'left' | 'right'
  materials?: string[]
}

/** Category banner — colored accent bar */
export interface ModularCategoryBanner {
  _type: 'categoryBanner'
  _key: string
  color?: string
  height?: 'thin' | 'medium' | 'tall'
  text?: string
}
```

**Step 2: Add to the `ModularPageSection` union** (after `| ModularBlogGrid`):

```ts
  | ModularCategoryHeader
  | ModularProductCarousel
  | ModularProductGrid
  | ModularPartnershipHighlight
  | ModularHouseTourCards
  | ModularRoomSection
  | ModularDiyStep
  | ModularCategoryBanner
```

**Step 3: Verify** — `npm run typecheck`

**Step 4: Commit** — `git commit -am "feat: add TypeScript interfaces for 8 new section types"`

---

### Task 4: Create CategoryHeaderSection + CategoryBannerSection components

**Files:**
- Create: `components/sections/CategoryHeaderSection.tsx`
- Create: `components/sections/CategoryBannerSection.tsx`

**Step 1: Create `components/sections/CategoryHeaderSection.tsx`**

```tsx
'use client'

import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@/lib/animations'
import Container from '@/components/layout/Container'

interface CategoryHeaderProps {
  heading?: string
  description?: string
  backgroundStyle?: 'solid' | 'stripes' | 'dots'
  backgroundColor?: string
  textColor?: string
}

const bgPatterns: Record<string, (color: string) => React.CSSProperties> = {
  solid: (color) => ({ backgroundColor: color }),
  stripes: (color) => ({
    backgroundImage: `repeating-linear-gradient(90deg, ${color} 0px, ${color} 2px, transparent 2px, transparent 8px)`,
    backgroundSize: '10px 100%',
    backgroundColor: `${color}22`,
  }),
  dots: (color) => ({
    backgroundImage: `radial-gradient(circle 3px at 10px 10px, ${color}44 2px, transparent 2.5px)`,
    backgroundSize: '20px 20px',
    backgroundColor: `${color}11`,
  }),
}

export default function CategoryHeaderSection({ heading, description, backgroundStyle = 'solid', backgroundColor = '#D9CB8B', textColor = '#3D3832' }: CategoryHeaderProps) {
  const patternFn = bgPatterns[backgroundStyle] || bgPatterns.solid
  return (
    <div style={patternFn(backgroundColor)}>
      <motion.section variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="py-12 sm:py-16">
        <Container>
          <motion.div variants={fadeInUp} className="text-center max-w-2xl mx-auto">
            {heading && <h2 className="font-serif text-3xl sm:text-4xl mb-3" style={{ color: textColor }}>{heading}</h2>}
            {description && <p className="text-base leading-relaxed opacity-80" style={{ color: textColor }}>{description}</p>}
          </motion.div>
        </Container>
      </motion.section>
    </div>
  )
}
```

**Step 2: Create `components/sections/CategoryBannerSection.tsx`**

```tsx
interface CategoryBannerProps {
  color?: string
  height?: 'thin' | 'medium' | 'tall'
  text?: string
}

const heights = { thin: 'h-1.5', medium: 'h-10', tall: 'h-20' }

export default function CategoryBannerSection({ color = '#C4A535', height = 'thin', text }: CategoryBannerProps) {
  const h = heights[height] || heights.thin
  return (
    <div className={`${h} flex items-center justify-center`} style={{ backgroundColor: color }}>
      {text && (height === 'medium' || height === 'tall') && (
        <span className="text-white text-[11px] tracking-[0.2em] uppercase font-medium">{text}</span>
      )}
    </div>
  )
}
```

**Step 3: Verify** — `npm run typecheck`

**Step 4: Commit** — `git commit -am "feat: add CategoryHeader and CategoryBanner section components"`

---

### Task 5: Create ProductCarouselSection component

**Files:**
- Create: `components/sections/ProductCarouselSection.tsx`

**Step 1: Create the component**

```tsx
'use client'

import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@/lib/animations'
import type { SanityImageSource } from '@sanity/image-url'
import Container from '@/components/layout/Container'
import SanityImage from '@/components/sanity/SanityImage'

interface ProductCarouselProps {
  heading?: string
  backgroundColor?: string
  columns?: number
  products?: Array<{
    name: string
    price?: string
    image?: SanityImageSource
    url?: string
  }>
}

export default function ProductCarouselSection({ heading, backgroundColor = '#F5F3EF', columns = 5, products }: ProductCarouselProps) {
  if (!products?.length) return null
  const colClass = columns === 3 ? 'sm:grid-cols-3' : columns === 4 ? 'sm:grid-cols-2 md:grid-cols-4' : columns === 6 ? 'sm:grid-cols-3 md:grid-cols-6' : 'sm:grid-cols-3 md:grid-cols-5'

  return (
    <motion.section variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="py-16 sm:py-20">
      <Container>
        <div className="p-6 rounded-sm" style={{ backgroundColor }}>
          {heading && (
            <motion.h3 variants={fadeInUp} className="text-[11px] tracking-[0.15em] uppercase font-medium text-foreground mb-5">
              {heading}
            </motion.h3>
          )}
          <div className={`grid grid-cols-2 ${colClass} gap-4`}>
            {products.map((product, i) => (
              <motion.a
                key={i}
                variants={fadeInUp}
                href={product.url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                {product.image && (
                  <div className="relative aspect-square overflow-hidden rounded-sm mb-2">
                    <SanityImage image={product.image} alt={product.name} fill sizes="(max-width: 640px) 50vw, 20vw" className="object-cover" />
                  </div>
                )}
                <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">{product.name}</p>
                {product.price && <p className="text-xs text-muted-foreground">{product.price}</p>}
                <span className="text-xs font-medium text-primary">Shop &rarr;</span>
              </motion.a>
            ))}
          </div>
        </div>
      </Container>
    </motion.section>
  )
}
```

**Step 2: Verify** — `npm run typecheck`

**Step 3: Commit** — `git commit -am "feat: add ProductCarousel section component"`

---

### Task 6: Create ProductGridSection component

**Files:**
- Create: `components/sections/ProductGridSection.tsx`

**Step 1: Create the component**

Handles both `downloads` and `affiliate` variants.

```tsx
'use client'

import { motion } from 'framer-motion'
import { stegaClean } from '@sanity/client/stega'
import { fadeInUp, staggerContainer } from '@/lib/animations'
import type { SanityImageSource } from '@sanity/image-url'
import Container from '@/components/layout/Container'
import SanityImage from '@/components/sanity/SanityImage'
import Button from '@/components/ui/Button'

interface ProductGridProps {
  heading?: string
  variant?: 'downloads' | 'affiliate'
  columns?: number
  products?: Array<{
    name: string
    description?: string
    price?: string
    image?: SanityImageSource
    url: string
    buttonText?: string
  }>
}

export default function ProductGridSection({ heading, variant = 'affiliate', columns = 3, products }: ProductGridProps) {
  if (!products?.length) return null
  const cleanVariant = stegaClean(variant)
  const colClass = columns === 2 ? 'sm:grid-cols-2' : columns === 4 ? 'sm:grid-cols-2 md:grid-cols-4' : 'sm:grid-cols-2 md:grid-cols-3'

  return (
    <motion.section variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="py-16 sm:py-20">
      <Container>
        {heading && <motion.h2 variants={fadeInUp} className="font-serif text-3xl sm:text-4xl mb-8">{heading}</motion.h2>}
        <div className={`grid grid-cols-1 ${colClass} gap-6`}>
          {products.map((product, i) => (
            <motion.div key={i} variants={fadeInUp} className="group">
              {product.image && (
                <a href={product.url} target="_blank" rel="noopener noreferrer" className="block relative aspect-[4/3] overflow-hidden rounded-sm mb-3">
                  <SanityImage image={product.image} alt={product.name} fill sizes={`(max-width: 640px) 100vw, ${Math.round(100 / columns)}vw`} className="object-cover" />
                  {cleanVariant === 'affiliate' && (
                    <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/60 transition-colors flex items-center justify-center">
                      <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">View Product</span>
                    </div>
                  )}
                </a>
              )}
              <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">{product.name}</h3>
              {product.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{product.description}</p>}
              {product.price && <p className="text-sm font-medium text-foreground mt-1">{product.price}</p>}
              {cleanVariant === 'downloads' && (
                <div className="mt-3">
                  <Button href={product.url} variant="outline" size="sm">{product.buttonText || 'Buy Now'}</Button>
                </div>
              )}
              {cleanVariant === 'affiliate' && (
                <a href={product.url} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-primary mt-1 inline-block">
                  Shop &rarr;
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </Container>
    </motion.section>
  )
}
```

**Step 2: Verify** — `npm run typecheck`

**Step 3: Commit** — `git commit -am "feat: add ProductGrid section component with downloads/affiliate variants"`

---

### Task 7: Create PartnershipHighlightSection component

**Files:**
- Create: `components/sections/PartnershipHighlightSection.tsx`

**Step 1: Create the component**

This is structurally similar to SplitContent but styled for partnerships.

```tsx
'use client'

import { motion } from 'framer-motion'
import { stegaClean } from '@sanity/client/stega'
import { PortableText } from '@portabletext/react'
import { fadeInUp, staggerContainer } from '@/lib/animations'
import type { SanityImageSource } from '@sanity/image-url'
import Container from '@/components/layout/Container'
import SanityImage from '@/components/sanity/SanityImage'
import Button from '@/components/ui/Button'

type PortableTextValue = Parameters<typeof PortableText>[0]['value']

interface PartnershipHighlightProps {
  heading?: string
  description?: PortableTextValue
  image?: SanityImageSource
  imagePosition?: 'left' | 'right'
  cta?: { label?: string; href?: string }
}

export default function PartnershipHighlightSection({ heading, description, image, imagePosition = 'left', cta }: PartnershipHighlightProps) {
  const textBlock = (
    <motion.div variants={fadeInUp}>
      {heading && <h2 className="font-serif text-3xl sm:text-4xl mb-4">{heading}</h2>}
      {description && (
        <div className="prose prose-lg max-w-none text-muted-foreground">
          {Array.isArray(description) ? <PortableText value={description} /> : <p>{String(description)}</p>}
        </div>
      )}
      {cta?.label && cta?.href && (
        <div className="mt-6">
          <Button href={stegaClean(cta.href)} variant="outline">{cta.label}</Button>
        </div>
      )}
    </motion.div>
  )

  const imageBlock = image ? (
    <motion.div variants={fadeInUp} className="relative aspect-[4/3] overflow-hidden rounded-sm">
      <SanityImage image={image} alt={heading || 'Partner'} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
    </motion.div>
  ) : null

  return (
    <motion.section variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="py-16 sm:py-20">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {stegaClean(imagePosition) === 'right' ? <>{textBlock}{imageBlock}</> : <>{imageBlock}{textBlock}</>}
        </div>
      </Container>
    </motion.section>
  )
}
```

**Step 2: Verify** — `npm run typecheck`

**Step 3: Commit** — `git commit -am "feat: add PartnershipHighlight section component"`

---

### Task 8: Create HouseTourCardsSection component

**Files:**
- Create: `components/sections/HouseTourCardsSection.tsx`

**Step 1: Create the component**

```tsx
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@/lib/animations'
import type { SanityImageSource } from '@sanity/image-url'
import Container from '@/components/layout/Container'
import SanityImage from '@/components/sanity/SanityImage'

interface HouseTourCardsProps {
  heading?: string
  tours?: Array<{
    title: string
    description?: string
    image?: SanityImageSource
    href?: string
    rooms?: string[]
  }>
}

export default function HouseTourCardsSection({ heading, tours }: HouseTourCardsProps) {
  if (!tours?.length) return null
  return (
    <motion.section variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="py-16 sm:py-20">
      <Container>
        {heading && <motion.h2 variants={fadeInUp} className="font-serif text-3xl sm:text-4xl mb-8">{heading}</motion.h2>}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {tours.map((tour, i) => (
            <motion.div key={i} variants={fadeInUp}>
              <Link href={tour.href || '#'} className="group block">
                {tour.image && (
                  <div className="relative aspect-[4/3] overflow-hidden rounded-sm mb-4">
                    <SanityImage image={tour.image} alt={tour.title} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                )}
                <h3 className="font-serif text-xl text-foreground group-hover:text-primary transition-colors">{tour.title}</h3>
                {tour.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{tour.description}</p>}
                {tour.rooms?.length ? (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {tour.rooms.map((room) => (
                      <span key={room} className="text-[10px] tracking-wide uppercase px-2 py-0.5 border border-border rounded-full text-muted-foreground">{room}</span>
                    ))}
                  </div>
                ) : null}
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>
    </motion.section>
  )
}
```

**Step 2: Verify** — `npm run typecheck`

**Step 3: Commit** — `git commit -am "feat: add HouseTourCards section component"`

---

### Task 9: Create RoomSectionBlock component

**Files:**
- Create: `components/sections/RoomSectionBlock.tsx`

**Step 1: Create the component**

```tsx
'use client'

import { motion } from 'framer-motion'
import { stegaClean } from '@sanity/client/stega'
import { fadeInUp, staggerContainer } from '@/lib/animations'
import type { SanityImageSource } from '@sanity/image-url'
import Container from '@/components/layout/Container'
import SanityImage from '@/components/sanity/SanityImage'

interface RoomSectionProps {
  roomName?: string
  photos?: SanityImageSource[]
  frameStyle?: 'none' | 'scallop' | 'rounded' | 'clipped'
  frameColor?: string
  products?: Array<{
    name: string
    price?: string
    image?: SanityImageSource
    url?: string
  }>
}

export default function RoomSectionBlock({ roomName, photos, frameStyle = 'none', frameColor, products }: RoomSectionProps) {
  const cleanFrame = stegaClean(frameStyle)
  const borderStyle = cleanFrame === 'scallop'
    ? { border: `2px solid ${frameColor || '#D4848A'}`, borderRadius: '10px' }
    : cleanFrame === 'rounded'
    ? { border: `2px solid ${frameColor || '#8BA4A8'}`, borderRadius: '14px' }
    : cleanFrame === 'clipped'
    ? { border: `2px solid ${frameColor || '#5A534B'}`, clipPath: 'polygon(14px 0, calc(100% - 14px) 0, 100% 14px, 100% calc(100% - 14px), calc(100% - 14px) 100%, 14px 100%, 0 calc(100% - 14px), 0 14px)' }
    : undefined

  return (
    <motion.section variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="py-12 sm:py-16">
      <Container>
        {roomName && <motion.h2 variants={fadeInUp} className="font-serif text-3xl mb-6">{roomName}</motion.h2>}

        {/* Room photos */}
        {photos?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {photos.map((photo, i) => (
              <motion.div key={i} variants={fadeInUp} className="relative aspect-[4/3] overflow-hidden" style={borderStyle ? { padding: '12px' } : undefined}>
                {borderStyle && <div className="absolute inset-0 pointer-events-none" style={borderStyle} />}
                <div className="relative w-full h-full overflow-hidden rounded-sm">
                  <SanityImage image={photo} alt={`${roomName || 'Room'} photo ${i + 1}`} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                </div>
              </motion.div>
            ))}
          </div>
        ) : null}

        {/* Product carousel */}
        {products?.length ? (
          <div className="bg-muted p-5 rounded-sm">
            <h3 className="text-[11px] tracking-[0.15em] uppercase font-medium text-foreground mb-4">
              Shop the {roomName || 'Room'}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {products.map((product, i) => (
                <motion.a key={i} variants={fadeInUp} href={product.url || '#'} target="_blank" rel="noopener noreferrer" className="group">
                  {product.image && (
                    <div className="relative aspect-square overflow-hidden rounded-sm mb-2">
                      <SanityImage image={product.image} alt={product.name} fill sizes="20vw" className="object-cover" />
                    </div>
                  )}
                  <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">{product.name}</p>
                  {product.price && <p className="text-xs text-muted-foreground">{product.price}</p>}
                  <span className="text-xs font-medium text-primary">Shop &rarr;</span>
                </motion.a>
              ))}
            </div>
          </div>
        ) : null}
      </Container>
    </motion.section>
  )
}
```

**Step 2: Verify** — `npm run typecheck`

**Step 3: Commit** — `git commit -am "feat: add RoomSection component with frame styles and product grid"`

---

### Task 10: Create DiyStepSection component

**Files:**
- Create: `components/sections/DiyStepSection.tsx`

**Step 1: Create the component**

```tsx
'use client'

import { motion } from 'framer-motion'
import { stegaClean } from '@sanity/client/stega'
import { PortableText } from '@portabletext/react'
import { fadeInUp, staggerContainer } from '@/lib/animations'
import type { SanityImageSource } from '@sanity/image-url'
import Container from '@/components/layout/Container'
import SanityImage from '@/components/sanity/SanityImage'

type PortableTextValue = Parameters<typeof PortableText>[0]['value']

interface DiyStepProps {
  heading?: string
  instructions?: PortableTextValue
  image?: SanityImageSource
  imagePosition?: 'left' | 'right'
  materials?: string[]
}

export default function DiyStepSection({ heading, instructions, image, imagePosition = 'left', materials }: DiyStepProps) {
  const imageBlock = image ? (
    <motion.div variants={fadeInUp} className="relative aspect-[4/3] overflow-hidden rounded-sm">
      <SanityImage image={image} alt={heading || 'DIY step'} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
    </motion.div>
  ) : null

  const textBlock = (
    <motion.div variants={fadeInUp}>
      {heading && <h3 className="font-serif text-2xl mb-4">{heading}</h3>}
      {instructions && (
        <div className="prose max-w-none text-muted-foreground">
          {Array.isArray(instructions) ? <PortableText value={instructions} /> : <p>{String(instructions)}</p>}
        </div>
      )}
      {materials?.length ? (
        <div className="mt-6 p-4 bg-muted rounded-sm border border-border">
          <h4 className="text-xs tracking-[0.15em] uppercase font-medium text-foreground mb-3">Materials &amp; Tools</h4>
          <ul className="space-y-1">
            {materials.map((item, i) => (
              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-primary mt-0.5">&#8226;</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </motion.div>
  )

  return (
    <motion.section variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="py-12 sm:py-16">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          {stegaClean(imagePosition) === 'right' ? <>{textBlock}{imageBlock}</> : <>{imageBlock}{textBlock}</>}
        </div>
      </Container>
    </motion.section>
  )
}
```

**Step 2: Verify** — `npm run typecheck`

**Step 3: Commit** — `git commit -am "feat: add DiyStep section component with materials callout"`

---

### Task 11: Register all 8 components in SectionRenderer

**Files:**
- Modify: `components/sections/SectionRenderer.tsx`

**Step 1: Add imports** after line 18 (`import BlogGridSection`):

```tsx
import CategoryHeaderSection from '@/components/sections/CategoryHeaderSection'
import CategoryBannerSection from '@/components/sections/CategoryBannerSection'
import ProductCarouselSection from '@/components/sections/ProductCarouselSection'
import ProductGridSection from '@/components/sections/ProductGridSection'
import PartnershipHighlightSection from '@/components/sections/PartnershipHighlightSection'
import HouseTourCardsSection from '@/components/sections/HouseTourCardsSection'
import RoomSectionBlock from '@/components/sections/RoomSectionBlock'
import DiyStepSection from '@/components/sections/DiyStepSection'
```

**Step 2: Add mappings** to `sectionComponents` after `blogGrid: BlogGridSection`:

```tsx
  categoryHeader: CategoryHeaderSection,
  categoryBanner: CategoryBannerSection,
  productCarousel: ProductCarouselSection,
  productGrid: ProductGridSection,
  partnershipHighlight: PartnershipHighlightSection,
  houseTourCards: HouseTourCardsSection,
  roomSection: RoomSectionBlock,
  diyStep: DiyStepSection,
```

**Step 3: Verify** — `npm run typecheck && npm run lint`

**Step 4: Run typegen** — `npm run typegen`

**Step 5: Commit** — `git commit -am "feat: register all 8 new sections in SectionRenderer and run typegen"`

---

## Part B: Designer Skills (Claude Code Commands)

Skills are `.claude/commands/*.md` files. They use YAML frontmatter for metadata and markdown for the prompt body. When a user types `/command-name`, Claude Code loads the file and follows its instructions.

### Task 12: Create `/add-section` command

**Files:**
- Create: `.claude/commands/add-section.md`

**Step 1: Create the command file**

```md
---
name: add-section
description: Add a new page builder section to the Bonsai Blog kit. Walks through creating the Sanity schema, React component, TypeScript types, GROQ projection, and SectionRenderer registration.
---

# Add a New Page Builder Section

You are adding a new page builder section to the Bonsai Blog kit. This is an 8-step process that touches 7 files. Follow each step exactly.

## Gather Information

Ask the user:
1. **Section name** — camelCase (e.g. `pricingTable`, `testimonialWall`). This becomes the Sanity schema name and the `_type` value.
2. **What does it display?** — Brief description of the section's purpose and visual layout.
3. **Fields** — What content fields does the CMS editor need? (text, images, arrays, references, etc.)

## The 8 Steps

### Step 1: Create Sanity Schema
Create `sanity/schemaTypes/sections/{name}.ts`

Pattern to follow (see `sanity/schemaTypes/sections/splitContent.ts` for reference):
- `defineType` with `type: 'object'`
- Pick an icon from `@sanity/icons` (see https://icons.sanity.build)
- Define fields with `defineField`
- Add `preview` with `select` and `prepare`

### Step 2: Register Schema
Add to `sanity/schemaTypes/index.ts`:
- Import the new schema
- Add it to the `schemaTypes` array in the "Page builder sections" group

### Step 3: Add to Page Documents
Add `defineArrayMember({ type: '{name}' })` to the `sections` array in:
- `sanity/schemaTypes/documents/modularPage.ts`
- `sanity/schemaTypes/singletons/homePage.ts`

### Step 4: Add GROQ Projection
Add a conditional projection block to `MODULAR_PAGE_SECTIONS_PROJECTION` in `sanity/lib/queries.ts`:
```
_type == "{name}" => {
  field1, field2, field3,
  reference-> { _id, title, "slug": slug.current }
}
```

### Step 5: Create React Component
Create `components/sections/{PascalName}Section.tsx`

Pattern to follow (see `components/sections/SplitContent.tsx` for reference):
- Use `'use client'` if it needs Framer Motion animations
- Define a props interface matching the Sanity schema fields
- Use `Container` for layout, `SanityImage` for images, `PortableText` for rich text
- Wrap in `motion.section` with `staggerContainer` + `fadeInUp` variants
- Use Tailwind classes from the project's design system (see `app/globals.css` for CSS variables)

### Step 6: Register in SectionRenderer
In `components/sections/SectionRenderer.tsx`:
- Import the new component
- Add `{name}: {PascalName}Section` to the `sectionComponents` map

### Step 7: Add TypeScript Interface
In `types/index.ts`:
- Add `Modular{PascalName}` interface with `_type: '{name}'`, `_key: string`, and all fields
- Add `| Modular{PascalName}` to the `ModularPageSection` union type

### Step 8: Run Typegen
Run `npm run typegen` to regenerate Sanity types, then `npm run typecheck` to verify.

## After Completion
Remind the user they can now:
- Add this section to any page in Sanity Studio (modular pages and homepage)
- The section will render automatically via `SectionRenderer`
```

**Step 2: Commit** — `git add .claude/commands/add-section.md && git commit -m "feat: add /add-section designer command"`

---

### Task 13: Create `/theme` command

**Files:**
- Create: `.claude/commands/theme.md`

**Step 1: Create the command file**

```md
---
name: theme
description: Customize the site's visual identity — colors, fonts, spacing. Knows exactly which CSS variables and Tailwind config values to change.
---

# Customize Site Theme

You are helping a designer customize the Bonsai Blog kit's visual identity.

## Key Files

- `app/globals.css` — CSS custom properties (the source of truth for colors)
- `tailwind.config.ts` — Maps CSS vars to Tailwind classes + font families
- `app/layout.tsx` — Google Font imports via `next/font`

## Current Color System

These CSS variables in `app/globals.css` control the entire site:

| Variable | Default | Used For |
|----------|---------|----------|
| `--color-background` | `#FAFAF8` | Page background |
| `--color-foreground` | `#1A1A1A` | Body text |
| `--color-primary` | `#B8860B` | Buttons, links, accents |
| `--color-primary-light` | `#D4A843` | Hover states |
| `--color-muted` | `#F5F5F0` | Card backgrounds, subtle sections |
| `--color-muted-foreground` | `#737373` | Secondary text |
| `--color-border` | `#E5E5E0` | Borders, dividers |

## Current Fonts

Defined in `app/layout.tsx` via `next/font/google`:
- **`font-sans`** → Inter (body, UI)
- **`font-serif`** → Playfair Display (headings, accents)

Mapped in `tailwind.config.ts` under `fontFamily`.

## How to Make Changes

### Changing Colors
1. Update the hex values in `app/globals.css` `:root` block
2. That's it — Tailwind classes (`bg-primary`, `text-foreground`, etc.) automatically pick up the new values

### Changing Fonts
1. In `app/layout.tsx`, change the `next/font/google` imports to the new fonts
2. Update the CSS variable names if needed in `tailwind.config.ts`
3. Verify the font weights match what the new font supports

### Dark Mode
1. Add a `@media (prefers-color-scheme: dark)` block in `globals.css` with inverted values
2. Or add a `.dark` class variant for manual toggle
3. Add `color-scheme: dark` to the dark variant's `html` element

## Process

1. Ask the user what they want to change (colors, fonts, or both)
2. Show the current values and proposed changes side-by-side
3. Make the changes
4. Run `npm run typecheck` to verify nothing broke
5. Suggest they check the site in the browser at key pages: `/`, `/blog`, `/contact`
```

**Step 2: Commit** — `git add .claude/commands/theme.md && git commit -m "feat: add /theme designer command"`

---

### Task 14: Create `/new-page` command

**Files:**
- Create: `.claude/commands/new-page.md`

**Step 1: Create the command file**

```md
---
name: new-page
description: Scaffold a custom page route with server-side data fetching, layout, and SEO. For pages that need custom logic beyond the modular page builder.
---

# Scaffold a Custom Page Route

Most pages should be created as `modularPage` documents in Sanity — no code needed. Use this command only for pages that need **custom logic** (like the existing `/blog`, `/contact`, `/faq` pages).

## When to Use This vs. Sanity

- **Use Sanity modular page** for: About, Privacy, Terms, Landing pages — anything built from the page builder sections
- **Use this command** for: Pages with custom data fetching, special layouts, interactive forms, or non-standard routing (like `/blog/category/[slug]`)

## Process

Ask the user:
1. **Route path** — e.g. `/house-tours`, `/shop`
2. **What data does it need?** — Sanity documents, external APIs, static content?
3. **Interactive?** — Does it need client-side state (forms, filters, tabs)?

## Scaffold Pattern

### Server Component (default)

Create `app/{route-name}/page.tsx`:

```tsx
import type { Metadata } from 'next'
import { sanityFetch } from '@/sanity/lib/live'
import { SITE_SETTINGS_QUERY, HEADER_QUERY, FOOTER_QUERY } from '@/sanity/lib/queries'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
// import your custom query

export const metadata: Metadata = {
  title: 'Page Title',
  description: 'Page description',
}

export default async function PageName() {
  const [{ data: settings }, { data: headerData }, { data: footerData }] = await Promise.all([
    sanityFetch({ query: SITE_SETTINGS_QUERY, tags: ['siteSettings'] }),
    sanityFetch({ query: HEADER_QUERY, tags: ['header'] }),
    sanityFetch({ query: FOOTER_QUERY, tags: ['footer'] }),
    // add your custom fetch here
  ])

  return (
    <>
      <Header siteSettings={settings} megaNavigation={headerData?.megaNavigation} secondaryNavigation={headerData?.secondaryNavigation} cta={headerData?.cta} />
      <main id="main">
        {/* Page content here */}
      </main>
      <Footer siteSettings={settings} footerData={footerData} />
    </>
  )
}
```

### If It Needs a GROQ Query

Add to `sanity/lib/queries.ts` following the existing pattern — use `defineQuery()`, project only needed fields, resolve references with `->`.

### If It Needs Client Interactivity

Create a client component at `components/{feature}/{ComponentName}.tsx` with `'use client'` directive. The server page fetches data and passes it as props to the client component.

## After Scaffolding

1. `npm run typecheck` to verify
2. Add navigation link in Sanity's header singleton if needed
3. Test at the route in browser
```

**Step 2: Commit** — `git add .claude/commands/new-page.md && git commit -m "feat: add /new-page designer command"`

---

### Task 15: Create `/audit` command

**Files:**
- Create: `.claude/commands/audit.md`

**Step 1: Create the command file**

```md
---
name: audit
description: Run an accessibility, performance, and SEO audit against the project's UI rules and WCAG guidelines.
---

# Site Audit

Run a comprehensive audit of the site against the project's own rules (`.claude/rules/ui-rules.md`) and web standards.

## Audit Checklist

Work through each category. For each item, check the codebase and report pass/fail with specific file references.

### Accessibility (WCAG 2.1 AA)

- [ ] All images have `alt` text (check `SanityImage` usage and any `<img>` tags)
- [ ] Form inputs have associated `<label>` elements or `aria-label`
- [ ] Interactive elements (`button`, `a`) have accessible names
- [ ] Focus is visible on all interactive elements (`:focus-visible` styles)
- [ ] Color contrast meets APCA guidelines (check text on backgrounds)
- [ ] Skip-to-content link exists in layout
- [ ] Heading hierarchy is correct (`h1` → `h2` → `h3`, no skips)
- [ ] `aria-live` regions for dynamic content (toasts, form validation)
- [ ] Decorative elements have `aria-hidden="true"`
- [ ] Touch targets ≥ 44px on mobile

### Performance

- [ ] Images use `next/image` or `SanityImage` (lazy loading, sizing)
- [ ] No layout shift from unsized images (explicit dimensions or aspect ratios)
- [ ] Animations use `transform`/`opacity` only (no `top`, `left`, `width`)
- [ ] `prefers-reduced-motion` is honored
- [ ] No `transition: all` (check for explicit property lists)
- [ ] Fonts use `next/font` with `font-display: swap`
- [ ] Large lists are virtualized if > 50 items

### SEO

- [ ] Every page has `<title>` and `meta description`
- [ ] JSON-LD structured data on key pages (home, blog posts, FAQ)
- [ ] `robots.ts` and `sitemap.ts` are present and functional
- [ ] Canonical URLs are set
- [ ] Open Graph images configured

### Forms & Interactions

- [ ] Contact form validates inputs and shows inline errors
- [ ] Submit buttons show loading state
- [ ] Enter key submits forms
- [ ] No dead zones on checkboxes/radios
- [ ] Cookie consent banner appears for new visitors

### Mobile

- [ ] Responsive at 320px minimum width
- [ ] No horizontal scroll at any breakpoint
- [ ] Safe area insets respected (`env(safe-area-inset-*)`)
- [ ] Mobile input font-size ≥ 16px

## Output Format

Present results as a table:

| Category | Check | Status | File(s) | Notes |
|----------|-------|--------|---------|-------|
| A11y | Alt text | ✅ | - | All images use SanityImage with alt |
| Perf | Image sizing | ⚠️ | HeroSection.tsx:23 | Missing explicit sizes prop |

Summarize with counts: X pass, Y warnings, Z failures.
```

**Step 2: Commit** — `git add .claude/commands/audit.md && git commit -m "feat: add /audit accessibility and performance command"`

---

### Task 16: Create `/deploy` command

**Files:**
- Create: `.claude/commands/deploy.md`

**Step 1: Create the command file**

```md
---
name: deploy
description: Walk through the full deployment checklist — env vars, Sanity webhook, hosting config, DNS, and go-live verification.
---

# Deploy & Go Live

Walk through the complete deployment process for the Bonsai Blog kit.

## Pre-Flight Checks

Before deploying, verify:

1. **Build passes locally**: Run `npm run build` and fix any errors
2. **TypeScript clean**: Run `npm run typecheck`
3. **Lint clean**: Run `npm run lint`
4. **Environment variables set**: Check `.env.local` has all required values (see below)

## Required Environment Variables

Check that these are set in the hosting platform (Vercel/Netlify):

| Variable | Required | How to Get |
|----------|----------|-----------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Yes | sanity.io/manage → project settings |
| `NEXT_PUBLIC_SANITY_DATASET` | Yes | Usually `production` |
| `SANITY_API_READ_TOKEN` | Yes | sanity.io/manage → API → Tokens → Add token (Viewer role) |
| `SANITY_API_WRITE_TOKEN` | Yes | sanity.io/manage → API → Tokens → Add token (Editor role) |
| `SANITY_WEBHOOK_SECRET` | Yes | Generate with `openssl rand -hex 32` |
| `NEXT_PUBLIC_SITE_URL` | Yes | The production URL (e.g. `https://example.com`) |
| `RESEND_API_KEY` | If contact form | resend.com/api-keys |
| `CONTACT_EMAIL_TO` | If contact form | Destination email address |
| `CONTACT_EMAIL_FROM` | If contact form | Verified sender address in Resend |
| `NEXT_PUBLIC_GA_ID` | Optional | Google Analytics measurement ID |
| `NEWSLETTER_PROVIDER` | Optional | `klaviyo`, `mailchimp`, or `convertkit` |

## Sanity Webhook Setup

1. Go to sanity.io/manage → your project → API → Webhooks
2. Create a new webhook:
   - **Name**: Revalidation
   - **URL**: `https://your-domain.com/api/revalidate`
   - **Trigger**: Create, Update, Delete
   - **Filter**: Leave empty (all document types)
   - **Secret**: The same value as `SANITY_WEBHOOK_SECRET`
   - **HTTP Method**: POST
3. Test by editing a document in Sanity Studio and verifying the site updates

## Hosting Setup

### Vercel (recommended)
1. Connect your GitHub repo to Vercel
2. Set all environment variables in Vercel dashboard → Settings → Environment Variables
3. Deploy — Vercel auto-detects Next.js settings
4. Set custom domain in Vercel dashboard → Settings → Domains

### Netlify
1. Install the Next.js plugin: `npm install @netlify/plugin-nextjs`
2. Add `netlify.toml` with Next.js build settings
3. Set environment variables in Netlify dashboard
4. Deploy and configure custom domain

## DNS Configuration

1. Add an A record or CNAME pointing to your hosting provider
2. Enable HTTPS (automatic on Vercel/Netlify)
3. Set `NEXT_PUBLIC_SITE_URL` to the final production URL
4. Verify `robots.ts` returns correct `sitemap` URL
5. Submit sitemap to Google Search Console

## Post-Deploy Verification

After deploying, check:

- [ ] Homepage loads correctly
- [ ] Blog listing and posts render
- [ ] Contact form submits (check email delivery + Sanity submission)
- [ ] Sanity Studio works at `/studio`
- [ ] Cookie consent banner appears
- [ ] Images load from Sanity CDN
- [ ] Edit a document in Sanity → verify webhook triggers revalidation
- [ ] Check Lighthouse scores (target 95+ all categories)
- [ ] Verify Open Graph tags with https://opengraph.dev
- [ ] Test on mobile device
```

**Step 2: Commit** — `git add .claude/commands/deploy.md && git commit -m "feat: add /deploy go-live checklist command"`

---

## Part C: Final Registration and Verification

### Task 17: Update CLAUDE.md with new sections and commands

**Files:**
- Modify: `CLAUDE.md`

**Step 1:** Add the 8 new section types to the "17 section types" list in CLAUDE.md. Update the count to 25 and add the new names: `categoryHeader`, `categoryBanner`, `productCarousel`, `productGrid`, `partnershipHighlight`, `houseTourCards`, `roomSection`, `diyStep`.

**Step 2:** Add a "Custom Commands" section to CLAUDE.md documenting the 5 available commands:

```md
## Custom Commands (Designer Skills)

| Command | Purpose |
|---------|---------|
| `/add-section` | Walk through adding a new page builder section (schema + component + registration) |
| `/theme` | Customize colors, fonts, and visual identity |
| `/new-page` | Scaffold a custom page route with data fetching |
| `/audit` | Run accessibility, performance, and SEO audit |
| `/deploy` | Full deployment and go-live checklist |
```

**Step 3: Verify** — `npm run typecheck && npm run lint`

**Step 4: Commit** — `git commit -am "docs: update CLAUDE.md with new sections and designer commands"`

---

## Verification

After all tasks:
1. `npm run typecheck` passes
2. `npm run lint` passes
3. `npm run typegen` runs without errors
4. Sanity Studio at `/studio` shows all 25 section types when editing a modular page
5. Each command is accessible via `/add-section`, `/theme`, `/new-page`, `/audit`, `/deploy` in Claude Code
6. Create a test modular page in Sanity with one of each new section type — verify they render
