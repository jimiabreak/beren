import { defineType, defineField, defineArrayMember } from 'sanity'
import { HelpCircleIcon } from '@sanity/icons'

export default defineType({
  name: 'faqAccordion',
  title: 'FAQ Accordion',
  type: 'object',
  icon: HelpCircleIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'Section heading displayed above the FAQ items',
    }),
    defineField({
      name: 'items',
      title: 'FAQ Items',
      type: 'array',
      description: 'Select FAQ items to display in the accordion',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'faqItem' }] })],
      validation: (Rule) => Rule.unique(),
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title: title || 'FAQ Accordion', subtitle: 'FAQ Section', media: HelpCircleIcon }),
  },
})
