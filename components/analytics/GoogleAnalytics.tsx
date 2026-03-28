'use client'

import { useState, useEffect, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import Script from 'next/script'
import { getConsent } from '@/lib/consent'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID

export default function GoogleAnalytics() {
  const pathname = usePathname()
  const [hasConsent, setHasConsent] = useState(false)

  const checkConsent = useCallback(() => {
    const consent = getConsent()
    setHasConsent(consent?.analytics === true)
  }, [])

  // Check consent on mount and listen for changes
  useEffect(() => {
    checkConsent()

    const handleConsentUpdate = () => checkConsent()

    window.addEventListener('consent-updated', handleConsentUpdate)
    window.addEventListener('storage', handleConsentUpdate)

    return () => {
      window.removeEventListener('consent-updated', handleConsentUpdate)
      window.removeEventListener('storage', handleConsentUpdate)
    }
  }, [checkConsent])

  // Send pageview on route change (only when consent is granted)
  useEffect(() => {
    if (!GA_ID || !hasConsent) return
    window.gtag?.('config', GA_ID, { page_path: pathname })
  }, [pathname, hasConsent])

  if (!GA_ID || !hasConsent) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { page_path: window.location.pathname });
        `}
      </Script>
    </>
  )
}
