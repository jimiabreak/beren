// Object types (shared building blocks)
import portableText from './objects/portableText'
import socialLink from './objects/socialLink'
import openingHours from './objects/openingHours'
import seo from './objects/seo'
import cta from './objects/cta'
import megaMenuGroup from './objects/megaMenuGroup'

// Page builder section types
import hero from './sections/hero'
import featureGrid from './sections/featureGrid'
import richTextBlock from './sections/richTextBlock'
import imageGallery from './sections/imageGallery'
import ctaBanner from './sections/ctaBanner'
import videoSection from './sections/videoSection'
import statsBar from './sections/statsBar'
import logoBar from './sections/logoBar'
import spacer from './sections/spacer'
import newsletterSection from './sections/newsletterSection'
import splitContent from './sections/splitContent'
import contactForm from './sections/contactForm'
import embed from './sections/embed'
import locationTeaser from './sections/locationTeaser'
import homeAbout from './sections/homeAbout'

// Singleton documents (one of each)
import siteSettings from './singletons/siteSettings'
import homePage from './singletons/homePage'
import header from './singletons/header'
import footer from './singletons/footer'
import redirects from './singletons/redirects'
import ourStoryPage from './singletons/our-story-page'
import cateringPage from './singletons/catering-page'
import contactPage from './singletons/contact-page'

// Document types (multiple entries)
import submission from './documents/submission'
import modularPage from './documents/modularPage'
import redirect from './documents/redirect'
import promoBanner from './documents/promoBanner'
import menuCategory from './documents/menuCategory'

export const schemaTypes = [
  // Objects
  portableText,
  socialLink,
  openingHours,
  seo,
  cta,
  megaMenuGroup,
  // Page builder sections
  hero,
  featureGrid,
  richTextBlock,
  imageGallery,
  ctaBanner,
  videoSection,
  statsBar,
  logoBar,
  spacer,
  newsletterSection,
  splitContent,
  contactForm,
  embed,
  locationTeaser,
  homeAbout,
  // Singletons
  siteSettings,
  homePage,
  header,
  footer,
  redirects,
  ourStoryPage,
  cateringPage,
  contactPage,
  // Documents
  submission,
  modularPage,
  redirect,
  promoBanner,
  menuCategory,
]
