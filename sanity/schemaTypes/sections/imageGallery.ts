import { defineType, defineField, defineArrayMember } from 'sanity'
import { ImageIcon } from '@sanity/icons'

export default defineType({
  name: 'imageGallery',
  title: 'Image Gallery',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'Section heading displayed above the gallery',
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      description: 'Images to display in the gallery',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', title: 'Alt Text', type: 'string', description: 'Describe the image for screen readers', validation: (Rule) => Rule.required() }),
            defineField({ name: 'caption', title: 'Caption', type: 'string', description: 'Optional caption displayed below the image' }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      description: 'How images are displayed',
      options: {
        list: [
          { title: 'Grid', value: 'grid' },
          { title: 'Carousel', value: 'carousel' },
        ],
        layout: 'radio',
      },
      initialValue: 'grid',
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title: title || 'Image Gallery', subtitle: 'Gallery Section', media: ImageIcon }),
  },
})
