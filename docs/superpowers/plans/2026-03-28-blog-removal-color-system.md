# Blog Removal + Color System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove all blog-related code from the Bonsai starter and update the color system to Beren's Figma-extracted palette.

**Architecture:** Two sequential phases — blog removal (delete 14 files, modify 11) then color system update (modify 3 files). Each phase ends with a typecheck gate.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Sanity v3

**Spec:** `docs/superpowers/specs/2026-03-28-blog-removal-color-system-design.md`

---

## Phase 1: Blog Removal

### Task 1: Delete blog route files

**Files:**
- Delete: `app/(site)/blog/page.tsx`
- Delete: `app/(site)/blog/[slug]/page.tsx`
- Delete: `app/(site)/blog/category/[slug]/page.tsx`
- Delete: `app/(site)/llms.txt/route.ts`
- Delete: `app/(site)/llms-full.txt/route.ts`

- [ ] **Step 1: Delete the blog directory and llms routes**

```bash
rm -rf app/\(site\)/blog
rm -f app/\(site\)/llms.txt/route.ts
rm -f app/\(site\)/llms-full.txt/route.ts
rmdir app/\(site\)/llms.txt 2>/dev/null
rmdir app/\(site\)/llms-full.txt 2>/dev/null
```

---

### Task 2: Delete blog component files

**Files:**
- Delete: `components/blog/BlogPostCard.tsx`
- Delete: `components/blog/BlogPostGrid.tsx`
- Delete: `components/blog/CategoryFilter.tsx`
- Delete: `components/blog/Pagination.tsx`
- Delete: `components/sections/BlogGridSection.tsx`

- [ ] **Step 1: Delete the blog components directory and BlogGridSection**

```bash
rm -rf components/blog
rm -f components/sections/BlogGridSection.tsx
```

---

### Task 3: Delete blog Sanity schema files

**Files:**
- Delete: `sanity/schemaTypes/sections/blogGrid.ts`
- Delete: `sanity/schemaTypes/documents/blogPost.ts`
- Delete: `sanity/schemaTypes/documents/category.ts`
- Delete: `sanity/schemaTypes/documents/tag.ts`

- [ ] **Step 1: Delete the schema files**

```bash
rm -f sanity/schemaTypes/sections/blogGrid.ts
rm -f sanity/schemaTypes/documents/blogPost.ts
rm -f sanity/schemaTypes/documents/category.ts
rm -f sanity/schemaTypes/documents/tag.ts
```

---

### Task 4: Remove blog registrations from schema index

**Files:**
- Modify: `sanity/schemaTypes/index.ts:26,44-46,73,89-91`

- [ ] **Step 1: Remove the blogGrid section import (line 26)**

Remove this line:
```ts
import blogGrid from './sections/blogGrid'
```

- [ ] **Step 2: Remove the blog document imports (lines 44-46)**

Remove these lines:
```ts
import category from './documents/category'
import tag from './documents/tag'
import blogPost from './documents/blogPost'
```

- [ ] **Step 3: Remove blogGrid from schemaTypes array (line 73)**

Remove this line from the array:
```ts
  blogGrid,
```

- [ ] **Step 4: Remove blog document registrations from schemaTypes array (lines 89-91)**

Remove these lines from the array:
```ts
  category,
  tag,
  blogPost,
```

---

### Task 5: Remove blog from Sanity desk structure

**Files:**
- Modify: `sanity/structure/index.ts:11-13,33-46`

- [ ] **Step 1: Remove unused icon imports (lines 11-13)**

Remove `DocumentTextIcon`, `TagIcon`, `TagsIcon` from the import block (lines 11-13). Keep all other icons.

- [ ] **Step 2: Remove the entire Blog listItem group (lines 33-46)**

Remove this block:
```ts
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
```

---

### Task 6: Remove blog queries from queries.ts

**Files:**
- Modify: `sanity/lib/queries.ts:144-151,185-320`

- [ ] **Step 1: Remove blogGrid projection from MODULAR_PAGE_SECTIONS_PROJECTION (lines 144-151)**

Remove this block from the projection:
```groq
    _type == "blogGrid" => {
      heading, source, limit, showViewAll, viewAllHref,
      category-> { _id, title, "slug": slug.current, color },
      posts[]-> {
        _id, _type, title, "slug": slug.current, publishedAt, excerpt, highlightImage, author,
        category-> { title, "slug": slug.current, color }
      }
    },
```

- [ ] **Step 2: Remove LLMS_TXT_QUERY and LLMS_FULL_TXT_QUERY (lines 185-211)**

Remove the entire section from `// ─── LLMs.txt` through the end of `LLMS_FULL_TXT_QUERY`.

