'use client'

import { useState } from 'react'

interface NewsletterSignupProps {
  className?: string
}

export default function NewsletterSignup({ className = '' }: NewsletterSignupProps) {
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
        <p className="text-sm text-foreground uppercase tracking-wider">Thank you for subscribing!</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={`${className}`}>
      <label htmlFor="newsletter-email" className="sr-only">Email address</label>
      <div className="flex border border-accent">
        <input
          id="newsletter-email"
          type="email"
          name="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your Email"
          className="flex-1 min-w-0 px-4 py-3 text-sm bg-transparent text-foreground placeholder:text-foreground/50 uppercase tracking-wider focus:outline-none"
          disabled={status === 'loading'}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-4 py-3 text-accent hover:text-foreground transition-colors disabled:opacity-50"
          aria-label="Subscribe"
        >
          {status === 'loading' ? (
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <span aria-hidden="true">&rarr;</span>
          )}
        </button>
      </div>
      {status === 'error' && (
        <p className="text-accent text-xs mt-2 uppercase tracking-wider" role="alert" aria-live="polite">
          {errorMsg}
        </p>
      )}
    </form>
  )
}
