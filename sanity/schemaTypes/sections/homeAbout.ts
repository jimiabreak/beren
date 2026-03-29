import { defineType, defineField, defineArrayMember } from 'sanity'
import { BlockContentIcon } from '@sanity/icons'

export default defineType({
  name: 'homeAbout',
  title: 'Home About',
  type: 'object',
  icon: BlockContentIcon,
  fields: [
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'Large display tagline (e.g. "A Taste of Turkey in Texas.")',
    }),
    defineField({
      name: 'body',
      title: 'Body Text',
      type: 'portableText',
      description: 'Descriptive text about the restaurant',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Food photography displayed alongside the text',
    }),
    defineField({
      name: 'ctaButtons',
      title: 'CTA Buttons',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'url', title: 'URL', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({
              name: 'variant',
              title: 'Variant',
              type: 'string',
              options: {
                list: [
                  { title: 'Primary', value: 'primary' },
                  { title: 'Secondary', value: 'secondary' },
                  { title: 'Outline', value: 'outline' },
                ],
                layout: 'radio',
              },
              initialValue: 'outline',
            }),
          ],
          preview: {
            select: { title: 'label' },
          },
        }),
      ],
      validation: (Rule) => Rule.max(3),
    }),
  ],
  preview: {
    select: { title: 'tagline' },
    prepare: ({ title }) => ({
      title: title || 'Home About',
      subtitle: 'About Section',
      media: BlockContentIcon,
    }),
  },
})
