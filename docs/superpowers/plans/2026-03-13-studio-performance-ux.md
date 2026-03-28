# Studio Performance & Client UX Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Isolate the Sanity Studio from the site's root layout to eliminate refreshing, fix Presentation tool draft mode, and polish all schemas for non-technical clients.

**Architecture:** Route groups separate site and studio into independent root layouts. Schema changes are field-level only (descriptions, placeholders, validation, groups, orderings). No desk structure changes.

**Tech Stack:** Next.js 14 App Router (route groups), Sanity v3 schemas

**Spec:** `docs/superpowers/specs/2026-03-13-studio-performance-ux-design.md`

---

## Chunk 1: Studio Route Isolation

### Task 1: Create route group directories and move studio

**Files:**
- Create: `app/(studio)/layout.tsx`
- Create: `app/(studio)/studio/[[...tool]]/loading.tsx`
- Move: `app/studio/[[...tool]]/page.tsx` → `app/(studio)/studio/[[...tool]]/page.tsx`

- [ ] **Step 1: Create the `(studio)` route group directory structure**

```bash
mkdir -p "app/(studio)/studio/[[...tool]]"
```

- [ ] **Step 2: Move studio page into route group**

```bash
mv app/studio/\[\[...tool\]\]/page.tsx "app/(studio)/studio/[[...tool]]/page.tsx"
rmdir app/studio/\[\[...tool\]\]
rmdir app/studio
```

- [ ] **Step 3: Create `app/(studio)/layout.tsx`**

```tsx
import type { Metadata } from 'next'
import '../globals.css'

export const metadata: Metadata = {
  title: 'Studio',
}

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

- [ ] **Step 4: Create `app/(studio)/studio/[[...tool]]/loading.tsx`**

```tsx
export default function StudioLoading() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#101112',
      fontFamily: 'system-ui, sans-serif',
    }}>
      <div style={{ color: '#8a8a8a', fontSize: '14px' }}>
        Loading Studio…
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add "app/(studio)"
git add -u app/studio
git commit -m "feat: isolate studio into (studio) route group with bare-bones layout"
```

---

### Task 2: Move site routes into (site) route group

**Files:**
- Create: `app/(site)/layout.tsx` (moved from `app/layout.tsx`)
- Move: all site routes into `app/(site)/`
- Keep: `app/globals.css` and `app/not-found.tsx` at root

- [ ] **Step 1: Create the `(site)` directory**

```bash
mkdir -p "app/(site)"
```

- [ ] **Step 2: Move layout.tsx and update globals.css import**

```bash
mv app/layout.tsx "app/(site)/layout.tsx"
```

Then edit `app/(site)/layout.tsx` — change the import path:

Old:
```tsx
import "./globals.css";
```

New:
```tsx
import "../globals.css";
```

- [ ] **Step 3: Move all site routes into (site)**

```bash
mv app/page.tsx "app/(site)/"
mv app/\[slug\] "app/(site)/"
mv app/blog "app/(site)/"
mv app/contact "app/(site)/"
mv app/faq "app/(site)/"
mv app/preview "app/(site)/"
mv app/api "app/(site)/"
mv app/sitemap.ts "app/(site)/"
mv app/robots.ts "app/(site)/"
mv app/llms.txt "app/(site)/"
mv app/llms-full.txt "app/(site)/"
```

- [ ] **Step 4: Create a minimal root `app/layout.tsx`**

Since `not-found.tsx` stays at the app root (outside both route groups), Next.js still requires a root layout. Create a minimal one:

```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

This only renders for files at the app root (i.e., `not-found.tsx`). The `(site)` and `(studio)` route groups have their own root layouts that override this.

- [ ] **Step 5: Verify `app/not-found.tsx` and `app/globals.css` stay at root**

```bash
ls app/not-found.tsx app/globals.css app/layout.tsx
```

Expected: all three files exist at root level.

- [ ] **Step 6: Verify build compiles**

```bash
npm run build
```

Expected: successful build, no import errors.

- [ ] **Step 7: Commit**

```bash
git add -A app/
git commit -m "feat: move site routes into (site) route group for layout isolation"
```

---

### Task 3: Fix Presentation tool draft mode config

**Files:**
- Modify: `sanity.config.ts:22-28`

- [ ] **Step 1: Add disable endpoint to presentationTool config**

In `sanity.config.ts`, change:

```ts
    presentationTool({
      previewUrl: {
        draftMode: {
          enable: '/api/draft/enable',
        },
      },
    }),
```

To:

```ts
    presentationTool({
      previewUrl: {
        draftMode: {
          enable: '/api/draft/enable',
          disable: '/api/draft/disable',
        },
      },
    }),
```

- [ ] **Step 2: Verify build still compiles**

```bash
npm run build
```

- [ ] **Step 3: Commit**

```bash
git add sanity.config.ts
git commit -m "fix: add draft mode disable endpoint to presentationTool config"
```

---

## Chunk 2: Schema UX — Array Limits & Validation

### Task 4: Add array max limits to section schemas

**Files:**
- Modify: `sanity/schemaTypes/sections/featureGrid.ts:26`
- Modify: `sanity/schemaTypes/sections/logoBar.ts:18`
- Modify: `sanity/schemaTypes/sections/statsBar.ts:13`
- Modify: `sanity/schemaTypes/sections/testimonialCarousel.ts:19`
- Modify: `sanity/schemaTypes/sections/blogGrid.ts:39`

- [ ] **Step 1: Add `validation: (Rule) => Rule.max(12)` to featureGrid.features**

