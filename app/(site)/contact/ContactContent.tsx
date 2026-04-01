'use client'

import { useState, useRef, FormEvent } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@/lib/animations'

export default function ContactContent() {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const formRef = useRef<HTMLFormElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrorMessage('')

    const form = e.currentTarget
    if (!form.checkValidity()) {
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
      nameRef.current?.focus()
    }
  }

  const inputStyles = 'w-full bg-transparent border-b-2 border-accent py-4 text-base text-foreground placeholder:text-accent uppercase tracking-wider focus:outline-none focus:border-foreground transition-all duration-200'

  return (
    <>
      {/* GET IN TOUCH */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-16 md:pt-28 pb-12 md:pb-16 text-center"
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl tracking-wide text-foreground uppercase text-balance">
          Get In Touch
        </h1>
      </motion.div>

      {/* Send us a message intro */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-14 md:pb-16"
      >
        <motion.div variants={fadeInUp}>
          <h2 className="text-base text-foreground uppercase tracking-wider mb-6">
            Send Us a Message
          </h2>
          <p className="text-base text-accent leading-relaxed max-w-lg text-pretty">
            For general inquiries please fill out the form below
          </p>
        </motion.div>
      </motion.div>

      {/* Two-column: photo + form */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-24 md:pb-32"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
          {/* Left: food photo */}
          <motion.div variants={fadeInUp} className="relative aspect-[3/5] overflow-hidden">
            <Image
              src="/images/parking/Beren-35 1.jpg"
              alt="Mezze spread with colorful dips and dishes"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </motion.div>

          {/* Right: form + info */}
          <motion.div variants={fadeInUp}>
            {formState === 'success' ? (
              <div className="py-8" aria-live="polite">
                <h3 className="text-lg text-foreground uppercase tracking-wider mb-2">Thank you!</h3>
                <p className="text-base text-muted-foreground">We&apos;ll get back to you soon.</p>
                <button
                  onClick={() => setFormState('idle')}
                  className="mt-4 text-base text-accent underline underline-offset-4 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-2" noValidate>
                <div>
                  <label htmlFor="contact-name" className="sr-only">Name</label>
                  <input
                    ref={nameRef}
                    id="contact-name"
                    type="text"
                    name="name"
                    required
                    autoComplete="name"
                    placeholder="Name"
                    className={inputStyles}
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="sr-only">Email</label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    required
                    autoComplete="email"
                    spellCheck={false}
                    placeholder="Email"
                    className={inputStyles}
                  />
                </div>
                <div>
                  <label htmlFor="contact-message" className="sr-only">Message</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    placeholder="Message"
                    rows={1}
                    className={inputStyles + ' resize-none'}
                  />
                </div>
                {formState === 'error' && (
                  <p role="alert" className="text-accent text-sm pt-2">{errorMessage}</p>
                )}
                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={formState === 'submitting'}
                    className="border-2 border-accent text-muted-foreground uppercase tracking-widest text-sm px-8 py-3.5 hover:bg-accent hover:text-background transition-[color,background-color,border-color,transform] disabled:opacity-50 active:scale-[0.97] active:transition-transform active:duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    {formState === 'submitting' ? 'Sending\u2026' : 'Send'}
                  </button>
                </div>
              </form>
            )}

            {/* Contact info below form */}
            <div className="mt-12 space-y-1.5 text-base text-muted-foreground">
              <p>
                <a href="https://berentexas.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors uppercase tracking-wider">
                  berentexas.com
                </a>
              </p>
              <p>
                <a href="mailto:info@berentexas.com" className="hover:text-foreground transition-colors uppercase tracking-wider">
                  info@berentexas.com
                </a>
              </p>
              <p>
                <a href="tel:+16822467501" className="hover:text-foreground transition-colors uppercase tracking-wider">
                  (682) 246 7501
                </a>
              </p>
              <div className="pt-6 space-y-1.5">
                <p className="uppercase tracking-wider">1216 6th Ave.</p>
                <p className="uppercase tracking-wider">Fort Worth, TX</p>
              </div>
              <div className="pt-6 space-y-1.5">
                <p className="uppercase tracking-wider">Hours:</p>
                <p className="uppercase tracking-wider">Monday-Thursday &amp; Sunday:</p>
                <p className="uppercase tracking-wider">11:00 AM - 10:00 PM</p>
                <div className="pt-3">
                  <p className="uppercase tracking-wider">Friday &amp; Saturday:</p>
                  <p className="uppercase tracking-wider">11:00 AM - 11:00 PM</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* GETTING THERE */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-8 pb-12 text-center"
      >
        <h2 className="text-4xl md:text-5xl lg:text-6xl tracking-wide text-foreground uppercase text-balance">
          Getting There
        </h2>
      </motion.div>

      {/* Parking map */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      >
        <div className="relative w-full aspect-[4/3] md:aspect-[16/10] overflow-hidden">
          <Image
            src="/images/parking/parking-img.png"
            alt="Aerial view of BEREN restaurant location with parking areas highlighted"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>

        {/* Parking info */}
        <div className="flex justify-between items-baseline pt-6 pb-3">
          <span className="text-base text-foreground uppercase tracking-wider">Parking:</span>
          <span className="text-base text-foreground uppercase tracking-wider">1216 6th Ave. Fort Worth, TX</span>
        </div>

        {/* Parking legend tabs */}
        <div className="grid grid-cols-2 gap-4 pb-10">
          <div className="flex items-center gap-2 border-b-2 border-accent pb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-accent" />
            <span className="text-base text-foreground uppercase tracking-wider">Customer</span>
          </div>
          <div className="flex items-center gap-2 border-b-2 border-green-500 pb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
            <span className="text-base text-foreground uppercase tracking-wider">After Hours</span>
          </div>
        </div>

        {/* PS1200 link */}
        <div className="text-center pb-20 md:pb-28">
          <p className="text-base text-muted-foreground">
            <Link
              href="https://ps1200.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-accent underline-offset-4 hover:text-foreground transition-colors"
            >
              Check out more at the<br />PS1200 campus.
            </Link>
          </p>
        </div>
      </motion.div>
    </>
  )
}
