# Phase 1: Blog System + Mega-Menu Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a complete blog system (posts, categories, tags, pagination) and CMS-driven mega-menu navigation to the bonsai-blog starter kit.

**Architecture:** New Sanity document types (category, tag, blogPost) with a megaMenuGroup object type for navigation and a blogGrid page builder section. Three new Next.js routes under /blog. Header rewritten for mega-menu with backwards-compatible fallback.

**Tech Stack:** Next.js 14 App Router, Sanity v3, TypeScript, Tailwind CSS, Framer Motion

---

## Task 0: Fresh Git Repository

**Why:** Disconnect from the bonsai-kit origin and start a clean repo for the blog starter kit.

**Step 1: Remove old git history and reinitialize**

```bash
rm -rf .git
git init
```

**Step 2: Clean initial commit**

```bash
git add -A
git commit -m "feat: bonsai-blog starter kit — initial commit from boilerplate"
```

**Step 3: Verify**

Run: `git log --oneline`
Expected: Single commit with the message above.

---

## Task 1: Category Schema

**Files:**
- Create: `sanity/schemaTypes/documents/category.ts`
- Modify: `sanity/schemaTypes/index.ts`

**Step 1: Create category schema**

```typescript
// sanity/schemaTypes/documents/category.ts
import { TagIcon } from '@sanity/icons'
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'color',
      title: 'Color',
      type: 'string',
      description: 'Hex color for category badges (e.g. #B8860B)',
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Controls display order (lower numbers appear first)',
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'description' },
  },
})
```

**Step 2: Register in schema index**

In `sanity/schemaTypes/index.ts`, add:
- Import: `import category from './documents/category'`
- Add `category` to `schemaTypes` array in the Documents section (after `promoBanner`).

**Step 3: Verify**

Run: `npm run typecheck`
Expected: No errors.

**Step 4: Commit**

```bash
git add sanity/schemaTypes/documents/category.ts sanity/schemaTypes/index.ts
git commit -m "feat: add category document schema"
```

---

## Task 2: Tag Schema

**Files:**
- Create: `sanity/schemaTypes/documents/tag.ts`
- Modify: `sanity/schemaTypes/index.ts`

**Step 1: Create tag schema**

```typescript
// sanity/schemaTypes/documents/tag.ts
import { TagsIcon } from '@sanity/icons'
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'tag',
  title: 'Tag',
  type: 'document',
  icon: TagsIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      description: 'Optional parent category for this tag',
    }),
  ],
  preview: {
    select: { title: 'title', category: 'category.title' },
    prepare({ title, category }) {
      return { title, subtitle: category || 'Uncategorized' }
    },
  },
})
```

**Step 2: Register in schema index**

In `sanity/schemaTypes/index.ts`, add:
- Import: `import tag from './documents/tag'`
- Add `tag` to `schemaTypes` array after `category`.

**Step 3: Verify**

Run: `npm run typecheck`
Expected: No errors.

**Step 4: Commit**

```bash
git add sanity/schemaTypes/documents/tag.ts sanity/schemaTypes/index.ts
git commit -m "feat: add tag document schema"
```

---

## Task 3: Blog Post Schema

**Files:**
- Create: `sanity/schemaTypes/documents/blogPost.ts`
- Modify: `sanity/schemaTypes/index.ts`
- Modify: `sanity/schemaTypes/objects/portableText.ts` (add blogPost to internalLink references)

**Step 1: Create blogPost schema**

```typescript
// sanity/schemaTypes/documents/blogPost.ts
import { DocumentTextIcon } from '@sanity/icons'
import { defineType, defineField, defineArrayMember } from 'sanity'

export default defineType({
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  icon: DocumentTextIcon,
  groups: [
    { name: 'post', title: 'Post', default: true },
    { name: 'content', title: 'Content' },
    { name: 'meta', title: 'Meta' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'post',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (Rule) => Rule.required(),
      group: 'post',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
      initialValue: () => new Date().toISOString(),
      group: 'post',
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      description: 'Short summary shown on cards and in search results (max 200 chars)',
      validation: (Rule) => Rule.max(200).warning('Keep under 200 characters'),
      group: 'post',
    }),
    defineField({
      name: 'highlightImage',
      title: 'Highlight Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Describe the image for screen readers',
          validation: (Rule) => Rule.required(),
        }),
      ],
      group: 'post',
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
      group: 'meta',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (Rule) => Rule.required(),
      group: 'meta',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'tag' }] })],
      group: 'meta',
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'portableText',
      group: 'content',
    }),
    defineField({
      name: 'relatedPosts',
      title: 'Related Posts',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'blogPost' }] })],
      validation: (Rule) => Rule.max(3),
      description: 'Up to 3 related posts shown at the bottom',
      group: 'meta',
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured Post',
      type: 'boolean',
      description: 'Feature this post in curated sections',
      initialValue: false,
      group: 'meta',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
  ],
  orderings: [
    {
      title: 'Published Date (Newest)',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      date: 'publishedAt',
      media: 'highlightImage',
      category: 'category.title',
    },
    prepare({ title, date, media, category }) {
      return {
        title,
        subtitle: [category, date ? new Date(date).toLocaleDateString() : ''].filter(Boolean).join(' — '),
        media,
      }
    },
  },
})
```

**Step 2: Register in schema index**

In `sanity/schemaTypes/index.ts`, add:
- Import: `import blogPost from './documents/blogPost'`
- Add `blogPost` to `schemaTypes` array after `tag`.

**Step 3: Add blogPost to portableText internalLink references**

In `sanity/schemaTypes/objects/portableText.ts`, find the `internalLink` annotation's `reference` field (line ~50) and add `{ type: 'blogPost' }` to the `to` array:

```typescript
to: [{ type: 'page' }, { type: 'modularPage' }, { type: 'blogPost' }],
```

**Step 4: Verify**

Run: `npm run typecheck`
Expected: No errors.

**Step 5: Commit**

```bash
git add sanity/schemaTypes/documents/blogPost.ts sanity/schemaTypes/index.ts sanity/schemaTypes/objects/portableText.ts
git commit -m "feat: add blogPost document schema with portableText internal linking"
```

---

## Task 4: MegaMenuGroup Object Schema + Header Schema Update

**Files:**
- Create: `sanity/schemaTypes/objects/megaMenuGroup.ts`
- Modify: `sanity/schemaTypes/index.ts`
- Modify: `sanity/schemaTypes/singletons/header.ts`

**Step 1: Create megaMenuGroup object schema**

```typescript
// sanity/schemaTypes/objects/megaMenuGroup.ts
import { defineType, defineField, defineArrayMember } from 'sanity'

export default defineType({
  name: 'megaMenuGroup',
  title: 'Mega Menu Group',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'href',
      title: 'Link',
      type: 'string',
      description: 'Optional — makes the group label itself a link',
    }),
    defineField({
      name: 'children',
      title: 'Dropdown Links',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'label', type: 'string', title: 'Label', validation: (Rule) => Rule.required() }),
            defineField({ name: 'href', type: 'string', title: 'Link', validation: (Rule) => Rule.required() }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'href' },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'label', children: 'children' },
    prepare({ title, children }) {
      return {
        title,
        subtitle: children?.length ? `${children.length} links` : 'No dropdown',
      }
    },
  },
})
```

**Step 2: Register in schema index**

In `sanity/schemaTypes/index.ts`, add:
- Import: `import megaMenuGroup from './objects/megaMenuGroup'`
- Add `megaMenuGroup` to `schemaTypes` array in the Objects section (after `cta`).

**Step 3: Rewrite header.ts**

Replace the entire content of `sanity/schemaTypes/singletons/header.ts`:

