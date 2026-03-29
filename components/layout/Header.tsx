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

  const navTaglineL1 = 'Ancestral Mediterranean Cooking'
  const navTaglineL2 = 'Meze & Grill House'

  const mobileLinks = [
    { href: '/our-story', label: 'Our Story' },
    { href: '/menu', label: 'The Menu' },
    { href: '/catering', label: 'Catering' },
    { href: '/contact', label: 'Contact' },
    ...(reserveHref ? [{ href: reserveHref, label: 'Reserve', isButton: true }] : []),
  ]

  return (
    <header className="bg-background">
      {/* Desktop Nav */}
      <div className="hidden md:block">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 lg:h-24">
            {/* Left Zone: Nav links with decorative icons */}
            <nav className="flex items-center gap-4 lg:gap-6">
              <Link
                href="/our-story"
                className="text-foreground uppercase tracking-wider text-sm lg:text-base font-mono leading-tight hover:text-accent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                Our<br />Story
              </Link>
              <Image
                src="/images/nav/Vector 76.svg"
                alt=""
                width={20}
                height={20}
                className="size-5 lg:size-6"
                aria-hidden="true"
              />
              <Link
                href="/menu"
                className="text-foreground uppercase tracking-wider text-sm lg:text-base font-mono leading-tight hover:text-accent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
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

            {/* Center Zone: Wave icon + tagline */}
            <Link href="/" className="flex items-center gap-3 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
              <Image
                src="/images/nav/Vector 77.svg"
                alt=""
                width={32}
                height={11}
                className="w-7 h-3 flex-shrink-0"
                aria-hidden="true"
              />
              <div className="flex flex-col items-start">
                <span className="text-foreground uppercase tracking-[0.2em] text-[10px] lg:text-xs leading-tight">
                  {navTaglineL1}
                </span>
                <span className="text-foreground uppercase tracking-[0.2em] text-[10px] lg:text-xs leading-tight">
                  {navTaglineL2}
                </span>
              </div>
            </Link>

            {/* Right Zone: Reserve CTA */}
            {reserveHref && (
              <a
                href={reserveHref}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                className="border border-accent text-foreground px-8 py-3 uppercase tracking-wider text-sm hover:bg-accent hover:text-background transition-[color,background-color,border-color,transform] duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
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
          <Link href="/" className="flex flex-col items-center gap-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
            <Image
              src="/images/nav/Vector 77.svg"
              alt=""
              width={24}
              height={8}
              className="w-6 h-2"
              aria-hidden="true"
            />
            <span className="text-foreground uppercase tracking-[0.15em] text-[8px] leading-tight">
              {navTaglineL1}
            </span>
          </Link>
          <button
            ref={menuButtonRef}
            className="touch-target flex items-center justify-center text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
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
