import { BellIcon } from '@sanity/icons'
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'promoBanner',
  title: 'Promo Banner',
  type: 'document',
  icon: BellIcon,
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'appearance', title: 'Appearance' },
    { name: 'schedule', title: 'Schedule' },
  ],
  fields: [
    defineField({
      name: 'message',
      title: 'Message',
      type: 'string',
      description: 'The banner message (keep it short)',
      validation: (Rule) => Rule.required().max(120),
      group: 'content',
    }),
    defineField({
      name: 'ctaText',
      title: 'CTA Text',
      type: 'string',
      description: 'Optional call-to-action link text',
      validation: (Rule) => Rule.max(25).warning('Keep under 25 characters for button sizing'),
      group: 'content',
    }),
    defineField({
      name: 'ctaUrl',
      title: 'CTA URL',
      type: 'string',
      description: 'Link destination for the CTA',
      group: 'content',
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      description: 'Hex color for the banner background (e.g. #B8860B)',
      placeholder: '#B8860B',
      initialValue: '#B8860B',
      group: 'appearance',
      validation: (Rule) => Rule.custom((value) => {
        if (!value) return true
        return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(value) || 'Must be a valid hex color (e.g. #1A1A1A)'
      }),
    }),
    defineField({
      name: 'textColor',
      title: 'Text Color',
      type: 'string',
      description: 'Hex color for the banner text (e.g. #FFFFFF)',
      placeholder: '#FFFFFF',
      initialValue: '#FFFFFF',
      group: 'appearance',
      validation: (Rule) => Rule.custom((value) => {
        if (!value) return true
        return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(value) || 'Must be a valid hex color (e.g. #1A1A1A)'
      }),
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      description: 'Only active banners are displayed',
      initialValue: true,
      group: 'schedule',
    }),
    defineField({
      name: 'startDate',
      title: 'Start Date',
      type: 'datetime',
      description: 'When the banner should start appearing (optional)',
      group: 'schedule',
    }),
    defineField({
      name: 'endDate',
      title: 'End Date',
      type: 'datetime',
      description: 'When the banner should stop appearing (optional)',
      group: 'schedule',
    }),
    defineField({
      name: 'dismissible',
      title: 'Dismissible',
      type: 'boolean',
      description: 'Allow visitors to dismiss the banner',
      initialValue: true,
      group: 'schedule',
    }),
    defineField({
      name: 'position',
      title: 'Position',
      type: 'string',
      group: 'appearance',
      options: {
        list: [
          { title: 'Top', value: 'top' },
          { title: 'Bottom', value: 'bottom' },
        ],
        layout: 'radio',
      },
      initialValue: 'top',
    }),
  ],
  orderings: [
    { title: 'Active First', name: 'activeFirst', by: [{ field: 'isActive', direction: 'desc' }] },
    { title: 'Start Date', name: 'startDateDesc', by: [{ field: 'startDate', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'message', active: 'isActive' },
    prepare: ({ title, active }) => ({
      title: title || 'Promo Banner',
      subtitle: active ? 'Active' : 'Inactive',
      media: BellIcon,
    }),
  },
})
