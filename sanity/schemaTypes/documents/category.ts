import { TagIcon } from '@sanity/icons'
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  icon: TagIcon,
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'appearance', title: 'Appearance' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().max(30).warning('Keep under 30 characters'),
      group: 'content',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL-friendly identifier (auto-generated from title)',
      options: { source: 'title' },
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Brief description of what this category covers',
      placeholder: 'Posts about lifestyle, wellness, and everyday living…',
      group: 'content',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Category header image (shown on category pages)',
      group: 'content',
    }),
    defineField({
      name: 'color',
      title: 'Color',
      type: 'string',
      description: 'Hex color for category badges (e.g. #B8860B)',
      placeholder: '#B8860B',
      group: 'appearance',
      validation: (Rule) => Rule.custom((value) => {
        if (!value) return true
        return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(value) || 'Must be a valid hex color (e.g. #1A1A1A)'
      }),
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Controls display order (lower numbers appear first)',
      group: 'content',
    }),
  ],
  orderings: [
    { title: 'Title A-Z', name: 'titleAsc', by: [{ field: 'title', direction: 'asc' }] },
    { title: 'Display Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'title', subtitle: 'description' },
  },
})