In `sanity/schemaTypes/sections/featureGrid.ts`, add validation to the `features` field:

```ts
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      description: 'List of features to display in the grid',
      validation: (Rule) => Rule.max(12),
      of: [
```

- [ ] **Step 2: Add `validation: (Rule) => Rule.max(20)` to logoBar.logos**

In `sanity/schemaTypes/sections/logoBar.ts`, add validation to the `logos` field:

```ts
    defineField({
      name: 'logos',
      title: 'Logos',
      type: 'array',
      description: 'Company or partner logos to display',
      validation: (Rule) => Rule.max(20),
      of: [
```

- [ ] **Step 3: Add `validation: (Rule) => Rule.max(6)` to statsBar.stats**

In `sanity/schemaTypes/sections/statsBar.ts`, add validation to the `stats` field:

```ts
    defineField({
      name: 'stats',
      title: 'Stats',
      type: 'array',
      description: 'Statistics to display in a horizontal bar',
      validation: (Rule) => Rule.max(6),
      of: [
```

- [ ] **Step 4: Add `validation: (Rule) => Rule.max(12)` to testimonialCarousel.testimonials**

In `sanity/schemaTypes/sections/testimonialCarousel.ts`, change the existing validation:

Old:
```ts
      validation: (Rule) => Rule.unique(),
```

New:
```ts
      validation: (Rule) => Rule.unique().max(12),
```

- [ ] **Step 5: Add `validation: (Rule) => Rule.max(12)` to blogGrid.posts**

In `sanity/schemaTypes/sections/blogGrid.ts`, add validation to the `posts` field:

```ts
    defineField({
      name: 'posts',
      title: 'Posts',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'blogPost' }] })],
      hidden: ({ parent }) => parent?.source !== 'manual',
      validation: (Rule) => Rule.max(12),
    }),
```

- [ ] **Step 6: Commit**

```bash
git add sanity/schemaTypes/sections/featureGrid.ts sanity/schemaTypes/sections/logoBar.ts sanity/schemaTypes/sections/statsBar.ts sanity/schemaTypes/sections/testimonialCarousel.ts sanity/schemaTypes/sections/blogGrid.ts
git commit -m "feat: add array max limits to section schemas"
```

---

### Task 5: Add array max limits to singletons and objects

**Files:**
- Modify: `sanity/schemaTypes/singletons/header.ts:18-19`
- Modify: `sanity/schemaTypes/singletons/footer.ts:13,22`
- Modify: `sanity/schemaTypes/singletons/siteSettings.ts:28`
- Modify: `sanity/schemaTypes/objects/megaMenuGroup.ts:22`
- Modify: `sanity/schemaTypes/objects/portableText.ts:175`

- [ ] **Step 1: Add max limits to header arrays**

In `sanity/schemaTypes/singletons/header.ts`:

Add to `megaNavigation` field:
```ts
      validation: (Rule) => Rule.max(8),
```

Add to `secondaryNavigation` field:
```ts
      validation: (Rule) => Rule.max(6),
```

- [ ] **Step 2: Add max limits to footer arrays**

In `sanity/schemaTypes/singletons/footer.ts`:

Add to `columns` field (after `type: 'array'`):
```ts
      validation: (Rule) => Rule.max(5),
```

Add to nested `links` field (inside column object):
```ts
              validation: (Rule) => Rule.max(10),
```

- [ ] **Step 3: Add max limit to siteSettings.socialLinks**

In `sanity/schemaTypes/singletons/siteSettings.ts`, change:

```ts
    defineField({ name: 'socialLinks', title: 'Social Media Links', type: 'array', of: [{ type: 'socialLink' }] }),
```

To:

```ts
    defineField({ name: 'socialLinks', title: 'Social Media Links', type: 'array', of: [{ type: 'socialLink' }], validation: (Rule) => Rule.max(10) }),
```

- [ ] **Step 4: Add max limit to megaMenuGroup.children**

In `sanity/schemaTypes/objects/megaMenuGroup.ts`, add to `children` field:

```ts
      validation: (Rule) => Rule.max(10),
```

- [ ] **Step 5: Add max limit to portableText buttonGroup.buttons**

In `sanity/schemaTypes/objects/portableText.ts`, add validation to the `buttons` field inside `buttonGroup` (around line 175):

```ts
        defineField({
          name: 'buttons',
          title: 'Buttons',
          type: 'array',
          validation: (Rule) => Rule.max(4),
          of: [
```

- [ ] **Step 6: Commit**

```bash
git add sanity/schemaTypes/singletons/header.ts sanity/schemaTypes/singletons/footer.ts sanity/schemaTypes/singletons/siteSettings.ts sanity/schemaTypes/objects/megaMenuGroup.ts sanity/schemaTypes/objects/portableText.ts
git commit -m "feat: add array max limits to singletons and objects"
```

---

### Task 6: Add hex color validation and update descriptions

**Files:**
- Modify: `sanity/schemaTypes/documents/category.ts:36-40`
- Modify: `sanity/schemaTypes/documents/promoBanner.ts:30-41`
- Modify: `sanity/schemaTypes/sections/ctaBanner.ts:58-69`
- Modify: `sanity/schemaTypes/sections/newsletterSection.ts:37-41`

- [ ] **Step 1: Add validation to category.color**

In `sanity/schemaTypes/documents/category.ts`, change:

```ts
    defineField({
      name: 'color',
      title: 'Color',
      type: 'string',
      description: 'Hex color for category badges (e.g. #B8860B)',
    }),
```

