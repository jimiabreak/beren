'use client'

import { useState, useRef, FormEvent } from 'react'
import { stegaClean } from '@sanity/client/stega'
import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@/lib/animations'
import Container from '@/components/layout/Container'
import Button from '@/components/ui/Button'
import type { SiteSettings } from '@/types'

interface ContactContentProps {
  settings: SiteSettings | null
}

export default function ContactContent({ settings }: ContactContentProps) {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrorMessage('')

    const form = e.currentTarget

    if (!form.checkValidity()) {
      const firstInvalid = form.querySelector<HTMLInputElement | HTMLTextAreaElement>(':invalid')
      firstInvalid?.focus()
      form.reportValidity()
      return
    }

    setFormState('submitting')
    const formData = new FormData(form)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: (formData.get('name') as string)?.trim(),
          email: (formData.get('email') as string)?.trim(),
          phone: (formData.get('phone') as string)?.trim(),
          message: (formData.get('message') as string)?.trim(),
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Something went wrong')
      }

      setFormState('success')
      form.reset()
    } catch (err: unknown) {
      setFormState('error')
      setErrorMessage(err instanceof Error ? err.message : 'Failed to send message')
    }
  }

  function handleTextareaKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      formRef.current?.requestSubmit()
    }
  }

  return (
    <Container>
      <motion.h1
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="font-serif text-4xl sm:text-5xl text-center mb-12"
      >
        Contact Us
      </motion.h1>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-16"
      >
        {/* Form */}
        <motion.div variants={fadeInUp}>
          {formState === 'success' ? (
            <div className="bg-muted p-8 rounded-sm text-center" aria-live="polite">
              <h2 className="font-serif text-2xl mb-2">Thank you!</h2>
              <p className="text-muted-foreground">We&apos;ll get back to you soon.</p>
            </div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  autoComplete="name"
                  placeholder="Jane Doe…"
                  className="w-full px-4 py-3 border border-border bg-background rounded-sm focus:outline-none focus:ring-2 focus:ring-foreground"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  autoComplete="email"
                  spellCheck={false}
                  placeholder="jane@example.com…"
                  className="w-full px-4 py-3 border border-border bg-background rounded-sm focus:outline-none focus:ring-2 focus:ring-foreground"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2">Phone (optional)</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="(555) 123-4567…"
                  className="w-full px-4 py-3 border border-border bg-background rounded-sm focus:outline-none focus:ring-2 focus:ring-foreground"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  placeholder="How can we help…"
                  onKeyDown={handleTextareaKeyDown}
                  className="w-full px-4 py-3 border border-border bg-background rounded-sm focus:outline-none focus:ring-2 focus:ring-foreground resize-none"
                />
              </div>
              {formState === 'error' && (
                <p role="alert" className="text-red-600 text-sm">{errorMessage}</p>
              )}
              <Button type="submit" disabled={formState === 'submitting'}>
                {formState === 'submitting' ? 'Sending…' : 'Send Message'}
              </Button>
            </form>
          )}
        </motion.div>

        {/* Info */}
        <motion.div variants={fadeInUp} className="space-y-8">
          {/* Hours */}
          {settings?.hours && settings.hours.length > 0 && (
            <div>
              <h2 className="font-serif text-2xl mb-4">Hours</h2>
              <div className="space-y-2">
                {settings.hours.map((h: { _key?: string; day: string; closed?: boolean; openTime?: string; closeTime?: string }) => (
                  <div key={h._key || stegaClean(h.day)} className="flex justify-between text-sm">
                    <span>{h.day}</span>
                    <span className="text-muted-foreground">
                      {h.closed ? 'Closed' : `${h.openTime} – ${h.closeTime}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Address */}
          {settings?.address && (
            <div>
              <h2 className="font-serif text-2xl mb-4">Location</h2>
              <p className="text-muted-foreground">
                {settings.address.street}<br />
                {settings.address.city}, {settings.address.state} {settings.address.zip}
              </p>
            </div>
          )}

          {/* Contact Info */}
          <div>
            <h2 className="font-serif text-2xl mb-4">Get in Touch</h2>
            {settings?.phone && (
              <p className="text-muted-foreground mb-1">
                <a href={`tel:${stegaClean(settings.phone)}`} className="hover:text-foreground transition-colors">
                  {settings.phone}
                </a>
              </p>
            )}
            {settings?.email && (
              <p className="text-muted-foreground">
                <a href={`mailto:${stegaClean(settings.email)}`} className="hover:text-foreground transition-colors">
                  {settings.email}
                </a>
              </p>
            )}
          </div>

          {/* Reservation CTA */}
          {settings?.reservationUrl && (
            <div className="bg-muted p-6 rounded-sm">
              <h3 className="font-serif text-xl mb-2">Make a Reservation</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Book a table through our reservation system.
              </p>
              <a
                href={stegaClean(settings.reservationUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-foreground text-background px-6 py-3 text-sm uppercase tracking-wider hover:opacity-80 transition-colors"
              >
                Reserve a Table
              </a>
            </div>
          )}
        </motion.div>
      </motion.div>
    </Container>
  )
}
