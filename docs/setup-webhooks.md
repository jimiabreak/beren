# Sanity Webhooks for On-Demand Revalidation

## Why

When content editors publish changes in Sanity, the webhook triggers Next.js to rebuild only the affected pages. Changes go live in ~1-2 seconds instead of waiting for the 60-second fallback TTL or a full rebuild.

## Setup Steps

1. Go to [sanity.io/manage](https://sanity.io/manage) > Your Project > API > Webhooks
2. Click **Create Webhook**
3. Configure:
   - **Name:** Next.js Revalidation
   - **URL:** `https://your-domain.com/api/revalidate`
   - **Dataset:** production
   - **Trigger on:** Create, Update, Delete
   - **Filter:** Leave empty to trigger on all document types (recommended)
   - **Projection:** `{_type, _id, "slug": slug.current}`
   - **Secret:** A random string (e.g. generate with `openssl rand -hex 32`)
   - **HTTP method:** POST
   - **API version:** v2024-01-01
   - **Status:** Enabled
4. Set the same secret value in your hosting environment as `SANITY_WEBHOOK_SECRET`

## How It Works

The webhook sends a POST request to `/api/revalidate` whenever a document is created, updated, or deleted. The API route:

1. Validates the webhook signature using `next-sanity/webhook`'s `parseBody`
2. Maps the document `_type` to cache tags:
   - `siteSettings` / `header` / `footer` → `siteSettings`
   - `menuCategory` / `menuItem` → `menu`
   - `faqItem` → `faq`
   - `teamMember` → `team`
   - `testimonial` → `testimonials`
   - `galleryImage` → `gallery`
   - `modularPage` → `modularPages`
   - `page` → `pages`
   - `homePage` → `homePage`
3. Calls `revalidateTag()` for each affected tag, causing Next.js to re-fetch the data on the next request

## Testing

1. Publish a change in Sanity Studio
2. Check your hosting platform's function logs for the revalidation response
3. The affected page should show updated content within seconds
4. You can also test manually:
   ```bash
   curl -X POST https://your-domain.com/api/revalidate \
     -H "Content-Type: application/json" \
     -d '{"_type": "siteSettings", "_id": "siteSettings"}'
   ```
   (Note: without a valid signature this will return 401 if `SANITY_WEBHOOK_SECRET` is set)

## Troubleshooting

- **Changes not appearing:** Check that the webhook URL is correct and the secret matches
- **401 errors:** Verify `SANITY_WEBHOOK_SECRET` matches in both Sanity webhook config and your hosting environment variables
- **500 errors:** Check function logs for the specific error message
- **Delayed updates:** The webhook waits for Content Lake eventual consistency before responding, so there may be a brief delay (1-2 seconds)
- **Fallback:** Even without webhooks, pages will revalidate every 60 seconds via the TTL fallback