To:

```ts
    defineField({
      name: 'color',
      title: 'Color',
      type: 'string',
      description: 'Hex color for category badges (e.g. #B8860B)',
      placeholder: '#B8860B',
      validation: (Rule) => Rule.custom((value) => {
        if (!value) return true
        return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(value) || 'Must be a valid hex color (e.g. #1A1A1A)'
      }),
    }),
```

- [ ] **Step 2: Add validation to promoBanner color fields**

In `sanity/schemaTypes/documents/promoBanner.ts`, change:

```ts
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      description: 'Hex color for the banner background (e.g. #B8860B)',
      initialValue: '#B8860B',
    }),
    defineField({
      name: 'textColor',
      title: 'Text Color',
      type: 'string',
      description: 'Hex color for the banner text (e.g. #FFFFFF)',
      initialValue: '#FFFFFF',
    }),
```

To:

```ts
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      description: 'Hex color for the banner background (e.g. #B8860B)',
      placeholder: '#B8860B',
      initialValue: '#B8860B',
      validation: (Rule) => Rule.custom((value) => {
        if (!value) return true
        return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(value) || 'Must be a valid hex color (e.g. #1A1A1A)'
      }),
    }),
    defineField({
      name: 'textColor',
      title: 'Text Color',
      type: 'string',
      description: 'Hex color for the banner text (e.g. #FFFFFF)',
      placeholder: '#FFFFFF',
      initialValue: '#FFFFFF',
      validation: (Rule) => Rule.custom((value) => {
        if (!value) return true
        return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(value) || 'Must be a valid hex color (e.g. #1A1A1A)'
      }),
    }),
```

- [ ] **Step 3: Add validation to ctaBanner color fields and update descriptions**

In `sanity/schemaTypes/sections/ctaBanner.ts`, change:

```ts
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      description: 'CSS color value for the banner background (e.g. #1A1A1A)',
    }),
    defineField({
      name: 'textColor',
      title: 'Text Color',
      type: 'string',
      description: 'CSS color value for the banner text (e.g. #FFFFFF)',
    }),
```

To:

```ts
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      description: 'Hex color for the banner background (e.g. #1A1A1A)',
      placeholder: '#1A1A1A',
      validation: (Rule) => Rule.custom((value) => {
        if (!value) return true
        return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(value) || 'Must be a valid hex color (e.g. #1A1A1A)'
      }),
    }),
    defineField({
      name: 'textColor',
      title: 'Text Color',
      type: 'string',
      description: 'Hex color for the banner text (e.g. #FFFFFF)',
      placeholder: '#FFFFFF',
      validation: (Rule) => Rule.custom((value) => {
        if (!value) return true
        return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(value) || 'Must be a valid hex color (e.g. #1A1A1A)'
      }),
    }),
```

- [ ] **Step 4: Add validation to newsletterSection.backgroundColor**

In `sanity/schemaTypes/sections/newsletterSection.ts`, change:

```ts
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      description: 'Optional hex background color',
    }),
```

To:

```ts
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      description: 'Optional hex background color (e.g. #1A1A1A)',
      placeholder: '#1A1A1A',
      validation: (Rule) => Rule.custom((value) => {
        if (!value) return true
        return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(value) || 'Must be a valid hex color (e.g. #1A1A1A)'
      }),
    }),
```

- [ ] **Step 5: Commit**

```bash
git add sanity/schemaTypes/documents/category.ts sanity/schemaTypes/documents/promoBanner.ts sanity/schemaTypes/sections/ctaBanner.ts sanity/schemaTypes/sections/newsletterSection.ts
git commit -m "feat: add hex color validation to all color fields"
```

---

### Task 7: Add validation warnings for character limits

**Files:**
- Modify: `sanity/schemaTypes/sections/hero.ts:13,19`
- Modify: `sanity/schemaTypes/sections/featureGrid.ts:32,34`
- Modify: `sanity/schemaTypes/sections/ctaBanner.ts:14`
- Modify: `sanity/schemaTypes/documents/blogPost.ts:20`
- Modify: `sanity/schemaTypes/documents/category.ts:13`
- Modify: `sanity/schemaTypes/documents/testimonial.ts:11`
- Modify: `sanity/schemaTypes/documents/promoBanner.ts:19`
- Modify: `sanity/schemaTypes/singletons/siteSettings.ts:11`

- [ ] **Step 1: Add warnings to hero fields**

In `sanity/schemaTypes/sections/hero.ts`:

Change headline validation from:
```ts
      validation: (Rule) => Rule.required(),
```
To:
```ts
      validation: (Rule) => Rule.required().max(80).warning('Keep under 80 characters for best display'),
```

Add validation to subheadline:
```ts
      validation: (Rule) => Rule.max(200).warning('Keep under 200 characters for readability'),
```

- [ ] **Step 2: Add warnings to featureGrid inline fields**

In `sanity/schemaTypes/sections/featureGrid.ts`:

Change feature title validation from:
```ts
            defineField({ name: 'title', title: 'Title', type: 'string', description: 'Feature name', validation: (Rule) => Rule.required() }),
```
To:
```ts
            defineField({ name: 'title', title: 'Title', type: 'string', description: 'Feature name', validation: (Rule) => Rule.required().max(40).warning('Keep under 40 characters to fit the grid') }),
```

Change feature description:
```ts
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 3, description: 'Short explanation of this feature', validation: (Rule) => Rule.max(120).warning('Keep under 120 characters for readability') }),
```

- [ ] **Step 3: Add warning to ctaBanner heading**

