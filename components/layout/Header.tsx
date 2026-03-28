'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { stegaClean } from '@sanity/client/stega'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { fadeInUp } from '@/lib/animations'
import MobileNav from './MobileNav'
import type { SanityImageSource } from '@sanity/image-url'
import SanityImage from '@/components/sanity/SanityImage'
import type { MegaMenuGroup } from '@/types'

interface HeaderProps {
  siteSettings?: {
    name?: string
    logo?: SanityImageSource
    reservationUrl?: string
  }
  megaNavigation?: MegaMenuGroup[]
  secondaryNavigation?: Array<{ _key: string; label: string; href: string }>
  cta?: { label: string; href: string }
}

const defaultNavLinks = [
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export default function Header({ siteSettings, megaNavigation, secondaryNavigation, cta }: HeaderProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const pathname = usePathname()

  const hasMegaNav = megaNavigation && megaNavigation.length > 0
  const secondaryLinks = secondaryNavigation?.length
    ? secondaryNavigation.map((n) => ({ href: stegaClean(n.href), label: n.label, _key: n._key }))
    : null
  const flatNavLinks = !hasMegaNav
    ? (secondaryLinks?.map((n) => ({ href: n.href, label: n.label })) || defaultNavLinks)
    : null

  const ctaHref = stegaClean(cta?.href || siteSettings?.reservationUrl || '')
  const ctaLabel = cta?.label || 'Get Started'
  const isExternal = ctaHref.startsWith('http')

  const handleDropdownEnter = useCallback((key: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current)
    setOpenDropdown(key)
  }, [])

  const handleDropdownLeave = useCallback(() => {
    dropdownTimeoutRef.current = setTimeout(() => setOpenDropdown(null), 150)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenDropdown(null)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Close dropdown on route change
  useEffect(() => {
    setOpenDropdown(null)
  }, [pathname])

  return (
    <motion.header
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border"
    >
      {/* Secondary Nav Bar (only when mega nav is active) */}
      {hasMegaNav && secondaryLinks && (
        <div className="hidden md:block bg-muted border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-end gap-6 h-9">
              {secondaryLinks.map((link) => (
                <Link
                  key={link._key}
                  href={link.href}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              {ctaHref && (
                <a
                  href={ctaHref}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  className="text-xs font-semibold text-foreground hover:text-foreground transition-colors"
                >
                  {ctaLabel}
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo / Name */}
          <Link href="/" className="flex items-center gap-3">
            {siteSettings?.logo ? (
              <SanityImage
                image={siteSettings.logo}
                alt={siteSettings.name || 'Home'}
                width={40}
                height={40}
                className="h-8 w-auto sm:h-10"
              />
            ) : (
              <span className="font-serif text-xl sm:text-2xl font-bold">
                {siteSettings?.name || 'Beren'}
              </span>
            )}
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {hasMegaNav ? (
              /* Mega Menu */
              megaNavigation.map((group) => {
                const key = group._key
                const hasChildren = group.children && group.children.length > 0
                const isOpen = openDropdown === key
                const groupHref = stegaClean(group.href || '')

                return (
                  <div
                    key={key}
                    className="relative"
                    onMouseEnter={() => hasChildren && handleDropdownEnter(key)}
                    onMouseLeave={handleDropdownLeave}
                  >
                    {groupHref && !hasChildren ? (
                      <Link
                        href={groupHref}
                        className="text-sm uppercase tracking-wider hover:text-foreground transition-colors py-2"
                      >
                        {group.label}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        className="text-sm uppercase tracking-wider hover:text-foreground transition-colors py-2 flex items-center gap-1"
                        aria-expanded={isOpen}
                        aria-haspopup={hasChildren ? 'true' : undefined}
                        onClick={() => hasChildren && setOpenDropdown(isOpen ? null : key)}
                      >
                        {group.label}
                        {hasChildren && (
                          <svg
                            className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        )}
                      </button>
                    )}

                    {/* Dropdown */}
                    {hasChildren && isOpen && (
                      <div
                        className="absolute top-full left-0 mt-0 min-w-[200px] bg-background border border-border rounded-lg shadow-lg py-2 z-50"
                        onMouseEnter={() => handleDropdownEnter(key)}
                        onMouseLeave={handleDropdownLeave}
                      >
                        {groupHref && (
                          <Link
                            href={groupHref}
                            className="block px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted hover:text-foreground transition-colors"
                          >
                            All {group.label}
                          </Link>
                        )}
                        {group.children!.map((child) => (
                          <Link
                            key={child._key}
                            href={stegaClean(child.href)}
                            className="block px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-foreground transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })
            ) : (
              /* Flat Nav Fallback */
              flatNavLinks!.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={pathname === link.href ? 'page' : undefined}
                  className="text-sm uppercase tracking-wider hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))
            )}

            {/* CTA (only in flat nav mode — mega nav shows CTA in secondary bar) */}
            {!hasMegaNav && ctaHref && (
              <a
                href={ctaHref}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                className="bg-foreground text-background px-4 py-2 text-sm uppercase tracking-wider hover:opacity-80 transition-colors"
              >
                {ctaLabel}
              </a>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            ref={menuButtonRef}
            className="md:hidden touch-target flex items-center justify-center"
            onClick={() => setMobileNavOpen(true)}
            aria-expanded={mobileNavOpen}
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      <MobileNav
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        triggerRef={menuButtonRef}
        pathname={pathname}
        megaNavigation={megaNavigation}
        links={
          hasMegaNav
            ? [
                ...(secondaryLinks?.map((l) => ({ href: l.href, label: l.label })) || []),
                ...(ctaHref ? [{ href: ctaHref, label: ctaLabel }] : []),
              ]
            : [
                ...(flatNavLinks || []),
                ...(ctaHref ? [{ href: ctaHref, label: ctaLabel }] : []),
              ]
        }
      />
    </motion.header>
  )
}
