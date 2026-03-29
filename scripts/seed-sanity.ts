/**
 * Sanity Seed Script — Beren Restaurant
 *
 * Populates Sanity with real Beren content so the Studio is ready to use.
 * Safe to run multiple times — uses createOrReplace with deterministic _id values.
 *
 * Usage:
 *   npm run seed
 */

import dotenv from 'dotenv'
import { createClient } from 'next-sanity'

dotenv.config({ path: '.env.local' })

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_WRITE_TOKEN

if (!projectId || !dataset || !token) {
  console.error('Missing required environment variables.')
  console.error('Ensure .env.local contains:')
  console.error('  NEXT_PUBLIC_SANITY_PROJECT_ID')
  console.error('  NEXT_PUBLIC_SANITY_DATASET')
  console.error('  SANITY_API_WRITE_TOKEN')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2025-03-04',
  token,
  useCdn: false,
})

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function textBlock(text: string, key: string, style: string = 'normal'): object {
  return {
    _type: 'block',
    _key: key,
    style,
    children: [{ _type: 'span', _key: `${key}-span`, text, marks: [] }],
    markDefs: [],
  }
}

function textBlocks(paragraphs: string[], keyPrefix: string): object[] {
  return paragraphs.map((text, i) => textBlock(text, `${keyPrefix}-${i}`))
}

// ---------------------------------------------------------------------------
// Site Settings
// ---------------------------------------------------------------------------

const siteSettings = {
  _id: 'siteSettings',
  _type: 'siteSettings',
  name: 'BEREN',
  tagline: 'Meze & Grill House',
  phone: '(682) 246 7501',
  email: 'info@berentexas.com',
  address: {
    street: '1216 6th Ave.',
    city: 'Fort Worth',
    state: 'TX',
    zip: '76104',
    country: 'US',
  },
  hours: [
    { _type: 'openingHours', _key: 'mon', day: 'Monday', openTime: '11:00 AM', closeTime: '10:00 PM', closed: false },
    { _type: 'openingHours', _key: 'tue', day: 'Tuesday', openTime: '11:00 AM', closeTime: '10:00 PM', closed: false },
    { _type: 'openingHours', _key: 'wed', day: 'Wednesday', openTime: '11:00 AM', closeTime: '10:00 PM', closed: false },
    { _type: 'openingHours', _key: 'thu', day: 'Thursday', openTime: '11:00 AM', closeTime: '10:00 PM', closed: false },
    { _type: 'openingHours', _key: 'fri', day: 'Friday', openTime: '11:00 AM', closeTime: '11:00 PM', closed: false },
    { _type: 'openingHours', _key: 'sat', day: 'Saturday', openTime: '11:00 AM', closeTime: '11:00 PM', closed: false },
    { _type: 'openingHours', _key: 'sun', day: 'Sunday', openTime: '11:00 AM', closeTime: '10:00 PM', closed: false },
  ],
  socialLinks: [
    { _type: 'socialLink', _key: 'fb', platform: 'facebook', url: 'https://facebook.com/berenmediterranean' },
    { _type: 'socialLink', _key: 'ig', platform: 'instagram', url: 'https://instagram.com/berenmediterranean/' },
  ],
}

// ---------------------------------------------------------------------------
// Header
// ---------------------------------------------------------------------------

const header = {
  _id: 'header',
  _type: 'header',
  secondaryNavigation: [
    { _key: 'nav-story', label: 'Our Story', href: '/our-story' },
    { _key: 'nav-menu', label: 'The Menu', href: '/menu' },
    { _key: 'nav-catering', label: 'Catering', href: '/catering' },
    { _key: 'nav-contact', label: 'Get In Touch', href: '/contact' },
  ],
  cta: {
    _type: 'cta',
    label: 'Reserve',
    href: '/contact',
  },
}

// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------

const footer = {
  _id: 'footer',
  _type: 'footer',
  tagline: 'Ancestral Mediterranean Cooking',
  columns: [
    {
      _key: 'col-explore',
      title: 'Explore',
      links: [
        { _key: 'fl-story', label: 'Our Story', href: '/our-story' },
        { _key: 'fl-menu', label: 'The Menu', href: '/menu' },
        { _key: 'fl-catering', label: 'Catering', href: '/catering' },
        { _key: 'fl-contact', label: 'Get In Touch', href: '/contact' },
      ],
    },
  ],
  copyrightText: 'All rights reserved.',
}

// ---------------------------------------------------------------------------
// Home Page Sections
// ---------------------------------------------------------------------------

