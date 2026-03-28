import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'cta',
  title: 'Call to Action',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Button Text',
      type: 'string',
      description: 'Text displayed on the button',
      placeholder: 'Learn more…',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'href',
      title: 'Link',
      type: 'string',
      description: 'Internal path (e.g. /menu) or external URL',
      placeholder: '/about',
      validation: (Rule) => Rule.required(),
    }),
  ],
})
