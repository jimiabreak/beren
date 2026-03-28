# Phase 1: Blog System + Mega-Menu Navigation — Design

**Date:** 2026-03-07
**Status:** Approved
**Scope:** Generic blog starter kit built on bonsai-blog boilerplate

## Context

Extend the bonsai-blog boilerplate (Next.js 14 + Sanity v3 + Tailwind + Framer Motion) with a full blog system and mega-menu navigation. This is a generic starter kit — no client-specific features. Designed for WordPress-refugee clients who need to build and launch posts entirely from Sanity CMS.

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Build order | Generic first, fork per-client | No cleanup pass needed; cleaner starter |
| Mega-menu control | Fully CMS-driven | Editors build entire nav structure in Sanity; matches WordPress mental model |
| Pagination | Numbered page links (`?page=N`) | SEO-friendly, bookmarkable, familiar to WP users |
| Post URLs | `/blog/[slug]` | No collision with `[slug]` catch-all; clean hierarchy |
| Posts per page | 12 | Fills 3-col grid evenly; reasonable page weight |
| BlogGrid sources | latest, category, manual | All three needed for homepage assembly |
| Author field | String, not document | YAGNI — upgrade to reference later if needed |

## Repo Setup

1. Remove `.git`, `git init` fresh — disconnect from `bonsai-kit` origin
2. Clean initial commit with current boilerplate
3. Build Phase 1 on top

## New Sanity Schemas (5)

### `category` (document)

- `title` (string, required)
- `slug` (slug, from title, required)
- `description` (text)
- `image` (image, hotspot)
- `color` (string — hex color for UI badges)
- `order` (number — manual sorting)

### `tag` (document)

- `title` (string, required)
- `slug` (slug, from title, required)
- `category` (reference to `category` — optional parent grouping)

### `blogPost` (document)

Groups: Post, Content, Meta, SEO

- `title` (string, required)
- `slug` (slug, from title, required)
- `publishedAt` (datetime, required)
- `excerpt` (text, max 200 chars)
- `highlightImage` (image with hotspot + alt text)
- `author` (string)
- `category` (reference to `category`, required)
- `tags` (array of references to `tag`)
- `content` (portableText — existing rich text type)
- `relatedPosts` (array of references to `blogPost`, max 3)
- `isFeatured` (boolean)
- `seo` (seo object)

### `megaMenuGroup` (object type)

- `label` (string, required)
- `href` (string — optional, makes group label a link)
- `children` (array of `{label, href}`)

### `blogGrid` (section type — page builder)

- `heading` (string)
- `source` (string list: "latest" | "category" | "manual")
- `category` (reference to `category` — visible when source is "category")
- `posts` (array of references to `blogPost` — visible when source is "manual")
- `limit` (number, default 3)
- `showViewAll` (boolean)
- `viewAllHref` (string)

## Schema Modifications

- `header.ts` — Add `megaNavigation` (array of `megaMenuGroup`), rename existing `navigation` to `secondaryNavigation`
- `homePage.ts` + `modularPage.ts` — Add `blogGrid` to sections array
- `portableText.ts` — Add `blogPost` to `internalLink` reference targets

## New Routes (3)

### `app/blog/page.tsx` — Blog listing

- Server component, paginated via `?page=` search param
- 12 posts/page, ordered by `publishedAt` desc
- Fetches total count for pagination
- Renders `BlogPostGrid` + `Pagination`

### `app/blog/[slug]/page.tsx` — Single blog post

- Server component, fetches post by slug
- Highlight image, title, date, author, category badge, tags, portable text content, related posts
- `generateStaticParams` for build-time generation
- BlogPosting JSON-LD structured data

### `app/blog/category/[slug]/page.tsx` — Category listing

- Posts filtered by category + optional `?tag=` param
- Same pagination (12/page)
- Category heading/description, tag filter pills
- `generateStaticParams` from all categories

## GROQ Queries (~10)

