/**
 * Sanity Seed Script
 *
 * Creates placeholder content in Sanity so the studio isn't empty on first run.
 * Safe to run multiple times — uses createOrReplace with deterministic _id values.
 *
 * Usage:
 *   npm run seed
 *
 * Requires:
 *   SANITY_API_WRITE_TOKEN in .env.local
 *   NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local
 *   NEXT_PUBLIC_SANITY_DATASET in .env.local
 */

import dotenv from 'dotenv'
import { createClient } from 'next-sanity'

// Load .env.local
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

/** Create a portable text block from a plain string. */
function textBlock(text: string, key: string, style: string = 'normal'): object {
  return {
    _type: 'block',
    _key: key,
    style,
    children: [{ _type: 'span', _key: `${key}-span`, text, marks: [] }],
    markDefs: [],
  }
}

/** Create multiple portable text blocks from an array of strings. */
function textBlocks(paragraphs: string[], keyPrefix: string): object[] {
  return paragraphs.map((text, i) => textBlock(text, `${keyPrefix}-${i}`))
}

/** Create a heading block. */
function headingBlock(text: string, key: string, level: 'h2' | 'h3' | 'h4' = 'h2'): object {
  return textBlock(text, key, level)
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

// --- Site Settings ---
const siteSettings = {
  _id: 'siteSettings',
  _type: 'siteSettings',
  name: 'Studio Name',
  tagline: 'Design and development studio.',
  phone: '555-000-0000',
  email: 'hello@studio.com',
  address: {
    street: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    country: 'US',
  },
  socialLinks: [
    { _type: 'socialLink', _key: 'ig', platform: 'instagram', url: 'https://instagram.com/studioname' },
    { _type: 'socialLink', _key: 'li', platform: 'linkedin', url: 'https://linkedin.com/company/studioname' },
  ],
}

// --- Home Page (modular sections[] format) ---
const homePage = {
  _id: 'homePage',
  _type: 'homePage',
  sections: [
    {
      _type: 'hero',
      _key: 'home-hero',
      headline: 'We build brands, products, and experiences.',
      subheadline: 'A design and development studio focused on craft, clarity, and results.',
      ctaButtons: [
        { _key: 'hero-cta-1', label: 'See Our Work', url: '/work', variant: 'primary' },
        { _key: 'hero-cta-2', label: 'Get in Touch', url: '/contact', variant: 'outline' },
      ],
      layout: 'centered',
    },
    {
      _type: 'featureGrid',
      _key: 'home-services',
      heading: 'What We Do',
      subheading: 'End-to-end design and development for brands that want to stand out.',
      columns: 3,
      features: [
        { _key: 'feat-1', title: 'Brand Identity', description: 'Logo, typography, color systems, and brand guidelines that give your business a distinct, memorable presence.' },
        { _key: 'feat-2', title: 'Web Design & Development', description: 'Custom websites built for performance, accessibility, and conversion. From marketing sites to complex web applications.' },
        { _key: 'feat-3', title: 'Content Strategy', description: 'Messaging, copywriting, and content systems that communicate your value clearly and consistently.' },
      ],
    },
    {
      _type: 'ctaBanner',
      _key: 'home-cta',
      heading: 'Ready to start a project?',
      body: 'We partner with businesses of all sizes to create work that matters. Let\'s talk about what you\'re building.',
      buttons: [
        { _key: 'cta-btn-1', label: 'Get in Touch', url: '/contact', variant: 'primary' },
      ],
    },
  ],
}

// --- Team Members ---
const teamMembers = [
  {
    _id: 'team-design-director',
    _type: 'teamMember',
    name: 'Alex Chen',
    role: 'Design Director',
    bio: textBlocks(
      [
        'Alex leads the design practice with over a decade of experience in brand strategy, visual design, and creative direction. He has shaped identities for startups, nonprofits, and Fortune 500 companies alike.',
        'His approach blends research-driven strategy with a sharp eye for aesthetics, ensuring every project communicates clearly and looks exceptional.',
      ],
      'alex-bio',
    ),
    order: 1,
  },
  {
    _id: 'team-lead-developer',
    _type: 'teamMember',
    name: 'Jordan Rivera',
    role: 'Lead Developer',
    bio: textBlocks(
      [
        'Jordan is a full-stack developer with deep expertise in modern web technologies, performance optimization, and accessible front-end architecture. She has built products used by millions of people.',
        'She is passionate about clean code, fast load times, and creating seamless user experiences that work beautifully on every device.',
      ],
      'jordan-bio',
    ),
    order: 2,
  },
]

// --- Testimonials ---
const testimonials = [
  {
    _id: 'testimonial-1',
    _type: 'testimonial',
    author: 'Sarah M., Founder',
    quote: 'Working with this team transformed our brand. They took the time to understand our business and delivered a website that exceeded expectations.',
    rating: 5,
    source: 'Client',
    date: '2025-11-15',
  },
  {
    _id: 'testimonial-2',
    _type: 'testimonial',
    author: 'David K., Marketing Director',
    quote: 'Professional, responsive, and incredibly talented. The design quality is on another level.',
    rating: 5,
    source: 'Client',
    date: '2025-10-22',
  },
  {
    _id: 'testimonial-3',
    _type: 'testimonial',
    author: 'Emily R., CEO',
    quote: 'They don\'t just build websites — they build experiences. Our conversion rate doubled within three months of launch.',
    rating: 5,
    source: 'Client',
    date: '2025-12-03',
  },
]

// --- FAQ Items ---
const faqItems = [
  {
    _id: 'faq-process',
    _type: 'faqItem',
    question: 'What is your typical process?',
    answer: textBlocks(
      [
        'Every project begins with a discovery phase where we learn about your business, goals, audience, and competitive landscape. From there, we move into design, where we explore concepts and refine direction through collaborative feedback.',
        'Once the design is approved, we move into development, building your site with clean, performant code. After thorough QA and testing, we launch and provide a handoff with documentation and training.',
      ],
      'faq-process',
    ),
    category: 'Process',
    order: 1,
  },
  {
    _id: 'faq-timeline',
    _type: 'faqItem',
    question: 'How long does a project take?',
    answer: textBlocks(
      [
        'Timelines depend on the scope and complexity of the project. A typical marketing website takes 4 to 8 weeks from kickoff to launch. Larger projects with custom functionality or extensive content can take 8 to 12 weeks or more.',
        'We provide a detailed timeline during the proposal phase so you know exactly what to expect at every stage.',
      ],
      'faq-timeline',
    ),
    category: 'Process',
    order: 2,
  },
  {
    _id: 'faq-cost',
    _type: 'faqItem',
    question: 'What does a project cost?',
    answer: textBlocks(
      [
        'Project costs vary based on scope, complexity, and the level of custom design and development involved. We provide detailed proposals with transparent pricing after an initial consultation.',
        'We are happy to work within a range of budgets and can tailor our approach to meet your needs. Reach out to start a conversation about your project.',
      ],
      'faq-cost',
    ),
    category: 'Pricing',
    order: 3,
  },
  {
    _id: 'faq-support',
    _type: 'faqItem',
    question: 'Do you offer ongoing support?',
    answer: textBlocks(
      [
        'Yes. We offer maintenance and support plans that include regular updates, security patches, content changes, and performance monitoring. Plans are flexible and can be tailored to your needs.',
        'Even without a formal plan, we are always available for one-off updates or enhancements after launch.',
      ],
      'faq-support',
    ),
    category: 'Support',
    order: 4,
  },
  {
    _id: 'faq-technologies',
    _type: 'faqItem',
    question: 'What technologies do you use?',
    answer: textBlocks(
      [
        'We build with modern, proven technologies including Next.js, React, TypeScript, Tailwind CSS, and Sanity CMS. Our stack is chosen for performance, developer experience, and long-term maintainability.',
        'We are always evaluating new tools and frameworks, but we prioritize stability and community support over hype. Every technology choice is made with your project\'s specific needs in mind.',
      ],
      'faq-technologies',
    ),
    category: 'Technical',
    order: 5,
  },
]

// --- Modular Pages (using sections[] with richTextBlock) ---

const aboutPageSections = [
  {
    _type: 'richTextBlock',
    _key: 'about-who',
    heading: 'Who We Are',
    content: textBlocks(
      [
        'We are a design and development studio founded to bridge the gap between beautiful design and solid engineering. We believe the best digital products are built when both disciplines work hand in hand from day one.',
        'Our small, senior team brings decades of combined experience across brand identity, web design, front-end development, and content strategy. We work directly with founders, marketing teams, and product leaders to create work that moves the needle.',
      ],
      'about-who',
    ),
  },
  {
    _type: 'richTextBlock',
    _key: 'about-approach',
    heading: 'Our Approach',
    content: textBlocks(
      [
        'We are collaborative and iterative. Every project starts with deep listening — understanding your business, your audience, and what success looks like for you. From there, we work in focused cycles of design, feedback, and refinement.',
        'We do not disappear for weeks and come back with a big reveal. You are involved at every stage, and we move quickly without cutting corners. The result is work that feels right because it was built together.',
      ],
      'about-approach',
    ),
  },
  {
    _type: 'richTextBlock',
    _key: 'about-values',
    heading: 'Our Values',
    content: textBlocks(
      [
        'Craft — We sweat the details. Typography, spacing, performance, accessibility — everything matters. We take pride in delivering work that is polished down to the pixel and the millisecond.',
        'Clarity — We communicate plainly, design with intention, and build interfaces that are intuitive. No jargon, no unnecessary complexity.',
        'Partnership — We treat every client relationship as a partnership. Your success is our success, and we are invested in the long-term impact of the work we do together.',
      ],
      'about-values',
    ),
  },
]

const privacyPageSections = [
  {
    _type: 'richTextBlock',
    _key: 'priv-intro',
    heading: 'Privacy Policy',
    content: [
      ...textBlocks(
        ['Last updated: January 1, 2026. This Privacy Policy describes how Studio Name ("we", "us", or "our") collects, uses, and shares information when you visit our website or interact with us.'],
        'priv-intro',
      ),
    ],
  },
  {
    _type: 'richTextBlock',
    _key: 'priv-collect',
    heading: 'Information We Collect',
    content: textBlocks(
      [
        'We may collect personal information that you voluntarily provide to us, including your name, email address, phone number, and any other information you provide when submitting a contact form, signing up for our newsletter, or interacting with us through our website.',
        'We also automatically collect certain information when you visit our website, including your IP address, browser type, operating system, referring URLs, and information about how you interact with our site. This data is collected through cookies and similar tracking technologies.',
      ],
      'priv-collect',
    ),
  },
  {
    _type: 'richTextBlock',
    _key: 'priv-use',
    heading: 'How We Use Your Information',
    content: textBlocks(
      [
        'We use the information we collect to respond to inquiries, send promotional communications (with your consent), improve our website and services, and comply with legal obligations.',
        'We will never sell your personal information to third parties. We may share your information with trusted service providers who assist us in operating our website, processing payments, or delivering communications on our behalf.',
      ],
      'priv-use',
    ),
  },
  {
    _type: 'richTextBlock',
    _key: 'priv-cookies',
    heading: 'Cookies',
    content: textBlocks(
      [
        'Our website uses cookies to enhance your browsing experience. Cookies are small text files stored on your device that help us remember your preferences and understand how you use our site.',
        'You can control cookie settings through your browser preferences. Please note that disabling cookies may affect the functionality of certain parts of our website.',
      ],
      'priv-cookies',
    ),
  },
  {
    _type: 'richTextBlock',
    _key: 'priv-third',
    heading: 'Third-Party Services',
    content: textBlocks(
      [
        'Our website may contain links to third-party websites, such as our social media profiles and payment processors. We are not responsible for the privacy practices of these external sites and encourage you to review their privacy policies.',
        'We use analytics services to understand website usage patterns. These services may collect information about your visits using cookies and similar technologies.',
      ],
      'priv-third',
    ),
  },
  {
    _type: 'richTextBlock',
    _key: 'priv-security',
    heading: 'Data Security',
    content: textBlocks(
      [
        'We implement reasonable security measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. However, no method of transmission over the Internet is completely secure, and we cannot guarantee absolute security.',
      ],
      'priv-security',
    ),
  },
  {
    _type: 'richTextBlock',
    _key: 'priv-rights',
    heading: 'Your Rights',
    content: textBlocks(
      [
        'You have the right to access, correct, or delete your personal information. You may also opt out of receiving marketing communications at any time by clicking the unsubscribe link in our emails or contacting us directly.',
      ],
      'priv-rights',
    ),
  },
  {
    _type: 'richTextBlock',
    _key: 'priv-contact',
    heading: 'Contact Us',
    content: textBlocks(
      [
        'If you have any questions about this Privacy Policy or our data practices, please contact us at hello@studio.com or write to us at 123 Main Street, New York, NY 10001.',
      ],
      'priv-contact',
    ),
  },
]

const pages = [
  {
    _id: 'page-about',
    _type: 'modularPage',
    title: 'About',
    slug: { _type: 'slug', current: 'about' },
    sections: aboutPageSections,
  },
  {
    _id: 'page-privacy',
    _type: 'modularPage',
    title: 'Privacy Policy',
    slug: { _type: 'slug', current: 'privacy' },
    sections: privacyPageSections,
  },
]

// ---------------------------------------------------------------------------
// Seed runner
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
  console.log('  Sanity Seed Script')
  console.log(`  Project: ${projectId}`)
  console.log(`  Dataset: ${dataset}`)
  console.log('===========================================')

  // Seed referenced documents first, then documents that reference them
  await seedDocuments('Team Members', teamMembers)
  await seedDocuments('Testimonials', testimonials)
  await seedDocuments('FAQ Items', faqItems)
  await seedDocuments('Site Settings', [siteSettings])
  await seedDocuments('Home Page', [homePage])
  await seedDocuments('Pages', pages)

  console.log('\n===========================================')
  console.log('  Seeding complete!')
  console.log('  Open Sanity Studio to verify your content.')
  console.log('===========================================\n')
}

main().catch((err) => {
  console.error('Fatal error during seeding:', err)
  process.exit(1)
})