- [ ] **Step 3: Remove all blog queries (lines 213-320)**

Remove everything from `// ─── Blog` through the end of `CATEGORY_SLUGS_QUERY`. This removes:
- `BLOG_POST_CARD_PROJECTION`
- `BLOG_POSTS_QUERY`
- `BLOG_POSTS_COUNT_QUERY`
- `BLOG_POST_QUERY`
- `BLOG_POSTS_BY_CATEGORY_QUERY`
- `BLOG_POSTS_BY_CATEGORY_COUNT_QUERY`
- `ALL_CATEGORIES_QUERY`
- `CATEGORY_QUERY`
- `TAGS_BY_CATEGORY_QUERY`
- `BLOG_POST_SLUGS_QUERY`
- `CATEGORY_SLUGS_QUERY`

---

### Task 7: Remove blogGrid from SectionRenderer

**Files:**
- Modify: `components/sections/SectionRenderer.tsx:18,38`

- [ ] **Step 1: Remove BlogGridSection import (line 18)**

Remove:
```ts
import BlogGridSection from '@/components/sections/BlogGridSection'
```

- [ ] **Step 2: Remove blogGrid mapping (line 38)**

Remove this line from the `sectionComponents` object:
```ts
  blogGrid: BlogGridSection,
```

---

### Task 8: Remove blogGrid from page schema section arrays

**Files:**
- Modify: `sanity/schemaTypes/documents/modularPage.ts:55`
- Modify: `sanity/schemaTypes/singletons/homePage.ts:37`

- [ ] **Step 1: Remove blogGrid from modularPage sections (line 55)**

Remove:
```ts
        defineArrayMember({ type: 'blogGrid' }),
```

- [ ] **Step 2: Remove blogGrid from homePage sections (line 37)**

Remove:
```ts
        defineArrayMember({ type: 'blogGrid' }),
```

---

### Task 9: Remove blog entries from revalidation map

**Files:**
- Modify: `app/(site)/api/revalidate/route.ts:18-20`

- [ ] **Step 1: Remove blog entries from REVALIDATION_MAP**

Remove these three lines:
```ts
  blogPost: ['blogPosts'],
  category: ['categories', 'blogPosts'],
  tag: ['tags', 'blogPosts'],
```

---

### Task 10: Remove blog references from sitemap

**Files:**
- Modify: `app/(site)/sitemap.ts:3,11,20-24,33-47`

- [ ] **Step 1: Remove blog query imports (line 3)**

Change:
```ts
import { SITEMAP_QUERY, BLOG_POST_SLUGS_QUERY, CATEGORY_SLUGS_QUERY } from '@/sanity/lib/queries'
```
To:
```ts
import { SITEMAP_QUERY } from '@/sanity/lib/queries'
```

- [ ] **Step 2: Remove /blog static route (line 11)**

Remove:
```ts
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
```

- [ ] **Step 3: Simplify the dynamic routes fetch (lines 20-24)**

Replace the `Promise.all` with a single fetch:
```ts
    const pages = await sitemapClient.fetch(SITEMAP_QUERY)
```

- [ ] **Step 4: Remove post and category route mappings (lines 33-47)**

Remove the `postRoutes` and `categoryRoutes` blocks, and simplify `dynamicRoutes`:
```ts
    dynamicRoutes = [...pageRoutes]
```

---

### Task 11: Update Header defaults

**Files:**
- Modify: `components/layout/Header.tsx:27,123`

- [ ] **Step 1: Remove Blog from defaultNavLinks (line 27)**

Remove:
```ts
  { href: '/blog', label: 'Blog' },
```

- [ ] **Step 2: Change 'Blog' fallback to 'Beren' (line 123)**

Change:
```ts
                {siteSettings?.name || 'Blog'}
```
To:
```ts
                {siteSettings?.name || 'Beren'}
```

---

### Task 12: Remove blog types

**Files:**
- Modify: `types/index.ts:164-214,379-390,411`

- [ ] **Step 1: Remove Category, Tag, BlogPost, BlogPostCard interfaces (lines 164-214)**

Remove the entire block from `/** Category` through the closing `}` of `BlogPostCard` (lines 164-214).

- [ ] **Step 2: Remove ModularBlogGrid interface (lines 379-390)**

Remove:
```ts
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

- [ ] **Step 3: Remove ModularBlogGrid from union type (line 411)**

Remove:
```ts
  | ModularBlogGrid
