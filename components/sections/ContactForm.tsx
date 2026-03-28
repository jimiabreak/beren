'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@/lib/animations'
import Container from '@/components/layout/Container'
import { useIsVisualEditing } from '@/components/sanity/VisualEditingContext'

interface ContactFormProps {
  heading?: string
  subheading?: string
}

export default function ContactForm({ heading, subheading }: ContactFormProps) {
  const isVisualEditing = useIsVisualEditing()
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget

    if (!form.checkValidity()) {
      const firstInvalid = form.querySelector<HTMLInputElement | HTMLTextAreaElement>(':invalid')
      firstInvalid?.focus()
      form.reportValidity()
      return
    }

    setFormState('submitting')
    const formData = new FormData(form)
    const data = {
      name: (formData.get('name') as string)?.trim(),
      email: (formData.get('email') as string)?.trim(),
      phone: (formData.get('phone') as string)?.trim() || undefined,
      message: (formData.get('message') as string)?.trim(),
    }
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const result = await res.json()
        throw new Error(result.error || 'Failed to send')
      }
      setFormState('success')
      form.reset()
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong')
      setFormState('error')
    }
  }

  function handleTextareaKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      formRef.current?.requestSubmit()
    }
  }

  const inputClasses =
    'w-full bg-transparent border-b border-border py-4 text-base placeholder:text-muted-foreground focus:border-foreground focus:outline-none transition-colors'

  return (
    <motion.section
      variants={staggerContainer}
      initial={isVisualEditing ? false : 'hidden'}
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      className="py-24 md:py-32"
    >
      <Container>
        <motion.div variants={fadeInUp} className="max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight text-center mb-4">
            {heading || 'Get in Touch'}
          </h2>
          {subheading && (
            <p className="text-lg text-muted-foreground text-center mb-12">
              {subheading}
            </p>
          )}
          {!subheading && <div className="mb-12" />}

          {formState === 'success' ? (
            <div className="text-center py-12" aria-live="polite">
              <p className="text-lg font-medium text-foreground">
                Thank you! We&apos;ll be in touch soon.
              </p>
            </div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-8" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <label htmlFor="cf-name" className="block font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="cf-name"
                    name="name"
                    required
                    autoComplete="name"
                    placeholder="Jane Doe..."
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label htmlFor="cf-email" className="block font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="cf-email"
                    name="email"
                    required
                    autoComplete="email"
                    spellCheck={false}
                    placeholder="jane@example.com..."
                    className={inputClasses}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="cf-phone" className="block font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  id="cf-phone"
                  name="phone"
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="(555) 123-4567..."
                  className={inputClasses}
                />
              </div>
              <div>
                <label htmlFor="cf-message" className="block font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">
                  Message *
                </label>
                <textarea
                  id="cf-message"
                  name="message"
                  required
                  rows={5}
                  placeholder="How can we help..."
                  onKeyDown={handleTextareaKeyDown}
                  className={`${inputClasses} min-h-[120px] resize-none`}
                />
              </div>
              {formState === 'error' && (
                <p role="alert" className="text-sm font-bold text-foreground underline">
                  {errorMessage}
                </p>
              )}
              <button
                type="submit"
                disabled={formState === 'submitting'}
                className="w-full bg-foreground text-background py-4 text-base font-medium uppercase tracking-wider hover:opacity-80 transition-all duration-300 disabled:opacity-60"
              >
                {formState === 'submitting' ? 'Sending\u2026' : 'Send Message'}
              </button>
            </form>
          )}
        </motion.div>
      </Container>
    </motion.section>
  )
}
