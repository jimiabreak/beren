import type { PortableTextBlock as PTBlock } from '@portabletext/types'

// =============================================================================
// Sanity Helper Types
// =============================================================================

/** Sanity slug field */
export interface SanitySlug {
  _type: 'slug'
  current: string
}

/** Sanity reference to another document */
export interface SanityReference {
  _ref: string
  _type: 'reference'
}

/** Sanity image with optional hotspot */
export interface SanityImage {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  hotspot?: {
    x: number
    y: number
    height: number
    width: number
  }
  crop?: { top: number; bottom: number; left: number; right: number }
}

/** Sanity geopoint */
export interface SanityGeopoint {
  _type: 'geopoint'
  lat: number
  lng: number
  alt?: number
}

/** Portable Text block content (array of Sanity block nodes) */
export type PortableTextBlock = PTBlock[]

// =============================================================================
// Sanity Object Types (shared building blocks)
// =============================================================================

/** Social media link — matches sanity/schemaTypes/objects/socialLink.ts */
export interface SocialLink {
  _type: 'socialLink'
  _key: string
  platform: 'facebook' | 'instagram' | 'twitter' | 'tiktok' | 'yelp' | 'google' | 'youtube'
  url: string
}

/** Opening hours for a single day — matches sanity/schemaTypes/objects/openingHours.ts */
export interface OpeningHours {
  _type: 'openingHours'
  _key: string
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'
  openTime?: string
  closeTime?: string
  closed?: boolean
}

/** SEO metadata — matches sanity/schemaTypes/objects/seo.ts */
export interface SEO {
  _type: 'seo'
  metaTitle?: string
  metaDescription?: string
  ogImage?: SanityImage
  canonicalUrl?: string
  noIndex?: boolean
  noFollow?: boolean
}

/** Physical address (inline object on siteSettings) */
export interface Address {
  street?: string
  city?: string
  state?: string
  zip?: string
  country?: string
}

// =============================================================================
// Sanity Singleton Documents
// =============================================================================

/** Site Settings — matches sanity/schemaTypes/singletons/siteSettings.ts */
export interface SiteSettings {
  _id: string
  _type: 'siteSettings'
  name: string
  tagline?: string
  logo?: SanityImage
  logoAlt?: SanityImage
  phone?: string
  email?: string
  address?: Address
  location?: SanityGeopoint
  hours?: OpeningHours[]
  socialLinks?: SocialLink[]
  reservationUrl?: string
  seo?: SEO
}

/** Home Page — with modular sections */
export interface HomePage {
  _id: string
  _type: 'homePage'
  sections?: ModularPageSection[]
  seo?: SEO
}

// =============================================================================
// Sanity Document Types
// =============================================================================

/** Team Member — matches sanity/schemaTypes/documents/teamMember.ts */
export interface TeamMember {
  _id: string
  _type: 'teamMember'
  name: string
  role?: string
  bio?: PortableTextBlock
  image: SanityImage
  order?: number
}

/** Testimonial — matches sanity/schemaTypes/documents/testimonial.ts */
export interface Testimonial {
  _id: string
  _type: 'testimonial'
  author: string
  quote: string
  rating?: number
  source?: string
  date?: string
}

/** FAQ Item — matches sanity/schemaTypes/documents/faqItem.ts */
export interface FAQItem {
  _id: string
  _type: 'faqItem'
  question: string
  answer: PortableTextBlock
  category?: string
  order?: number
}

/** Gallery Image — matches sanity/schemaTypes/documents/galleryImage.ts */
export interface GalleryImage {
  _id: string
  _type: 'galleryImage'
  image: SanityImage
  alt: string
  caption?: string
  order?: number
}

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

/** Blog Post Card — projection subset for listings (slug projected as string) */
export interface BlogPostCard {
  _id: string
  _type: 'blogPost'
  title: string
  slug: string
  publishedAt: string
  excerpt?: string
  highlightImage?: SanityImage & { alt?: string }
  author?: string
  category: { title: string; slug: string; color?: string }
}

// =============================================================================
// Shared Object Types
// =============================================================================

/** CTA (call to action) button object */
export interface CTA {
  _type: 'cta'
  label: string
  href: string
}

// =============================================================================
// Page Builder Section Types
// =============================================================================

/** Hero section (modular) */
export interface ModularHero {
  _type: 'hero'
  _key: string
  headline?: string
  subheadline?: string
  ctaButtons?: Array<{ _key: string; label: string; url: string; variant?: 'primary' | 'secondary' | 'outline' }>
  backgroundImage?: SanityImage
  layout?: 'centered' | 'left-aligned' | 'split'
}

