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
    _type == "ctaBanner" => {
      heading, body, buttons, backgroundColor, textColor
    },
    _type == "videoSection" => {
      heading, videoUrl, posterImage, autoplay
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
    _type == "locationTeaser" => {
      heading, subtitle, backgroundImage
    },
    _type == "homeAbout" => {
      tagline, body, image, ctaButtons
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

// ─── Our Story Page ─────────────────────────────────────────────
export const OUR_STORY_PAGE_QUERY = defineQuery(`
  *[_type == "ourStoryPage"][0] {
    heading,
    subheading,
    bodyParagraph1,
    bodyParagraph2
  }
`)

// ─── Catering Page ──────────────────────────────────────────────
export const CATERING_PAGE_QUERY = defineQuery(`
  *[_type == "cateringPage"][0] {
    heading,
    subheading,
    ctaButtonText,
    bodyParagraph1,
    bodyParagraph2,
    bodyParagraph3
  }
`)

// ─── Contact Page ───────────────────────────────────────────────
export const CONTACT_PAGE_QUERY = defineQuery(`
  *[_type == "contactPage"][0] {
    heading,
    formHeading,
    formDescription,
    gettingThereHeading,
    email,
    phone,
    website,
    addressLine1,
    addressLine2,
    hoursLine1Label,
    hoursLine1Time,
    hoursLine2Label,
    hoursLine2Time
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
