import { defineType, defineField } from 'sanity'
import { EnvelopeIcon } from '@sanity/icons'

export default defineType({
  name: 'newsletterSection',
  title: 'Newsletter',
  type: 'object',
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'Section heading (e.g. "Stay in the loop")',
    }),
    defineField({
      name: 'subheading',
      title: 'Subheading',
      type: 'text',
      rows: 2,
      description: 'Supporting text below the heading',
    }),
    defineField({
      name: 'placeholder',
      title: 'Input Placeholder',
      type: 'string',
      description: 'Placeholder text for the email input',
      initialValue: 'Enter your email\u2026',
    }),
    defineField({
      name: 'buttonText',
      title: 'Button Text',
      type: 'string',
      initialValue: 'Subscribe',
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      description: 'Optional hex background color',
      placeholder: '#1A1A1A',
      validation: (Rule) => Rule.custom((value) => {
        if (!value) return true
        return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(value) || 'Must be a valid hex color (e.g. #1A1A1A)'
      }),
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({
      title: title || 'Newsletter',
      subtitle: 'Newsletter Section',
      media: EnvelopeIcon,
    }),
  },
})
