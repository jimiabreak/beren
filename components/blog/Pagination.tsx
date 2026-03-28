import Link from 'next/link'

interface PaginationProps {
  currentPage: number
  totalPages: number
  basePath: string
  searchParams?: Record<string, string>
}

function getPageUrl(basePath: string, page: number, searchParams?: Record<string, string>) {
  const params = new URLSearchParams(searchParams)
  if (page > 1) {
    params.set('page', String(page))
  } else {
    params.delete('page')
  }
  const qs = params.toString()
  return qs ? `${basePath}?${qs}` : basePath
}

function getPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const pages: (number | 'ellipsis')[] = [1]

  if (current > 3) pages.push('ellipsis')

  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  for (let i = start; i <= end; i++) pages.push(i)

  if (current < total - 2) pages.push('ellipsis')

  pages.push(total)
  return pages
}

export default function Pagination({ currentPage, totalPages, basePath, searchParams }: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = getPageNumbers(currentPage, totalPages)
  const extraParams = { ...searchParams }
  delete extraParams.page

  return (
    <nav aria-label="Blog pagination" className="flex items-center justify-center gap-2 mt-12">
      {/* Previous */}
      {currentPage > 1 ? (
        <Link
          href={getPageUrl(basePath, currentPage - 1, extraParams)}
          className="px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors"
          aria-label="Previous page"
        >
          &larr; Prev
        </Link>
      ) : (
        <span className="px-3 py-2 text-sm text-muted-foreground opacity-50" aria-disabled="true">
          &larr; Prev
        </span>
      )}

      {/* Page Numbers */}
      {pages.map((page, i) =>
        page === 'ellipsis' ? (
          <span key={`ellipsis-${i}`} className="px-2 text-muted-foreground" aria-hidden="true">
            &hellip;
          </span>
        ) : (
          <Link
            key={page}
            href={getPageUrl(basePath, page, extraParams)}
            aria-current={page === currentPage ? 'page' : undefined}
            className={`px-3 py-2 text-sm rounded-lg transition-colors ${
              page === currentPage
                ? 'bg-foreground text-background font-semibold'
                : 'hover:bg-muted'
            }`}
          >
            {page}
          </Link>
        )
      )}

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          href={getPageUrl(basePath, currentPage + 1, extraParams)}
          className="px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors"
          aria-label="Next page"
        >
          Next &rarr;
        </Link>
      ) : (
        <span className="px-3 py-2 text-sm text-muted-foreground opacity-50" aria-disabled="true">
          Next &rarr;
        </span>
      )}
    </nav>
  )
}
