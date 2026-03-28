import type { SiteSettings } from '@/types'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'

export function organizationJsonLd(settings: SiteSettings) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: settings.name,
    url: siteUrl,
    ...(settings.email && { email: settings.email }),
    ...(settings.phone && { telephone: settings.phone }),
    ...(settings.address && {
      address: {
        '@type': 'PostalAddress',
        streetAddress: settings.address.street,
        addressLocality: settings.address.city,
        addressRegion: settings.address.state,
        postalCode: settings.address.zip,
        addressCountry: settings.address.country || 'US',
      },
    }),
    ...(settings.socialLinks && {
      sameAs: settings.socialLinks.map((s) => s.url),
    }),
  }
}

export function webSiteJsonLd(settings: SiteSettings) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: settings.name,
    url: siteUrl,
    ...(settings.seo?.metaDescription && {
      description: settings.seo.metaDescription,
    }),
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
