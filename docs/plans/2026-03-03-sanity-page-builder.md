# Sanity Page Builder Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Upgrade the Sanity CMS layer from hardcoded page templates to a composable page builder system with custom desk structure, separated global config, and a frontend PageBuilder component.

**Architecture:** Section schemas are defined as Sanity object types in `sanity/schemaTypes/objects/sections/`. A `pageBuilder` array field (defined in `sanity/schemaTypes/builders/pageBuilder.ts`) is added to both `homePage` and `page` document types. The frontend maps each `section._type` to a React component via `components/sanity/PageBuilder.tsx`. Global config is split from `siteSettings` into separate `header`, `footer`, and `redirects` singletons. A custom desk structure organizes the Studio sidebar into logical groups.

**Tech Stack:** Next.js 14 (App Router), Sanity v3, TypeScript, Tailwind CSS, Framer Motion, Resend

---

## Phase 1: Custom Desk Structure

### Task 1: Create custom desk structure

**Files:**
- Create: `sanity/structure/index.ts`

**Step 1: Create the desk structure file**

```typescript
import type { StructureBuilder } from 'sanity/structure'

// Singleton document IDs — these must NOT appear in normal document lists
const SINGLETONS = ['siteSettings', 'homePage', 'header', 'footer', 'redirects']

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      // ── Homepage (singleton) ──────────────────────────────────
      S.listItem()
        .title('Homepage')
        .icon(() => '🏠')
        .child(S.document().schemaType('homePage').documentId('homePage')),

      S.divider(),

      // ── Pages ─────────────────────────────────────────────────
      S.documentTypeListItem('page').title('Pages'),

      S.divider(),

      // ── Menu ──────────────────────────────────────────────────
      S.listItem()
        .title('Menu')
        .icon(() => '🍽')
        .child(
          S.list()
            .title('Menu')
            .items([
              S.documentTypeListItem('menuCategory').title('Categories'),
              S.documentTypeListItem('menuItem').title('Items'),
            ])
        ),

      // ── Content Library ───────────────────────────────────────
      S.listItem()
        .title('Content Library')
        .icon(() => '📚')
        .child(
          S.list()
            .title('Content Library')
            .items([
              S.documentTypeListItem('teamMember').title('Team'),
              S.documentTypeListItem('testimonial').title('Testimonials'),
              S.documentTypeListItem('faqItem').title('FAQ'),
              S.documentTypeListItem('galleryImage').title('Gallery'),
            ])
        ),

      // ── Submissions (added in Phase 5) ────────────────────────
      S.documentTypeListItem('submission').title('Submissions').icon(() => '📩'),

      S.divider(),

      // ── Site ──────────────────────────────────────────────────
      S.listItem()
        .title('Site')
        .icon(() => '⚙')
        .child(
          S.list()
            .title('Site')
            .items([
              S.listItem()
                .title('Settings')
                .icon(() => '⚙')
                .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
              S.listItem()
                .title('Header')
                .icon(() => '🔝')
                .child(S.document().schemaType('header').documentId('header')),
              S.listItem()
                .title('Footer')
                .icon(() => '🔻')
                .child(S.document().schemaType('footer').documentId('footer')),
              S.listItem()
                .title('Redirects')
                .icon(() => '↪')
                .child(S.document().schemaType('redirects').documentId('redirects')),
            ])
        ),
    ])

// Filter singletons out of the "new document" creation menu
export const newDocumentOptions = (prev: { templateId: string }[]) =>
  prev.filter(({ templateId }) => !SINGLETONS.includes(templateId))
```

**Step 2: Update sanity.config.ts to use custom structure**

Modify: `sanity.config.ts`

Replace:
```typescript
plugins: [
    structureTool(),
```

With:
```typescript
plugins: [
    structureTool({ structure }),
```

And add the import at the top (after the existing imports):
```typescript
import { structure, newDocumentOptions } from './sanity/structure'
```

And add `newDocumentOptions` to the `document` config on the `defineConfig` object — add this after the `schema` key:
```typescript
document: {
  newDocumentOptions,
},
```

Note: The `submission` list item will show an error in the Studio until Phase 5 when we create that schema. That's fine — Sanity just won't render it. Alternatively, you can comment out the submission line and add it back during Phase 5.

**Step 3: Commit**

```bash
git add sanity/structure/index.ts sanity.config.ts
git commit -m "feat: add custom desk structure for Sanity Studio"
```

---

## Phase 2: Section Schemas

### Task 2: Create CTA object and section schema helpers

**Files:**
- Create: `sanity/schemaTypes/objects/cta.ts`

**Step 1: Create the shared CTA object**

Many sections use a CTA button (text + link). Define it once:

```typescript
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'cta',
  title: 'Call to Action',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Button Text',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'href',
      title: 'Link',
      type: 'string',
      description: 'Internal path (e.g. /menu) or external URL',
      validation: (Rule) => Rule.required(),
    }),
  ],
})
```

**Step 2: Register cta in schema index**

Modify: `sanity/schemaTypes/index.ts`

Add after the `seo` import:
```typescript
import cta from './objects/cta'
```

Add `cta` to the `schemaTypes` array after `seo`:
```typescript
seo,
cta,
```

**Step 3: Commit**

```bash
git add sanity/schemaTypes/objects/cta.ts sanity/schemaTypes/index.ts
git commit -m "feat: add shared CTA object schema"
```

---

### Task 3: Create section schemas (batch 1 — Hero, SplitContent, RichText, CTA)

**Files:**
- Create: `sanity/schemaTypes/objects/sections/sectionHero.ts`
- Create: `sanity/schemaTypes/objects/sections/sectionSplitContent.ts`
- Create: `sanity/schemaTypes/objects/sections/sectionRichText.ts`
- Create: `sanity/schemaTypes/objects/sections/sectionCta.ts`

**Step 1: Create sectionHero**

```typescript
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'sectionHero',
  title: 'Hero',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow Text', type: 'string', description: 'Small text above the heading (optional)' }),
    defineField({ name: 'heading', title: 'Heading', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'subheading', title: 'Subheading', type: 'text', rows: 2 }),
    defineField({ name: 'image', title: 'Background Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'cta', title: 'Call to Action', type: 'cta' }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Centered', value: 'centered' },
          { title: 'Left-aligned', value: 'left' },
          { title: 'Split (text left, image right)', value: 'split' },
        ],
        layout: 'radio',
      },
      initialValue: 'centered',
    }),
  ],
  preview: {
    select: { title: 'heading', subtitle: 'subheading' },
    prepare: ({ title, subtitle }) => ({ title: title || 'Hero', subtitle, media: () => '🦸' }),
  },
})
```

**Step 2: Create sectionSplitContent**

```typescript
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'sectionSplitContent',
  title: 'Split Content',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({ name: 'body', title: 'Body', type: 'portableText' }),
    defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'imagePosition',
      title: 'Image Position',
      type: 'string',
      options: { list: ['left', 'right'], layout: 'radio' },
      initialValue: 'right',
    }),
    defineField({ name: 'cta', title: 'Call to Action', type: 'cta' }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title: title || 'Split Content', media: () => '◫' }),
  },
})
```

**Step 3: Create sectionRichText**

```typescript
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'sectionRichText',
  title: 'Rich Text',
  type: 'object',
  fields: [
    defineField({ name: 'body', title: 'Body', type: 'portableText', validation: (Rule) => Rule.required() }),
  ],
  preview: {
    prepare: () => ({ title: 'Rich Text Block', media: () => '📝' }),
  },
})
```

**Step 4: Create sectionCta**

```typescript
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'sectionCta',
  title: 'Call to Action',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({ name: 'body', title: 'Body Text', type: 'text', rows: 3 }),
    defineField({ name: 'cta', title: 'Button', type: 'cta' }),
    defineField({ name: 'backgroundImage', title: 'Background Image', type: 'image', options: { hotspot: true } }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title: title || 'Call to Action', media: () => '📢' }),
  },
})
```

**Step 5: Commit**

```bash
git add sanity/schemaTypes/objects/sections/
git commit -m "feat: add section schemas — Hero, SplitContent, RichText, CTA"
```

---

### Task 4: Create section schemas (batch 2 — reference-based sections)

**Files:**
- Create: `sanity/schemaTypes/objects/sections/sectionFeaturedMenu.ts`
- Create: `sanity/schemaTypes/objects/sections/sectionTestimonials.ts`
- Create: `sanity/schemaTypes/objects/sections/sectionFaq.ts`
- Create: `sanity/schemaTypes/objects/sections/sectionTeam.ts`
- Create: `sanity/schemaTypes/objects/sections/sectionImageGallery.ts`
- Create: `sanity/schemaTypes/objects/sections/sectionContactForm.ts`