const homePage = {
  _id: 'homePage',
  _type: 'homePage',
  sections: [
    // 1. Hero — full-width BEREN logo + food banner (uses 'home' layout)
    {
      _type: 'hero',
      _key: 'home-hero',
      headline: 'BEREN',
      subheadline: 'Ancestral Mediterranean Cooking',
      layout: 'home',
    },
    // 2. Home About — tagline + image + body text + CTAs
    {
      _type: 'homeAbout',
      _key: 'home-about',
      tagline: 'A Taste of Turkey\nin Texas.',
      body: textBlocks(
        [
          'BEREN Meze & Grill House was born from a deep love for Turkish cuisine and a desire to share the rich, vibrant flavors of Anatolia with the heart of Texas. Our name, "Beren," is inspired by the Turkish word for strength and resilience — qualities reflected in every dish we serve.',
          'At BEREN, we take pride in crafting every dish with the finest local ingredients, paired with authentic Turkish spices and time-honored techniques passed down through generations. From our wood-fired kebabs to our handcrafted mezes, each plate tells a story of tradition, love, and the art of gathering around a shared table.',
        ],
        'about-body',
      ),
      ctaButtons: [
        { _key: 'cta-menu', label: 'View Our Menu', url: '/menu', variant: 'outline' },
        { _key: 'cta-story', label: 'Our Story', url: '/our-story', variant: 'outline' },
        { _key: 'cta-reserve', label: 'Make a Reservation', url: '/contact', variant: 'outline' },
      ],
    },
    // 3. Location Teaser — cityscape banner
    {
      _type: 'locationTeaser',
      _key: 'home-location',
      heading: 'Fort Worth, Texas',
    },
  ],
  seo: {
    _type: 'seo',
    metaTitle: 'BEREN — Meze & Grill House | Fort Worth, TX',
    metaDescription: 'Authentic Turkish and Mediterranean cuisine in Fort Worth, Texas. Wood-fired kebabs, handcrafted mezes, and warm hospitality at BEREN Meze & Grill House.',
  },
}

// ---------------------------------------------------------------------------
// Menu Tab Documents
// ---------------------------------------------------------------------------

const menuTabs = [
  {
    _id: 'menu-lunch',
    _type: 'menuCategory',
    title: 'Lunch',
    slug: { _type: 'slug', current: 'lunch' },
    order: 1,
    isActive: true,
  },
  {
    _id: 'menu-dinner',
    _type: 'menuCategory',
    title: 'Dinner',
    slug: { _type: 'slug', current: 'dinner' },
    order: 2,
    isActive: true,
  },
  {
    _id: 'menu-dessert',
    _type: 'menuCategory',
    title: 'Dessert',
    slug: { _type: 'slug', current: 'dessert' },
    order: 3,
    isActive: true,
  },
  {
    _id: 'menu-drink',
    _type: 'menuCategory',
    title: 'Drink',
    slug: { _type: 'slug', current: 'drink' },
    order: 4,
    isActive: true,
  },
  {
    _id: 'menu-specials',
    _type: 'menuCategory',
    title: 'Specials',
    slug: { _type: 'slug', current: 'specials' },
    order: 5,
    isActive: true,
  },
]

// ---------------------------------------------------------------------------
// Seed Runner
// ---------------------------------------------------------------------------

type SanityDocument = { _id: string; _type: string; [key: string]: unknown }

async function seedDocuments(label: string, documents: SanityDocument[]) {
  console.log(`\nSeeding ${label}...`)
  for (const doc of documents) {
    try {
      await client.createOrReplace(doc)
      console.log(`  + ${doc._type} "${doc._id}"`)
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      console.error(`  ! Failed to create ${doc._id}: ${message}`)
    }
  }
  console.log(`  Done. (${documents.length} ${label.toLowerCase()})`)
}

async function main() {
  console.log('===========================================')
  console.log('  Sanity Seed — BEREN Restaurant')
  console.log(`  Project: ${projectId}`)
  console.log(`  Dataset: ${dataset}`)
  console.log('===========================================')

  await seedDocuments('Site Settings', [siteSettings])
  await seedDocuments('Header', [header])
  await seedDocuments('Footer', [footer])
  await seedDocuments('Home Page', [homePage])
  await seedDocuments('Menu Tabs', menuTabs)

  console.log('\n===========================================')
  console.log('  Seeding complete!')
  console.log('  Open Sanity Studio to verify your content.')
  console.log('  Menu tabs are ready — upload PDFs in Studio.')
  console.log('===========================================\n')
}

main().catch((err) => {
  console.error('Fatal error during seeding:', err)
  process.exit(1)
})
