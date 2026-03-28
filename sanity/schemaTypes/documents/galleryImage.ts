import { ImageIcon } from '@sanity/icons'
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'galleryImage',
  title: 'Gallery Image',
  type: 'document',
  icon: ImageIcon,
  fields: [
    defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true }, description: 'The gallery image — use the hotspot to set the focal point', validation: (Rule) => Rule.required() }),
    defineField({ name: 'alt', title: 'Alt Text', type: 'string', description: 'Describe the image for accessibility (required)', validation: (Rule) => Rule.required() }),
    defineField({ name: 'caption', title: 'Caption', type: 'string', description: 'Optional caption shown below the image' }),
    defineField({ name: 'order', title: 'Display Order', type: 'number', description: 'Lower numbers appear first (0 = top of list)', initialValue: 0, validation: (Rule) => Rule.integer().min(0) }),
  ],
  orderings: [{ title: 'Display Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'alt', media: 'image' } },
})
