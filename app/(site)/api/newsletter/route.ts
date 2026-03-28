import { type NextRequest, NextResponse } from 'next/server'

const PROVIDER = process.env.NEWSLETTER_PROVIDER

async function subscribeKlaviyo(email: string) {
  const listId = process.env.KLAVIYO_LIST_ID
  const apiKey = process.env.KLAVIYO_API_KEY
  if (!listId || !apiKey) throw new Error('Klaviyo not configured')

  const res = await fetch(
    `https://a.klaviyo.com/api/v2/list/${listId}/subscribe`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: apiKey,
        profiles: [{ email }],
      }),
    }
  )
  if (!res.ok) throw new Error(`Klaviyo error: ${res.status}`)
}

async function subscribeMailchimp(email: string) {
  const listId = process.env.MAILCHIMP_LIST_ID
  const apiKey = process.env.MAILCHIMP_API_KEY
  if (!listId || !apiKey) throw new Error('Mailchimp not configured')

  const dc = apiKey.split('-').pop()
  const res = await fetch(
    `https://${dc}.api.mailchimp.com/3.0/lists/${listId}/members`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(`anystring:${apiKey}`).toString('base64')}`,
      },
      body: JSON.stringify({
        email_address: email,
        status: 'subscribed',
      }),
    }
  )
  if (!res.ok) {
    const data = await res.json().catch(() => null)
    if (data?.title === 'Member Exists') return
    throw new Error(`Mailchimp error: ${res.status}`)
  }
}

async function subscribeConvertKit(email: string) {
  const formId = process.env.CONVERTKIT_FORM_ID
  const apiKey = process.env.CONVERTKIT_API_KEY
  if (!formId || !apiKey) throw new Error('ConvertKit not configured')

  const res = await fetch(
    `https://api.convertkit.com/v3/forms/${formId}/subscribe`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: apiKey,
        email,
      }),
    }
  )
  if (!res.ok) throw new Error(`ConvertKit error: ${res.status}`)
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email required' },
        { status: 400 }
      )
    }

    if (!PROVIDER) {
      console.log('[newsletter] No provider configured — subscription logged only')
      return NextResponse.json({ success: true })
    }

    switch (PROVIDER) {
      case 'klaviyo':
        await subscribeKlaviyo(email.trim())
        break
      case 'mailchimp':
        await subscribeMailchimp(email.trim())
        break
      case 'convertkit':
        await subscribeConvertKit(email.trim())
        break
      default:
        return NextResponse.json(
          { error: 'Unknown newsletter provider' },
          { status: 500 }
        )
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
