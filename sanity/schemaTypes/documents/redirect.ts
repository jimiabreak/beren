import { defineType, defineField } from 'sanity'
import { LinkIcon } from '@sanity/icons'

export default defineType({
  name: 'redirect',
  title: 'Redirect',
  type: 'document',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'source',
      title: 'Source Path',
      type: 'string',
      description: 'The path to redirect FROM, e.g. /old-page',
      validation: (Rule) =>
        Rule.required().custom((value) => {
          if (typeof value === 'string' && !value.startsWith('/')) {
            return 'Source path must start with /'
          }
          return true
        }),
    }),
    defineField({
      name: 'destination',
      title: 'Destination',
      type: 'string',
      description: 'The path or URL to redirect TO, e.g. /new-page or https://example.com',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'permanent',
      title: 'Permanent Redirect',
      type: 'boolean',
      description: '301 (permanent) for SEO-safe moves, 302 (temporary) for short-term redirects',
      initialValue: true,
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      description: 'Toggle off to disable without deleting',
      initialValue: true,
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'text',
      rows: 2,
      description: 'Internal notes — not visible on the site',
    }),
  ],
  orderings: [
    {
      title: 'Source Path',
      name: 'sourceAsc',
      by: [{ field: 'source', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      source: 'source',
      destination: 'destination',
      permanent: 'permanent',
      isActive: 'isActive',
    },
    prepare({ source, destination, permanent, isActive }) {
      const status = permanent ? '301' : '302'
      const inactive = isActive === false ? ' — INACTIVE' : ''
      return {
        title: `${source || '/'} → ${destination || '?'}`,
        subtitle: `${status}${inactive}`,
        media: LinkIcon,
      }
    },
  },
})
