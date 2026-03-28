import { type NextRequest, NextResponse } from 'next/server'

interface RedirectRule {
  source: string
  destination: string
  permanent: boolean
}

let cachedRedirects: RedirectRule[] = []
let cacheTimestamp = 0
const CACHE_TTL = 60_000 // 60 seconds

async function getRedirects(): Promise<RedirectRule[]> {
  const now = Date.now()
  if (cachedRedirects.length > 0 && now - cacheTimestamp < CACHE_TTL) {
    return cachedRedirects
  }

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01'

  if (!projectId) return cachedRedirects

  const query = encodeURIComponent(
    `*[_type == "redirect" && isActive == true]{ source, destination, permanent }`,
  )

  try {
    const res = await fetch(
      `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=${query}`,
      { cache: 'no-store' },
    )
    if (res.ok) {
      const json = await res.json()
      cachedRedirects = json.result || []
      cacheTimestamp = now
    }
  } catch {
    // Use stale cache on error
  }

  return cachedRedirects
}

export async function middleware(req: NextRequest) {
  const redirects = await getRedirects()
  const pathname = req.nextUrl.pathname

  const match = redirects.find((r) => r.source === pathname)
  if (match) {
    const destination = match.destination.startsWith('http')
      ? match.destination
      : new URL(match.destination, req.url).toString()
    return NextResponse.redirect(destination, {
      status: match.permanent ? 301 : 302,
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|studio|favicon.ico|robots.txt|sitemap.xml|llms.txt|llms-full.txt|images/).*)',
  ],
}
