import { defineQuery } from 'next-sanity'

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

// ─── Footer ─────────────────────────────────────────────────────
export const FOOTER_QUERY = defineQuery(`
  *[_type == "footer"][0] {
    tagline,
    columns,
    copyrightText
  }
`)

// ─── Redirects (singleton — legacy) ─────────────────────────────
export const REDIRECTS_QUERY = defineQuery(`
  *[_type == "redirects"][0] {
    rules
  }
`)

// ─── Redirects (individual documents) ───────────────────────────
export const ACTIVE_REDIRECTS_QUERY = defineQuery(`
  *[_type == "redirect" && isActive == true] {
    source,
    destination,
    permanent
  }
`)

// ─── Home Page ──────────────────────────────────────────────────
// NOTE: HOME_PAGE_QUERY is below MODULAR_PAGE_SECTIONS_PROJECTION

// ─── FAQ ────────────────────────────────────────────────────────
export const FAQ_QUERY = defineQuery(`
  *[_type == "faqItem"] | order(order asc) {
    _id,
    question,
    answer,
    category
  }
`)

// ─── Modular Page (by slug) ─────────────────────────────────────
const MODULAR_PAGE_SECTIONS_PROJECTION = `
  sections[] {
    _type,
    _key,
    _type == "hero" => {
      headline, subheadline, ctaButtons, backgroundImage, layout
    },
    _type == "featureGrid" => {
      heading, subheading, features, columns
    },
    _type == "richTextBlock" => {
      heading, content
    },
    _type == "imageGallery" => {
      heading, images, layout
    },
    _type == "testimonialCarousel" => {
      heading,
      testimonials[]-> {
        _id, author, quote, rating, source
      },
      autoPlay
    },
    _type == "ctaBanner" => {
      heading, body, buttons, backgroundColor, textColor
    },
    _type == "videoSection" => {
      heading, videoUrl, posterImage, autoplay
    },
    _type == "teamGrid" => {
      heading, subheading,
      members[]-> {
        _id, name, role, image
      }
    },
    _type == "faqAccordion" => {
      heading,
      items[]-> {
        _id, question, answer
      }
    },
    _type == "statsBar" => {
      stats
    },
    _type == "logoBar" => {
      heading, logos, grayscale
    },
    _type == "spacer" => {
      size
    },
    _type == "newsletterSection" => {
      heading, subheading, placeholder, buttonText, backgroundColor
    },
    _type == "splitContent" => {
      heading, body, image, imagePosition, cta
    },
    _type == "contactForm" => {
      heading, subheading
    },
    _type == "embed" => {
      heading, embedType, embedUrl, aspectRatio
    },
    _type == "blogGrid" => {
      heading, source, limit, showViewAll, viewAllHref,
      category-> { _id, title, "slug": slug.current, color },
      posts[]-> {
        _id, _type, title, "slug": slug.current, publishedAt, excerpt, highlightImage, author,
        category-> { title, "slug": slug.current, color }
      }
    },
  }
`

export const HOME_PAGE_QUERY = defineQuery(`
  *[_type == "homePage"][0] {
    title,
    ${MODULAR_PAGE_SECTIONS_PROJECTION},
    seo
  }
`)

export const MODULAR_PAGE_QUERY = defineQuery(`
  *[_type == "modularPage" && slug.current == $slug][0] {
    title,
    ${MODULAR_PAGE_SECTIONS_PROJECTION},
    seo
  }
`)

export const MODULAR_PAGE_SLUGS_QUERY = defineQuery(`
  *[_type == "modularPage" && defined(slug.current)] {
    "slug": slug.current
  }
`)

// ─── Sitemap ────────────────────────────────────────────────────
export const SITEMAP_QUERY = defineQuery(`
  *[_type == "modularPage" && defined(slug.current)] {
    "slug": slug.current,
    _updatedAt
  }
`)

// ─── LLMs.txt ───────────────────────────────────────────────────
export const LLMS_TXT_QUERY = defineQuery(`
  {
    "settings": *[_type == "siteSettings"][0] { name, tagline, seo },
    "pages": *[_type == "modularPage"] | order(title asc) {
      title,
      _type,
      "slug": "/" + slug.current,
      "description": seo.metaDescription
    }
  }
`)

// ─── LLMs-full.txt ─────────────────────────────────────────────
export const LLMS_FULL_TXT_QUERY = defineQuery(`
  {
    "settings": *[_type == "siteSettings"][0] { name, tagline, seo },
    "faqs": *[_type == "faqItem"] | order(order asc) { question, answer },
    "team": *[_type == "teamMember"] | order(order asc) { name, role },
    "pages": *[_type == "modularPage"] | order(title asc) {
      title,
      _type,
      "slug": "/" + slug.current,
      "description": seo.metaDescription
    }
  }
`)

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

// ─── Promo Banner ────────────────────────────────────────────────
export const PROMO_BANNER_QUERY = defineQuery(`
  *[_type == "promoBanner" && isActive == true && (
    !defined(startDate) || dateTime(startDate) <= dateTime(now())
  ) && (
    !defined(endDate) || dateTime(endDate) >= dateTime(now())
  )] | order(_createdAt desc) [0] {
    _id,
    message,
    ctaText,
    ctaUrl,
    backgroundColor,
    textColor,
    dismissible,
    position
  }
`)