In `sanity/schemaTypes/sections/ctaBanner.ts`, change heading validation:

From:
```ts
      validation: (Rule) => Rule.required(),
```
To:
```ts
      validation: (Rule) => Rule.required().max(60).warning('Keep under 60 characters for impact'),
```

- [ ] **Step 4: Add warning to blogPost title**

In `sanity/schemaTypes/documents/blogPost.ts`, change title validation:

From:
```ts
      validation: (Rule) => Rule.required(),
```
(the first one, in the `title` field at line 20)

To:
```ts
      validation: (Rule) => Rule.required().max(70).warning('Keep under 70 characters for SEO'),
```

- [ ] **Step 5: Add warning to category title**

In `sanity/schemaTypes/documents/category.ts`, change title validation:

From:
```ts
      validation: (Rule) => Rule.required(),
```
(the first one, for the `title` field)

To:
```ts
      validation: (Rule) => Rule.required().max(30).warning('Keep under 30 characters'),
```

- [ ] **Step 6: Add warning to testimonial quote**

In `sanity/schemaTypes/documents/testimonial.ts`, change quote validation:

From:
```ts
    defineField({ name: 'quote', title: 'Quote', type: 'text', rows: 4, validation: (Rule) => Rule.required() }),
```
To:
```ts
    defineField({ name: 'quote', title: 'Quote', type: 'text', rows: 4, validation: (Rule) => Rule.required().max(300).warning('Keep under 300 characters for readability') }),
```

- [ ] **Step 7: Add warning to promoBanner CTA text**

In `sanity/schemaTypes/documents/promoBanner.ts`, change ctaText:

From:
```ts
    defineField({
      name: 'ctaText',
      title: 'CTA Text',
      type: 'string',
      description: 'Optional call-to-action link text',
    }),
```
To:
```ts
    defineField({
      name: 'ctaText',
      title: 'CTA Text',
      type: 'string',
      description: 'Optional call-to-action link text',
      validation: (Rule) => Rule.max(25).warning('Keep under 25 characters for button sizing'),
    }),
```

- [ ] **Step 8: Add warning to siteSettings tagline**

In `sanity/schemaTypes/singletons/siteSettings.ts`, change tagline:

From:
```ts
    defineField({ name: 'tagline', title: 'Tagline', type: 'string', description: 'Short tagline shown in header or hero' }),
```
To:
```ts
    defineField({ name: 'tagline', title: 'Tagline', type: 'string', description: 'Short tagline shown in header or hero', validation: (Rule) => Rule.max(120).warning('Keep under 120 characters') }),
```

- [ ] **Step 9: Commit**

```bash
git add sanity/schemaTypes/sections/hero.ts sanity/schemaTypes/sections/featureGrid.ts sanity/schemaTypes/sections/ctaBanner.ts sanity/schemaTypes/documents/blogPost.ts sanity/schemaTypes/documents/category.ts sanity/schemaTypes/documents/testimonial.ts sanity/schemaTypes/documents/promoBanner.ts sanity/schemaTypes/singletons/siteSettings.ts
git commit -m "feat: add character limit warnings to guide content length"
```

---

## Chunk 3: Schema UX — Descriptions, Placeholders & Orderings

### Task 8: Add descriptions and placeholders to section schemas

**Files:**
- Modify: `sanity/schemaTypes/sections/splitContent.ts`
- Modify: `sanity/schemaTypes/sections/contactForm.ts`
- Modify: `sanity/schemaTypes/sections/embed.ts`
- Modify: `sanity/schemaTypes/sections/blogGrid.ts`

- [ ] **Step 1: Update splitContent.ts**

Replace the fields array content in `sanity/schemaTypes/sections/splitContent.ts`:

```ts
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'Section heading displayed beside the image',
      placeholder: 'Your heading here…',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'portableText',
      description: 'Rich text content displayed alongside the image',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Image displayed on one side of the split layout',
    }),
    defineField({
      name: 'imagePosition',
      title: 'Image Position',
      type: 'string',
      description: 'Which side the image appears on',
      options: { list: ['left', 'right'], layout: 'radio' },
      initialValue: 'right',
    }),
    defineField({
      name: 'cta',
      title: 'CTA Button',
      type: 'cta',
      description: 'Optional call-to-action button below the text',
    }),
```

- [ ] **Step 2: Update contactForm.ts**

Replace the fields in `sanity/schemaTypes/sections/contactForm.ts`:

```ts
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'Heading displayed above the contact form',
      placeholder: 'Get in touch…',
    }),
    defineField({
      name: 'subheading',
      title: 'Subheading',
      type: 'string',
      description: 'Supporting text below the heading',
      placeholder: 'We\'d love to hear from you…',
    }),
```

- [ ] **Step 3: Update embed.ts**

Replace the fields in `sanity/schemaTypes/sections/embed.ts`:

```ts
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'Optional heading displayed above the embed',
      placeholder: 'Watch our story…',
    }),
    defineField({
      name: 'embedType',
      title: 'Embed Type',
      type: 'string',
      description: 'The type of content being embedded',
      options: { list: ['video', 'map', 'custom'] },
      initialValue: 'video',
    }),
    defineField({
      name: 'embedUrl',
      title: 'Embed URL',
      type: 'url',
      description: 'The URL of the content to embed (YouTube, Google Maps, etc.)',
      validation: (Rule) => Rule.required(),
    }),
```

- [ ] **Step 4: Update blogGrid.ts**

In `sanity/schemaTypes/sections/blogGrid.ts`, add descriptions and placeholders to the fields that lack them:

