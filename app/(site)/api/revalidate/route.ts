import { revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

const REVALIDATION_MAP: Record<string, string[]> = {
  siteSettings: ['siteSettings'],
  homePage: ['homePage'],
  header: ['header', 'siteSettings'],
  footer: ['footer', 'siteSettings'],
  faqItem: ['faq'],
  teamMember: ['team'],
  testimonial: ['testimonials'],
  galleryImage: ['gallery'],
  modularPage: ['modularPages'],
  redirect: ['redirects'],
  redirects: ['redirects'],
  promoBanner: ['promoBanner'],
  blogPost: ['blogPosts'],
  category: ['categories', 'blogPosts'],
  tag: ['tags', 'blogPosts'],
}

export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<{
      _type: string
      _id: string
      slug?: { current?: string }
    }>(req, process.env.SANITY_WEBHOOK_SECRET)

    if (isValidSignature === false) {
      return NextResponse.json(
        { message: 'Invalid signature' },
        { status: 401 },
      )
    }

    if (!body?._type) {
      return NextResponse.json(
        { message: 'Bad request: missing _type' },
        { status: 400 },
      )
    }

    const tags = REVALIDATION_MAP[body._type] || [body._type]
    for (const tag of tags) {
      revalidateTag(tag)
    }

    const timestamp = new Date().toISOString()
    console.log(
      `[revalidate] ${timestamp} — type: ${body._type}, tags: [${tags.join(', ')}]`,
    )

    return NextResponse.json({
      revalidated: true,
      type: body._type,
      tags,
      timestamp,
    })
  } catch (err) {
    console.error('[revalidate] Error:', err)
    return NextResponse.json(
      { message: 'Error revalidating', error: String(err) },
      { status: 500 },
    )
  }
}
