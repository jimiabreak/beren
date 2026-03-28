'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

interface PromoBannerProps {
  id: string
  message: string
  ctaText?: string | null
  ctaUrl?: string | null
  backgroundColor?: string | null
  textColor?: string | null
  dismissible?: boolean | null
  position?: string | null
}

export default function PromoBanner({
  id,
  message,
  ctaText,
  ctaUrl,
  backgroundColor,
  textColor,
  dismissible,
  position,
}: PromoBannerProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const dismissed = localStorage.getItem(`banner-dismissed-${id}`)
    if (!dismissed) setVisible(true)
  }, [id])

  const handleDismiss = () => {
    setVisible(false)
    localStorage.setItem(`banner-dismissed-${id}`, 'true')
  }

  const isBottom = position === 'bottom'

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={`overflow-hidden ${isBottom ? 'fixed bottom-0 left-0 right-0 z-50' : 'sticky top-0 z-50'}`}
          style={{ backgroundColor: backgroundColor || '#B8860B', color: textColor || '#FFFFFF' }}
          role="banner"
        >
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-center gap-4 text-sm">
            <p className="text-center">
              {message}
              {ctaText && ctaUrl && (
                <>
                  {' '}
                  <Link href={ctaUrl} className="underline underline-offset-2 font-semibold hover:opacity-80 transition-opacity">
                    {ctaText}
                  </Link>
                </>
              )}
            </p>
            {dismissible !== false && (
              <button
                onClick={handleDismiss}
                className="flex-shrink-0 p-1 hover:opacity-80 transition-opacity"
                aria-label="Dismiss banner"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