```

---

### Task 13: Remove blogPostJsonLd from structured data

**Files:**
- Modify: `lib/structuredData.ts:51-84`

- [ ] **Step 1: Remove blogPostJsonLd function (lines 51-84)**

Remove the entire `blogPostJsonLd` function.

---

### Task 14: Typecheck gate

- [ ] **Step 1: Run typecheck**

```bash
npm run typecheck
```

Expected: zero errors. If errors found, fix any remaining broken imports before proceeding.

- [ ] **Step 2: Commit blog removal**

```bash
git add -A
git commit -m "Remove all blog-related code from Bonsai starter

Delete blog routes, components, Sanity schemas, queries, types,
and all references. Strip llms.txt routes. Clean up sitemap,
revalidation map, Header defaults, and SectionRenderer."
```

---

## Phase 2: Color System Update

### Task 15: Update CSS custom properties

**Files:**
- Modify: `app/globals.css:34-43`

- [ ] **Step 1: Replace the `:root` color variables (lines 38-42)**

Change:
```css
  --color-background: #D5D0CB;
  --color-foreground: #1A1A1A;
  --color-muted: #C8C3BE;
  --color-muted-foreground: #6B6560;
  --color-border: #B8B3AE;
```

To:
```css
  --color-background: #86351C;
  --color-background-light: #E8E7DC;
  --color-foreground: #DCDBC4;
  --color-foreground-dark: #86351C;
  --color-muted: #6E2C17;
  --color-muted-foreground: #E8E7DC;
  --color-border: #A0543F;
  --color-accent: #FF5B00;
```

---

### Task 16: Update Tailwind color configuration

**Files:**
- Modify: `tailwind.config.ts:10-19`

- [ ] **Step 1: Replace the colors object (lines 10-19)**

Change:
```ts
      colors: {
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",

        muted: {
          DEFAULT: "var(--color-muted)",
          foreground: "var(--color-muted-foreground)",
        },
        border: "var(--color-border)",
      },
```

To:
```ts
      colors: {
        background: {
          DEFAULT: "var(--color-background)",
          light: "var(--color-background-light)",
        },
        foreground: {
          DEFAULT: "var(--color-foreground)",
          dark: "var(--color-foreground-dark)",
        },
        muted: {
          DEFAULT: "var(--color-muted)",
          foreground: "var(--color-muted-foreground)",
        },
        border: "var(--color-border)",
        accent: "var(--color-accent)",
      },
```

Note: `bg-background` and `text-foreground` continue to work — Tailwind resolves `DEFAULT` from nested objects.

---

### Task 17: Update CLAUDE.md color table

**Files:**
- Modify: `CLAUDE.md` — Color System section

- [ ] **Step 1: Replace the color table in CLAUDE.md (lines 258-273)**

Replace the entire block from `## Color System` through the `**Note:**` paragraph with:

```markdown
## Color System

CSS variables defined in `app/globals.css`, mapped to Tailwind in `tailwind.config.ts`:

| Variable                      | Value     | Tailwind Class            |
| ----------------------------- | --------- | ------------------------- |
| `--color-background`          | `#86351C` | `bg-background`           |
| `--color-background-light`    | `#E8E7DC` | `bg-background-light`     |
| `--color-foreground`          | `#DCDBC4` | `text-foreground`         |
| `--color-foreground-dark`     | `#86351C` | `text-foreground-dark`    |
| `--color-muted`               | `#6E2C17` | `bg-muted`                |
| `--color-muted-foreground`    | `#E8E7DC` | `text-muted-foreground`   |
| `--color-border`              | `#A0543F` | `border-border`           |
| `--color-accent`              | `#FF5B00` | `bg-accent`/`text-accent` |

Dark terracotta + warm cream two-tone system with bright orange accent. Headlines/nav use `--color-foreground` (#DCDBC4), body copy uses `--color-muted-foreground` (#E8E7DC). Light backgrounds (Menu page) use `bg-background-light` + `text-foreground-dark`.
```

The old content to replace (lines 258-273) starts with:
```
## Color System

CSS variables defined in `app/globals.css`, mapped to Tailwind in `tailwind.config.ts`. **Update these to match the Figma design:**
```
...and ends with:
```
**Note:** The exact hex values should be extracted from the Figma file — the values above are approximations from the screenshot. The design is predominantly **dark (terracotta) backgrounds with cream text**, with the Menu page being the exception (cream background with dark text).
```

---

### Task 18: Final verification and commit

- [ ] **Step 1: Run typecheck**

```bash
npm run typecheck
```

Expected: zero errors.

- [ ] **Step 2: Commit color system update**

```bash
git add app/globals.css tailwind.config.ts CLAUDE.md
git commit -m "Update color system to Beren's Figma palette

Replace neutral beige with terracotta/cream/orange brand colors.
Add background-light, foreground-dark, and accent variables.
Update Tailwind config from flat strings to nested objects."
```
