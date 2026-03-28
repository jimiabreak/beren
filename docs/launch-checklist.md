# Launch Checklist

## Pre-Launch

- [ ] All environment variables set in production (see `.env.local.example`)
- [ ] Sanity dataset created and seeded (`npm run seed`)
- [ ] Sanity webhook configured (see `docs/setup-webhooks.md`)
- [ ] Custom domain configured in hosting provider
- [ ] SSL certificate active
- [ ] `NEXT_PUBLIC_SITE_URL` set to production domain
- [ ] robots.txt verified at `/robots.txt`
- [ ] sitemap.xml verified at `/sitemap.xml`
- [ ] Favicon and social share images uploaded to Sanity
- [ ] Google Analytics ID set (`NEXT_PUBLIC_GA_ID`)
- [ ] Cookie consent banner tested
- [ ] Contact form tested end-to-end (Resend)
- [ ] Newsletter subscription tested (if configured)
- [ ] All pages checked on mobile (320px minimum)
- [ ] Lighthouse audit: 95+ target all categories
- [ ] Visual Editing works in Sanity Studio

## CMS Setup

- [ ] Site Settings populated (name, logo, address, hours, social links)
- [ ] Header navigation configured
- [ ] Footer columns and links configured
- [ ] Homepage sections built in page builder
- [ ] All static pages have content (About, Menu, Contact, FAQ, Privacy)
- [ ] SEO metadata set on all pages
- [ ] Promo banner configured (if needed)

## Deployment

- [ ] Production build succeeds (`npm run build`)
- [ ] TypeScript passes (`npm run typecheck`)
- [ ] ESLint passes (`npm run lint`)
- [ ] Preview/staging deployment tested
- [ ] Production deployment live
- [ ] DNS propagation confirmed

## Post-Launch

- [ ] Google Search Console submitted
- [ ] Structured data validated (Google Rich Results Test)
- [ ] Monitor error logs for first 48 hours
- [ ] Test webhook revalidation (edit content, verify update)
- [ ] Backup Sanity dataset
