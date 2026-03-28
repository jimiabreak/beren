import { defineType, defineField } from 'sanity'
import { BlockContentIcon } from '@sanity/icons'

export default defineType({
  name: 'richTextBlock',
  title: 'Rich Text Block',
  type: 'object',
  icon: BlockContentIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'Optional heading displayed above the rich text content',
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'portableText',
      description: 'Rich text content with formatting, links, and images',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title: title || 'Rich Text Block', subtitle: 'Rich Text Section', media: BlockContentIcon }),
  },
})
