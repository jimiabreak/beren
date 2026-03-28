# Deployment Guide

## Vercel (Recommended)

1. Push repo to GitHub
2. Import project at [vercel.com/new](https://vercel.com/new)
3. Set environment variables (see `.env.local.example` for full list):
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET`
   - `SANITY_API_READ_TOKEN`
   - `SANITY_API_WRITE_TOKEN`
   - `SANITY_WEBHOOK_SECRET`
   - `RESEND_API_KEY` (if using contact form)
   - `CONTACT_EMAIL_TO` / `CONTACT_EMAIL_FROM`
   - `NEXT_PUBLIC_SITE_URL`
   - `NEXT_PUBLIC_GA_ID` (optional)
   - Newsletter provider vars (optional)
4. Deploy
5. Set up custom domain in Vercel dashboard

## Netlify

1. Push repo to GitHub
2. Import at [app.netlify.com](https://app.netlify.com)
3. Build command: `npm run build`
4. Publish directory: `.next`
5. Set environment variables (same as above)
6. Install the `@netlify/plugin-nextjs` plugin

## Webhook Setup

After deployment, configure the Sanity webhook:

1. Go to [sanity.io/manage](https://sanity.io/manage) > Your Project > API > Webhooks
2. Create webhook:
   - **URL:** `https://[your-domain]/api/revalidate`
   - **Trigger:** Create, Update, Delete
   - **Secret:** Same value as `SANITY_WEBHOOK_SECRET`
3. See `docs/setup-webhooks.md` for details

## Environment Variable Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Yes | Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | Yes | Dataset name (usually `production`) |
| `NEXT_PUBLIC_SANITY_API_VERSION` | No | API version (default: `2024-01-01`) |
| `SANITY_API_READ_TOKEN` | Yes | Read token for data fetching |
| `SANITY_API_WRITE_TOKEN` | Yes | Write token for form submissions + seed |
| `SANITY_WEBHOOK_SECRET` | Yes | Shared secret for webhook validation |
| `RESEND_API_KEY` | Contact | Resend API key |
| `CONTACT_EMAIL_TO` | Contact | Destination email |
| `CONTACT_EMAIL_FROM` | Contact | Sender address |
| `NEXT_PUBLIC_SITE_URL` | No | Production URL |
| `NEXT_PUBLIC_GA_ID` | No | Google Analytics ID |
| `NEWSLETTER_PROVIDER` | No | `klaviyo`, `mailchimp`, or `convertkit` |
