import { defineType, defineField, defineArrayMember } from 'sanity'
import { BarChartIcon } from '@sanity/icons'

export default defineType({
  name: 'statsBar',
  title: 'Stats Bar',
  type: 'object',
  icon: BarChartIcon,
  fields: [
    defineField({
      name: 'stats',
      title: 'Stats',
      type: 'array',
      description: 'Statistics to display in a horizontal bar',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'value', title: 'Value', type: 'string', description: 'The number or metric (e.g. 500+)', validation: (Rule) => Rule.required() }),
            defineField({ name: 'label', title: 'Label', type: 'string', description: 'What this stat represents (e.g. Happy Clients)', validation: (Rule) => Rule.required() }),
            defineField({ name: 'prefix', title: 'Prefix', type: 'string', description: 'Text before the value (e.g. $)' }),
            defineField({ name: 'suffix', title: 'Suffix', type: 'string', description: 'Text after the value (e.g. +, %, k)' }),
          ],
          preview: {
            select: { title: 'value', subtitle: 'label' },
          },
        }),
      ],
      validation: (Rule) => Rule.max(6),
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Stats Bar', subtitle: 'Stats Section', media: BarChartIcon }),
  },
})
