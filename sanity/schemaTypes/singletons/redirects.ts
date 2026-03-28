import { defineType, defineField, defineArrayMember } from 'sanity'
import { LinkIcon } from '@sanity/icons'

export default defineType({
  name: 'redirects',
  title: 'Redirects',
  type: 'document',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'rules',
      title: 'Redirect Rules',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'source',
              type: 'string',
              title: 'Source Path',
              description: 'e.g. /old-page',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'destination',
              type: 'string',
              title: 'Destination Path',
              description: 'e.g. /new-page',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'permanent',
              type: 'boolean',
              title: 'Permanent (301)',
              initialValue: false,
              description: 'Permanent (301) vs temporary (307) redirect',
            }),
          ],
          preview: {
            select: { source: 'source', destination: 'destination', permanent: 'permanent' },
            prepare({ source, destination, permanent }) {
              return {
                title: `${source} → ${destination}`,
                subtitle: permanent ? '301 (permanent)' : '307 (temporary)',
              }
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Redirects' }
    },
  },
})
