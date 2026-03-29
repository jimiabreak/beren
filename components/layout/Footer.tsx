'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { fadeIn } from '@/lib/animations'
import NewsletterSignup from '@/components/ui/NewsletterSignup'

interface FooterProps {
  siteSettings?: {
    name?: string
    phone?: string
    email?: string
    address?: {
      street?: string
      city?: string
      state?: string
      zip?: string
    }
    socialLinks?: Array<{ _key?: string; platform: string; url: string }>
  }
  footerData?: {
    tagline?: string
    copyrightText?: string
  }
}

export default function Footer({ siteSettings }: FooterProps) {
  const address = siteSettings?.address

  return (
    <footer className="bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Orange divider */}
        <div className="border-t-2 border-accent mt-12 mb-10" />

        {/* Main footer grid: 3 columns + social icons */}
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr] gap-10 md:gap-8 items-start relative">
          {/* Left: Newsletter */}
          <div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Sign up for our newsletter to stay in the loop with what&apos;s new at BEREN.
            </p>
            <NewsletterSignup />
          </div>

          {/* Contact info */}
          <div className="flex flex-col gap-1">
            <a
              href="https://berentexas.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              berentexas.com
            </a>
            <a
              href="mailto:info@berentexas.com"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              info@berentexas.com
            </a>
            <a
              href="tel:+16822467501"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors tracking-wider focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              (682) 246 7501
            </a>
          </div>

          {/* Hours + Social icons */}
          <div className="flex flex-col gap-1 text-sm text-muted-foreground uppercase tracking-wider">
            <div className="flex justify-between items-start">
              <div>
                <p>Hours:</p>
                <p>Monday-Thursday &amp; Sunday:</p>
                <p>11:00 AM - 10:00 PM</p>
                <div className="mt-2">
                  <p>Friday &amp; Saturday:</p>
                  <p>11:00 AM - 11:00 PM</p>
                </div>
              </div>
              <div className="flex gap-3 md:absolute md:right-0 md:top-0">
                <a
                  href="https://www.facebook.com/berenmediterranean"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="opacity-80 hover:opacity-100 hover:scale-110 transition-[opacity,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <Image
                    src="/images/nav/Facebook.svg"
                    alt="Facebook"
                    width={24}
                    height={24}
                    className="w-6 h-6"
                  />
                </a>
                <a
                  href="https://www.instagram.com/berenmediterranean/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="opacity-80 hover:opacity-100 hover:scale-110 transition-[opacity,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <Image
                    src="/images/nav/Instagram.svg"
                    alt="Instagram"
                    width={24}
                    height={24}
                    className="w-6 h-6"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Full-width BEREN logo */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-12 md:mt-16"
        >
          <Image
            src="/images/nav/Logo.svg"
            alt="BEREN"
            width={1280}
            height={200}
            className="w-full h-auto"
            priority={false}
          />
        </motion.div>

        {/* Bottom bar */}
        <div className="mt-8 pb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {/* Address */}
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            {address
              ? `${address.street}. ${address.city}, ${address.state}`
              : '1216 6th Ave. Fort Worth, TX'}
          </p>

          {/* Nav links + copyright */}
          <nav className="flex items-center gap-4 text-xs text-muted-foreground uppercase tracking-wider">
            <Link href="/catering" className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
              Catering
            </Link>
            <Link href="/contact" className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
              Contact
            </Link>
            <span>
              &copy; BEREN {new Date().getFullYear()}
            </span>
          </nav>
        </div>
      </div>
    </footer>
  )
}
