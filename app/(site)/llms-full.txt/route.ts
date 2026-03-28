import { NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { toPlainText } from '@portabletext/toolkit'
import { LLMS_FULL_TXT_QUERY } from '@/sanity/lib/queries'

export const revalidate = 3600

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'

export async function GET() {
  const data = await client.withConfig({ stega: false }).fetch(LLMS_FULL_TXT_QUERY)
  const { settings, faqs, team, pages } = data || {}

  const lines: string[] = [
    `# ${settings?.name || 'Website'}`,
    '',
    `> ${settings?.tagline || settings?.seo?.metaDescription || 'A modern website.'}`,
    '',
  ]

  if (pages && pages.length > 0) {
    lines.push('## Pages', '')
    for (const page of pages) {
      const url = `${siteUrl}${page.slug?.startsWith('/') ? page.slug : '/' + page.slug}`
      lines.push(`- [${page.title}](${url})${page.description ? ': ' + page.description : ''}`)
    }
    lines.push('')
  }

  if (faqs && faqs.length > 0) {
    lines.push('## Frequently Asked Questions', '')
    for (const faq of faqs) {
      lines.push(`### ${faq.question}`)
      const answer = Array.isArray(faq.answer) ? toPlainText(faq.answer as never) : String(faq.answer || '')
      lines.push('', answer, '')
    }
  }

  if (team && team.length > 0) {
    lines.push('## Team', '')
    for (const member of team) {
      lines.push(`- **${member.name}**${member.role ? ' \u2014 ' + member.role : ''}`)
    }
    lines.push('')
  }

  return new NextResponse(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