**Step 1: Create sectionFeaturedMenu**

```typescript
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'sectionFeaturedMenu',
  title: 'Featured Menu',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string', initialValue: 'From Our Kitchen' }),
    defineField({
      name: 'items',
      title: 'Menu Items',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'menuItem' }] }],
      validation: (Rule) => Rule.max(6),
    }),
  ],
  preview: {
    select: { title: 'heading', count: 'items.length' },
    prepare: ({ title }) => ({ title: title || 'Featured Menu', media: () => '🍽' }),
  },
})
```

**Step 2: Create sectionTestimonials**

```typescript
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'sectionTestimonials',
  title: 'Testimonials',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string', initialValue: 'What Our Guests Say' }),
    defineField({
      name: 'testimonials',
      title: 'Testimonials',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'testimonial' }] }],
      validation: (Rule) => Rule.max(6),
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title: title || 'Testimonials', media: () => '⭐' }),
  },
})
```

**Step 3: Create sectionFaq**

```typescript
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'sectionFaq',
  title: 'FAQ',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string', initialValue: 'Frequently Asked Questions' }),
    defineField({
      name: 'faqItems',
      title: 'FAQ Items',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'faqItem' }] }],
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title: title || 'FAQ', media: () => '❓' }),
  },
})
```

**Step 4: Create sectionTeam**

```typescript
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'sectionTeam',
  title: 'Team',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string', initialValue: 'Meet the Team' }),
    defineField({ name: 'subheading', title: 'Subheading', type: 'text', rows: 2 }),
    defineField({
      name: 'teamMembers',
      title: 'Team Members',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'teamMember' }] }],
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title: title || 'Team', media: () => '👥' }),
  },
})
```

**Step 5: Create sectionImageGallery**

```typescript
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'sectionImageGallery',
  title: 'Image Gallery',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string', initialValue: 'Our Space' }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'galleryImage' }] }],
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title: title || 'Image Gallery', media: () => '🖼' }),
  },
})
```

**Step 6: Create sectionContactForm**

```typescript
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'sectionContactForm',
  title: 'Contact Form',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string', initialValue: 'Get in Touch' }),
    defineField({ name: 'subheading', title: 'Subheading', type: 'text', rows: 2 }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title: title || 'Contact Form', media: () => '✉' }),
  },
})
```

**Step 7: Commit**

```bash
git add sanity/schemaTypes/objects/sections/
git commit -m "feat: add section schemas — FeaturedMenu, Testimonials, FAQ, Team, Gallery, ContactForm"
```

---

### Task 5: Create section schemas (batch 3 — Embed, MenuSection, LogoBar, StatsBar)

**Files:**
- Create: `sanity/schemaTypes/objects/sections/sectionEmbed.ts`
- Create: `sanity/schemaTypes/objects/sections/sectionMenuSection.ts`
- Create: `sanity/schemaTypes/objects/sections/sectionLogoBar.ts`
- Create: `sanity/schemaTypes/objects/sections/sectionStatsBar.ts`

**Step 1: Create sectionEmbed**

```typescript
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'sectionEmbed',
  title: 'Embed',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({
      name: 'embedType',
      title: 'Embed Type',
      type: 'string',
      options: {
        list: [
          { title: 'Video', value: 'video' },
          { title: 'Map', value: 'map' },
          { title: 'Custom', value: 'custom' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'embedUrl',
      title: 'Embed URL',
      type: 'url',
      validation: (Rule) => Rule.required().uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'aspectRatio',
      title: 'Aspect Ratio',
      type: 'string',
      options: { list: ['16:9', '4:3', '1:1', '9:16'], layout: 'radio' },
      initialValue: '16:9',
    }),
  ],
  preview: {
    select: { title: 'heading', type: 'embedType' },
    prepare: ({ title, type }) => ({ title: title || `Embed (${type || 'unknown'})`, media: () => '🎬' }),
  },
})
```

**Step 2: Create sectionMenuSection**

```typescript
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'sectionMenuSection',
  title: 'Full Menu',
  type: 'object',
  description: 'Renders the full menu with category tabs — uses existing menuCategory/menuItem data',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string', initialValue: 'Our Menu' }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title: title || 'Full Menu', media: () => '📋' }),
  },
})
```

**Step 3: Create sectionLogoBar**

```typescript
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'sectionLogoBar',
  title: 'Logo Bar',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({
      name: 'logos',
      title: 'Logos',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'alt', type: 'string', title: 'Alt Text', validation: (Rule: any) => Rule.required() },
          ],
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title: title || 'Logo Bar', media: () => '🏷' }),
  },
})
```

**Step 4: Create sectionStatsBar**

```typescript
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'sectionStatsBar',
  title: 'Stats Bar',
  type: 'object',
  fields: [
    defineField({
      name: 'stats',
      title: 'Stats',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'number', type: 'string', title: 'Number', validation: (Rule: any) => Rule.required() },
            { name: 'label', type: 'string', title: 'Label', validation: (Rule: any) => Rule.required() },
          ],
          preview: {
            select: { title: 'number', subtitle: 'label' },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Stats Bar', media: () => '📊' }),
  },
})
```

**Step 5: Commit**

```bash
git add sanity/schemaTypes/objects/sections/
git commit -m "feat: add section schemas — Embed, MenuSection, LogoBar, StatsBar"
```

---

### Task 6: Create pageBuilder field definition and register all sections

**Files:**
- Create: `sanity/schemaTypes/builders/pageBuilder.ts`
- Modify: `sanity/schemaTypes/index.ts`

**Step 1: Create the pageBuilder definition**

```typescript
import { defineField } from 'sanity'

/**
 * Reusable pageBuilder field — an array of section types.
 * Import and spread into any document's fields array.
 */
export const pageBuilderField = defineField({
  name: 'pageBuilder',
  title: 'Page Sections',
  type: 'array',
  of: [
    { type: 'sectionHero' },
    { type: 'sectionSplitContent' },
    { type: 'sectionRichText' },
    { type: 'sectionCta' },
    { type: 'sectionFeaturedMenu' },
    { type: 'sectionTestimonials' },
    { type: 'sectionFaq' },
    { type: 'sectionTeam' },
    { type: 'sectionImageGallery' },
    { type: 'sectionContactForm' },
    { type: 'sectionEmbed' },
    { type: 'sectionMenuSection' },
    { type: 'sectionLogoBar' },
    { type: 'sectionStatsBar' },
  ],
})
```

**Step 2: Register all new schemas in index.ts**

Replace the entire contents of `sanity/schemaTypes/index.ts` with:

```typescript
// Object types (shared building blocks)
import portableText from './objects/portableText'
import socialLink from './objects/socialLink'
import openingHours from './objects/openingHours'
import seo from './objects/seo'
import cta from './objects/cta'

// Section types (page builder blocks)
import sectionHero from './objects/sections/sectionHero'
import sectionSplitContent from './objects/sections/sectionSplitContent'
import sectionRichText from './objects/sections/sectionRichText'
import sectionCta from './objects/sections/sectionCta'
import sectionFeaturedMenu from './objects/sections/sectionFeaturedMenu'
import sectionTestimonials from './objects/sections/sectionTestimonials'
import sectionFaq from './objects/sections/sectionFaq'
import sectionTeam from './objects/sections/sectionTeam'
import sectionImageGallery from './objects/sections/sectionImageGallery'
import sectionContactForm from './objects/sections/sectionContactForm'
import sectionEmbed from './objects/sections/sectionEmbed'
import sectionMenuSection from './objects/sections/sectionMenuSection'
import sectionLogoBar from './objects/sections/sectionLogoBar'
import sectionStatsBar from './objects/sections/sectionStatsBar'

// Singleton documents (one of each)
import siteSettings from './singletons/siteSettings'
import homePage from './singletons/homePage'

// Document types (multiple entries)
import menuCategory from './documents/menuCategory'
import menuItem from './documents/menuItem'
import teamMember from './documents/teamMember'
import testimonial from './documents/testimonial'
import faqItem from './documents/faqItem'
import galleryImage from './documents/galleryImage'
import page from './documents/page'

export const schemaTypes = [
  // Objects
  portableText,
  socialLink,
  openingHours,
  seo,
  cta,
  // Sections
  sectionHero,
  sectionSplitContent,
  sectionRichText,
  sectionCta,
  sectionFeaturedMenu,
  sectionTestimonials,
  sectionFaq,
  sectionTeam,
  sectionImageGallery,
  sectionContactForm,
  sectionEmbed,
  sectionMenuSection,
  sectionLogoBar,
  sectionStatsBar,
  // Singletons
  siteSettings,
  homePage,
  // Documents
  menuCategory,
  menuItem,
  teamMember,
  testimonial,
  faqItem,
  galleryImage,
  page,
]
```

