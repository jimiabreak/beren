import { defineType, defineField, defineArrayMember } from 'sanity'
import { InlineIcon } from '@sanity/icons'

export default defineType({
  name: 'featureGrid',
  title: 'Feature Grid',
  type: 'object',
  icon: InlineIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'Section heading displayed above the features',
    }),
    defineField({
      name: 'subheading',
      title: 'Subheading',
      type: 'text',
      rows: 2,
      description: 'Brief description below the heading',
    }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      description: 'List of features to display in the grid',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'icon', title: 'Icon', type: 'string', description: 'Emoji or icon name to represent this feature' }),
            defineField({ name: 'title', title: 'Title', type: 'string', description: 'Feature name', validation: (Rule) => Rule.required().max(40).warning('Keep under 40 characters to fit the grid') }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 3, description: 'Short explanation of this feature', validation: (Rule) => Rule.max(120).warning('Keep under 120 characters for readability') }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'description' },
          },
        }),
      ],
      validation: (Rule) => Rule.max(12),
    }),
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'number',
      description: 'Number of columns in the grid layout',
      options: {
        list: [
          { title: '2 Columns', value: 2 },
          { title: '3 Columns', value: 3 },
          { title: '4 Columns', value: 4 },
        ],
        layout: 'radio',
      },
      initialValue: 3,
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title: title || 'Feature Grid', subtitle: 'Feature Grid Section', media: InlineIcon }),
  },
})
