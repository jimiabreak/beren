import type { SiteSettings } from '@/types'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://berentexas.com'

export function organizationJsonLd(settings: SiteSettings) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: settings.name || 'BEREN Meze & Grill House',
    url: siteUrl,
    description: 'Authentic Turkish & Mediterranean cuisine in Fort Worth, Texas. Vibrant meze spreads, sizzling kebabs, fresh grills, and traditional desserts.',
    servesCuisine: ['Turkish', 'Mediterranean'],
    priceRange: '$$',
    menu: `${siteUrl}/menu`,
    acceptsReservations: true,
    ...(settings.email && { email: settings.email }),
    ...(settings.phone && { telephone: settings.phone }),
    telephone: settings.phone || '(682) 246-7501',
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.address?.street || '1216 6th Ave',
      addressLocality: settings.address?.city || 'Fort Worth',
      addressRegion: settings.address?.state || 'TX',
      postalCode: settings.address?.zip || '76104',
      addressCountry: 'US',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Sunday'],
        opens: '11:00',
        closes: '22:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Friday', 'Saturday'],
        opens: '11:00',
        closes: '23:00',
      },
    ],
    sameAs: [
      'https://www.instagram.com/berenmediterranean/',
      'https://www.facebook.com/berenmediterranean',
      ...(settings.socialLinks?.map((s) => s.url).filter(
        (url) => !url.includes('instagram.com/berenmediterranean') && !url.includes('facebook.com/berenmediterranean')
      ) || []),
    ],
  }
}

export function webSiteJsonLd(settings: SiteSettings) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: settings.name || 'BEREN Meze & Grill House',
    alternateName: 'BEREN — A Taste of Turkey in Texas',
    url: siteUrl,
    description: settings.seo?.metaDescription || 'Authentic Turkish & Mediterranean cuisine in Fort Worth, Texas.',
  }
}

export function webPageJsonLd(title: string, description?: string, path?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    url: `${siteUrl}${path || ''}`,
    ...(description && { description }),
  }
}

export function faqPageJsonLd(items: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}
