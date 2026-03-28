'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getConsent, setConsent } from '@/lib/consent'

export default function CookieConsent() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!getConsent()) setShow(true)
  }, [])

  const handleAcceptAll = () => {
    setConsent({ analytics: true, marketing: true })
    window.dispatchEvent(new Event('consent-updated'))
    setShow(false)
  }

  const handleReject = () => {
    setConsent({ analytics: false, marketing: false })
    window.dispatchEvent(new Event('consent-updated'))
    setShow(false)
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed bottom-0 left-0 right-0 z-[60] bg-white border-t border-border shadow-lg"
          role="dialog"
          aria-label="Cookie consent"
        >
          <div className="max-w-5xl mx-auto px-4 py-4 sm:py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <p className="text-sm text-muted-foreground flex-1">
              We use cookies to improve your experience and analyze site traffic.
              By clicking &ldquo;Accept All&rdquo;, you consent to our use of cookies.
            </p>
            <div className="flex gap-3 flex-shrink-0">
              <button
                onClick={handleReject}
                className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted transition-colors"
              >
                Reject
              </button>
              <button
                onClick={handleAcceptAll}
                className="px-4 py-2 text-sm bg-foreground text-background rounded-lg hover:opacity-80 transition-colors"
              >
                Accept All
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
