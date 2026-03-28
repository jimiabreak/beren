import Link from 'next/link'
import { stegaClean } from '@sanity/client/stega'
import type { SanityImageSource } from '@sanity/image-url'
import SanityImage from '@/components/sanity/SanityImage'

interface FooterProps {
  siteSettings?: {
    name?: string
    logo?: SanityImageSource
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
    columns?: Array<{
      _key: string
      title: string
      links?: Array<{ _key: string; label: string; href: string }>
    }>
    copyrightText?: string
  }
}

const socialIcons: Record<string, string> = {
  facebook: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  instagram: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z',
  twitter: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  tiktok: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z',
  yelp: 'M20.16 12.594l-4.995 1.98c-.53.212-.74.674-.46 1.012l3.678 4.456c.263.318.696.378.946.13l2.948-2.946c.248-.25.188-.682-.13-.944l-1.987-3.688zm-7.842-1.174l3.65-3.792c.316-.327.253-.756-.14-.94L12.83 5.19c-.392-.183-.82-.06-.94.27l-1.74 4.97c-.12.33.16.71.528.69l1.64-.07zm-1.076 2.716l-4.57-2.436c-.362-.193-.774-.048-.9.318l-1.5 4.346c-.126.366.05.764.383.87l3.946 1.248c.332.105.706-.098.82-.445l1.82-3.9zm3.166 1.474l1.056 5.103c.083.4-.162.76-.536.79l-4.432.344c-.373.03-.698-.24-.71-.59l-.168-5.3c-.013-.35.29-.632.66-.614l3.13.147c.37.018.67.33.7.7l.3-.58zm-2.748-7.99l-2.198-4.68c-.175-.371-.58-.503-.89-.29l-3.66 2.526c-.31.214-.382.634-.158.918l3.37 4.264c.224.284.674.318.984.075l2.552-2.814z',
  google: 'M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z',
  youtube: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z',
}

export default function Footer({ siteSettings, footerData }: FooterProps) {
  const address = siteSettings?.address

  return (
    <footer className="bg-foreground text-background py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            {siteSettings?.logo ? (
              <SanityImage
                image={siteSettings.logo}
                alt={siteSettings.name || 'Business'}
                width={120}
                height={40}
                className="h-8 w-auto mb-4 invert"
              />
            ) : (
              <span className="font-serif text-2xl font-bold block mb-4">
                {siteSettings?.name || 'Business'}
              </span>
            )}
            {address && (
              <p className="text-sm opacity-70 leading-relaxed">
                {address.street}<br />
                {address.city}, {address.state} {address.zip}
              </p>
            )}
          </div>

          {/* Navigation */}
          {footerData?.columns?.length ? (
            footerData.columns.map((col) => (
              <div key={col._key}>
                <h3 className="font-serif text-lg mb-4">{col.title}</h3>
                <nav className="flex flex-col gap-2">
                  {col.links?.map((link) => (
                    <Link
                      key={link._key}
                      href={stegaClean(link.href)}
                      className="text-sm opacity-70 hover:opacity-100 transition-opacity"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
            ))
          ) : (
            <div>
              <h3 className="font-serif text-lg mb-4">Navigate</h3>
              <nav className="flex flex-col gap-2">
                {[
                  { href: '/about', label: 'About' },
                  { href: '/contact', label: 'Contact' },
                  { href: '/faq', label: 'FAQ' },
                  { href: '/privacy', label: 'Privacy Policy' },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm opacity-70 hover:opacity-100 transition-opacity"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          )}

          {/* Contact + Social */}
          <div>
            <h3 className="font-serif text-lg mb-4">Contact</h3>
            {siteSettings?.phone && (
              <a href={`tel:${stegaClean(siteSettings.phone)}`} className="block text-sm opacity-70 hover:opacity-100 py-1">
                {siteSettings.phone}
              </a>
            )}
            {siteSettings?.email && (
              <a href={`mailto:${stegaClean(siteSettings.email)}`} className="block text-sm opacity-70 hover:opacity-100 py-1 mb-2">
                {siteSettings.email}
              </a>
            )}
            {siteSettings?.socialLinks && siteSettings.socialLinks.length > 0 && (
              <div className="flex gap-4 mt-4">
                {siteSettings.socialLinks.map((social) => {
                  const platform = stegaClean(social.platform)
                  return (
                    <a
                      key={social._key || platform}
                      href={stegaClean(social.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={platform}
                      className="p-3 -m-3 opacity-70 hover:opacity-100 transition-opacity"
                    >
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d={socialIcons[platform] || ''} />
                      </svg>
                    </a>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-background/20 text-center text-sm opacity-50">
          {footerData?.copyrightText
            ? footerData.copyrightText
            : <>&copy; {new Date().getFullYear()} {siteSettings?.name || 'Business'}. All rights reserved.</>
          }
        </div>
      </div>
    </footer>
  )
}
