import { MetadataRoute } from 'next'
import { client } from '@/sanity/lib/client'
import { SITEMAP_QUERY } from '@/sanity/lib/queries'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://berentexas.com'
const sitemapClient = client.withConfig({ stega: false })

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/menu`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/our-story`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/catering`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/faq`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ]

  let dynamicRoutes: MetadataRoute.Sitemap = []
  try {
    const pages = await sitemapClient.fetch(SITEMAP_QUERY)

    const pageRoutes = (pages || []).map((p: { slug: string; _updatedAt: string }) => ({
      url: `${baseUrl}/${p.slug}`,
      lastModified: new Date(p._updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

    dynamicRoutes = [...pageRoutes]
  } catch {
    // Silently fail if Sanity is not configured
  }

  return [...staticRoutes, ...dynamicRoutes]
}
