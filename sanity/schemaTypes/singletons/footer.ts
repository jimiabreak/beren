import { defineType, defineField, defineArrayMember } from 'sanity'
import { BlockContentIcon } from '@sanity/icons'

export default defineType({
  name: 'footer',
  title: 'Footer',
  type: 'document',
  icon: BlockContentIcon,
  fields: [
    defineField({ name: 'tagline', title: 'Tagline', type: 'string', description: 'Short tagline displayed in the footer area', placeholder: 'Crafted with care since 2020…' }),
    defineField({
      name: 'columns',
      title: 'Link Columns',
      type: 'array',
      description: 'Groups of links organized into columns in the footer',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'title', type: 'string', title: 'Column Title', validation: (Rule) => Rule.required() }),
            defineField({
              name: 'links',
              type: 'array',
              title: 'Links',
              of: [
                defineArrayMember({
                  type: 'object',
                  fields: [
                    defineField({ name: 'label', type: 'string', title: 'Label', description: 'Link text shown to visitors', placeholder: 'About Us', validation: (Rule) => Rule.required() }),
                    defineField({ name: 'href', type: 'string', title: 'Link', description: 'URL path or full URL', placeholder: '/about', validation: (Rule) => Rule.required() }),
                  ],
                  preview: {
                    select: { title: 'label', subtitle: 'href' },
                  },
                }),
              ],
              validation: (Rule) => Rule.max(10),
            }),
          ],
          preview: {
            select: { title: 'title' },
          },
        }),
      ],
      validation: (Rule) => Rule.max(5),
    }),
    defineField({ name: 'copyrightText', title: 'Copyright Text', type: 'string', description: 'e.g. "All rights reserved." — year and business name are added automatically' }),
  ],
  preview: {
    prepare() {
      return { title: 'Footer' }
    },
  },
})