**Step 3: Commit**

```bash
git add sanity/schemaTypes/builders/pageBuilder.ts sanity/schemaTypes/index.ts
git commit -m "feat: add pageBuilder field and register all section schemas"
```

---

## Phase 3: Update Existing Document Schemas

### Task 7: Update homePage schema to use pageBuilder

**Files:**
- Modify: `sanity/schemaTypes/singletons/homePage.ts`

**Step 1: Replace homePage schema**

Replace the entire contents of `sanity/schemaTypes/singletons/homePage.ts` with:

```typescript
import { HomeIcon } from '@sanity/icons'
import { defineType, defineField } from 'sanity'
import { pageBuilderField } from '../builders/pageBuilder'

export default defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  icon: HomeIcon,
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      ...pageBuilderField,
      group: 'content',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Home Page' }
    },
  },
})
```

**Step 2: Commit**

```bash
git add sanity/schemaTypes/singletons/homePage.ts
git commit -m "feat: replace hardcoded homePage fields with pageBuilder"
```

---

### Task 8: Update page schema with uri field and pageBuilder

**Files:**
- Modify: `sanity/schemaTypes/documents/page.ts`

**Step 1: Replace page schema**

Replace the entire contents of `sanity/schemaTypes/documents/page.ts` with:

```typescript
import { DocumentIcon } from '@sanity/icons'
import { defineType, defineField } from 'sanity'
import { pageBuilderField } from '../builders/pageBuilder'

export default defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: DocumentIcon,
  groups: [
    { name: 'page', title: 'Page', default: true },
    { name: 'content', title: 'Content' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'page',
    }),
    defineField({
      name: 'slug',
      title: 'Slug (legacy)',
      type: 'slug',
      options: { source: 'title' },
      hidden: true,
      description: 'Legacy field — use URI instead',
    }),
    defineField({
      name: 'uri',
      title: 'URI',
      type: 'string',
      description: 'Full path, e.g. /about — must start with /, lowercase, no trailing slash',
      group: 'page',
      validation: (Rule) =>
        Rule.required()
          .regex(/^\/[a-z0-9\-/]*[a-z0-9]$/, {
            name: 'uri',
            invert: false,
          })
          .error('Must start with /, be lowercase, and have no trailing slash (e.g. /about)'),
    }),
    defineField({
      ...pageBuilderField,
      group: 'content',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    select: { title: 'title', uri: 'uri', slug: 'slug.current' },
    prepare({ title, uri, slug }) {
      return { title, subtitle: uri || (slug ? `/${slug}` : '') }
    },
  },
})
```

**Step 2: Commit**

```bash
git add sanity/schemaTypes/documents/page.ts
git commit -m "feat: add uri field and pageBuilder to page schema"
```

---

## Phase 4: Separate Global Config

### Task 9: Create header, footer, and redirects singletons

**Files:**
- Create: `sanity/schemaTypes/singletons/header.ts`
- Create: `sanity/schemaTypes/singletons/footer.ts`
- Create: `sanity/schemaTypes/singletons/redirects.ts`
- Modify: `sanity/schemaTypes/index.ts`

**Step 1: Create header singleton**

```typescript
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'header',
  title: 'Header',
  type: 'document',
  fields: [
    defineField({
      name: 'navigation',
      title: 'Navigation Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', type: 'string', title: 'Label', validation: (Rule: any) => Rule.required() },
            { name: 'href', type: 'string', title: 'Link', validation: (Rule: any) => Rule.required() },
          ],
          preview: {
            select: { title: 'label', subtitle: 'href' },
          },
        },
      ],
    }),
    defineField({
      name: 'cta',
      title: 'CTA Button (optional)',
      type: 'cta',
      description: 'Optional call-to-action button shown in the header (e.g. "Reserve")',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Header' }
    },
  },
})
```

**Step 2: Create footer singleton**

```typescript
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'footer',
  title: 'Footer',
  type: 'document',
  fields: [
    defineField({ name: 'tagline', title: 'Tagline', type: 'string' }),
    defineField({
      name: 'columns',
      title: 'Link Columns',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', type: 'string', title: 'Column Title', validation: (Rule: any) => Rule.required() },
            {
              name: 'links',
              type: 'array',
              title: 'Links',
              of: [
                {
                  type: 'object',
                  fields: [
                    { name: 'label', type: 'string', title: 'Label', validation: (Rule: any) => Rule.required() },
                    { name: 'href', type: 'string', title: 'Link', validation: (Rule: any) => Rule.required() },
                  ],
                  preview: {
                    select: { title: 'label', subtitle: 'href' },
                  },
                },
              ],
            },
          ],
          preview: {
            select: { title: 'title' },
          },
        },
      ],
    }),
    defineField({ name: 'copyrightText', title: 'Copyright Text', type: 'string', description: 'e.g. "All rights reserved." — year and business name are added automatically' }),
  ],
  preview: {
    prepare() {
      return { title: 'Footer' }
    },
  },
})
```

**Step 3: Create redirects singleton**

```typescript
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'redirects',
  title: 'Redirects',
  type: 'document',
  fields: [
    defineField({
      name: 'rules',
      title: 'Redirect Rules',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'source',
              type: 'string',
              title: 'Source Path',
              description: 'e.g. /old-page',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'destination',
              type: 'string',
              title: 'Destination Path',
              description: 'e.g. /new-page',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'permanent',
              type: 'boolean',
              title: 'Permanent (301)',
              initialValue: false,
              description: 'Permanent (301) vs temporary (307) redirect',
            },
          ],
          preview: {
            select: { source: 'source', destination: 'destination', permanent: 'permanent' },
            prepare({ source, destination, permanent }) {
              return {
                title: `${source} → ${destination}`,
                subtitle: permanent ? '301 (permanent)' : '307 (temporary)',
              }
            },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Redirects' }
    },
  },
})
```

**Step 4: Register new singletons in schema index**

In `sanity/schemaTypes/index.ts`, add after the `homePage` import:
```typescript
import header from './singletons/header'
import footer from './singletons/footer'
import redirects from './singletons/redirects'
```

Add to the `schemaTypes` array after `homePage`:
```typescript
homePage,
header,
footer,
redirects,
```

**Step 5: Commit**

```bash
git add sanity/schemaTypes/singletons/header.ts sanity/schemaTypes/singletons/footer.ts sanity/schemaTypes/singletons/redirects.ts sanity/schemaTypes/index.ts
git commit -m "feat: add header, footer, and redirects singletons"
```

---

### Task 10: Update siteSettings — remove any nav/footer overlap

**Files:**
- Verify: `sanity/schemaTypes/singletons/siteSettings.ts`

**Step 1: Review siteSettings**

The current `siteSettings.ts` does NOT contain navigation or footer-specific fields — it only has business info (name, tagline, logos, phone, email, address, location, hours, socialLinks, reservationUrl, seo). No changes needed.

**Step 2: Commit (no-op)**

No changes required. Proceed to next task.

---

## Phase 5: Submissions

### Task 11: Create submission document schema

**Files:**
- Create: `sanity/schemaTypes/documents/submission.ts`
- Modify: `sanity/schemaTypes/index.ts`

**Step 1: Create submission schema**

```typescript
import { EnvelopeIcon } from '@sanity/icons'
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'submission',
  title: 'Submission',
  type: 'document',
  icon: EnvelopeIcon,
  readOnly: true,
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string' }),
    defineField({ name: 'email', title: 'Email', type: 'string' }),
    defineField({ name: 'phone', title: 'Phone', type: 'string' }),
    defineField({ name: 'message', title: 'Message', type: 'text' }),
    defineField({ name: 'page', title: 'Page', type: 'string', description: 'Which page the form was submitted from' }),
    defineField({ name: 'source', title: 'Source', type: 'string', description: 'Which form (e.g. contact, newsletter)' }),
    defineField({ name: 'submittedAt', title: 'Submitted At', type: 'datetime' }),
  ],
  orderings: [
    { title: 'Newest First', name: 'submittedAtDesc', by: [{ field: 'submittedAt', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'name', subtitle: 'email', date: 'submittedAt' },
    prepare({ title, subtitle, date }) {
      const dateStr = date ? new Date(date).toLocaleDateString() : ''
      return { title: title || 'Unknown', subtitle: `${subtitle || ''} · ${dateStr}` }
    },
  },
})
```

