import { type NextRequest, NextResponse } from 'next/server'

const WEB3FORMS_KEY = process.env.WEB3FORMS_ACCESS_KEY || 'e15c0631-2d68-4692-95f7-1b0cd0bda82c'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email || typeof email !== 'string' || !EMAIL_RE.test(email.trim())) {
      return NextResponse.json(
        { error: 'Valid email required' },
        { status: 400 }
      )
    }

    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        subject: `BEREN Newsletter Signup: ${email.trim()}`,
        from_name: 'BEREN Website',
        email: email.trim(),
        message: `New newsletter subscriber: ${email.trim()}`,
      }),
    })

    if (!res.ok) {
      throw new Error(`Web3Forms error: ${res.status}`)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[newsletter] Error:', err)
    return NextResponse.json(
      { error: 'Failed to subscribe' },
      { status: 500 }
    )
  }
}