Change heading:
```ts
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'Section heading displayed above the blog posts',
      placeholder: 'Latest from the blog…',
    }),
```

Change source:
```ts
    defineField({
      name: 'source',
      title: 'Source',
      type: 'string',
      description: 'How to select which posts appear in this grid',
      options: {
```

- [ ] **Step 5: Commit**

```bash
git add sanity/schemaTypes/sections/splitContent.ts sanity/schemaTypes/sections/contactForm.ts sanity/schemaTypes/sections/embed.ts sanity/schemaTypes/sections/blogGrid.ts
git commit -m "feat: add descriptions and placeholders to section schemas"
```

---

### Task 9: Add descriptions and placeholders to document schemas

**Files:**
- Modify: `sanity/schemaTypes/documents/teamMember.ts`
- Modify: `sanity/schemaTypes/documents/testimonial.ts`
- Modify: `sanity/schemaTypes/documents/faqItem.ts`
- Modify: `sanity/schemaTypes/documents/galleryImage.ts`
- Modify: `sanity/schemaTypes/documents/category.ts`
- Modify: `sanity/schemaTypes/documents/tag.ts`

- [ ] **Step 1: Update teamMember.ts**

Replace fields:

```ts
    defineField({ name: 'name', title: 'Name', type: 'string', description: 'Full name of the team member', placeholder: 'Jane Smith', validation: (Rule) => Rule.required() }),
    defineField({ name: 'role', title: 'Role', type: 'string', description: 'Job title or position', placeholder: 'Head Chef' }),
    defineField({ name: 'bio', title: 'Bio', type: 'portableText', description: 'Short biography displayed on the team page' }),
    defineField({ name: 'image', title: 'Photo', type: 'image', options: { hotspot: true }, description: 'Professional headshot or photo', validation: (Rule) => Rule.required() }),
    defineField({ name: 'order', title: 'Display Order', type: 'number', description: 'Lower numbers appear first (0 = top of list)', initialValue: 0, validation: (Rule) => Rule.integer().min(0) }),
```

- [ ] **Step 2: Update testimonial.ts**

Replace fields:

```ts
    defineField({ name: 'author', title: 'Author Name', type: 'string', description: 'Name of the person who gave this testimonial', placeholder: 'Jane D.', validation: (Rule) => Rule.required() }),
    defineField({ name: 'quote', title: 'Quote', type: 'text', rows: 4, description: 'The testimonial text', placeholder: 'This was an amazing experience…', validation: (Rule) => Rule.required().max(300).warning('Keep under 300 characters for readability') }),
    defineField({ name: 'rating', title: 'Rating', type: 'number', description: 'Star rating from 1 to 5 (optional)', validation: (Rule) => Rule.min(1).max(5).integer() }),
    defineField({ name: 'source', title: 'Source', type: 'string', description: 'Where this review came from (e.g. Google, Yelp)', placeholder: 'Google' }),
    defineField({ name: 'date', title: 'Date', type: 'date', description: 'When this testimonial was received' }),
```

- [ ] **Step 3: Update faqItem.ts**

Replace fields:

```ts
    defineField({ name: 'question', title: 'Question', type: 'string', description: 'The question as a visitor would ask it', placeholder: 'What are your opening hours?', validation: (Rule) => Rule.required() }),
    defineField({ name: 'answer', title: 'Answer', type: 'portableText', description: 'The answer — keep it clear and concise', validation: (Rule) => Rule.required() }),
    defineField({ name: 'category', title: 'Category', type: 'string', description: 'Optional grouping (e.g., "Reservations", "Dietary", "General")', placeholder: 'General' }),
    defineField({ name: 'order', title: 'Display Order', type: 'number', description: 'Lower numbers appear first (0 = top of list)', initialValue: 0, validation: (Rule) => Rule.integer().min(0) }),
```

- [ ] **Step 4: Update galleryImage.ts**

Replace fields:

```ts
    defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true }, description: 'The gallery image — use the hotspot to set the focal point', validation: (Rule) => Rule.required() }),
    defineField({ name: 'alt', title: 'Alt Text', type: 'string', description: 'Describe the image for screen readers (required)', placeholder: 'A cozy dining room with warm lighting…', validation: (Rule) => Rule.required() }),
    defineField({ name: 'caption', title: 'Caption', type: 'string', description: 'Optional caption shown below the image', placeholder: 'Our dining room' }),
    defineField({ name: 'order', title: 'Display Order', type: 'number', description: 'Lower numbers appear first (0 = top of list)', initialValue: 0, validation: (Rule) => Rule.integer().min(0) }),
```

- [ ] **Step 5: Update category.ts**

Add descriptions and placeholders to fields that lack them:

```ts
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Category name displayed on the site',
      placeholder: 'Lifestyle',
      validation: (Rule) => Rule.required().max(30).warning('Keep under 30 characters'),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      description: 'URL-friendly identifier (auto-generated from title)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Brief description of what this category covers',
      placeholder: 'Posts about lifestyle, wellness, and everyday living…',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Category header image (shown on category pages)',
    }),
```

- [ ] **Step 6: Update tag.ts**

Add descriptions:

```ts
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Tag name used for filtering posts',
      placeholder: 'Wellness',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      description: 'URL-friendly identifier (auto-generated from title)',
      validation: (Rule) => Rule.required(),
    }),
```

- [ ] **Step 7: Commit**