**Step 2: Register in schema index**

In `sanity/schemaTypes/index.ts`, add after the `page` import:
```typescript
import submission from './documents/submission'
```

Add to the `schemaTypes` array after `page`:
```typescript
page,
submission,
```

**Step 3: Commit**

```bash
git add sanity/schemaTypes/documents/submission.ts sanity/schemaTypes/index.ts
git commit -m "feat: add submission document schema (read-only)"
```

---

### Task 12: Update contact API to write submissions to Sanity

**Files:**
- Modify: `app/api/contact/route.ts`

**Step 1: Update the contact route**

Replace the entire contents of `app/api/contact/route.ts` with:

```typescript
import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '@/sanity/env'

const resend = new Resend(process.env.RESEND_API_KEY)

const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
})

export async function POST(request: Request) {
  try {
    const { name, email, phone, message } = await request.json()

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    // Send email via Resend and write to Sanity in parallel
    const emailPromise = resend.emails.send({
      from: process.env.CONTACT_EMAIL_FROM || 'noreply@example.com',
      to: process.env.CONTACT_EMAIL_TO || 'hello@example.com',
      subject: `Contact form: ${name}`,
      html: `
        <h2>New contact form submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
      replyTo: email,
    })

    const sanityPromise = writeClient.create({
      _type: 'submission',
      name,
      email,
      phone: phone || undefined,
      message,
      page: '/contact',
      source: 'contact',
      submittedAt: new Date().toISOString(),
    }).catch((err) => {
      // Log but don't fail the request if Sanity write fails
      console.error('Failed to write submission to Sanity:', err)
    })

    await Promise.all([emailPromise, sanityPromise])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
```

**Step 2: Commit**

```bash
git add app/api/contact/route.ts
git commit -m "feat: write contact form submissions to Sanity"
```

---

## Phase 6: Frontend PageBuilder Component

### Task 13: Extract Hero section component from HomePageSections

**Files:**
- Create: `components/sections/Hero.tsx`

**Step 1: Create Hero component**

Extract the hero section from `app/HomePageSections.tsx` (lines 20-61):

```typescript
'use client'

import { motion } from 'framer-motion'
import { fadeInUp } from '@/lib/animations'
import SanityImage from '@/components/sanity/SanityImage'
import Button from '@/components/ui/Button'

interface HeroProps {
  eyebrow?: string
  heading?: string
  subheading?: string
  image?: any
  cta?: { label?: string; href?: string }
  layout?: 'centered' | 'left' | 'split'
}

export default function Hero({ eyebrow, heading, subheading, image, cta, layout = 'centered' }: HeroProps) {
  if (layout === 'split') {
    return (
      <section className="grid grid-cols-1 md:grid-cols-2 min-h-[70vh]">
        <div className="flex items-center justify-center px-8 py-20 sm:py-28">
          <div className="max-w-lg">
            {eyebrow && (
              <motion.p variants={fadeInUp} initial="hidden" animate="visible" className="text-sm uppercase tracking-wider text-primary mb-4">
                {eyebrow}
              </motion.p>
            )}
            <motion.h1 variants={fadeInUp} initial="hidden" animate="visible" className="font-serif text-4xl sm:text-5xl font-bold mb-6">
              {heading || 'Welcome'}
            </motion.h1>
            {subheading && (
              <motion.p variants={fadeInUp} initial="hidden" animate="visible" className="text-lg text-muted-foreground mb-8">
                {subheading}
              </motion.p>
            )}
            {cta?.label && cta?.href && (
              <motion.div variants={fadeInUp} initial="hidden" animate="visible">
                <Button href={cta.href} variant="primary" size="lg">{cta.label}</Button>
              </motion.div>
            )}
          </div>
        </div>
        {image && (
          <div className="relative min-h-[50vh] md:min-h-full">
            <SanityImage image={image} alt={heading || 'Hero'} fill sizes="50vw" className="object-cover" priority />
          </div>
        )}
      </section>
    )
  }

  const alignClass = layout === 'left' ? 'text-left items-start' : 'text-center'

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center text-white">
      {image && (
        <div className="absolute inset-0">
          <SanityImage image={image} alt={heading || 'Hero'} fill sizes="100vw" className="object-cover" priority />
          <div className="absolute inset-0 bg-black/50" />
        </div>
      )}
      <div className={`relative z-10 px-4 max-w-3xl ${alignClass}`}>
        {eyebrow && (
          <motion.p variants={fadeInUp} initial="hidden" animate="visible" className="text-sm uppercase tracking-wider text-primary-light mb-4">
            {eyebrow}
          </motion.p>
        )}
        <motion.h1 variants={fadeInUp} initial="hidden" animate="visible" className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
          {heading || 'Welcome'}
        </motion.h1>
        {subheading && (
          <motion.p variants={fadeInUp} initial="hidden" animate="visible" className="text-lg sm:text-xl opacity-90 mb-8">
            {subheading}
          </motion.p>
        )}
        {cta?.label && cta?.href && (
          <motion.div variants={fadeInUp} initial="hidden" animate="visible">
            <Button href={cta.href} variant="primary" size="lg">{cta.label}</Button>
          </motion.div>
        )}
      </div>
    </section>
  )
}
```

**Step 2: Commit**

```bash
git add components/sections/Hero.tsx
git commit -m "feat: extract Hero section component"
```

---

### Task 14: Extract SplitContent, CTA, and RichText section components

**Files:**
- Create: `components/sections/SplitContent.tsx`
- Create: `components/sections/CTA.tsx`
- Create: `components/sections/RichText.tsx`

**Step 1: Create SplitContent component**

Extract from `app/HomePageSections.tsx` (lines 64-101):

```typescript
'use client'

import { motion } from 'framer-motion'
import { PortableText } from '@portabletext/react'
import { fadeInUp, staggerContainer } from '@/lib/animations'
import Container from '@/components/layout/Container'
import SanityImage from '@/components/sanity/SanityImage'
import Button from '@/components/ui/Button'

interface SplitContentProps {
  heading?: string
  body?: any
  image?: any
  imagePosition?: 'left' | 'right'
  cta?: { label?: string; href?: string }
}

export default function SplitContent({ heading, body, image, imagePosition = 'right', cta }: SplitContentProps) {
  const textBlock = (
    <motion.div variants={fadeInUp}>
      {heading && (
        <h2 className="font-serif text-3xl sm:text-4xl mb-6">{heading}</h2>
      )}
      {body && (
        <div className="prose prose-lg max-w-none text-muted-foreground">
          {Array.isArray(body) ? <PortableText value={body} /> : <p>{body}</p>}
        </div>
      )}
      {cta?.label && cta?.href && (
        <div className="mt-8">
          <Button href={cta.href} variant="outline">{cta.label}</Button>
        </div>
      )}
    </motion.div>
  )

  const imageBlock = image ? (
    <motion.div variants={fadeInUp} className="relative aspect-[4/3] overflow-hidden rounded-sm">
      <SanityImage image={image} alt={heading || 'Content image'} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
    </motion.div>
  ) : null

  return (
    <motion.section
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      className="py-20 sm:py-28"
    >
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {imagePosition === 'left' ? (
            <>{imageBlock}{textBlock}</>
          ) : (
            <>{textBlock}{imageBlock}</>
          )}
        </div>
      </Container>
    </motion.section>
  )
}
```

**Step 2: Create CTA component**

Extract from `app/HomePageSections.tsx` (lines 166-206):

```typescript
'use client'

import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@/lib/animations'
import Container from '@/components/layout/Container'
import SanityImage from '@/components/sanity/SanityImage'
import Button from '@/components/ui/Button'

interface CTAProps {
  heading?: string
  body?: string
  cta?: { label?: string; href?: string }
  backgroundImage?: any
}