/** Feature grid section */
export interface ModularFeatureGrid {
  _type: 'featureGrid'
  _key: string
  heading?: string
  subheading?: string
  features?: Array<{ _key: string; icon?: string; title: string; description?: string }>
  columns?: 2 | 3 | 4
}

/** Rich text block section */
export interface ModularRichTextBlock {
  _type: 'richTextBlock'
  _key: string
  heading?: string
  content: PortableTextBlock
}

/** Image gallery section (modular) */
export interface ModularImageGallery {
  _type: 'imageGallery'
  _key: string
  heading?: string
  images?: Array<SanityImage & { _key: string; alt?: string; caption?: string }>
  layout?: 'grid' | 'carousel'
}

/** Testimonial carousel section */
export interface ModularTestimonialCarousel {
  _type: 'testimonialCarousel'
  _key: string
  heading?: string
  testimonials?: Testimonial[]
  autoPlay?: boolean
}

/** CTA banner section */
export interface ModularCtaBanner {
  _type: 'ctaBanner'
  _key: string
  heading?: string
  body?: string
  buttons?: Array<{ _key: string; label: string; url: string; variant?: 'primary' | 'secondary' | 'outline' }>
  backgroundColor?: string
  textColor?: string
}

/** Video section */
export interface ModularVideoSection {
  _type: 'videoSection'
  _key: string
  heading?: string
  videoUrl?: string
  posterImage?: SanityImage
  autoplay?: boolean
}

/** Team grid section */
export interface ModularTeamGrid {
  _type: 'teamGrid'
  _key: string
  heading?: string
  subheading?: string
  members?: TeamMember[]
}

/** FAQ accordion section */
export interface ModularFaqAccordion {
  _type: 'faqAccordion'
  _key: string
  heading?: string
  items?: FAQItem[]
}

/** Stats bar section (modular) */
export interface ModularStatsBar {
  _type: 'statsBar'
  _key: string
  stats?: Array<{ _key: string; value: string; label: string; prefix?: string; suffix?: string }>
}

/** Logo bar section (modular) */
export interface ModularLogoBar {
  _type: 'logoBar'
  _key: string
  heading?: string
  logos?: Array<SanityImage & { _key: string; alt?: string }>
  grayscale?: boolean
}

/** Spacer section */
export interface ModularSpacer {
  _type: 'spacer'
  _key: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

/** Newsletter section */
export interface ModularNewsletterSection {
  _type: 'newsletterSection'
  _key: string
  heading?: string
  subheading?: string
  placeholder?: string
  buttonText?: string
  backgroundColor?: string
}

/** Split content section (text + image side by side) */
export interface ModularSplitContent {
  _type: 'splitContent'
  _key: string
  heading?: string
  body?: PortableTextBlock
  image?: SanityImage
  imagePosition?: 'left' | 'right'
  cta?: CTA
}

/** Contact form section */
export interface ModularContactForm {
  _type: 'contactForm'
  _key: string
  heading?: string
  subheading?: string
}

/** Embed section (video, map, or custom iframe) */
export interface ModularEmbed {
  _type: 'embed'
  _key: string
  heading?: string
  embedType?: 'video' | 'map' | 'custom'
  embedUrl?: string
  aspectRatio?: '16:9' | '4:3' | '1:1' | '9:16'
}

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


/** Union of all modular section types */
export type ModularPageSection =
  | ModularHero
  | ModularFeatureGrid
  | ModularRichTextBlock
  | ModularImageGallery
  | ModularTestimonialCarousel
  | ModularCtaBanner
  | ModularVideoSection
  | ModularTeamGrid
  | ModularFaqAccordion
  | ModularStatsBar
  | ModularLogoBar
  | ModularSpacer
  | ModularNewsletterSection
  | ModularSplitContent
  | ModularContactForm
  | ModularEmbed
  | ModularBlogGrid

/** Modular Page document */
export interface ModularPage {
  _id: string
  _type: 'modularPage'
  title: string
  slug: SanitySlug
  sections?: ModularPageSection[]
  seo?: SEO
}

// =============================================================================
// Global Config Types
// =============================================================================

/** Header singleton */
export interface Header {
  _id: string
  _type: 'header'
  megaNavigation?: MegaMenuGroup[]
  secondaryNavigation?: Array<{ _key: string; label: string; href: string }>
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

// =============================================================================
// Component Props Types
// =============================================================================

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  ariaLabel?: string
  className?: string
  type?: 'button' | 'submit' | 'reset'
}

export interface CardProps {
  title?: string
  description?: string
  image?: string
  imageAlt?: string
  children?: React.ReactNode
  className?: string
  variant?: 'default' | 'elevated' | 'outline'
}

// =============================================================================
// Navigation Types
// =============================================================================

export interface NavLink {
  label: string
  href: string
  external?: boolean
}

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
