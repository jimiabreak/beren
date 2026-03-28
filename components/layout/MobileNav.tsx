'use client'

import { useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
  links: Array<{ href: string; label: string; isButton?: boolean }>
  triggerRef: React.RefObject<HTMLButtonElement | null>
}

export default function MobileNav({ isOpen, onClose, links, triggerRef }: MobileNavProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab') return

      const panel = panelRef.current
      if (!panel) return
      const focusable = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    },
    [onClose]
  )

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      requestAnimationFrame(() => closeButtonRef.current?.focus())
      document.addEventListener('keydown', handleKeyDown)
    } else {
      document.body.style.overflow = 'unset'
      triggerRef.current?.focus()
    }

    return () => {
      document.body.style.overflow = 'unset'
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, handleKeyDown, triggerRef])

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-foreground/50 z-40 md:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className="fixed top-0 right-0 bottom-0 w-72 bg-background shadow-xl z-50 md:hidden overscroll-contain overflow-y-auto"
      >
        <div className="flex flex-col py-6 px-4">
          {/* Close button */}
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close menu"
            className="self-end touch-target flex items-center justify-center text-foreground mb-4"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <nav role="navigation" aria-label="Mobile navigation">
            <div className="flex flex-col space-y-1">
              {links.map((link) =>
                link.isButton ? (
                  <a
                    key={link.href}
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="border border-accent text-accent text-center uppercase tracking-wider py-3 mt-4 touch-target hover:bg-accent hover:text-background transition-colors"
                    onClick={onClose}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-lg font-mono uppercase tracking-wider text-foreground py-3 touch-target"
                    onClick={onClose}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </div>
          </nav>
        </div>
      </div>
    </>
  )
}
