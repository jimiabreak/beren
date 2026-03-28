# Blog Removal + Color System Update

**Date:** 2026-03-28
**Status:** Approved
**Scope:** Remove all blog-related code from the Bonsai starter kit and update the color system to match Beren's Figma palette.

---

## Part 1: Blog Removal

### Files to Delete (14)

**Routes:**
- `app/(site)/blog/page.tsx` — blog listing with pagination
- `app/(site)/blog/[slug]/page.tsx` — blog post detail
- `app/(site)/blog/category/[slug]/page.tsx` — category listing
- `app/(site)/llms.txt/route.ts` — LLM crawler summary
- `app/(site)/llms-full.txt/route.ts` — extended LLM crawler summary

**Components:**
- `components/blog/BlogPostCard.tsx`
- `components/blog/BlogPostGrid.tsx`
- `components/blog/CategoryFilter.tsx`
- `components/blog/Pagination.tsx`
- `components/sections/BlogGridSection.tsx`

**Sanity Schemas:**
- `sanity/schemaTypes/sections/blogGrid.ts`
- `sanity/schemaTypes/documents/blogPost.ts`
- `sanity/schemaTypes/documents/category.ts`
- `sanity/schemaTypes/documents/tag.ts`

### Files to Modify (11)

| File | Changes |
|------|---------|
| `sanity/schemaTypes/index.ts` | Remove imports and registrations for blogGrid, blogPost, category, tag |
| `sanity/structure/index.ts` | Remove entire "Blog" listItem group (blogPost, category, tag) |
| `sanity/lib/queries.ts` | Remove `BLOG_POST_CARD_PROJECTION` and all 10 blog queries (`BLOG_POSTS_QUERY`, `BLOG_POSTS_COUNT_QUERY`, `BLOG_POST_QUERY`, `BLOG_POSTS_BY_CATEGORY_QUERY`, `BLOG_POSTS_BY_CATEGORY_COUNT_QUERY`, `ALL_CATEGORIES_QUERY`, `CATEGORY_QUERY`, `TAGS_BY_CATEGORY_QUERY`, `BLOG_POST_SLUGS_QUERY`, `CATEGORY_SLUGS_QUERY`); remove `LLMS_TXT_QUERY` and `LLMS_FULL_TXT_QUERY`; remove blogGrid block from `MODULAR_PAGE_SECTIONS_PROJECTION` |
| `components/sections/SectionRenderer.tsx` | Remove BlogGridSection import and `blogGrid` mapping entry |
| `sanity/schemaTypes/documents/modularPage.ts` | Remove `defineArrayMember({ type: 'blogGrid' })` from sections array |
| `sanity/schemaTypes/singletons/homePage.ts` | Remove `defineArrayMember({ type: 'blogGrid' })` from sections array |
| `app/(site)/api/revalidate/route.ts` | Remove blogPost, category, tag entries from `REVALIDATION_MAP` |
| `app/(site)/sitemap.ts` | Remove `BLOG_POST_SLUGS_QUERY` and `CATEGORY_SLUGS_QUERY` imports, `/blog` static route, post/category slug fetches and mappings |
| `components/layout/Header.tsx` | Remove `{ href: '/blog', label: 'Blog' }` from defaultNavLinks; change `'Blog'` site name fallback to `'Beren'` |
| `types/index.ts` | Remove `Category`, `Tag`, `BlogPost`, `BlogPostCard`, `ModularBlogGrid` interfaces and `ModularBlogGrid` from `ModularPageSection` union |
| `lib/structuredData.ts` | Remove `blogPostJsonLd` function |

### Verification

Run `npm run typecheck` — must pass with zero errors.

---

## Part 2: Color System Update

### Figma-Extracted Palette

| Color | Hex | Role |
|-------|-----|------|
| Dark terracotta | `#86351C` | Primary background; text on light surfaces |
| Warm cream | `#E8E7DC` | Secondary background (Menu page); body copy on dark surfaces |
| Light cream | `#DCDBC4` | Headlines, navigation, footer text on dark surfaces |
| Bright orange | `#FF5B00` | CTAs, active tab fills, accent borders, tagline emphasis |

### CSS Variable Mapping

**`app/globals.css` `:root`:**

```css
:root {
  --color-background: #86351C;
  --color-background-light: #E8E7DC;
  --color-foreground: #DCDBC4;
  --color-foreground-dark: #86351C;
  --color-muted: #6E2C17;
  --color-muted-foreground: #E8E7DC;
  --color-border: #A0543F;
  --color-accent: #FF5B00;
}
```

### Tailwind Configuration

**`tailwind.config.ts` colors — structural change from flat strings to nested objects:**

The existing config uses flat values (`background: "var(--color-background)"`). This changes `background` and `foreground` to nested objects with `DEFAULT` keys. Existing classes like `bg-background` and `text-foreground` continue to work (Tailwind resolves `DEFAULT`).

```ts
colors: {
  background: {
    DEFAULT: "var(--color-background)",
    light: "var(--color-background-light)",      // NEW
  },
  foreground: {
    DEFAULT: "var(--color-foreground)",
    dark: "var(--color-foreground-dark)",          // NEW
  },
  muted: {
    DEFAULT: "var(--color-muted)",
    foreground: "var(--color-muted-foreground)",
  },
  border: "var(--color-border)",
  accent: "var(--color-accent)",                   // NEW
}
```

### Resulting Tailwind Classes

| Class | Value | Usage |
|-------|-------|-------|
| `bg-background` | `#86351C` | Default dark page background |
| `bg-background-light` | `#E8E7DC` | Light sections (Menu page) |
| `text-foreground` | `#DCDBC4` | Headlines/nav on dark bg |
| `text-foreground-dark` | `#86351C` | Text on light bg |
| `text-muted-foreground` | `#E8E7DC` | Body copy on dark bg |
| `bg-muted` | `#6E2C17` | Subtle dark variation |
| `border-border` | `#A0543F` | Dividers, borders |
| `bg-accent` / `text-accent` | `#FF5B00` | CTAs, active states |

### CLAUDE.md Update

Update the Color System table to reflect the new values and new variables.

### Out of Scope

Per-component updates to use `bg-background-light` / `text-foreground-dark` on light sections (e.g., Menu page) — those will be done when building individual pages.

---

## Execution Order

1. Delete blog files
2. Modify files to remove blog references
3. Run `npm run typecheck` to verify clean removal
4. Update `globals.css` color variables
5. Update `tailwind.config.ts` color configuration
6. Update CLAUDE.md color table
7. Final `npm run typecheck`
