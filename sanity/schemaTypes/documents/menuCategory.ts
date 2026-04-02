import { defineType, defineField } from 'sanity'
import { MenuIcon } from '@sanity/icons'

export default defineType({
  name: 'menuCategory',
  title: 'Menu Category',
  type: 'document',
  icon: MenuIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Tab Label',
      type: 'string',
      description: 'e.g., "Lunch", "Dinner", "Dessert"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 50 },
    }),
    defineField({
      name: 'menuImage',
      title: 'Menu Image',
      type: 'image',
      description: 'Upload an image of the menu for this category (e.g., a photo or exported PDF page)',
      options: { hotspot: true },
    }),
    defineField({
      name: 'pdf',
      title: 'Menu PDF (optional)',
      type: 'file',
      description: 'Optional: upload a PDF version for download',
      options: { accept: '.pdf' },
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first',
      initialValue: 0,
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      description: 'Show or hide this tab on the menu page',
      initialValue: true,
    }),
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'title', order: 'order', active: 'isActive' },
    prepare({ title, order, active }) {
      return {
        title: title || 'Untitled',
        subtitle: `#${order ?? '?'} ${active === false ? '(hidden)' : ''}`,
      }
    },
  },
})
