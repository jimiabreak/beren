import { defineType, defineField, defineArrayMember } from 'sanity'
import { TagIcon } from '@sanity/icons'

export default defineType({
  name: 'logoBar',
  title: 'Logo Bar',
  type: 'object',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'Optional heading displayed above the logos (e.g. "Trusted by")',
    }),
    defineField({
      name: 'logos',
      title: 'Logos',
      type: 'array',
      description: 'Company or partner logos to display',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', title: 'Alt Text', type: 'string', description: 'Describe the logo for screen readers', validation: (Rule) => Rule.required() }),
          ],
        }),
      ],
      validation: (Rule) => Rule.max(20),
    }),
    defineField({
      name: 'grayscale',
      title: 'Grayscale',
      type: 'boolean',
      description: 'Display logos in grayscale (colored on hover)',
      initialValue: true,
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title: title || 'Logo Bar', subtitle: 'Logo Section', media: TagIcon }),
  },
})
