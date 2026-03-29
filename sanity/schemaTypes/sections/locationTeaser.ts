import { defineType, defineField } from 'sanity'
import { PinIcon } from '@sanity/icons'

export default defineType({
  name: 'locationTeaser',
  title: 'Location Teaser',
  type: 'object',
  icon: PinIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'Large display text (e.g. "BEREN")',
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'text',
      rows: 2,
      description: 'Optional subtitle or tagline below the heading',
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Full-width atmospheric photo (e.g. Turkish cityscape)',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({
      title: title || 'Location Teaser',
      subtitle: 'Location Teaser',
      media: PinIcon,
    }),
  },
})