| Query | Purpose |
|-------|---------|
| `BLOG_POST_CARD_PROJECTION` | Shared fragment: title, slug, excerpt, publishedAt, highlightImage, category->{title, slug, color}, author |
| `BLOG_POSTS_QUERY` | Paginated listing with `[$start...$end]` slice |
| `BLOG_POSTS_COUNT_QUERY` | Total count for pagination |
| `BLOG_POST_QUERY` | Single post by slug (full content + related posts) |
| `BLOG_POSTS_BY_CATEGORY_QUERY` | By category slug, optional tag, paginated |
| `BLOG_POSTS_BY_CATEGORY_COUNT_QUERY` | Count for category+tag pagination |
| `ALL_CATEGORIES_QUERY` | All categories ordered by `order` |
| `CATEGORY_QUERY` | Single category by slug |
| `TAGS_BY_CATEGORY_QUERY` | Tags belonging to a category |
| `BLOG_POST_SLUGS_QUERY` | All slugs for `generateStaticParams` |

`blogGrid` section projection handles all three source modes inline in `MODULAR_PAGE_SECTIONS_PROJECTION`.

## New Components (7+)

### Blog Components

| Component | Type | Purpose |
|-----------|------|---------|
| `components/blog/BlogPostCard.tsx` | Client | Image, category badge, title, excerpt, date, author. Full card links to post. |
| `components/blog/BlogPostGrid.tsx` | Client | Responsive grid (1/2/3 col) with stagger animation. Empty state. |
| `components/blog/Pagination.tsx` | Server | Numbered `<Link>` elements, prev/next, ellipsis truncation. |
| `components/blog/CategoryFilter.tsx` | Client | Tag filter pills, URL-param based (`?tag=`), category-colored active state. |
| `components/sections/BlogGridSection.tsx` | Server | Page builder section. Fetches by source mode. Renders BlogPostGrid + View All link. |

### Header Rewrite

**`components/layout/Header.tsx`** — Major rewrite

Desktop layout:
- Top bar (optional): secondary nav + CTA — slim, muted
- Main bar: Logo left, mega-menu center/right
- Hover/click opens dropdown with children links
- Close on mouse leave, Escape, click outside
- `aria-expanded`, `aria-haspopup`, keyboard arrow navigation

Fallback: if `megaNavigation` is empty, renders `secondaryNavigation` as flat nav (backwards compatible).

**`components/layout/MobileNav.tsx`** — Extend

- Mega-menu groups as accordion items with chevron
- Children indented underneath
- Secondary nav as flat links below
- Existing focus trap/Escape handling unchanged

## Cache & Revalidation

New `REVALIDATION_MAP` entries:
- `blogPost` -> `['blogPosts']`
- `category` -> `['categories', 'blogPosts']`
- `tag` -> `['tags', 'blogPosts']`

## Sitemap

Add to `app/sitemap.ts`:
- Blog post URLs (`/blog/[slug]`) — priority 0.7
- Category URLs (`/blog/category/[slug]`) — priority 0.6

## Structured Data

New `blogPostJsonLd()` in `lib/structuredData.ts`:
- `@type: "BlogPosting"`
- headline, description, datePublished, dateModified, author (Person), image, publisher (Organization), mainEntityOfPage

## SEO Metadata

- `/blog` — "Blog — {siteName}"
- `/blog/[slug]` — Post title, excerpt, OG image, with SEO overrides
- `/blog/category/[slug]` — "Category — Blog — {siteName}"

## Desk Structure

```
Homepage
---
Pages
---
Blog
  Posts (ordered by publishedAt desc)
  Categories (ordered by order)
  Tags
---
Content Library
  Team / Testimonials / FAQ / Gallery
Submissions
---
Redirects / Promo Banners
---
Site
  Settings / Header / Footer / Redirects
```

## TypeScript Types

New interfaces: `Category`, `Tag`, `BlogPost`, `BlogPostCard`, `MegaMenuGroup`, `MegaMenuChild`, `ModularBlogGrid`

Updated: `ModularPageSection` union, `Header` interface for dual navigation.

## Not in Scope

- Search (separate project)
- Social sharing buttons (later)
- RSS feed (later)
- Breadcrumbs (later)
- Comments
- Author as document type
- Draft preview beyond existing Visual Editing
