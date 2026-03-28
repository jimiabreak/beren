import { defineType, defineField, defineArrayMember } from 'sanity'
import { BulbOutlineIcon } from '@sanity/icons'

export default defineType({
  name: 'ctaBanner',
  title: 'CTA Banner',
  type: 'object',
  icon: BulbOutlineIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'The main call-to-action heading',
      validation: (Rule) => Rule.required().max(60).warning('Keep under 60 characters for impact'),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'text',
      rows: 3,
      description: 'Supporting text for the call to action',
    }),
    defineField({
      name: 'buttons',
      title: 'Buttons',
      type: 'array',
      description: 'Action buttons for the CTA banner',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string', description: 'Button text', validation: (Rule) => Rule.required() }),
            defineField({ name: 'url', title: 'URL', type: 'string', description: 'Link destination', validation: (Rule) => Rule.required() }),
            defineField({
              name: 'variant',
              title: 'Variant',
              type: 'string',
              description: 'Visual style of the button',
              options: {
                list: [
                  { title: 'Primary', value: 'primary' },
                  { title: 'Secondary', value: 'secondary' },
                  { title: 'Outline', value: 'outline' },
                ],
                layout: 'radio',
              },
              initialValue: 'primary',
            }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'variant' },
          },
        }),
      ],
      validation: (Rule) => Rule.max(2),
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      description: 'Hex color for the banner background (e.g. #1A1A1A)',
      placeholder: '#1A1A1A',
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
      validation: (Rule) => Rule.custom((value) => {
        if (!value) return true
        return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(value) || 'Must be a valid hex color (e.g. #1A1A1A)'
      }),
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title: title || 'CTA Banner', subtitle: 'CTA Section', media: BulbOutlineIcon }),
  },
})
