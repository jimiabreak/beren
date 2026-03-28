import { HelpCircleIcon } from '@sanity/icons'
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'faqItem',
  title: 'FAQ',
  type: 'document',
  icon: HelpCircleIcon,
  fields: [
    defineField({ name: 'question', title: 'Question', type: 'string', description: 'The question as a visitor would ask it', placeholder: 'What are your opening hours?', validation: (Rule) => Rule.required() }),
    defineField({ name: 'answer', title: 'Answer', type: 'portableText', description: 'The answer — keep it clear and concise', validation: (Rule) => Rule.required() }),
    defineField({ name: 'category', title: 'Category', type: 'string', description: 'Optional grouping (e.g., "Reservations", "Dietary", "General")' }),
    defineField({ name: 'order', title: 'Display Order', type: 'number', description: 'Lower numbers appear first (0 = top of list)', initialValue: 0, validation: (Rule) => Rule.integer().min(0) }),
  ],
  orderings: [
    { title: 'Display Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
    { title: 'Question A-Z', name: 'questionAsc', by: [{ field: 'question', direction: 'asc' }] },
  ],
  preview: { select: { title: 'question', subtitle: 'category' } },
})
