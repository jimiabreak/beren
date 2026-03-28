import type { PortableTextComponents } from '@portabletext/react'
import Link from 'next/link'
import Button from '@/components/ui/Button'

const calloutStyles: Record<string, { border: string; bg: string; icon: string }> = {
  info: { border: 'border-blue-500', bg: 'bg-blue-50', icon: 'i' },
  warning: { border: 'border-amber-500', bg: 'bg-amber-50', icon: '!' },
  success: { border: 'border-green-500', bg: 'bg-green-50', icon: '\u2713' },
  tip: { border: 'border-purple-500', bg: 'bg-purple-50', icon: '\u2726' },
}

export const portableTextComponents: PortableTextComponents = {
  marks: {
    link: ({ children, value }) => {
      const href = value?.href || '#'
      const blank = value?.blank
      return blank ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground underline underline-offset-2 hover:text-foreground transition-colors"
        >
          {children}
        </a>
      ) : (
        <a
          href={href}
          className="text-foreground underline underline-offset-2 hover:text-foreground transition-colors"
        >
          {children}
        </a>
      )
    },
    internalLink: ({ children, value }) => {
      const ref = value?.reference
      if (!ref) return <>{children}</>
      const href = ref.slug?.current ? `/${ref.slug.current}` : ref.uri || '#'
      return (
        <Link
          href={href}
          className="text-foreground underline underline-offset-2 hover:text-foreground transition-colors"
        >
          {children}
        </Link>
      )
    },
  },
  types: {
    callout: ({ value }) => {
      const style = calloutStyles[value?.type || 'info'] || calloutStyles.info
      return (
        <div
          className={`my-6 border-l-4 ${style.border} ${style.bg} p-4 rounded-r-lg`}
          role="note"
        >
          <div className="flex gap-3">
            <span
              className="flex-shrink-0 w-6 h-6 rounded-full bg-white flex items-center justify-center text-sm font-bold"
              aria-hidden="true"
            >
              {style.icon}
            </span>
            <div>
              {value?.title && (
                <p className="font-semibold mb-1">{value.title}</p>
              )}
              {value?.body && (
                <p className="text-sm text-muted-foreground">{value.body}</p>
              )}
            </div>
          </div>
        </div>
      )
    },
    codeBlock: ({ value }) => (
      <div className="my-6 rounded-lg overflow-hidden bg-foreground">
        {value?.language && (
          <div className="px-4 py-2 text-xs text-muted-foreground bg-foreground/90 border-b border-white/10">
            {value.language}
          </div>
        )}
        <pre className="p-4 overflow-x-auto">
          <code className="text-sm text-background font-mono">
            {value?.code}
          </code>
        </pre>
      </div>
    ),
    table: ({ value }) => {
      const rows = value?.rows || []
      if (rows.length === 0) return null
      return (
        <div className="my-6 overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted">
                {(rows[0]?.cells || []).map((cell: string, i: number) => (
                  <th
                    key={i}
                    className="px-4 py-3 text-left font-semibold border-b border-border"
                  >
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows
                .slice(1)
                .map(
                  (
                    row: { cells?: string[]; _key?: string },
                    i: number,
                  ) => (
                    <tr
                      key={row._key || i}
                      className="border-b border-border last:border-0"
                    >
                      {(row.cells || []).map((cell: string, j: number) => (
                        <td key={j} className="px-4 py-3">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ),
                )}
            </tbody>
          </table>
        </div>
      )
    },
    buttonGroup: ({ value }) => {
      const buttons = value?.buttons || []
      if (buttons.length === 0) return null
      return (
        <div className="my-6 flex flex-wrap gap-3">
          {buttons.map(
            (
              btn: {
                _key?: string
                label: string
                url: string
                variant?: string
              },
              i: number,
            ) => (
              <Button
                key={btn._key || i}
                href={btn.url || '#'}
                variant={
                  (btn.variant as 'primary' | 'secondary' | 'outline') ||
                  'primary'
                }
              >
                {btn.label}
              </Button>
            ),
          )}
        </div>
      )
    },
  },
}