```typescript
import { defineType, defineField, defineArrayMember } from 'sanity'
import { MenuIcon } from '@sanity/icons'

export default defineType({
  name: 'header',
  title: 'Header',
  type: 'document',
  icon: MenuIcon,
  groups: [
    { name: 'main', title: 'Main Navigation', default: true },
    { name: 'secondary', title: 'Secondary Navigation' },
  ],
  fields: [
    defineField({
      name: 'megaNavigation',
      title: 'Mega Menu Navigation',
      description: 'Main navigation with dropdown groups. Leave empty to use secondary navigation as a flat menu.',
      type: 'array',
      of: [defineArrayMember({ type: 'megaMenuGroup' })],
      group: 'main',
    }),
    defineField({
      name: 'secondaryNavigation',
      title: 'Secondary Navigation',
      description: 'Simple link list shown in the top bar (or as main nav if mega menu is empty)',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'label', type: 'string', title: 'Label', validation: (Rule) => Rule.required() }),
            defineField({ name: 'href', type: 'string', title: 'Link', validation: (Rule) => Rule.required() }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'href' },
          },
        }),
      ],
      group: 'secondary',
    }),
    defineField({
      name: 'cta',
      title: 'CTA Button (optional)',
      type: 'cta',
      description: 'Optional call-to-action button shown in the header',
      group: 'secondary',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Header' }
    },
  },
})
```

**Step 4: Verify**

Run: `npm run typecheck`
Expected: No errors.

**Step 5: Commit**

```bash
git add sanity/schemaTypes/objects/megaMenuGroup.ts sanity/schemaTypes/index.ts sanity/schemaTypes/singletons/header.ts
git commit -m "feat: add megaMenuGroup object and update header with mega navigation"
```

---

## Task 5: BlogGrid Section Schema

**Files:**
- Create: `sanity/schemaTypes/sections/blogGrid.ts`
- Modify: `sanity/schemaTypes/index.ts`
- Modify: `sanity/schemaTypes/singletons/homePage.ts`
- Modify: `sanity/schemaTypes/documents/modularPage.ts`

**Step 1: Create blogGrid section schema**

```typescript
// sanity/schemaTypes/sections/blogGrid.ts
import { InlineIcon } from '@sanity/icons'
import { defineType, defineField, defineArrayMember } from 'sanity'

export default defineType({
  name: 'blogGrid',
  title: 'Blog Grid',
  type: 'object',
  icon: InlineIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
    }),
    defineField({
      name: 'source',
      title: 'Source',
      type: 'string',
      options: {
        list: [
          { title: 'Latest Posts', value: 'latest' },
          { title: 'By Category', value: 'category' },
          { title: 'Manual Selection', value: 'manual' },
        ],
        layout: 'radio',
      },
      initialValue: 'latest',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      hidden: ({ parent }) => parent?.source !== 'category',
    }),
    defineField({
      name: 'posts',
      title: 'Posts',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'blogPost' }] })],
      hidden: ({ parent }) => parent?.source !== 'manual',
    }),
    defineField({
      name: 'limit',
      title: 'Number of Posts',
      type: 'number',
      initialValue: 3,
      validation: (Rule) => Rule.min(1).max(12),
      hidden: ({ parent }) => parent?.source === 'manual',
    }),
    defineField({
      name: 'showViewAll',
      title: 'Show "View All" Link',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'viewAllHref',
      title: '"View All" Link',
      type: 'string',
      description: 'e.g. /blog or /blog/category/lifestyle',
      hidden: ({ parent }) => !parent?.showViewAll,
    }),
  ],
  preview: {
    select: { heading: 'heading', source: 'source' },
    prepare({ heading, source }) {
      return {
        title: heading || 'Blog Grid',
        subtitle: `Source: ${source || 'latest'}`,
      }
    },
  },
})
```

**Step 2: Register in schema index**

In `sanity/schemaTypes/index.ts`, add:
- Import: `import blogGrid from './sections/blogGrid'`
- Add `blogGrid` to `schemaTypes` array in the Page builder sections (after `embed`).

**Step 3: Add blogGrid to homePage sections array**

In `sanity/schemaTypes/singletons/homePage.ts`, add to the `sections` field's `of` array:

```typescript
defineArrayMember({ type: 'blogGrid' }),
```

Add it after the last existing entry (`embed`).

**Step 4: Add blogGrid to modularPage sections array**

In `sanity/schemaTypes/documents/modularPage.ts`, add to the `sections` field's `of` array:

```typescript
defineArrayMember({ type: 'blogGrid' }),
```

Add it after the last existing entry (`embed`).

**Step 5: Verify**

Run: `npm run typecheck`
Expected: No errors.

**Step 6: Commit**

```bash
git add sanity/schemaTypes/sections/blogGrid.ts sanity/schemaTypes/index.ts sanity/schemaTypes/singletons/homePage.ts sanity/schemaTypes/documents/modularPage.ts
git commit -m "feat: add blogGrid page builder section schema"
```

---

## Task 6: TypeScript Types

**Files:**
- Modify: `types/index.ts`

**Step 1: Add new interfaces**

Add the following after the existing `GalleryImage` interface (around line 162) and before the `CTA` interface:

```typescript
/** Category — matches sanity/schemaTypes/documents/category.ts */
export interface Category {
  _id: string
  _type: 'category'
  title: string
  slug: SanitySlug
  description?: string
  image?: SanityImage
  color?: string
  order?: number
}

/** Tag — matches sanity/schemaTypes/documents/tag.ts */
export interface Tag {
  _id: string
  _type: 'tag'
  title: string
  slug: SanitySlug
  category?: SanityReference
}

/** Blog Post — matches sanity/schemaTypes/documents/blogPost.ts */
export interface BlogPost {
  _id: string
  _type: 'blogPost'
  title: string
  slug: SanitySlug
  publishedAt: string
  excerpt?: string
  highlightImage?: SanityImage & { alt?: string }
  author?: string
  category: Category
  tags?: Tag[]
  content?: PortableTextBlock
  relatedPosts?: BlogPostCard[]
  isFeatured?: boolean
  seo?: SEO
}

/** Blog Post Card — projection subset for listings */
export interface BlogPostCard {
  _id: string
  _type: 'blogPost'
  title: string
  slug: SanitySlug
  publishedAt: string
  excerpt?: string
  highlightImage?: SanityImage & { alt?: string }
  author?: string
  category: { title: string; slug: SanitySlug; color?: string }
}
```

**Step 2: Add mega menu types**

Add after the existing `NavLink` interface (end of file):

```typescript
/** Mega menu child link */
export interface MegaMenuChild {
  _key: string
  label: string
  href: string
}

/** Mega menu group — matches sanity/schemaTypes/objects/megaMenuGroup.ts */
export interface MegaMenuGroup {
  _key: string
  label: string
  href?: string
  children?: MegaMenuChild[]
}
```

**Step 3: Add ModularBlogGrid section type**

Add after the existing `ModularEmbed` interface:

```typescript
/** Blog grid page builder section */
export interface ModularBlogGrid {
  _type: 'blogGrid'
  _key: string
  heading?: string
  source?: 'latest' | 'category' | 'manual'
  category?: Category
  posts?: BlogPostCard[]
  limit?: number
  showViewAll?: boolean
  viewAllHref?: string
}
```

**Step 4: Update ModularPageSection union**

Add `| ModularBlogGrid` to the `ModularPageSection` union type.

**Step 5: Update Header interface**

Replace the existing `Header` interface:

```typescript
/** Header singleton */
export interface Header {
  _id: string
  _type: 'header'
  megaNavigation?: MegaMenuGroup[]
  secondaryNavigation?: Array<{ _key: string; label: string; href: string }>
  cta?: CTA
}
```

**Step 6: Verify**

Run: `npm run typecheck`
Expected: No errors.

**Step 7: Commit**

```bash
git add types/index.ts
git commit -m "feat: add blog, category, tag, mega-menu, and blogGrid TypeScript types"
```

---

## Task 7: GROQ Queries

**Files:**
- Modify: `sanity/lib/queries.ts`