export default function CTA({ heading, body, cta, backgroundImage }: CTAProps) {
  return (
    <section className="relative py-20 sm:py-28 text-white">
      {backgroundImage && (
        <div className="absolute inset-0">
          <SanityImage image={backgroundImage} alt="" fill sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-black/60" />
        </div>
      )}
      <Container>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative z-10 text-center max-w-2xl mx-auto"
        >
          {heading && (
            <motion.h2 variants={fadeInUp} className="font-serif text-3xl sm:text-4xl mb-4">
              {heading}
            </motion.h2>
          )}
          {body && (
            <motion.p variants={fadeInUp} className="text-lg opacity-90 mb-8">
              {body}
            </motion.p>
          )}
          {cta?.label && cta?.href && (
            <motion.div variants={fadeInUp}>
              <Button href={cta.href} variant="primary" size="lg">{cta.label}</Button>
            </motion.div>
          )}
        </motion.div>
      </Container>
    </section>
  )
}
```

**Step 3: Create RichText component**

```typescript
import { PortableText } from '@portabletext/react'
import Container from '@/components/layout/Container'

interface RichTextProps {
  body?: any
}

export default function RichText({ body }: RichTextProps) {
  if (!body) return null

  return (
    <section className="py-16 sm:py-24">
      <Container>
        <div className="prose prose-lg max-w-3xl mx-auto text-muted-foreground">
          <PortableText value={body} />
        </div>
      </Container>
    </section>
  )
}
```

**Step 4: Commit**

```bash
git add components/sections/SplitContent.tsx components/sections/CTA.tsx components/sections/RichText.tsx
git commit -m "feat: extract SplitContent, CTA, and RichText section components"
```

---

### Task 15: Create FeaturedMenu and Testimonials section components

**Files:**
- Create: `components/sections/FeaturedMenu.tsx`
- Create: `components/sections/Testimonials.tsx`

**Step 1: Create FeaturedMenu component**

Extract from `app/HomePageSections.tsx` (lines 104-135):

```typescript
'use client'

import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@/lib/animations'
import Container from '@/components/layout/Container'
import MenuItem from '@/components/ui/MenuItem'
import Button from '@/components/ui/Button'

interface FeaturedMenuProps {
  heading?: string
  items?: Array<{
    _id: string
    name: string
    description?: string
    price: string
    dietaryTags?: string[]
  }>
}

export default function FeaturedMenu({ heading, items }: FeaturedMenuProps) {
  if (!items || items.length === 0) return null

  return (
    <motion.section
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      className="py-20 sm:py-28 bg-muted"
    >
      <Container>
        <motion.h2 variants={fadeInUp} className="font-serif text-3xl sm:text-4xl text-center mb-12">
          {heading || 'From Our Kitchen'}
        </motion.h2>
        <div className="max-w-2xl mx-auto space-y-6">
          {items.map((item) => (
            <motion.div key={item._id} variants={fadeInUp}>
              <MenuItem
                name={item.name}
                price={`$${item.price}`}
                description={item.description || ''}
                dietaryTags={item.dietaryTags}
              />
            </motion.div>
          ))}
        </div>
        <motion.div variants={fadeInUp} className="text-center mt-12">
          <Button href="/menu" variant="outline">View Full Menu</Button>
        </motion.div>
      </Container>
    </motion.section>
  )
}
```

**Step 2: Create Testimonials component**

Extract from `app/HomePageSections.tsx` (lines 138-163):

```typescript
'use client'

import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@/lib/animations'
import Container from '@/components/layout/Container'
import TestimonialCard from '@/components/ui/TestimonialCard'

interface TestimonialsProps {
  heading?: string
  testimonials?: Array<{
    _id: string
    author: string
    quote: string
    rating?: number
    source?: string
  }>
}

export default function Testimonials({ heading, testimonials }: TestimonialsProps) {
  if (!testimonials || testimonials.length === 0) return null

  return (
    <motion.section
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      className="py-20 sm:py-28"
    >
      <Container>
        <motion.h2 variants={fadeInUp} className="font-serif text-3xl sm:text-4xl text-center mb-12">
          {heading || 'What Our Guests Say'}
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <TestimonialCard key={t._id} author={t.author} quote={t.quote} rating={t.rating} source={t.source} />
          ))}
        </div>
      </Container>
    </motion.section>
  )
}
```

**Step 3: Commit**

```bash
git add components/sections/FeaturedMenu.tsx components/sections/Testimonials.tsx
git commit -m "feat: extract FeaturedMenu and Testimonials section components"
```

---

### Task 16: Create remaining section components (FAQ, Team, Gallery, ContactForm, Embed, MenuSection, LogoBar, StatsBar)

**Files:**
- Create: `components/sections/FAQ.tsx`
- Create: `components/sections/Team.tsx`
- Create: `components/sections/ImageGallery.tsx`
- Create: `components/sections/ContactForm.tsx`
- Create: `components/sections/Embed.tsx`
- Create: `components/sections/MenuSection.tsx`
- Create: `components/sections/LogoBar.tsx`
- Create: `components/sections/StatsBar.tsx`

**Step 1: Create FAQ component**

```typescript
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PortableText } from '@portabletext/react'
import { fadeInUp, staggerContainer } from '@/lib/animations'
import Container from '@/components/layout/Container'

interface FAQProps {
  heading?: string
  faqItems?: Array<{
    _id: string
    question: string
    answer: any
  }>
}

