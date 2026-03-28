'use client'

import { useState } from 'react'

interface NewsletterSignupProps {
  placeholder?: string
  buttonText?: string
  className?: string
}

export default function NewsletterSignup({
  placeholder = 'Enter your email\u2026',
  buttonText = 'Subscribe',
  className = '',
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.error || 'Failed to subscribe')
      }

      setStatus('success')
      setEmail('')
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  if (status === 'success') {
    return (
      <div className={className} role="status" aria-live="polite">
        <p className="text-green-600 font-medium">Thanks for subscribing!</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col sm:flex-row gap-3 ${className}`}>
      <label htmlFor="newsletter-email" className="sr-only">Email address</label>
      <input
        id="newsletter-email"
        type="email"
        name="email"
        autoComplete="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={placeholder}
        className="flex-1 min-w-0 px-4 py-3 text-base border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-foreground/50 focus:border-foreground"
        disabled={status === 'loading'}
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="px-6 py-3 bg-foreground text-background rounded-lg font-medium hover:opacity-80 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {status === 'loading' && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {buttonText}
      </button>
      {status === 'error' && (
        <p className="text-red-600 text-sm sm:col-span-full" role="alert" aria-live="polite">
          {errorMsg}
        </p>
      )}
    </form>
  )
}
