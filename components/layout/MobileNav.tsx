'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { stegaClean } from '@sanity/client/stega'
import type { NavLink, MegaMenuGroup } from '@/types'

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
  links: NavLink[]
  megaNavigation?: MegaMenuGroup[]
  triggerRef: React.RefObject<HTMLButtonElement | null>
  pathname?: string
}

export default function MobileNav({ isOpen, onClose, links, megaNavigation, triggerRef, pathname }: MobileNavProps) {
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null)
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
      setExpandedGroup(null)
    }

    return () => {
      document.body.style.overflow = 'unset'
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, handleKeyDown, triggerRef])

  if (!isOpen) return null

  const hasMegaNav = megaNavigation && megaNavigation.length > 0

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
            className="self-end touch-target flex items-center justify-center mb-4"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <nav role="navigation" aria-label="Mobile navigation">
            <div className="flex flex-col space-y-1">
              {/* Mega Nav Groups */}
              {hasMegaNav &&
                megaNavigation.map((group) => {
                  const key = group._key
                  const hasChildren = group.children && group.children.length > 0
                  const isExpanded = expandedGroup === key
                  const groupHref = stegaClean(group.href || '')

                  if (!hasChildren) {
                    return (
                      <Link
                        key={key}
                        href={groupHref || '#'}
                        className="text-lg font-serif font-semibold text-foreground hover:text-foreground transition-colors py-3 touch-target"
                        onClick={onClose}
                      >
                        {group.label}
                      </Link>
                    )
                  }

                  return (
                    <div key={key}>
                      <button
                        type="button"
                        className="w-full flex items-center justify-between text-lg font-serif font-semibold text-foreground hover:text-foreground transition-colors py-3 touch-target"
                        aria-expanded={isExpanded}
                        onClick={() => setExpandedGroup(isExpanded ? null : key)}
                      >
                        {group.label}
                        <svg
                          className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {isExpanded && (
                        <div className="flex flex-col space-y-1 pl-4 pb-2">
                          {groupHref && (
                            <Link
                              href={groupHref}
                              className="text-base text-muted-foreground hover:text-foreground transition-colors py-2 touch-target font-medium"
                              onClick={onClose}
                            >
                              All {group.label}
                            </Link>
                          )}
                          {group.children!.map((child) => (
                            <Link
                              key={child._key}
                              href={stegaClean(child.href)}
                              className="text-base text-muted-foreground hover:text-foreground transition-colors py-2 touch-target"
                              onClick={onClose}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}

              {/* Divider between mega nav and secondary links */}
              {hasMegaNav && links.length > 0 && (
                <div className="border-t border-border my-2" />
              )}

              {/* Secondary / Flat Links */}
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={pathname === link.href ? 'page' : undefined}
                  className="text-base text-foreground hover:text-foreground transition-colors py-3 touch-target"
                  onClick={onClose}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </>
  )
}