export default function FAQ({ heading, faqItems }: FAQProps) {
  const [openId, setOpenId] = useState<string | null>(null)

  if (!faqItems || faqItems.length === 0) return null

  return (
    <motion.section
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      className="py-20 sm:py-28"
    >
      <Container>
        <motion.h2 variants={fadeInUp} className="font-serif text-3xl sm:text-4xl text-center mb-12">
          {heading || 'Frequently Asked Questions'}
        </motion.h2>
        <div className="max-w-3xl mx-auto divide-y divide-border">
          {faqItems.map((item) => (
            <motion.div key={item._id} variants={fadeInUp}>
              <button
                onClick={() => setOpenId(openId === item._id ? null : item._id)}
                className="w-full flex items-center justify-between py-5 text-left"
                aria-expanded={openId === item._id}
              >
                <span className="font-medium text-lg pr-4">{item.question}</span>
                <svg
                  className={`w-5 h-5 flex-shrink-0 transition-transform ${openId === item._id ? 'rotate-180' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <AnimatePresence>
                {openId === item._id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="overflow-hidden"
                  >
                    <div className="pb-5 prose prose-sm text-muted-foreground">
                      {Array.isArray(item.answer) ? <PortableText value={item.answer} /> : <p>{item.answer}</p>}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </Container>
    </motion.section>
  )
}
```

**Step 2: Create Team component**

```typescript
'use client'

import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@/lib/animations'
import Container from '@/components/layout/Container'
import TeamCard from '@/components/ui/TeamCard'

interface TeamProps {
  heading?: string
  subheading?: string
  teamMembers?: Array<{
    _id: string
    name: string
    role?: string
    image: any
  }>
}

export default function Team({ heading, subheading, teamMembers }: TeamProps) {
  if (!teamMembers || teamMembers.length === 0) return null

  return (
    <motion.section
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      className="py-20 sm:py-28 bg-muted"
    >
      <Container>
        <motion.h2 variants={fadeInUp} className="font-serif text-3xl sm:text-4xl text-center mb-4">
          {heading || 'Meet the Team'}
        </motion.h2>
        {subheading && (
          <motion.p variants={fadeInUp} className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            {subheading}
          </motion.p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <motion.div key={member._id} variants={fadeInUp}>
              <TeamCard name={member.name} role={member.role} image={member.image} />
            </motion.div>
          ))}
        </div>
      </Container>
    </motion.section>
  )
}
```

**Step 3: Create ImageGallery component**

```typescript
'use client'

import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@/lib/animations'
import Container from '@/components/layout/Container'
import GalleryGrid from '@/components/ui/GalleryGrid'

interface ImageGalleryProps {
  heading?: string
  images?: Array<{
    _id: string
    image: any
    alt: string
    caption?: string
  }>
}

export default function ImageGallery({ heading, images }: ImageGalleryProps) {
  if (!images || images.length === 0) return null

  return (
    <motion.section
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      className="py-20 sm:py-28"
    >
      <Container>
        <motion.h2 variants={fadeInUp} className="font-serif text-3xl sm:text-4xl text-center mb-12">
          {heading || 'Gallery'}
        </motion.h2>
        <GalleryGrid images={images} />
      </Container>
    </motion.section>
  )
}
```

**Step 4: Create ContactForm component**

```typescript
'use client'

import { useState } from 'react'
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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFormState('submitting')

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone') || undefined,
      message: formData.get('message'),
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
      ;(e.target as HTMLFormElement).reset()
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong')
      setFormState('error')
    }
  }

  return (
    <motion.section
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      className="py-20 sm:py-28 bg-muted"
    >
      <Container>
        <motion.div variants={fadeInUp} className="max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl sm:text-4xl text-center mb-4">
            {heading || 'Get in Touch'}
          </h2>
          {subheading && (
            <p className="text-center text-muted-foreground text-lg mb-12">{subheading}</p>
          )}

          {formState === 'success' ? (
            <div className="text-center py-12">
              <p className="text-lg font-medium text-primary">Thank you! We&apos;ll be in touch soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">Name *</label>
                  <input type="text" id="name" name="name" required className="w-full px-4 py-3 border border-border bg-background rounded-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">Email *</label>
                  <input type="email" id="email" name="email" required className="w-full px-4 py-3 border border-border bg-background rounded-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2">Phone</label>
                <input type="tel" id="phone" name="phone" className="w-full px-4 py-3 border border-border bg-background rounded-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">Message *</label>
                <textarea id="message" name="message" required rows={5} className="w-full px-4 py-3 border border-border bg-background rounded-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
              </div>
              {formState === 'error' && (
                <p className="text-red-600 text-sm">{errorMessage}</p>
              )}
              <Button type="submit" variant="primary" disabled={formState === 'submitting'}>
                {formState === 'submitting' ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          )}
        </motion.div>
      </Container>
    </motion.section>
  )
}
```

**Step 5: Create Embed component**

```typescript
import Container from '@/components/layout/Container'

interface EmbedProps {
  heading?: string
  embedType?: 'video' | 'map' | 'custom'
  embedUrl?: string
  aspectRatio?: '16:9' | '4:3' | '1:1' | '9:16'
}

const aspectClasses: Record<string, string> = {
  '16:9': 'aspect-video',
  '4:3': 'aspect-[4/3]',
  '1:1': 'aspect-square',
  '9:16': 'aspect-[9/16]',
}

export default function Embed({ heading, embedUrl, aspectRatio = '16:9' }: EmbedProps) {
  if (!embedUrl) return null

  return (
    <section className="py-16 sm:py-24">
      <Container>
        {heading && (
          <h2 className="font-serif text-3xl sm:text-4xl text-center mb-12">{heading}</h2>
        )}
        <div className={`relative ${aspectClasses[aspectRatio] || 'aspect-video'} overflow-hidden rounded-sm`}>
          <iframe
            src={embedUrl}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </Container>
    </section>
  )
}
```

**Step 6: Create MenuSection component**

This re-uses the existing menu fetching pattern. Since pageBuilder sections are rendered client-side but the data needs to come from Sanity, the full menu data is fetched in the GROQ query (see Task 19). The component receives pre-fetched data.

```typescript
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@/lib/animations'
import Container from '@/components/layout/Container'
import MenuItem from '@/components/ui/MenuItem'

interface MenuSectionProps {
  heading?: string
  description?: string
  categories?: Array<{
    _id: string
    name: string
    menuSection: string
    description?: string
    items: Array<{
      _id: string
      name: string
      description?: string
      price: string
      dietaryTags?: string[]
    }>
  }>
}

export default function MenuSection({ heading, description, categories }: MenuSectionProps) {
  const sections = [...new Set(categories?.map((c) => c.menuSection) || [])]
  const [activeTab, setActiveTab] = useState(sections[0] || 'food')

  if (!categories || categories.length === 0) return null

  const filteredCategories = categories.filter((c) => c.menuSection === activeTab)

  return (
    <motion.section
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      className="py-20 sm:py-28"
    >
      <Container>
        <motion.h2 variants={fadeInUp} className="font-serif text-3xl sm:text-4xl text-center mb-4">
          {heading || 'Our Menu'}
        </motion.h2>
        {description && (
          <motion.p variants={fadeInUp} className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            {description}
          </motion.p>
        )}

        {sections.length > 1 && (
          <motion.div variants={fadeInUp} className="flex justify-center gap-4 mb-12">
            {sections.map((section) => (
              <button
                key={section}
                onClick={() => setActiveTab(section)}
                className={`px-4 py-2 text-sm uppercase tracking-wider transition-colors ${
                  activeTab === section ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {section}
              </button>
            ))}
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {filteredCategories.map((category) => (
              <div key={category._id} className="mb-12 last:mb-0">
                <h3 className="font-serif text-2xl mb-2">{category.name}</h3>
                {category.description && (
                  <p className="text-muted-foreground mb-6">{category.description}</p>
                )}
                <div className="space-y-4">
                  {category.items.map((item) => (
                    <MenuItem
                      key={item._id}
                      name={item.name}
                      price={`$${item.price}`}
                      description={item.description || ''}
                      dietaryTags={item.dietaryTags}
                    />
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </Container>
    </motion.section>
  )
}
```

**Step 7: Create LogoBar component**

```typescript
import Container from '@/components/layout/Container'
import SanityImage from '@/components/sanity/SanityImage'

interface LogoBarProps {
  heading?: string
  logos?: Array<{
    _key: string
    asset: any
    alt?: string
  }>
}

export default function LogoBar({ heading, logos }: LogoBarProps) {
  if (!logos || logos.length === 0) return null

  return (
    <section className="py-12 sm:py-16 bg-muted">
      <Container>
        {heading && (
          <h2 className="text-sm uppercase tracking-wider text-center text-muted-foreground mb-8">{heading}</h2>
        )}
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
          {logos.map((logo) => (
            <div key={logo._key} className="h-10 sm:h-12 opacity-60 hover:opacity-100 transition-opacity">
              <SanityImage image={logo} alt={logo.alt || ''} height={48} width={120} className="h-full w-auto object-contain" />
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
```

**Step 8: Create StatsBar component**

```typescript
'use client'

import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@/lib/animations'
import Container from '@/components/layout/Container'

interface StatsBarProps {
  stats?: Array<{
    _key: string
    number: string
    label: string
  }>
}

export default function StatsBar({ stats }: StatsBarProps) {
  if (!stats || stats.length === 0) return null

  return (
    <motion.section
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="py-16 sm:py-20 bg-foreground text-background"
    >
      <Container>
        <div className={`grid grid-cols-2 md:grid-cols-${Math.min(stats.length, 4)} gap-8 text-center`}>
          {stats.map((stat) => (
            <motion.div key={stat._key} variants={fadeInUp}>
              <p className="font-serif text-4xl sm:text-5xl font-bold text-primary-light">{stat.number}</p>
              <p className="text-sm uppercase tracking-wider mt-2 opacity-70">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </motion.section>
  )
}
```

**Step 9: Commit**

```bash
git add components/sections/
git commit -m "feat: add FAQ, Team, ImageGallery, ContactForm, Embed, MenuSection, LogoBar, StatsBar section components"
```

---

### Task 17: Create PageBuilder component

**Files:**
- Create: `components/sanity/PageBuilder.tsx`

**Step 1: Create the PageBuilder component**

This component maps each section `_type` to its React component:

```typescript
import Hero from '@/components/sections/Hero'
import SplitContent from '@/components/sections/SplitContent'
import RichText from '@/components/sections/RichText'
import CTA from '@/components/sections/CTA'
import FeaturedMenu from '@/components/sections/FeaturedMenu'
import Testimonials from '@/components/sections/Testimonials'
import FAQ from '@/components/sections/FAQ'
import Team from '@/components/sections/Team'
import ImageGallery from '@/components/sections/ImageGallery'
import ContactForm from '@/components/sections/ContactForm'
import Embed from '@/components/sections/Embed'
import MenuSection from '@/components/sections/MenuSection'
import LogoBar from '@/components/sections/LogoBar'
import StatsBar from '@/components/sections/StatsBar'

const sectionComponents: Record<string, React.ComponentType<any>> = {
  sectionHero: Hero,
  sectionSplitContent: SplitContent,
  sectionRichText: RichText,
  sectionCta: CTA,
  sectionFeaturedMenu: FeaturedMenu,
  sectionTestimonials: Testimonials,
  sectionFaq: FAQ,
  sectionTeam: Team,
  sectionImageGallery: ImageGallery,
  sectionContactForm: ContactForm,
  sectionEmbed: Embed,
  sectionMenuSection: MenuSection,
  sectionLogoBar: LogoBar,
  sectionStatsBar: StatsBar,
}

interface PageBuilderProps {
  sections?: Array<{ _type: string; _key: string; [key: string]: any }>
}

export default function PageBuilder({ sections }: PageBuilderProps) {
  if (!sections || sections.length === 0) return null

  return (
    <>
      {sections.map((section) => {
        const Component = sectionComponents[section._type]
        if (!Component) {
          console.warn(`Unknown section type: ${section._type}`)
          return null
        }
        return <Component key={section._key} {...section} />
      })}
    </>
  )
}
```

**Step 2: Commit**

```bash
git add components/sanity/PageBuilder.tsx
git commit -m "feat: add PageBuilder component mapping section types to React components"
```

---

### Task 18: Update home page to use PageBuilder

**Files:**
- Modify: `app/page.tsx`
- Keep (do not delete yet): `app/HomePageSections.tsx`

**Step 1: Update app/page.tsx**

Replace the entire contents of `app/page.tsx` with:

```typescript
import { sanityFetch } from '@/sanity/lib/live'
import { SITE_SETTINGS_QUERY, HOME_PAGE_QUERY } from '@/sanity/lib/queries'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import PageBuilder from '@/components/sanity/PageBuilder'

export default async function HomePage() {
  const [{ data: settings }, { data: page }] = await Promise.all([
    sanityFetch({ query: SITE_SETTINGS_QUERY }),
    sanityFetch({ query: HOME_PAGE_QUERY }),
  ])

  return (
    <>
      <Header siteSettings={settings} />
      <main>
        <PageBuilder sections={page?.pageBuilder} />
      </main>
      <Footer siteSettings={settings} />
    </>
  )
}
```

Note: Keep `app/HomePageSections.tsx` around for reference until everything is confirmed working, then delete it.

**Step 2: Commit**

```bash
git add app/page.tsx
git commit -m "feat: update home page to use PageBuilder instead of HomePageSections"
```

---

## Phase 7: GROQ Queries and Types

### Task 19: Update GROQ queries

**Files:**
- Modify: `sanity/lib/queries.ts`

**Step 1: Replace queries**

Replace the entire contents of `sanity/lib/queries.ts` with:

```typescript
import { defineQuery } from 'next-sanity'

// ─── Shared fragment: resolve all section types inside pageBuilder ───
// This GROQ fragment expands references within each section type.
const PAGE_BUILDER_PROJECTION = `
  pageBuilder[] {
    _type,
    _key,
    // sectionHero
    _type == "sectionHero" => {
      eyebrow, heading, subheading, image, cta, layout
    },
    // sectionSplitContent
    _type == "sectionSplitContent" => {
      heading, body, image, imagePosition, cta
    },
    // sectionRichText
    _type == "sectionRichText" => {
      body
    },
    // sectionCta
    _type == "sectionCta" => {
      heading, body, cta, backgroundImage
    },
    // sectionFeaturedMenu
    _type == "sectionFeaturedMenu" => {
      heading,
      items[]-> {
        _id, name, description, price, image, dietaryTags,
        category-> { name }
      }
    },
    // sectionTestimonials
    _type == "sectionTestimonials" => {
      heading,
      testimonials[]-> {
        _id, author, quote, rating, source
      }
    },
    // sectionFaq
    _type == "sectionFaq" => {
      heading,
      faqItems[]-> {
        _id, question, answer
      }
    },
    // sectionTeam
    _type == "sectionTeam" => {
      heading, subheading,
      teamMembers[]-> {
        _id, name, role, image
      }
    },
    // sectionImageGallery
    _type == "sectionImageGallery" => {
      heading,
      images[]-> {
        _id, image, alt, caption
      }
    },
    // sectionContactForm
    _type == "sectionContactForm" => {
      heading, subheading
    },
    // sectionEmbed
    _type == "sectionEmbed" => {
      heading, embedType, embedUrl, aspectRatio
    },
    // sectionMenuSection — fetch full menu data inline
    _type == "sectionMenuSection" => {
      heading, description,
      "categories": *[_type == "menuCategory"] | order(order asc) {
        _id, name, menuSection, description,
        "items": *[_type == "menuItem" && references(^._id) && available != false] | order(order asc) {
          _id, name, description, price, dietaryTags
        }
      }
    },
    // sectionLogoBar
    _type == "sectionLogoBar" => {
      heading, logos
    },
    // sectionStatsBar
    _type == "sectionStatsBar" => {
      stats
    }
  }
`

// ─── Site Settings ──────────────────────────────────────────────
export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings"][0] {
    name,
    tagline,
    logo,
    logoAlt,
    phone,
    email,
    address,
    location,
    hours,
    socialLinks,
    reservationUrl,
    seo
  }
`)

// ─── Header ─────────────────────────────────────────────────────
export const HEADER_QUERY = defineQuery(`
  *[_type == "header"][0] {
    navigation,
    cta
  }
`)

// ─── Footer ─────────────────────────────────────────────────────
export const FOOTER_QUERY = defineQuery(`
  *[_type == "footer"][0] {
    tagline,
    columns,
    copyrightText
  }
`)

// ─── Redirects ──────────────────────────────────────────────────
export const REDIRECTS_QUERY = defineQuery(`
  *[_type == "redirects"][0] {
    rules
  }
`)

// ─── Home Page ──────────────────────────────────────────────────
export const HOME_PAGE_QUERY = defineQuery(`
  *[_type == "homePage"][0] {
    ${PAGE_BUILDER_PROJECTION},
    seo
  }
`)

// ─── Page by URI ────────────────────────────────────────────────
export const PAGE_BY_URI_QUERY = defineQuery(`
  *[_type == "page" && uri == $uri][0] {
    title,
    uri,
    ${PAGE_BUILDER_PROJECTION},
    seo
  }
`)

// ─── Menu ───────────────────────────────────────────────────────
export const MENU_QUERY = defineQuery(`
  {
    "categories": *[_type == "menuCategory"] | order(order asc) {
      _id,
      name,
      slug,
      description,
      menuSection,
      "items": *[_type == "menuItem" && references(^._id) && available != false] | order(order asc) {
        _id,
        name,
        description,
        price,
        image,
        dietaryTags
      }
    }
  }
`)

// ─── About Page ─────────────────────────────────────────────────
export const ABOUT_PAGE_QUERY = defineQuery(`
  {
    "page": *[_type == "page" && (uri == "/about" || slug.current == "about")][0] {
      title,
      uri,
      ${PAGE_BUILDER_PROJECTION},
      body,
      seo
    },
    "team": *[_type == "teamMember"] | order(order asc) {
      _id,
      name,
      role,
      bio,
      image
    },
    "gallery": *[_type == "galleryImage"] | order(order asc) {
      _id,
      image,
      alt,
      caption
    }
  }
`)

// ─── FAQ ────────────────────────────────────────────────────────
export const FAQ_QUERY = defineQuery(`
  *[_type == "faqItem"] | order(order asc) {
    _id,
    question,
    answer,
    category
  }
`)

// ─── Generic Page (Privacy, etc.) — legacy slug support ─────────
export const PAGE_QUERY = defineQuery(`
  *[_type == "page" && slug.current == $slug][0] {
    title,
    body,
    ${PAGE_BUILDER_PROJECTION},
    seo
  }
`)

// ─── Sitemap ────────────────────────────────────────────────────
export const SITEMAP_QUERY = defineQuery(`
  *[_type == "page" && (defined(uri) || defined(slug.current))] {
    "path": coalesce(uri, "/" + slug.current),
    _updatedAt
  }
`)
```

**Step 2: Commit**

```bash
git add sanity/lib/queries.ts
git commit -m "feat: update GROQ queries for pageBuilder, header, footer, redirects"
```

---

### Task 20: Update TypeScript types

**Files:**
- Modify: `types/index.ts`

**Step 1: Add section and global config types**

Add the following after the existing `Page` interface (before the "Component Props Types" section, around line 215):

```typescript
// =============================================================================
// Section Types (Page Builder)
// =============================================================================

/** CTA (call to action) button object */
export interface CTA {
  _type: 'cta'
  label: string
  href: string
}

/** Hero section */
export interface SectionHero {
  _type: 'sectionHero'
  _key: string
  eyebrow?: string
  heading: string
  subheading?: string
  image?: SanityImage
  cta?: CTA
  layout?: 'centered' | 'left' | 'split'
}

/** Split content section */
export interface SectionSplitContent {
  _type: 'sectionSplitContent'
  _key: string
  heading?: string
  body?: PortableTextBlock
  image?: SanityImage
  imagePosition?: 'left' | 'right'
  cta?: CTA
}

/** Rich text section */
export interface SectionRichText {
  _type: 'sectionRichText'
  _key: string
  body: PortableTextBlock
}

/** CTA section */
export interface SectionCta {
  _type: 'sectionCta'
  _key: string
  heading?: string
  body?: string
  cta?: CTA
  backgroundImage?: SanityImage
}

/** Featured menu section */
export interface SectionFeaturedMenu {
  _type: 'sectionFeaturedMenu'
  _key: string
  heading?: string
  items?: MenuItem[]
}

/** Testimonials section */
export interface SectionTestimonials {
  _type: 'sectionTestimonials'
  _key: string
  heading?: string
  testimonials?: Testimonial[]
}

/** FAQ section */
export interface SectionFaq {
  _type: 'sectionFaq'
  _key: string
  heading?: string
  faqItems?: FAQItem[]
}

/** Team section */
export interface SectionTeam {
  _type: 'sectionTeam'
  _key: string
  heading?: string
  subheading?: string
  teamMembers?: TeamMember[]
}

/** Image gallery section */
export interface SectionImageGallery {
  _type: 'sectionImageGallery'
  _key: string
  heading?: string
  images?: GalleryImage[]
}

/** Contact form section */
export interface SectionContactForm {
  _type: 'sectionContactForm'
  _key: string
  heading?: string
  subheading?: string
}

/** Embed section */
export interface SectionEmbed {
  _type: 'sectionEmbed'
  _key: string
  heading?: string
  embedType?: 'video' | 'map' | 'custom'
  embedUrl?: string
  aspectRatio?: '16:9' | '4:3' | '1:1' | '9:16'
}

/** Full menu section */
export interface SectionMenuSection {
  _type: 'sectionMenuSection'
  _key: string
  heading?: string
  description?: string
  categories?: MenuCategory[]
}

/** Logo bar section */
export interface SectionLogoBar {
  _type: 'sectionLogoBar'
  _key: string
  heading?: string
  logos?: Array<SanityImage & { alt?: string }>
}

/** Stats bar section */
export interface SectionStatsBar {
  _type: 'sectionStatsBar'
  _key: string
  stats?: Array<{ _key: string; number: string; label: string }>
}

/** Union of all section types */
export type PageBuilderSection =
  | SectionHero
  | SectionSplitContent
  | SectionRichText
  | SectionCta
  | SectionFeaturedMenu
  | SectionTestimonials
  | SectionFaq
  | SectionTeam
  | SectionImageGallery
  | SectionContactForm
  | SectionEmbed
  | SectionMenuSection
  | SectionLogoBar
  | SectionStatsBar

// =============================================================================
// Global Config Types
// =============================================================================

/** Header singleton */
export interface Header {
  _id: string
  _type: 'header'
  navigation?: Array<{ _key: string; label: string; href: string }>
  cta?: CTA
}

/** Footer singleton */
export interface Footer {
  _id: string
  _type: 'footer'
  tagline?: string
  columns?: Array<{
    _key: string
    title: string
    links?: Array<{ _key: string; label: string; href: string }>
  }>
  copyrightText?: string
}

/** Redirects singleton */
export interface Redirects {
  _id: string
  _type: 'redirects'
  rules?: Array<{
    _key: string
    source: string
    destination: string
    permanent?: boolean
  }>
}

/** Submission document */
export interface Submission {
  _id: string
  _type: 'submission'
  name?: string
  email?: string
  phone?: string
  message?: string
  page?: string
  source?: string
  submittedAt?: string
}
```

Also update the existing `HomePage` interface (lines 105-131) to:

```typescript
/** Home Page — with pageBuilder */
export interface HomePage {
  _id: string
  _type: 'homePage'
  pageBuilder?: PageBuilderSection[]
  seo?: SEO
}
```

And update the `Page` interface (lines 208-215) to:

```typescript
/** Generic Page — with pageBuilder + uri */
export interface Page {
  _id: string
  _type: 'page'
  title: string
  slug?: SanitySlug
  uri?: string
  body?: PortableTextBlock
  pageBuilder?: PageBuilderSection[]
  seo?: SEO
}
```

**Step 2: Commit**

```bash
git add types/index.ts
git commit -m "feat: add TypeScript types for sections, pageBuilder, header, footer, redirects, submission"
```

---

### Task 21: Run typegen and verify build

**Step 1: Run typegen**

```bash
npm run typegen
```

Expected: Types regenerated without errors.

**Step 2: Run typecheck**

```bash
npm run typecheck
```

Expected: No TypeScript errors. If there are errors, fix them.

**Step 3: Run lint**

```bash
npm run lint
```

Expected: No lint errors.

**Step 4: Run build**

```bash
npm run build
```

Expected: Build succeeds. If there are issues, they'll likely be related to:
- Import path mismatches
- Missing type annotations
- GROQ query syntax

Fix any issues found.

**Step 5: Commit fixes if any**

```bash
git add -A
git commit -m "fix: resolve build errors after page builder migration"
```

---

### Task 22: Clean up — delete HomePageSections

**Files:**
- Delete: `app/HomePageSections.tsx`

**Step 1: Verify home page works with PageBuilder**

Open `http://localhost:3000` and confirm sections render correctly. If this is a CI-only environment, confirm the build passed in Task 21.

**Step 2: Delete the old component**

```bash
rm app/HomePageSections.tsx
```

**Step 3: Commit**

```bash
git add app/HomePageSections.tsx
git commit -m "chore: remove legacy HomePageSections component"
```

---

### Task 23: Update CLAUDE.md

**Files:**
- Modify: `CLAUDE.md`

**Step 1: Update the documentation**

Update the following sections in CLAUDE.md:

1. In **File Structure**, add:
```
sanity/
├── structure/
│   └── index.ts              # Custom desk structure
├── schemaTypes/
│   ├── builders/
│   │   └── pageBuilder.ts    # Reusable pageBuilder field
│   ├── objects/
│   │   ├── sections/         # 14 section types for page builder
│   │   │   ├── sectionHero.ts
│   │   │   ├── sectionSplitContent.ts
│   │   │   ├── sectionRichText.ts
│   │   │   ├── sectionCta.ts
│   │   │   ├── sectionFeaturedMenu.ts
│   │   │   ├── sectionTestimonials.ts
│   │   │   ├── sectionFaq.ts
│   │   │   ├── sectionTeam.ts
│   │   │   ├── sectionImageGallery.ts
│   │   │   ├── sectionContactForm.ts
│   │   │   ├── sectionEmbed.ts
│   │   │   ├── sectionMenuSection.ts
│   │   │   ├── sectionLogoBar.ts
│   │   │   └── sectionStatsBar.ts
│   │   └── cta.ts            # Shared CTA object
│   ├── singletons/
│   │   ├── header.ts         # Navigation config
│   │   ├── footer.ts         # Footer config
│   │   └── redirects.ts      # Redirect rules
│   └── documents/
│       └── submission.ts     # Form submissions (read-only)
components/
├── sections/                  # Section components for PageBuilder
│   ├── Hero.tsx
│   ├── SplitContent.tsx
│   ├── RichText.tsx
│   ├── CTA.tsx
│   ├── FeaturedMenu.tsx
│   ├── Testimonials.tsx
│   ├── FAQ.tsx
│   ├── Team.tsx
│   ├── ImageGallery.tsx
│   ├── ContactForm.tsx
│   ├── Embed.tsx
│   ├── MenuSection.tsx
│   ├── LogoBar.tsx
│   └── StatsBar.tsx
├── sanity/
│   └── PageBuilder.tsx        # Maps section._type to React components
```

2. Update the **Key Patterns** section to add a "Page Builder Pattern" subsection describing how pages use `<PageBuilder sections={page?.pageBuilder} />`.

3. Update **Adding a New Page** to reference the pageBuilder pattern.

**Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: update CLAUDE.md with page builder architecture"
```

---

## Summary

| Phase | Tasks | What It Builds |
|-------|-------|----------------|
| 1 | 1 | Custom desk structure |
| 2 | 2-6 | 14 section schemas + pageBuilder field + CTA object |
| 3 | 7-8 | Updated homePage + page schemas |
| 4 | 9-10 | header, footer, redirects singletons |
| 5 | 11-12 | submission document + API update |
| 6 | 13-18 | 14 section components + PageBuilder + home page update |
| 7 | 19-23 | GROQ queries, types, build verification, cleanup |

**Total: 23 tasks across 7 phases.**