```bash
git add sanity/schemaTypes/documents/teamMember.ts sanity/schemaTypes/documents/testimonial.ts sanity/schemaTypes/documents/faqItem.ts sanity/schemaTypes/documents/galleryImage.ts sanity/schemaTypes/documents/category.ts sanity/schemaTypes/documents/tag.ts
git commit -m "feat: add descriptions, placeholders, and initial values to document schemas"
```

---

### Task 10: Add descriptions and placeholders to singletons and objects

**Files:**
- Modify: `sanity/schemaTypes/singletons/siteSettings.ts`
- Modify: `sanity/schemaTypes/singletons/footer.ts`
- Modify: `sanity/schemaTypes/objects/cta.ts`
- Modify: `sanity/schemaTypes/objects/megaMenuGroup.ts`
- Modify: `sanity/schemaTypes/objects/socialLink.ts`
- Modify: `sanity/schemaTypes/objects/openingHours.ts`

- [ ] **Step 1: Update siteSettings.ts**

Add descriptions and placeholders to fields that lack them:

```ts
    defineField({ name: 'name', title: 'Business Name', type: 'string', description: 'Your business name — used in headers, footers, and SEO', placeholder: 'My Business', validation: (Rule) => Rule.required() }),
```

```ts
    defineField({ name: 'phone', title: 'Phone Number', type: 'string', description: 'Main contact phone number', placeholder: '(555) 123-4567' }),
```

Update address fields with descriptions:
```ts
    defineField({
      name: 'address', title: 'Address', type: 'object',
      description: 'Business address displayed in the footer and contact page',
      fields: [
        { name: 'street', title: 'Street', type: 'string', placeholder: '123 Main St' },
        { name: 'city', title: 'City', type: 'string', placeholder: 'New York' },
        { name: 'state', title: 'State', type: 'string', placeholder: 'NY' },
        { name: 'zip', title: 'ZIP Code', type: 'string', placeholder: '10001' },
        { name: 'country', title: 'Country', type: 'string', initialValue: 'US', placeholder: 'US' },
      ],
    }),
```

- [ ] **Step 2: Update footer.ts**

Add descriptions to footer fields:

```ts
    defineField({ name: 'tagline', title: 'Tagline', type: 'string', description: 'Short tagline displayed in the footer area', placeholder: 'Crafted with care since 2020…' }),
```

Add description to `columns`:
```ts
    defineField({
      name: 'columns',
      title: 'Link Columns',
      type: 'array',
      description: 'Groups of links organized into columns in the footer',
      validation: (Rule) => Rule.max(5),
```

Add descriptions to nested link fields:
```ts
                    defineField({ name: 'label', type: 'string', title: 'Label', description: 'Link text shown to visitors', placeholder: 'About Us', validation: (Rule) => Rule.required() }),
                    defineField({ name: 'href', type: 'string', title: 'Link', description: 'URL path or full URL', placeholder: '/about', validation: (Rule) => Rule.required() }),
```

Update copyrightText:
```ts
    defineField({ name: 'copyrightText', title: 'Copyright Text', type: 'string', description: 'Text after the year and business name (e.g. "All rights reserved.")', placeholder: 'All rights reserved.' }),
```

- [ ] **Step 3: Update cta.ts**

Add description and placeholder to label:

```ts
    defineField({
      name: 'label',
      title: 'Button Text',
      type: 'string',
      description: 'Text displayed on the button',
      placeholder: 'Learn more…',
      validation: (Rule) => Rule.required(),
    }),
```

Add placeholder to href:
```ts
    defineField({
      name: 'href',
      title: 'Link',
      type: 'string',
      description: 'Internal path (e.g. /menu) or external URL',
      placeholder: '/about',
      validation: (Rule) => Rule.required(),
    }),
```

- [ ] **Step 4: Update megaMenuGroup.ts**

Add descriptions and placeholders:

```ts
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      description: 'Navigation item text shown in the menu bar',
      placeholder: 'About',
      validation: (Rule) => Rule.required(),
    }),
```

Add description to children:
```ts
    defineField({
      name: 'children',
      title: 'Dropdown Links',
      type: 'array',
      description: 'Links that appear in the dropdown when hovering this menu item',
      validation: (Rule) => Rule.max(10),
```

Add descriptions/placeholders to nested link fields:
```ts
            defineField({ name: 'label', type: 'string', title: 'Label', description: 'Link text', placeholder: 'Our Story', validation: (Rule) => Rule.required() }),
            defineField({ name: 'href', type: 'string', title: 'Link', description: 'URL path or full URL', placeholder: '/about/story', validation: (Rule) => Rule.required() }),
```

- [ ] **Step 5: Update socialLink.ts**

Add descriptions:

```ts
    defineField({
      name: 'platform',
      title: 'Platform',
      type: 'string',
      description: 'Which social media platform this links to',
```

```ts
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      description: 'Full URL to your profile on this platform',
      validation: (Rule) => Rule.required().uri({ scheme: ['http', 'https'] }),
    }),
```

- [ ] **Step 6: Update openingHours.ts**

Add descriptions:

```ts
    defineField({
      name: 'day',
      title: 'Day',
      type: 'string',
      description: 'Day of the week',
```

```ts
    defineField({
      name: 'closed',
      title: 'Closed this day',
      type: 'boolean',
      description: 'Check if the business is closed on this day',
      initialValue: false,
    }),
```

- [ ] **Step 7: Commit**

