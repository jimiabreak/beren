import { defineType, defineField } from 'sanity'
import { SplitHorizontalIcon } from '@sanity/icons'

export default defineType({
  name: 'splitContent',
  title: 'Split Content',
  type: 'object',
  icon: SplitHorizontalIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'Section heading displayed beside the image',
      placeholder: 'Your heading here…',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'portableText',
      description: 'Rich text content displayed alongside the image',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Image displayed on one side of the split layout',
    }),
    defineField({
      name: 'imagePosition',
      title: 'Image Position',
      type: 'string',
      options: { list: ['left', 'right'], layout: 'radio' },
      initialValue: 'right',
      description: 'Which side the image appears on',
    }),
    defineField({
      name: 'cta',
      title: 'CTA Button',
      type: 'cta',
      description: 'Optional call-to-action button below the text',
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: title || 'Split Content', subtitle: 'Split Content', media: SplitHorizontalIcon }
    },
  },
})
