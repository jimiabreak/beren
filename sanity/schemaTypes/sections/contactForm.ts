import { defineType, defineField } from 'sanity'
import { EnvelopeIcon } from '@sanity/icons'

export default defineType({
  name: 'contactForm',
  title: 'Contact Form',
  type: 'object',
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'Heading displayed above the contact form',
      placeholder: 'Get in touch…',
    }),
    defineField({
      name: 'subheading',
      title: 'Subheading',
      type: 'string',
      description: 'Supporting text below the heading',
      placeholder: 'We\'d love to hear from you…',
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: title || 'Contact Form', subtitle: 'Contact Form', media: EnvelopeIcon }
    },
  },
})
