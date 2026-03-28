'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { stegaClean } from '@sanity/client/stega'
import MobileNav from './MobileNav'

interface HeaderProps {
  siteSettings?: {
    name?: string
    tagline?: string
    reservationUrl?: string
  }
  cta?: { label: string; href: string }
}

export default function Header({ siteSettings, cta }: HeaderProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  const reserveHref = stegaClean(cta?.href || siteSettings?.reservationUrl || '')
  const isExternal = reserveHref.startsWith('http')

  // Split tagline on " / " for two-line rendering
  const tagline = siteSettings?.tagline || 'Ancestral Mediterranean Cooking / Meze & Grill House'
  const taglineParts = tagline.split(' / ')

  const mobileLinks = [
    { href: '/our-story', label: 'Our Story' },
    { href: '/menu', label: 'The Menu' },
    ...(reserveHref ? [{ href: reserveHref, label: 'Reserve', isButton: true }] : []),
  ]

  return (
    <header className="bg-background">
      {/* Desktop Nav */}
      <div className="hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 lg:h-24">
            {/* Left Zone: Nav links with decorative icons */}
            <nav className="flex items-center gap-4 lg:gap-6">
              <Link
                href="/our-story"
                className="text-foreground uppercase tracking-wider text-sm lg:text-base font-mono leading-tight"
              >
                Our<br />Story
              </Link>
              <Image
                src="/images/nav/Vector 76.svg"
                alt=""
                width={20}
                height={20}
                className="w-5 h-5 lg:w-6 lg:h-6"
                aria-hidden="true"
              />
              <Link
                href="/menu"
                className="text-foreground uppercase tracking-wider text-sm lg:text-base font-mono leading-tight"
              >
                The<br />Menu
              </Link>
              <Image
                src="/images/nav/Group 1000002677.svg"
                alt=""
                width={22}
                height={24}
                className="w-5 h-6 lg:w-6 lg:h-7"
                aria-hidden="true"
              />
            </nav>

            {/* Center Zone: Tagline + wave icon */}
            <Link href="/" className="flex flex-col items-center gap-1 text-center">
              <Image
                src="/images/nav/Vector 77.svg"
                alt=""
                width={32}
                height={11}
                className="w-8 h-3"
                aria-hidden="true"
              />
              {taglineParts.map((part, i) => (
                <span
                  key={i}
                  className="text-foreground uppercase tracking-[0.2em] text-[10px] lg:text-xs leading-tight"
                >
                  {part.trim()}
                </span>
              ))}
            </Link>

            {/* Right Zone: Reserve CTA */}
            {reserveHref && (
              <a
                href={reserveHref}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                className="border border-accent text-accent px-6 py-2 uppercase tracking-wider text-sm hover:bg-accent hover:text-background transition-colors"
              >
                Reserve
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <div className="md:hidden">
        <div className="flex items-center justify-between h-16 px-4">
          <Link href="/" className="flex flex-col items-center gap-0.5">
            <Image
              src="/images/nav/Vector 77.svg"
              alt=""
              width={24}
              height={8}
              className="w-6 h-2"
              aria-hidden="true"
            />
            <span className="text-foreground uppercase tracking-[0.15em] text-[8px] leading-tight">
              {taglineParts[0]?.trim()}
            </span>
          </Link>
          <button
            ref={menuButtonRef}
            className="touch-target flex items-center justify-center text-foreground"
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
        links={mobileLinks}
      />
    </header>
  )
}
