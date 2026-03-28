import { NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { LLMS_TXT_QUERY } from '@/sanity/lib/queries'

export const revalidate = 3600

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'

export async function GET() {
  const data = await client.withConfig({ stega: false }).fetch(LLMS_TXT_QUERY)
  const { settings, pages } = data || {}

  const lines: string[] = [
    `# ${settings?.name || 'Website'}`,
    '',
    `> ${settings?.tagline || settings?.seo?.metaDescription || 'A modern website.'}`,
    '',
    '## Pages',
    '',
  ]

  if (pages && pages.length > 0) {
    for (const page of pages) {
      const url = `${siteUrl}${page.slug?.startsWith('/') ? page.slug : '/' + page.slug}`
      lines.push(`- [${page.title}](${url})${page.description ? ': ' + page.description : ''}`)
    }
  }

  lines.push(
    '',
    '## Static Pages',
    '',
    `- [Home](${siteUrl}/)`,
    `- [Menu](${siteUrl}/menu)`,
    `- [About](${siteUrl}/about)`,
    `- [Contact](${siteUrl}/contact)`,
    `- [FAQ](${siteUrl}/faq)`,
  )

  return new NextResponse(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
