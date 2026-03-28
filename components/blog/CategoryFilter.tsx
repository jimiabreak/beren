'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

interface CategoryFilterProps {
  tags: Array<{ _id: string; title: string; slug: string }>
  basePath: string
  categoryColor?: string
}

export default function CategoryFilter({ tags, basePath, categoryColor }: CategoryFilterProps) {
  const searchParams = useSearchParams()
  const activeTag = searchParams.get('tag')

  if (!tags || tags.length === 0) return null

  return (
    <nav aria-label="Filter by tag" className="flex flex-wrap gap-2 mb-8">
      {/* All pill */}
      <Link
        href={basePath}
        className={`px-4 py-2 text-sm rounded-full transition-colors ${
          !activeTag
            ? 'font-semibold text-white'
            : 'bg-muted text-foreground hover:bg-border'
        }`}
        style={!activeTag ? { backgroundColor: categoryColor || 'var(--color-foreground)' } : undefined}
        aria-current={!activeTag ? 'page' : undefined}
      >
        All
      </Link>

      {tags.map((tag) => {
        const isActive = activeTag === tag.slug
        return (
          <Link
            key={tag._id}
            href={`${basePath}?tag=${tag.slug}`}
            className={`px-4 py-2 text-sm rounded-full transition-colors ${
              isActive
                ? 'font-semibold text-white'
                : 'bg-muted text-foreground hover:bg-border'
            }`}
            style={isActive ? { backgroundColor: categoryColor || 'var(--color-foreground)' } : undefined}
            aria-current={isActive ? 'page' : undefined}
          >
            {tag.title}
          </Link>
        )
      })}
    </nav>
  )
}