```bash
git add sanity/schemaTypes/singletons/siteSettings.ts sanity/schemaTypes/singletons/footer.ts sanity/schemaTypes/objects/cta.ts sanity/schemaTypes/objects/megaMenuGroup.ts sanity/schemaTypes/objects/socialLink.ts sanity/schemaTypes/objects/openingHours.ts
git commit -m "feat: add descriptions and placeholders to singletons and objects"
```

---

### Task 11: Add descriptions to portableText custom blocks

**Files:**
- Modify: `sanity/schemaTypes/objects/portableText.ts`

- [ ] **Step 1: Add descriptions to callout fields**

In `sanity/schemaTypes/objects/portableText.ts`, update the callout fields:

```ts
        defineField({
          name: 'type',
          title: 'Type',
          type: 'string',
          description: 'Visual style: Info (blue), Warning (yellow), Success (green), Tip (purple)',
```

```ts
        defineField({ name: 'title', title: 'Title', type: 'string', description: 'Optional callout heading' }),
        defineField({ name: 'body', title: 'Body', type: 'text', rows: 3, description: 'The callout message' }),
```

- [ ] **Step 2: Add description to codeBlock.code**

```ts
        defineField({
          name: 'code',
          title: 'Code',
          type: 'text',
          rows: 10,
          description: 'Paste your code snippet here',
          validation: (Rule) => Rule.required(),
        }),
```

- [ ] **Step 3: Commit**

```bash
git add sanity/schemaTypes/objects/portableText.ts
git commit -m "feat: add descriptions to portableText custom block fields"
```

---

### Task 12: Add document orderings

**Files:**
- Modify: `sanity/schemaTypes/documents/blogPost.ts:115-121`
- Modify: `sanity/schemaTypes/documents/modularPage.ts` (add orderings)
- Modify: `sanity/schemaTypes/documents/category.ts` (add orderings)
- Modify: `sanity/schemaTypes/documents/tag.ts` (add orderings)
- Modify: `sanity/schemaTypes/documents/testimonial.ts` (add orderings)
- Modify: `sanity/schemaTypes/documents/teamMember.ts` (extend orderings)
- Modify: `sanity/schemaTypes/documents/faqItem.ts` (extend orderings)
- Modify: `sanity/schemaTypes/documents/promoBanner.ts` (add orderings)

- [ ] **Step 1: Add orderings to blogPost (extend existing)**

In `sanity/schemaTypes/documents/blogPost.ts`, replace orderings:

```ts
  orderings: [
    { title: 'Published (Newest)', name: 'publishedAtDesc', by: [{ field: 'publishedAt', direction: 'desc' }] },
    { title: 'Published (Oldest)', name: 'publishedAtAsc', by: [{ field: 'publishedAt', direction: 'asc' }] },
    { title: 'Title A-Z', name: 'titleAsc', by: [{ field: 'title', direction: 'asc' }] },
  ],
```

- [ ] **Step 2: Add orderings to modularPage**

In `sanity/schemaTypes/documents/modularPage.ts`, add before `preview`:

```ts
  orderings: [
    { title: 'Title A-Z', name: 'titleAsc', by: [{ field: 'title', direction: 'asc' }] },
    { title: 'Recently Updated', name: 'updatedAtDesc', by: [{ field: '_updatedAt', direction: 'desc' }] },
  ],
```

- [ ] **Step 3: Add orderings to category**

In `sanity/schemaTypes/documents/category.ts`, add before `preview`:

```ts
  orderings: [
    { title: 'Title A-Z', name: 'titleAsc', by: [{ field: 'title', direction: 'asc' }] },
    { title: 'Display Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
```

- [ ] **Step 4: Add orderings to tag**

In `sanity/schemaTypes/documents/tag.ts`, add before `preview`:

```ts
  orderings: [
    { title: 'Title A-Z', name: 'titleAsc', by: [{ field: 'title', direction: 'asc' }] },
  ],
```

- [ ] **Step 5: Add orderings to testimonial**

In `sanity/schemaTypes/documents/testimonial.ts`, add before `preview`:

```ts
  orderings: [
    { title: 'Date (Newest)', name: 'dateDesc', by: [{ field: 'date', direction: 'desc' }] },
    { title: 'Rating (Highest)', name: 'ratingDesc', by: [{ field: 'rating', direction: 'desc' }] },
  ],
```

- [ ] **Step 6: Extend orderings for teamMember**

In `sanity/schemaTypes/documents/teamMember.ts`, replace orderings (currently only has `Display Order`):

```ts
  orderings: [
    { title: 'Name A-Z', name: 'nameAsc', by: [{ field: 'name', direction: 'asc' }] },
    { title: 'Display Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
```

- [ ] **Step 7: Extend orderings for faqItem**

In `sanity/schemaTypes/documents/faqItem.ts`, replace orderings (currently only has `Display Order`):

```ts
  orderings: [
    { title: 'Display Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
    { title: 'Question A-Z', name: 'questionAsc', by: [{ field: 'question', direction: 'asc' }] },
  ],
```

- [ ] **Step 8: Add orderings to promoBanner**

In `sanity/schemaTypes/documents/promoBanner.ts`, add before `preview`:

```ts
  orderings: [
    { title: 'Active First', name: 'activeFirst', by: [{ field: 'isActive', direction: 'desc' }] },
    { title: 'Start Date', name: 'startDateDesc', by: [{ field: 'startDate', direction: 'desc' }] },
  ],
```

- [ ] **Step 9: Commit**