**Step 1: Add blog queries**

Add the following after the `PROMO_BANNER_QUERY` at the end of the file:

```typescript
// ─── Blog ──────────────────────────────────────────────────────

const BLOG_POST_CARD_PROJECTION = `
  _id,
  _type,
  title,
  "slug": slug.current,
  publishedAt,
  excerpt,
  highlightImage,
  author,
  category-> { title, "slug": slug.current, color }
`

export const BLOG_POSTS_QUERY = defineQuery(`
  *[_type == "blogPost"] | order(publishedAt desc) [$start...$end] {
    ${BLOG_POST_CARD_PROJECTION}
  }
`)

export const BLOG_POSTS_COUNT_QUERY = defineQuery(`
  count(*[_type == "blogPost"])
`)

export const BLOG_POST_QUERY = defineQuery(`
  *[_type == "blogPost" && slug.current == $slug][0] {
    _id,
    _type,
    title,
    "slug": slug.current,
    publishedAt,
    _updatedAt,
    excerpt,
    highlightImage,
    author,
    category-> { _id, title, "slug": slug.current, color },
    tags[]-> { _id, title, "slug": slug.current },
    content,
    relatedPosts[]-> {
      ${BLOG_POST_CARD_PROJECTION}
    },
    isFeatured,
    seo
  }
`)

export const BLOG_POSTS_BY_CATEGORY_QUERY = defineQuery(`
  *[_type == "blogPost" && category->slug.current == $categorySlug
    && select(
      defined($tagSlug) && $tagSlug != "" => $tagSlug in tags[]->slug.current,
      true
    )
  ] | order(publishedAt desc) [$start...$end] {
    ${BLOG_POST_CARD_PROJECTION}
  }
`)

export const BLOG_POSTS_BY_CATEGORY_COUNT_QUERY = defineQuery(`
  count(*[_type == "blogPost" && category->slug.current == $categorySlug
    && select(
      defined($tagSlug) && $tagSlug != "" => $tagSlug in tags[]->slug.current,
      true
    )
  ])
`)

export const ALL_CATEGORIES_QUERY = defineQuery(`
  *[_type == "category"] | order(order asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    image,
    color,
    order
  }
`)

export const CATEGORY_QUERY = defineQuery(`
  *[_type == "category" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    description,
    image,
    color
  }
`)

export const TAGS_BY_CATEGORY_QUERY = defineQuery(`
  *[_type == "tag" && category->slug.current == $categorySlug] | order(title asc) {
    _id,
    title,
    "slug": slug.current
  }
`)

export const BLOG_POST_SLUGS_QUERY = defineQuery(`
  *[_type == "blogPost" && defined(slug.current)] {
    "slug": slug.current
  }
`)

export const CATEGORY_SLUGS_QUERY = defineQuery(`
  *[_type == "category" && defined(slug.current)] {
    "slug": slug.current
  }
`)
```

**Step 2: Update HEADER_QUERY**

Replace the existing `HEADER_QUERY`:

```typescript
export const HEADER_QUERY = defineQuery(`
  *[_type == "header"][0] {
    megaNavigation[] {
      _key,
      label,
      href,
      children[] {
        _key,
        label,
        href
      }
    },
    secondaryNavigation[] {
      _key,
      label,
      href
    },
    cta
  }
`)
```

**Step 3: Update MODULAR_PAGE_SECTIONS_PROJECTION**

Add the `blogGrid` projection inside the existing `MODULAR_PAGE_SECTIONS_PROJECTION` string, after the `embed` block:

```typescript
    _type == "blogGrid" => {
      heading, source, limit, showViewAll, viewAllHref,
      category-> { _id, title, "slug": slug.current, color },
      posts[]-> {
        _id, _type, title, "slug": slug.current, publishedAt, excerpt, highlightImage, author,
        category-> { title, "slug": slug.current, color }
      }
    }
```

**Step 4: Verify**

Run: `npm run typecheck`
Expected: No errors.

**Step 5: Commit**

```bash
git add sanity/lib/queries.ts
git commit -m "feat: add blog GROQ queries and update header/sections projections"
```

---

## Task 8: Revalidation Map, Desk Structure, Sitemap

**Files:**
- Modify: `app/api/revalidate/route.ts`
- Modify: `sanity/structure/index.ts`
- Modify: `app/sitemap.ts`

**Step 1: Update REVALIDATION_MAP**

In `app/api/revalidate/route.ts`, add to the `REVALIDATION_MAP` object:

```typescript
blogPost: ['blogPosts'],
category: ['categories', 'blogPosts'],
tag: ['tags', 'blogPosts'],
```

**Step 2: Update desk structure**

Replace the entire content of `sanity/structure/index.ts`:

```typescript
import type { StructureBuilder } from 'sanity/structure'
import {
  HomeIcon,
  BookIcon,
  EnvelopeIcon,
  CogIcon,
  MenuIcon,
  BlockContentIcon,
  LinkIcon,
  BellIcon,
  DocumentTextIcon,
  TagIcon,
  TagsIcon,
} from '@sanity/icons'

export const SINGLETONS = ['siteSettings', 'homePage', 'header', 'footer', 'redirects']

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Homepage')
        .icon(HomeIcon)
        .child(S.document().schemaType('homePage').documentId('homePage')),

      S.divider(),

      S.documentTypeListItem('modularPage').title('Pages'),

      S.divider(),

      S.listItem()
        .title('Blog')
        .icon(DocumentTextIcon)
        .child(
          S.list()
            .title('Blog')
            .items([
              S.documentTypeListItem('blogPost').title('Posts').icon(DocumentTextIcon),
              S.documentTypeListItem('category').title('Categories').icon(TagIcon),
              S.documentTypeListItem('tag').title('Tags').icon(TagsIcon),
            ])
        ),

      S.divider(),

      S.listItem()
        .title('Content Library')
        .icon(BookIcon)
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

      S.documentTypeListItem('submission').title('Submissions').icon(EnvelopeIcon),

      S.divider(),

      S.documentTypeListItem('redirect').title('Redirects').icon(LinkIcon),
      S.documentTypeListItem('promoBanner').title('Promo Banners').icon(BellIcon),

      S.divider(),

      S.listItem()
        .title('Site')
        .icon(CogIcon)
        .child(
          S.list()
            .title('Site')
            .items([
              S.listItem()
                .title('Settings')
                .icon(CogIcon)
                .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
              S.listItem()
                .title('Header')
                .icon(MenuIcon)
                .child(S.document().schemaType('header').documentId('header')),
              S.listItem()
                .title('Footer')
                .icon(BlockContentIcon)
                .child(S.document().schemaType('footer').documentId('footer')),
              S.listItem()
                .title('Redirects')
                .icon(LinkIcon)
                .child(S.document().schemaType('redirects').documentId('redirects')),
            ])
        ),
    ])

export const newDocumentOptions = (prev: { templateId: string }[]) =>
  prev.filter(({ templateId }) => !SINGLETONS.includes(templateId))
```

**Step 3: Update sitemap**

Replace the entire content of `app/sitemap.ts`:

```typescript
import { MetadataRoute } from 'next'
import { client } from '@/sanity/lib/client'
import { SITEMAP_QUERY, BLOG_POST_SLUGS_QUERY, CATEGORY_SLUGS_QUERY } from '@/sanity/lib/queries'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'
const sitemapClient = client.withConfig({ stega: false })

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/faq`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ]

  let dynamicRoutes: MetadataRoute.Sitemap = []
  try {
    const [pages, posts, categories] = await Promise.all([
      sitemapClient.fetch(SITEMAP_QUERY),
      sitemapClient.fetch(BLOG_POST_SLUGS_QUERY),
      sitemapClient.fetch(CATEGORY_SLUGS_QUERY),
    ])

    const pageRoutes = (pages || []).map((p: { slug: string; _updatedAt: string }) => ({
      url: `${baseUrl}/${p.slug}`,
      lastModified: new Date(p._updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

    const postRoutes = (posts || []).map((p: { slug: string }) => ({
      url: `${baseUrl}/blog/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    const categoryRoutes = (categories || []).map((c: { slug: string }) => ({
      url: `${baseUrl}/blog/category/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))

    dynamicRoutes = [...pageRoutes, ...postRoutes, ...categoryRoutes]
  } catch {
    // Silently fail if Sanity is not configured
  }

  return [...staticRoutes, ...dynamicRoutes]
}
```

**Step 4: Verify**

Run: `npm run typecheck`
Expected: No errors.

**Step 5: Commit**

```bash
git add app/api/revalidate/route.ts sanity/structure/index.ts app/sitemap.ts
git commit -m "feat: update revalidation map, desk structure, and sitemap for blog"
```

---

## Task 9: BlogPosting JSON-LD

**Files:**
- Modify: `lib/structuredData.ts`

**Step 1: Add blogPostJsonLd function**

Add at the end of `lib/structuredData.ts`:

```typescript
export function blogPostJsonLd(post: {
  title: string
  excerpt?: string
  publishedAt: string
  updatedAt?: string
  author?: string
  image?: string
  slug: string
}, siteName: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    ...(post.excerpt && { description: post.excerpt }),
    datePublished: post.publishedAt,
    ...(post.updatedAt && { dateModified: post.updatedAt }),
    ...(post.author && {
      author: {
        '@type': 'Person',
        name: post.author,
      },
    }),
    ...(post.image && { image: post.image }),
    publisher: {
      '@type': 'Organization',
      name: siteName,
      url: siteUrl,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/blog/${post.slug}`,
    },
  }
}
```

**Step 2: Verify**

Run: `npm run typecheck`
Expected: No errors.

**Step 3: Commit**

```bash
git add lib/structuredData.ts
git commit -m "feat: add BlogPosting JSON-LD structured data"
```

---

## Task 10: Blog Components — BlogPostCard + BlogPostGrid

**Files:**
- Create: `components/blog/BlogPostCard.tsx`
- Create: `components/blog/BlogPostGrid.tsx`

**Step 1: Create BlogPostCard**

```typescript
// components/blog/BlogPostCard.tsx
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { fadeInUp } from '@/lib/animations'
import SanityImage from '@/components/sanity/SanityImage'
import type { BlogPostCard as BlogPostCardType } from '@/types'

interface BlogPostCardProps {
  post: BlogPostCardType
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  const date = post.publishedAt
    ? new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(post.publishedAt))
    : null

  return (
    <motion.article variants={fadeInUp} className="group">
      <Link href={`/blog/${post.slug}`} className="block">
        {/* Image */}
        <div className="aspect-[3/2] overflow-hidden rounded-lg bg-muted mb-4">
          {post.highlightImage ? (
            <SanityImage
              image={post.highlightImage}
              alt={post.highlightImage.alt || post.title}
              width={600}
              height={400}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No image
            </div>
          )}
        </div>

        {/* Category Badge */}
        {post.category && (
          <span
            className="inline-block text-xs font-semibold uppercase tracking-wider mb-2 px-2 py-1 rounded"
            style={{
              backgroundColor: post.category.color ? `${post.category.color}15` : undefined,
              color: post.category.color || undefined,
            }}
          >
            {post.category.title}
          </span>
        )}

        {/* Title */}
        <h3 className="font-serif text-lg sm:text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {post.title}
        </h3>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
            {post.excerpt}
          </p>
        )}

        {/* Meta */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {post.author && <span>{post.author}</span>}
          {post.author && date && <span aria-hidden="true">&middot;</span>}
          {date && <time dateTime={post.publishedAt}>{date}</time>}
        </div>
      </Link>
    </motion.article>
  )
}
```

**Step 2: Create BlogPostGrid**

```typescript
// components/blog/BlogPostGrid.tsx
'use client'

import { motion } from 'framer-motion'
import { staggerContainer } from '@/lib/animations'
import BlogPostCard from './BlogPostCard'
import type { BlogPostCard as BlogPostCardType } from '@/types'

interface BlogPostGridProps {
  posts: BlogPostCardType[]
}

export default function BlogPostGrid({ posts }: BlogPostGridProps) {
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">No posts found.</p>
      </div>
    )
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {posts.map((post) => (
        <BlogPostCard key={post._id} post={post} />
      ))}
    </motion.div>
  )
}
```

**Step 3: Verify**

Run: `npm run typecheck`
Expected: No errors.

**Step 4: Commit**

```bash
git add components/blog/BlogPostCard.tsx components/blog/BlogPostGrid.tsx
git commit -m "feat: add BlogPostCard and BlogPostGrid components"
```

---

## Task 11: Pagination Component

**Files:**
- Create: `components/blog/Pagination.tsx`

**Step 1: Create Pagination component**

```typescript
// components/blog/Pagination.tsx
import Link from 'next/link'

interface PaginationProps {
  currentPage: number
  totalPages: number
  basePath: string
  searchParams?: Record<string, string>
}

function getPageUrl(basePath: string, page: number, searchParams?: Record<string, string>) {
  const params = new URLSearchParams(searchParams)
  if (page > 1) {
    params.set('page', String(page))
  } else {
    params.delete('page')
  }
  const qs = params.toString()
  return qs ? `${basePath}?${qs}` : basePath
}

function getPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const pages: (number | 'ellipsis')[] = [1]

  if (current > 3) pages.push('ellipsis')

  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  for (let i = start; i <= end; i++) pages.push(i)

  if (current < total - 2) pages.push('ellipsis')

  pages.push(total)
  return pages
}

export default function Pagination({ currentPage, totalPages, basePath, searchParams }: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = getPageNumbers(currentPage, totalPages)
  const extraParams = { ...searchParams }
  delete extraParams.page

  return (
    <nav aria-label="Blog pagination" className="flex items-center justify-center gap-2 mt-12">
      {/* Previous */}
      {currentPage > 1 ? (
        <Link
          href={getPageUrl(basePath, currentPage - 1, extraParams)}
          className="px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors"
          aria-label="Previous page"
        >
          &larr; Prev
        </Link>
      ) : (
        <span className="px-3 py-2 text-sm text-muted-foreground opacity-50" aria-disabled="true">
          &larr; Prev
        </span>
      )}

      {/* Page Numbers */}
      {pages.map((page, i) =>
        page === 'ellipsis' ? (
          <span key={`ellipsis-${i}`} className="px-2 text-muted-foreground" aria-hidden="true">
            &hellip;
          </span>
        ) : (
          <Link
            key={page}
            href={getPageUrl(basePath, page, extraParams)}
            aria-current={page === currentPage ? 'page' : undefined}
            className={`px-3 py-2 text-sm rounded-lg transition-colors ${
              page === currentPage
                ? 'bg-primary text-white font-semibold'
                : 'hover:bg-muted'
            }`}
          >
            {page}
          </Link>
        )
      )}

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          href={getPageUrl(basePath, currentPage + 1, extraParams)}
          className="px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors"
          aria-label="Next page"
        >
          Next &rarr;
        </Link>
      ) : (
        <span className="px-3 py-2 text-sm text-muted-foreground opacity-50" aria-disabled="true">
          Next &rarr;
        </span>
      )}
    </nav>
  )
}
```

**Step 2: Verify**

Run: `npm run typecheck`
Expected: No errors.

**Step 3: Commit**

```bash
git add components/blog/Pagination.tsx
git commit -m "feat: add Pagination component with ellipsis truncation"
```

---

## Task 12: CategoryFilter Component

**Files:**
- Create: `components/blog/CategoryFilter.tsx`

**Step 1: Create CategoryFilter component**

```typescript
// components/blog/CategoryFilter.tsx
'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

interface CategoryFilterProps {
  tags: Array<{ _id: string; title: string; slug: string }>
  basePath: string
  categoryColor?: string
}

export default function CategoryFilter({ tags, basePath, categoryColor }: CategoryFilterProps) {
  const searchParams = useSearchParams()
  const activeTag = searchParams.get('tag')

  if (!tags || tags.length === 0) return null

  return (
    <nav aria-label="Filter by tag" className="flex flex-wrap gap-2 mb-8">
      {/* All pill */}
      <Link
        href={basePath}
        className={`px-4 py-2 text-sm rounded-full transition-colors ${
          !activeTag
            ? 'font-semibold text-white'
            : 'bg-muted text-foreground hover:bg-border'
        }`}
        style={!activeTag ? { backgroundColor: categoryColor || 'var(--color-primary)' } : undefined}
        aria-current={!activeTag ? 'page' : undefined}
      >
        All
      </Link>

      {tags.map((tag) => {
        const isActive = activeTag === tag.slug
        return (
          <Link
            key={tag._id}
            href={`${basePath}?tag=${tag.slug}`}
            className={`px-4 py-2 text-sm rounded-full transition-colors ${
              isActive
                ? 'font-semibold text-white'
                : 'bg-muted text-foreground hover:bg-border'
            }`}
            style={isActive ? { backgroundColor: categoryColor || 'var(--color-primary)' } : undefined}
            aria-current={isActive ? 'page' : undefined}
          >
            {tag.title}
          </Link>
        )
      })}
    </nav>
  )
}
```

**Step 2: Verify**

Run: `npm run typecheck`
Expected: No errors.

**Step 3: Commit**

```bash
git add components/blog/CategoryFilter.tsx
git commit -m "feat: add CategoryFilter tag pill component"
```

---

## Task 13: BlogGridSection (Page Builder Section)

**Files:**
- Create: `components/sections/BlogGridSection.tsx`
- Modify: `components/sections/SectionRenderer.tsx`

**Step 1: Create BlogGridSection**

```typescript
// components/sections/BlogGridSection.tsx
import Link from 'next/link'
import { sanityFetch } from '@/sanity/lib/live'
import { BLOG_POSTS_QUERY } from '@/sanity/lib/queries'
import BlogPostGrid from '@/components/blog/BlogPostGrid'

interface BlogGridSectionProps {
  heading?: string
  source?: 'latest' | 'category' | 'manual'
  category?: { _id: string; title: string; slug: string; color?: string }
  posts?: Array<{
    _id: string
    _type: 'blogPost'
    title: string
    slug: string
    publishedAt: string
    excerpt?: string
    highlightImage?: { _type: 'image'; asset: { _ref: string; _type: 'reference' }; alt?: string }
    author?: string
    category: { title: string; slug: string; color?: string }
  }>
  limit?: number
  showViewAll?: boolean
  viewAllHref?: string
}

export default async function BlogGridSection({
  heading,
  source = 'latest',
  category,
  posts: manualPosts,
  limit = 3,
  showViewAll,
  viewAllHref,
}: BlogGridSectionProps) {
  let posts = manualPosts || []

  if (source === 'latest') {
    const { data } = await sanityFetch({
      query: BLOG_POSTS_QUERY,
      params: { start: 0, end: limit },
      tags: ['blogPosts'],
    })
    posts = data || []
  } else if (source === 'category' && category?.slug) {
    // Reuse the main query with a category filter approach
    // For simplicity, fetch latest and they're already resolved via GROQ projection
    // The category posts come pre-resolved from the GROQ projection in MODULAR_PAGE_SECTIONS_PROJECTION
    // but for the 'category' source, we need a runtime fetch
    const { defineQuery } = await import('next-sanity')
    const CATEGORY_POSTS = defineQuery(`
      *[_type == "blogPost" && category->slug.current == $categorySlug] | order(publishedAt desc) [0...$limit] {
        _id, _type, title, "slug": slug.current, publishedAt, excerpt, highlightImage, author,
        category-> { title, "slug": slug.current, color }
      }
    `)
    const { data } = await sanityFetch({
      query: CATEGORY_POSTS,
      params: { categorySlug: category.slug, limit },
      tags: ['blogPosts'],
    })
    posts = data || []
  }
  // source === 'manual': posts already resolved from GROQ projection

  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(heading || showViewAll) && (
          <div className="flex items-end justify-between mb-10">
            {heading && (
              <h2 className="font-serif text-3xl sm:text-4xl font-bold">{heading}</h2>
            )}
            {showViewAll && viewAllHref && (
              <Link
                href={viewAllHref}
                className="text-sm text-primary hover:text-primary-light transition-colors font-medium"
              >
                View All &rarr;
              </Link>
            )}
          </div>
        )}
        <BlogPostGrid posts={posts} />
      </div>
    </section>
  )
}
```

**Step 2: Register in SectionRenderer**

In `components/sections/SectionRenderer.tsx`:

- Add import: `import BlogGridSection from '@/components/sections/BlogGridSection'`
- Add to `sectionComponents` map: `blogGrid: BlogGridSection,`

**Step 3: Verify**

Run: `npm run typecheck`
Expected: No errors.

**Step 4: Commit**

```bash
git add components/sections/BlogGridSection.tsx components/sections/SectionRenderer.tsx
git commit -m "feat: add BlogGridSection page builder component"
```

---

## Task 14: Blog Listing Route — `/blog`

**Files:**
- Create: `app/blog/page.tsx`

**Step 1: Create blog listing page**

```typescript
// app/blog/page.tsx
import type { Metadata } from 'next'
import { sanityFetch } from '@/sanity/lib/live'
import {
  SITE_SETTINGS_QUERY,
  HEADER_QUERY,
  FOOTER_QUERY,
  BLOG_POSTS_QUERY,
  BLOG_POSTS_COUNT_QUERY,
} from '@/sanity/lib/queries'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import BlogPostGrid from '@/components/blog/BlogPostGrid'
import Pagination from '@/components/blog/Pagination'
import JsonLd from '@/components/seo/JsonLd'
import { webPageJsonLd } from '@/lib/structuredData'

const POSTS_PER_PAGE = 12

interface BlogPageProps {
  searchParams: Promise<{ page?: string }>
}

export async function generateMetadata(): Promise<Metadata> {
  const { data: settings } = await sanityFetch({ query: SITE_SETTINGS_QUERY, tags: ['siteSettings'] })
  return {
    title: `Blog — ${settings?.name || 'Blog'}`,
    description: `Latest posts from ${settings?.name || 'our blog'}`,
  }
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { page } = await searchParams
  const currentPage = Math.max(1, parseInt(page || '1', 10) || 1)
  const start = (currentPage - 1) * POSTS_PER_PAGE
  const end = start + POSTS_PER_PAGE

  const [{ data: settings }, { data: headerData }, { data: footerData }, { data: posts }, { data: totalCount }] =
    await Promise.all([
      sanityFetch({ query: SITE_SETTINGS_QUERY, tags: ['siteSettings'] }),
      sanityFetch({ query: HEADER_QUERY, tags: ['header'] }),
      sanityFetch({ query: FOOTER_QUERY, tags: ['footer'] }),
      sanityFetch({ query: BLOG_POSTS_QUERY, params: { start, end }, tags: ['blogPosts'] }),
      sanityFetch({ query: BLOG_POSTS_COUNT_QUERY, tags: ['blogPosts'] }),
    ])

  const totalPages = Math.ceil((totalCount || 0) / POSTS_PER_PAGE)

  return (
    <>
      <Header
        siteSettings={settings}
        megaNavigation={headerData?.megaNavigation}
        secondaryNavigation={headerData?.secondaryNavigation}
        cta={headerData?.cta}
      />
      <main id="main">
        <section className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-12">Blog</h1>
            <BlogPostGrid posts={posts || []} />
            <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/blog" />
          </div>
        </section>
      </main>
      <Footer siteSettings={settings} footerData={footerData} />
      <JsonLd data={webPageJsonLd('Blog', `Latest posts from ${settings?.name || 'our blog'}`, '/blog')} />
    </>
  )
}
```

**Step 2: Verify**

Run: `npm run typecheck`
Expected: No errors.

**Step 3: Commit**

```bash
git add app/blog/page.tsx
git commit -m "feat: add blog listing route with pagination"
```

---

## Task 15: Blog Post Route — `/blog/[slug]`

**Files:**
- Create: `app/blog/[slug]/page.tsx`

**Step 1: Create blog post page**

```typescript
// app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { sanityFetch } from '@/sanity/lib/live'
import { client } from '@/sanity/lib/client'
import {
  SITE_SETTINGS_QUERY,
  HEADER_QUERY,
  FOOTER_QUERY,
  BLOG_POST_QUERY,
  BLOG_POST_SLUGS_QUERY,
} from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import SanityImage from '@/components/sanity/SanityImage'
import { PortableText } from '@portabletext/react'
import { portableTextComponents } from '@/components/sanity/PortableTextComponents'
import BlogPostGrid from '@/components/blog/BlogPostGrid'
import JsonLd from '@/components/seo/JsonLd'
import { blogPostJsonLd } from '@/lib/structuredData'

interface PostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params
  const { data: post } = await sanityFetch({
    query: BLOG_POST_QUERY,
    params: { slug },
    tags: ['blogPosts'],
  })
  if (!post) return {}

  const ogImage = post.seo?.ogImage || post.highlightImage
  return {
    title: post.seo?.metaTitle || post.title,
    description: post.seo?.metaDescription || post.excerpt,
    openGraph: {
      title: post.seo?.metaTitle || post.title,
      description: post.seo?.metaDescription || post.excerpt || undefined,
      ...(ogImage && { images: [{ url: urlFor(ogImage).width(1200).height(630).url() }] }),
    },
  }
}

export async function generateStaticParams() {
  const posts = await client.withConfig({ stega: false }).fetch(BLOG_POST_SLUGS_QUERY)
  return (posts || []).map((p: { slug: string }) => ({ slug: p.slug }))
}

export default async function BlogPostPage({ params }: PostPageProps) {
  const { slug } = await params
  const [{ data: settings }, { data: headerData }, { data: footerData }, { data: post }] = await Promise.all([
    sanityFetch({ query: SITE_SETTINGS_QUERY, tags: ['siteSettings'] }),
    sanityFetch({ query: HEADER_QUERY, tags: ['header'] }),
    sanityFetch({ query: FOOTER_QUERY, tags: ['footer'] }),
    sanityFetch({ query: BLOG_POST_QUERY, params: { slug }, tags: ['blogPosts'] }),
  ])

  if (!post) notFound()

  const date = post.publishedAt
    ? new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(post.publishedAt))
    : null

  const jsonLd = blogPostJsonLd(
    {
      title: post.title,
      excerpt: post.excerpt,
      publishedAt: post.publishedAt,
      updatedAt: post._updatedAt,
      author: post.author,
      image: post.highlightImage ? urlFor(post.highlightImage).width(1200).height(630).url() : undefined,
      slug: post.slug,
    },
    settings?.name || 'Blog',
  )

  return (
    <>
      <Header
        siteSettings={settings}
        megaNavigation={headerData?.megaNavigation}
        secondaryNavigation={headerData?.secondaryNavigation}
        cta={headerData?.cta}
      />
      <main id="main">
        <article className="py-16 sm:py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Category + Date */}
            <div className="flex items-center gap-3 mb-6">
              {post.category && (
                <Link
                  href={`/blog/category/${post.category.slug}`}
                  className="text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded hover:opacity-80 transition-opacity"
                  style={{
                    backgroundColor: post.category.color ? `${post.category.color}15` : undefined,
                    color: post.category.color || undefined,
                  }}
                >
                  {post.category.title}
                </Link>
              )}
              {date && (
                <time dateTime={post.publishedAt} className="text-sm text-muted-foreground">
                  {date}
                </time>
              )}
            </div>

            {/* Title */}
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-balance">
              {post.title}
            </h1>

            {/* Author */}
            {post.author && (
              <p className="text-muted-foreground mb-8">By {post.author}</p>
            )}

            {/* Highlight Image */}
            {post.highlightImage && (
              <div className="aspect-[16/9] overflow-hidden rounded-lg bg-muted mb-10">
                <SanityImage
                  image={post.highlightImage}
                  alt={post.highlightImage.alt || post.title}
                  width={1200}
                  height={675}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
            )}

            {/* Content */}
            {post.content && (
              <div className="prose prose-lg max-w-none">
                <PortableText value={post.content} components={portableTextComponents} />
              </div>
            )}

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-border">
                {post.tags.map((tag) => (
                  <Link
                    key={tag._id}
                    href={`/blog/category/${post.category?.slug}?tag=${tag.slug}`}
                    className="px-3 py-1 text-sm bg-muted rounded-full hover:bg-border transition-colors"
                  >
                    {tag.title}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Related Posts */}
          {post.relatedPosts && post.relatedPosts.length > 0 && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-16 border-t border-border">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-10">Related Posts</h2>
              <BlogPostGrid posts={post.relatedPosts} />
            </div>
          )}
        </article>
      </main>
      <Footer siteSettings={settings} footerData={footerData} />
      <JsonLd data={jsonLd} />
    </>
  )
}
```

**Step 2: Verify**

Run: `npm run typecheck`
Expected: No errors.

**Step 3: Commit**

```bash
git add app/blog/[slug]/page.tsx
git commit -m "feat: add blog post detail route with JSON-LD"
```

---

## Task 16: Category Listing Route — `/blog/category/[slug]`

**Files:**
- Create: `app/blog/category/[slug]/page.tsx`

**Step 1: Create category listing page**

```typescript
// app/blog/category/[slug]/page.tsx
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { sanityFetch } from '@/sanity/lib/live'
import { client } from '@/sanity/lib/client'
import {
  SITE_SETTINGS_QUERY,
  HEADER_QUERY,
  FOOTER_QUERY,
  CATEGORY_QUERY,
  CATEGORY_SLUGS_QUERY,
  TAGS_BY_CATEGORY_QUERY,
  BLOG_POSTS_BY_CATEGORY_QUERY,
  BLOG_POSTS_BY_CATEGORY_COUNT_QUERY,
} from '@/sanity/lib/queries'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import BlogPostGrid from '@/components/blog/BlogPostGrid'
import Pagination from '@/components/blog/Pagination'
import CategoryFilter from '@/components/blog/CategoryFilter'
import JsonLd from '@/components/seo/JsonLd'
import { webPageJsonLd } from '@/lib/structuredData'

const POSTS_PER_PAGE = 12

interface CategoryPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string; tag?: string }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const [{ data: category }, { data: settings }] = await Promise.all([
    sanityFetch({ query: CATEGORY_QUERY, params: { slug }, tags: ['categories'] }),
    sanityFetch({ query: SITE_SETTINGS_QUERY, tags: ['siteSettings'] }),
  ])
  if (!category) return {}
  return {
    title: `${category.title} — Blog — ${settings?.name || 'Blog'}`,
    description: category.description || `Posts in ${category.title}`,
  }
}

export async function generateStaticParams() {
  const categories = await client.withConfig({ stega: false }).fetch(CATEGORY_SLUGS_QUERY)
  return (categories || []).map((c: { slug: string }) => ({ slug: c.slug }))
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params
  const { page, tag } = await searchParams
  const currentPage = Math.max(1, parseInt(page || '1', 10) || 1)
  const start = (currentPage - 1) * POSTS_PER_PAGE
  const end = start + POSTS_PER_PAGE
  const tagSlug = tag || ''

  const [
    { data: settings },
    { data: headerData },
    { data: footerData },
    { data: category },
    { data: tags },
    { data: posts },
    { data: totalCount },
  ] = await Promise.all([
    sanityFetch({ query: SITE_SETTINGS_QUERY, tags: ['siteSettings'] }),
    sanityFetch({ query: HEADER_QUERY, tags: ['header'] }),
    sanityFetch({ query: FOOTER_QUERY, tags: ['footer'] }),
    sanityFetch({ query: CATEGORY_QUERY, params: { slug }, tags: ['categories'] }),
    sanityFetch({ query: TAGS_BY_CATEGORY_QUERY, params: { categorySlug: slug }, tags: ['tags'] }),
    sanityFetch({
      query: BLOG_POSTS_BY_CATEGORY_QUERY,
      params: { categorySlug: slug, tagSlug, start, end },
      tags: ['blogPosts'],
    }),
    sanityFetch({
      query: BLOG_POSTS_BY_CATEGORY_COUNT_QUERY,
      params: { categorySlug: slug, tagSlug },
      tags: ['blogPosts'],
    }),
  ])

  if (!category) notFound()

  const totalPages = Math.ceil((totalCount || 0) / POSTS_PER_PAGE)
  const basePath = `/blog/category/${slug}`
  const paginationParams = tag ? { tag } : undefined

  return (
    <>
      <Header
        siteSettings={settings}
        megaNavigation={headerData?.megaNavigation}
        secondaryNavigation={headerData?.secondaryNavigation}
        cta={headerData?.cta}
      />
      <main id="main">
        <section className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-4">{category.title}</h1>
            {category.description && (
              <p className="text-muted-foreground text-lg mb-10 max-w-2xl">{category.description}</p>
            )}
            <CategoryFilter
              tags={tags || []}
              basePath={basePath}
              categoryColor={category.color}
            />
            <BlogPostGrid posts={posts || []} />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              basePath={basePath}
              searchParams={paginationParams}
            />
          </div>
        </section>
      </main>
      <Footer siteSettings={settings} footerData={footerData} />
      <JsonLd data={webPageJsonLd(category.title, category.description, basePath)} />
    </>
  )
}
```

**Step 2: Verify**

Run: `npm run typecheck`
Expected: No errors.

**Step 3: Commit**

```bash
git add app/blog/category/[slug]/page.tsx
git commit -m "feat: add category listing route with tag filtering"
```

---

## Task 17: Header Rewrite — Mega Menu

**Files:**
- Rewrite: `components/layout/Header.tsx`

**Step 1: Rewrite Header component**

Replace the entire content of `components/layout/Header.tsx`:

```typescript
'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { stegaClean } from '@sanity/client/stega'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { fadeInUp } from '@/lib/animations'
import MobileNav from './MobileNav'
import type { SanityImageSource } from '@sanity/image-url'
import SanityImage from '@/components/sanity/SanityImage'
import type { MegaMenuGroup } from '@/types'

interface HeaderProps {
  siteSettings?: {
    name?: string
    logo?: SanityImageSource
    reservationUrl?: string
  }
  megaNavigation?: MegaMenuGroup[]
  secondaryNavigation?: Array<{ _key: string; label: string; href: string }>
  cta?: { label: string; href: string }
}

const defaultNavLinks = [
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
]

export default function Header({ siteSettings, megaNavigation, secondaryNavigation, cta }: HeaderProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const pathname = usePathname()

  const hasMegaNav = megaNavigation && megaNavigation.length > 0
  const secondaryLinks = secondaryNavigation?.length
    ? secondaryNavigation.map((n) => ({ href: stegaClean(n.href), label: n.label, _key: n._key }))
    : null
  const flatNavLinks = !hasMegaNav
    ? (secondaryLinks?.map((n) => ({ href: n.href, label: n.label })) || defaultNavLinks)
    : null

  const ctaHref = stegaClean(cta?.href || siteSettings?.reservationUrl || '')
  const ctaLabel = cta?.label || 'Get Started'
  const isExternal = ctaHref.startsWith('http')

  const handleDropdownEnter = useCallback((key: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current)
    setOpenDropdown(key)
  }, [])

  const handleDropdownLeave = useCallback(() => {
    dropdownTimeoutRef.current = setTimeout(() => setOpenDropdown(null), 150)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenDropdown(null)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Close dropdown on route change
  useEffect(() => {
    setOpenDropdown(null)
  }, [pathname])

  return (
    <motion.header
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border"
    >
      {/* Secondary Nav Bar (only when mega nav is active) */}
      {hasMegaNav && secondaryLinks && (
        <div className="hidden md:block bg-muted border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-end gap-6 h-9">
              {secondaryLinks.map((link) => (
                <Link
                  key={link._key}
                  href={link.href}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              {ctaHref && (
                <a
                  href={ctaHref}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  className="text-xs font-semibold text-primary hover:text-primary-light transition-colors"
                >
                  {ctaLabel}
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo / Name */}
          <Link href="/" className="flex items-center gap-3">
            {siteSettings?.logo ? (
              <SanityImage
                image={siteSettings.logo}
                alt={siteSettings.name || 'Home'}
                width={40}
                height={40}
                className="h-8 w-auto sm:h-10"
              />
            ) : (
              <span className="font-serif text-xl sm:text-2xl font-bold">
                {siteSettings?.name || 'Blog'}
              </span>
            )}
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {hasMegaNav ? (
              /* Mega Menu */
              megaNavigation.map((group) => {
                const key = group._key
                const hasChildren = group.children && group.children.length > 0
                const isOpen = openDropdown === key
                const groupHref = stegaClean(group.href || '')

                return (
                  <div
                    key={key}
                    className="relative"
                    onMouseEnter={() => hasChildren && handleDropdownEnter(key)}
                    onMouseLeave={handleDropdownLeave}
                  >
                    {groupHref && !hasChildren ? (
                      <Link
                        href={groupHref}
                        className="text-sm uppercase tracking-wider hover:text-primary transition-colors py-2"
                      >
                        {group.label}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        className="text-sm uppercase tracking-wider hover:text-primary transition-colors py-2 flex items-center gap-1"
                        aria-expanded={isOpen}
                        aria-haspopup={hasChildren ? 'true' : undefined}
                        onClick={() => hasChildren && setOpenDropdown(isOpen ? null : key)}
                      >
                        {group.label}
                        {hasChildren && (
                          <svg
                            className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        )}
                      </button>
                    )}

                    {/* Dropdown */}
                    {hasChildren && isOpen && (
                      <div
                        className="absolute top-full left-0 mt-0 min-w-[200px] bg-background border border-border rounded-lg shadow-lg py-2 z-50"
                        onMouseEnter={() => handleDropdownEnter(key)}
                        onMouseLeave={handleDropdownLeave}
                      >
                        {groupHref && (
                          <Link
                            href={groupHref}
                            className="block px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted hover:text-primary transition-colors"
                          >
                            All {group.label}
                          </Link>
                        )}
                        {group.children!.map((child) => (
                          <Link
                            key={child._key}
                            href={stegaClean(child.href)}
                            className="block px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-primary transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })
            ) : (
              /* Flat Nav Fallback */
              flatNavLinks!.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={pathname === link.href ? 'page' : undefined}
                  className="text-sm uppercase tracking-wider hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))
            )}

            {/* CTA (only in flat nav mode — mega nav shows CTA in secondary bar) */}
            {!hasMegaNav && ctaHref && (
              <a
                href={ctaHref}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                className="bg-primary text-white px-4 py-2 text-sm uppercase tracking-wider hover:bg-primary-light transition-colors"
              >
                {ctaLabel}
              </a>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            ref={menuButtonRef}
            className="md:hidden touch-target flex items-center justify-center"
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
        pathname={pathname}
        megaNavigation={megaNavigation}
        links={
          hasMegaNav
            ? [
                ...(secondaryLinks?.map((l) => ({ href: l.href, label: l.label })) || []),
                ...(ctaHref ? [{ href: ctaHref, label: ctaLabel }] : []),
              ]
            : [
                ...(flatNavLinks || []),
                ...(ctaHref ? [{ href: ctaHref, label: ctaLabel }] : []),
              ]
        }
      />
    </motion.header>
  )
}
```

**Step 2: Verify**

Run: `npm run typecheck`
Expected: May have errors from MobileNav not yet accepting `megaNavigation` prop. That's fixed in the next task.

**Step 3: Commit (after Task 18)**

Hold commit until MobileNav is updated.

---

## Task 18: MobileNav Rewrite — Accordion Mega Menu

**Files:**
- Rewrite: `components/layout/MobileNav.tsx`

**Step 1: Rewrite MobileNav**

Replace the entire content of `components/layout/MobileNav.tsx`:

```typescript
'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { stegaClean } from '@sanity/client/stega'
import type { NavLink, MegaMenuGroup } from '@/types'

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
  links: NavLink[]
  megaNavigation?: MegaMenuGroup[]
  triggerRef: React.RefObject<HTMLButtonElement | null>
  pathname?: string
}

export default function MobileNav({ isOpen, onClose, links, megaNavigation, triggerRef, pathname }: MobileNavProps) {
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null)
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
      setExpandedGroup(null)
    }

    return () => {
      document.body.style.overflow = 'unset'
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, handleKeyDown, triggerRef])

  if (!isOpen) return null

  const hasMegaNav = megaNavigation && megaNavigation.length > 0

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
            className="self-end touch-target flex items-center justify-center mb-4"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <nav role="navigation" aria-label="Mobile navigation">
            <div className="flex flex-col space-y-1">
              {/* Mega Nav Groups */}
              {hasMegaNav &&
                megaNavigation.map((group) => {
                  const key = group._key
                  const hasChildren = group.children && group.children.length > 0
                  const isExpanded = expandedGroup === key
                  const groupHref = stegaClean(group.href || '')

                  if (!hasChildren) {
                    return (
                      <Link
                        key={key}
                        href={groupHref || '#'}
                        className="text-lg font-serif font-semibold text-foreground hover:text-primary transition-colors py-3 touch-target"
                        onClick={onClose}
                      >
                        {group.label}
                      </Link>
                    )
                  }

                  return (
                    <div key={key}>
                      <button
                        type="button"
                        className="w-full flex items-center justify-between text-lg font-serif font-semibold text-foreground hover:text-primary transition-colors py-3 touch-target"
                        aria-expanded={isExpanded}
                        onClick={() => setExpandedGroup(isExpanded ? null : key)}
                      >
                        {group.label}
                        <svg
                          className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {isExpanded && (
                        <div className="flex flex-col space-y-1 pl-4 pb-2">
                          {groupHref && (
                            <Link
                              href={groupHref}
                              className="text-base text-muted-foreground hover:text-primary transition-colors py-2 touch-target font-medium"
                              onClick={onClose}
                            >
                              All {group.label}
                            </Link>
                          )}
                          {group.children!.map((child) => (
                            <Link
                              key={child._key}
                              href={stegaClean(child.href)}
                              className="text-base text-muted-foreground hover:text-primary transition-colors py-2 touch-target"
                              onClick={onClose}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}

              {/* Divider between mega nav and secondary links */}
              {hasMegaNav && links.length > 0 && (
                <div className="border-t border-border my-2" />
              )}

              {/* Secondary / Flat Links */}
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={pathname === link.href ? 'page' : undefined}
                  className="text-base text-foreground hover:text-primary transition-colors py-3 touch-target"
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

**Step 2: Verify**

Run: `npm run typecheck`
Expected: No errors.

**Step 3: Commit Header + MobileNav together**

```bash
git add components/layout/Header.tsx components/layout/MobileNav.tsx
git commit -m "feat: rewrite Header with mega-menu and MobileNav with accordion groups"
```

---

## Task 19: Update All Page Components for New Header Props

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/[slug]/page.tsx`
- Modify: Any other page files that render `<Header>`

**Step 1: Check all files that import Header**

Search for `<Header` usage across all page files. Each one currently passes `navigation={headerData?.navigation}` which no longer exists. Update them all to pass:

```tsx
<Header
  siteSettings={settings}
  megaNavigation={headerData?.megaNavigation}
  secondaryNavigation={headerData?.secondaryNavigation}
  cta={headerData?.cta}
/>
```

Files to update:
- `app/page.tsx` — replace line with `<Header siteSettings={settings} navigation={headerData?.navigation} cta={headerData?.cta} />`
- `app/[slug]/page.tsx` — same replacement
- Any other page files (`app/faq/page.tsx`, `app/contact/page.tsx`, etc.) — search and update all

**Step 2: Verify**

Run: `npm run typecheck`
Expected: No errors.

**Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds.

**Step 4: Commit**

```bash
git add app/
git commit -m "refactor: update all pages to use new Header mega-navigation props"
```

---

## Task 20: Update CLAUDE.md

**Files:**
- Modify: `CLAUDE.md`

**Step 1: Update documentation**

Update the following sections of `CLAUDE.md`:

- **File Structure**: Add blog routes (`app/blog/`), blog components (`components/blog/`), new schema files
- **Adding a New Page**: Keep existing guidance, mention blog routes as example of custom logic pages
- **Page Builder Pattern**: Update section count from 16 to 17, add `blogGrid` to the list
- **ISR + Webhook Revalidation**: Add `blogPost`, `category`, `tag` to the REVALIDATION_MAP documentation
- **Header/Navigation section**: Document the dual-navigation system (mega menu + secondary)

**Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: update CLAUDE.md with blog system and mega-menu documentation"
```

---

## Task 21: Final Verification

**Step 1: Run typegen**

```bash
npm run typegen
```

Expected: Types regenerate successfully.

**Step 2: Run typecheck**

```bash
npm run typecheck
```

Expected: No TypeScript errors.

**Step 3: Run build**

```bash
npm run build
```

Expected: Production build succeeds with no errors.

**Step 4: Run dev and manual test**

```bash
npm run dev
```

Verify:
- `/studio` — Blog > Posts, Categories, Tags sections appear in desk structure
- Header singleton has Mega Menu Navigation and Secondary Navigation fields
- HomePage and ModularPage editors show BlogGrid as a section option
- `/blog` — renders (empty state if no posts)
- Create a test category, tag, and blog post in Studio
- `/blog` — post card appears
- `/blog/[slug]` — post detail renders with content
- `/blog/category/[slug]` — category page with tag filter pills
- Mega menu (if configured) opens on hover, closes on Escape
- Mobile nav accordion expands/collapses groups
- Header falls back to flat nav when mega menu is empty

**Step 5: Commit any fixes**

Fix any issues found during manual testing and commit.

---

## Summary

| Task | Description | Files Changed |
|------|-------------|---------------|
| 0 | Fresh git repo | `.git` |
| 1 | Category schema | 2 |
| 2 | Tag schema | 2 |
| 3 | BlogPost schema | 3 |
| 4 | MegaMenuGroup + header update | 3 |
| 5 | BlogGrid section schema | 4 |
| 6 | TypeScript types | 1 |
| 7 | GROQ queries | 1 |
| 8 | Revalidation, desk structure, sitemap | 3 |
| 9 | BlogPosting JSON-LD | 1 |
| 10 | BlogPostCard + BlogPostGrid | 2 |
| 11 | Pagination | 1 |
| 12 | CategoryFilter | 1 |
| 13 | BlogGridSection + SectionRenderer | 2 |
| 14 | Blog listing route | 1 |
| 15 | Blog post route | 1 |
| 16 | Category listing route | 1 |
| 17 | Header rewrite | 1 |
| 18 | MobileNav rewrite | 1 |
| 19 | Update all page Header props | 2+ |
| 20 | Update CLAUDE.md | 1 |
| 21 | Final verification | 0 |
