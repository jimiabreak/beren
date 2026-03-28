import SectionRenderer from '@/components/sections/SectionRenderer'

/**
 * Preview page — renders all 17 section types with hardcoded data.
 * Visit /preview to see every component stacked.
 * No Sanity connection required.
 */

const previewSections = [
  // 1. Hero (centered)
  {
    _type: 'hero',
    _key: 'preview-hero-centered',
    headline: 'We build brands, products, and experiences.',
    subheadline: 'A design and development studio focused on craft, clarity, and results.',
    ctaButtons: [
      { _key: 'h1', label: 'See Our Work', url: '#work', variant: 'primary' },
      { _key: 'h2', label: 'Get in Touch', url: '#contact', variant: 'outline' },
    ],
    layout: 'centered',
  },

  // 2. Logo Bar
  {
    _type: 'logoBar',
    _key: 'preview-logos',
    heading: 'Trusted by',
    logos: [],
    grayscale: true,
  },

  // 3. Feature Grid (3 col)
  {
    _type: 'featureGrid',
    _key: 'preview-features',
    heading: 'What We Do',
    subheading: 'End-to-end design and development for brands that want to stand out.',
    columns: 3,
    features: [
      { _key: 'f1', title: 'Brand Identity', description: 'Logo, typography, color systems, and brand guidelines that give your business a distinct, memorable presence.' },
      { _key: 'f2', title: 'Web Design & Development', description: 'Custom websites built for performance, accessibility, and conversion. From marketing sites to complex web applications.' },
      { _key: 'f3', title: 'Content Strategy', description: 'Messaging, copywriting, and content systems that communicate your value clearly and consistently.' },
    ],
  },

  // 4. Stats Bar
  {
    _type: 'statsBar',
    _key: 'preview-stats',
    stats: [
      { _key: 's1', value: '50', suffix: '+', label: 'Projects Delivered' },
      { _key: 's2', value: '12', label: 'Years Experience' },
      { _key: 's3', value: '98', suffix: '%', label: 'Client Retention' },
      { _key: 's4', value: '4.9', label: 'Avg Rating' },
    ],
  },

  // 5. Split Content (image right)
  {
    _type: 'splitContent',
    _key: 'preview-split-right',
    heading: 'Designed with intention, built to last.',
    body: [
      {
        _type: 'block',
        _key: 'sp1',
        style: 'normal',
        children: [{ _type: 'span', _key: 'sp1s', text: 'We believe great work starts with understanding. Every project begins with deep discovery — learning your business, your audience, and your goals. From there, we craft solutions that are as strategic as they are beautiful.', marks: [] }],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'sp2',
        style: 'normal',
        children: [{ _type: 'span', _key: 'sp2s', text: 'Our process is collaborative, iterative, and transparent. You will always know where things stand and why decisions were made.', marks: [] }],
        markDefs: [],
      },
    ],
    imagePosition: 'right',
    cta: { _type: 'cta', label: 'About Us', href: '/about' },
  },

  // 6. Rich Text Block
  {
    _type: 'richTextBlock',
    _key: 'preview-richtext',
    heading: 'Our Philosophy',
    content: [
      {
        _type: 'block',
        _key: 'rt1',
        style: 'normal',
        children: [{ _type: 'span', _key: 'rt1s', text: 'Good design is invisible. It doesn\'t call attention to itself — it calls attention to the message. We approach every project with restraint and purpose, stripping away the unnecessary until only what matters remains.', marks: [] }],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'rt2',
        style: 'normal',
        children: [{ _type: 'span', _key: 'rt2s', text: 'This philosophy extends to how we build. Clean code, fast load times, and accessible interfaces are not afterthoughts — they are foundational to everything we deliver.', marks: [] }],
        markDefs: [],
      },
    ],
  },

  // 7. Image Gallery (grid) — empty images, will show placeholder
  {
    _type: 'imageGallery',
    _key: 'preview-gallery',
    heading: 'Selected Work',
    images: [],
    layout: 'grid',
  },

  // 8. Testimonial Carousel
  {
    _type: 'testimonialCarousel',
    _key: 'preview-testimonials',
    heading: 'What Clients Say',
    testimonials: [
      { _id: 't1', author: 'Sarah Mitchell', quote: 'Working with this team transformed our brand. They took the time to understand our business and delivered a website that exceeded every expectation.', source: 'Founder, Acme Co' },
      { _id: 't2', author: 'David Kim', quote: 'Professional, responsive, and incredibly talented. The design quality is on another level. Our customers notice the difference.', source: 'Marketing Director' },
      { _id: 't3', author: 'Emily Roberts', quote: 'They don\'t just build websites — they build experiences. Our conversion rate doubled within three months of launch.', source: 'CEO, StartupXYZ' },
    ],
    autoPlay: false,
  },

  // 9. Team Grid
  {
    _type: 'teamGrid',
    _key: 'preview-team',
    heading: 'The Team',
    subheading: 'Small team, big ambitions.',
    members: [
      { _id: 'tm1', name: 'Alex Chen', role: 'Design Director' },
      { _id: 'tm2', name: 'Jordan Rivera', role: 'Lead Developer' },
      { _id: 'tm3', name: 'Sam Taylor', role: 'Strategist' },
    ],
  },

  // 10. Split Content (image left)
  {
    _type: 'splitContent',
    _key: 'preview-split-left',
    heading: 'From concept to launch, we\'ve got you.',
    body: [
      {
        _type: 'block',
        _key: 'sl1',
        style: 'normal',
        children: [{ _type: 'span', _key: 'sl1s', text: 'Whether you are launching a new brand or refreshing an existing one, we handle the full spectrum — research, strategy, design, development, and ongoing support.', marks: [] }],
        markDefs: [],
      },
    ],
    imagePosition: 'left',
    cta: { _type: 'cta', label: 'Our Process', href: '/about' },
  },

  // 11. FAQ Accordion
  {
    _type: 'faqAccordion',
    _key: 'preview-faq',
    heading: 'Common Questions',
    items: [
      {
        _id: 'fq1',
        question: 'What is your typical process?',
        answer: [{ _type: 'block', _key: 'fa1', style: 'normal', children: [{ _type: 'span', _key: 'fa1s', text: 'We follow a four-phase approach: Discovery, Design, Development, and Launch. Each phase has clear deliverables and checkpoints so you always know where things stand.', marks: [] }], markDefs: [] }],
      },
      {
        _id: 'fq2',
        question: 'How long does a project take?',
        answer: [{ _type: 'block', _key: 'fa2', style: 'normal', children: [{ _type: 'span', _key: 'fa2s', text: 'Most projects take 4 to 12 weeks depending on scope. A simple marketing site might be 4-6 weeks, while a complex web application could be 8-12 weeks or more.', marks: [] }], markDefs: [] }],
      },
      {
        _id: 'fq3',
        question: 'What does a project cost?',
        answer: [{ _type: 'block', _key: 'fa3', style: 'normal', children: [{ _type: 'span', _key: 'fa3s', text: 'Every project is unique, and we provide detailed proposals after our initial discovery call. We believe in transparent pricing with no surprises.', marks: [] }], markDefs: [] }],
      },
      {
        _id: 'fq4',
        question: 'Do you offer ongoing support?',
        answer: [{ _type: 'block', _key: 'fa4', style: 'normal', children: [{ _type: 'span', _key: 'fa4s', text: 'Yes. We offer monthly maintenance plans that include hosting, updates, security patches, and priority support. Most clients stay with us long after launch.', marks: [] }], markDefs: [] }],
      },
    ],
  },

  // 12. Video Section
  {
    _type: 'videoSection',
    _key: 'preview-video',
    heading: 'See How We Work',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    autoplay: false,
  },

  // 13. Newsletter
  {
    _type: 'newsletterSection',
    _key: 'preview-newsletter',
    heading: 'Stay in the loop.',
    subheading: 'Occasional updates on our work, process, and the tools we use.',
    placeholder: 'Your email address...',
    buttonText: 'Subscribe',
  },

  // 14. Feature Grid (4 col)
  {
    _type: 'featureGrid',
    _key: 'preview-features-4',
    heading: 'Why Work With Us',
    columns: 4,
    features: [
      { _key: 'w1', title: 'Transparent Process', description: 'Clear communication and regular updates. No black boxes.' },
      { _key: 'w2', title: 'Performance First', description: 'Fast load times and accessibility built into every project.' },
      { _key: 'w3', title: 'Scalable Systems', description: 'Code and design that grows with your business.' },
      { _key: 'w4', title: 'Long-term Partners', description: 'We don\'t disappear after launch. Ongoing support and iteration.' },
    ],
  },

  // 15. Spacer
  {
    _type: 'spacer',
    _key: 'preview-spacer',
    size: 'md',
  },

  // 16. Contact Form
  {
    _type: 'contactForm',
    _key: 'preview-contact',
    heading: 'Let\'s Talk',
    subheading: 'Tell us about your project and we\'ll get back to you within 24 hours.',
  },

  // 17. CTA Banner
  {
    _type: 'ctaBanner',
    _key: 'preview-cta',
    heading: 'Ready to start a project?',
    body: 'We partner with businesses of all sizes to create work that matters. Let\'s talk about what you\'re building.',
    buttons: [
      { _key: 'cta1', label: 'Get in Touch', url: '/contact', variant: 'outline' },
    ],
  },

  // Hero variant: left-aligned
  {
    _type: 'hero',
    _key: 'preview-hero-left',
    headline: 'Left-aligned hero variant.',
    subheadline: 'For pages that need a different feel. Same bold typography, different alignment.',
    ctaButtons: [
      { _key: 'hl1', label: 'Learn More', url: '#', variant: 'primary' },
    ],
    layout: 'left-aligned',
  },

  // Feature Grid (2 col)
  {
    _type: 'featureGrid',
    _key: 'preview-features-2',
    heading: 'Two Column Grid',
    columns: 2,
    features: [
      { _key: 'tc1', title: 'Discovery & Strategy', description: 'We start by understanding your business, your audience, and your goals. Research informs every decision we make.' },
      { _key: 'tc2', title: 'Design & Build', description: 'From wireframes to working code, we design and develop in parallel for faster delivery without sacrificing quality.' },
    ],
  },
]

export default function PreviewPage() {
  return (
    <main id="main">
      <div className="border-b border-border py-4 px-6">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Component Preview — All 17 Section Types
        </p>
      </div>
      <SectionRenderer sections={previewSections} />
    </main>
  )
}