```bash
git add sanity/schemaTypes/documents/blogPost.ts sanity/schemaTypes/documents/modularPage.ts sanity/schemaTypes/documents/category.ts sanity/schemaTypes/documents/tag.ts sanity/schemaTypes/documents/testimonial.ts sanity/schemaTypes/documents/teamMember.ts sanity/schemaTypes/documents/faqItem.ts sanity/schemaTypes/documents/promoBanner.ts
git commit -m "feat: add document orderings for client-friendly sorting"
```

---

## Chunk 4: Schema UX — Groups & Homepage Verification

### Task 13: Add groups to dense schemas

**Files:**
- Modify: `sanity/schemaTypes/singletons/siteSettings.ts`
- Modify: `sanity/schemaTypes/documents/promoBanner.ts`
- Modify: `sanity/schemaTypes/documents/testimonial.ts`
- Modify: `sanity/schemaTypes/documents/category.ts`

**Note:** `modularPage` already has groups (Page, Content, SEO) that match the spec — no changes needed there.

- [ ] **Step 1: Add groups to siteSettings**

In `sanity/schemaTypes/singletons/siteSettings.ts`, add groups definition and assign each field:

```ts
export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  groups: [
    { name: 'identity', title: 'Identity', default: true },
    { name: 'contact', title: 'Contact' },
    { name: 'hours', title: 'Hours' },
    { name: 'social', title: 'Social' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({ name: 'name', ..., group: 'identity' }),
    defineField({ name: 'tagline', ..., group: 'identity' }),
    defineField({ name: 'logo', ..., group: 'identity' }),
    defineField({ name: 'logoAlt', ..., group: 'identity' }),
    defineField({ name: 'phone', ..., group: 'contact' }),
    defineField({ name: 'email', ..., group: 'contact' }),
    defineField({ name: 'address', ..., group: 'contact' }),
    defineField({ name: 'location', ..., group: 'contact' }),
    defineField({ name: 'hours', ..., group: 'hours' }),
    defineField({ name: 'socialLinks', ..., group: 'social' }),
    defineField({ name: 'reservationUrl', ..., group: 'social' }),
    defineField({ name: 'seo', ..., group: 'seo' }),
  ],
```

Add `group` property to each existing field definition. Don't rewrite the whole file — just add `group: 'identity'` etc. to each field.

- [ ] **Step 2: Add groups to promoBanner**

In `sanity/schemaTypes/documents/promoBanner.ts`, add groups and assign fields:

```ts
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'appearance', title: 'Appearance' },
    { name: 'schedule', title: 'Schedule' },
  ],
```

Assign groups:
- Content: `message`, `ctaText`, `ctaUrl`
- Appearance: `backgroundColor`, `textColor`, `position`
- Schedule: `isActive`, `startDate`, `endDate`, `dismissible`

- [ ] **Step 3: Add groups to testimonial**

In `sanity/schemaTypes/documents/testimonial.ts`, add groups:

```ts
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'meta', title: 'Meta' },
  ],
```

Assign groups:
- Content: `author`, `quote`
- Meta: `rating`, `source`, `date`

- [ ] **Step 4: Add groups to category**

In `sanity/schemaTypes/documents/category.ts`, add groups:

```ts
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'appearance', title: 'Appearance' },
  ],
```

Assign groups:
- Content: `title`, `slug`, `description`, `image`, `order`
- Appearance: `color`

- [ ] **Step 5: Commit**

```bash
git add sanity/schemaTypes/singletons/siteSettings.ts sanity/schemaTypes/documents/promoBanner.ts sanity/schemaTypes/documents/testimonial.ts sanity/schemaTypes/documents/category.ts
git commit -m "feat: add groups to dense schemas for better editor organization"
```

---

### Task 14: Verify homepage singleton enforcement

**Files:**
- Read: `sanity/structure/index.ts`
- Read: `sanity.config.ts`

- [ ] **Step 1: Verify `homePage` is in SINGLETONS array**

Read `sanity/structure/index.ts` and confirm:
```ts
export const SINGLETONS = ['siteSettings', 'homePage', 'header', 'footer', 'redirects']
```

Expected: `homePage` is present.

- [ ] **Step 2: Verify desk structure presents it as fixed item**

Confirm the structure contains:
```ts
S.document().schemaType('homePage').documentId('homePage')
```

Expected: Homepage is a fixed item, not a list.

- [ ] **Step 3: Verify document actions strip delete/duplicate**

In `sanity.config.ts`, confirm:
```ts
actions: (input, context) => {
  if (SINGLETONS.includes(context.schemaType)) {
    return input.filter(({ action }) => action && !['delete', 'duplicate'].includes(action))
  }
  return input
},
```

Expected: delete and duplicate are filtered for singletons.

- [ ] **Step 4: Verify newDocumentOptions filter**

Confirm:
```ts
newDocumentOptions: (prev) => prev.filter(({ templateId }) => !SINGLETONS.includes(templateId))
```

Expected: `homePage` does not appear in "Create new document" menu.

- [ ] **Step 5: No commit needed — verification only**

---

### Task 15: Final build verification

- [ ] **Step 1: Run typecheck**

```bash
npm run typecheck
```

Expected: no TypeScript errors.

- [ ] **Step 2: Run lint**

```bash
npm run lint
```

Expected: no new lint errors.

- [ ] **Step 3: Run build**

```bash
npm run build
```

Expected: successful build.

- [ ] **Step 4: Manual verification in browser**

Start dev server and verify:
1. `/studio` loads without flash or refresh issues
2. Navigating between documents in Structure tool is smooth
3. Presentation tool preview loads correctly
4. Schema fields show descriptions and placeholders
5. Array fields enforce max limits
6. Document lists have sort options

```bash
npm run dev
```
