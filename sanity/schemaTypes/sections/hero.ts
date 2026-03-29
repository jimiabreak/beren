import { defineType, defineField, defineArrayMember } from 'sanity'
import { RocketIcon } from '@sanity/icons'

export default defineType({
  name: 'hero',
  title: 'Hero',
  type: 'object',
  icon: RocketIcon,
  fields: [
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      description: 'The main headline displayed prominently in the hero area',
      validation: (Rule) => Rule.required().max(80).warning('Keep under 80 characters for best display'),
    }),
    defineField({
      name: 'subheadline',
      title: 'Subheadline',
      type: 'text',
      rows: 3,
      description: 'Supporting text below the headline',
      validation: (Rule) => Rule.max(200).warning('Keep under 200 characters for readability'),
    }),
    defineField({
      name: 'ctaButtons',
      title: 'CTA Buttons',
      type: 'array',
      description: 'Call-to-action buttons displayed in the hero',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string', description: 'Button text', validation: (Rule) => Rule.required() }),
            defineField({ name: 'url', title: 'URL', type: 'string', description: 'Link destination (e.g. /about or https://example.com)', validation: (Rule) => Rule.required() }),
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
      validation: (Rule) => Rule.max(3),
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Full-width background image behind the hero content',
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      description: 'How the hero content is positioned',
      options: {
        list: [
          { title: 'Centered', value: 'centered' },
          { title: 'Left-aligned', value: 'left-aligned' },
          { title: 'Split', value: 'split' },
          { title: 'Home', value: 'home' },
        ],
        layout: 'radio',
      },
      initialValue: 'centered',
    }),
  ],
  preview: {
    select: { title: 'headline' },
    prepare: ({ title }) => ({ title: title || 'Hero', subtitle: 'Hero Section', media: RocketIcon }),
  },
})
