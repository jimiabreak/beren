import { EnvelopeIcon } from '@sanity/icons'
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'submission',
  title: 'Submission',
  type: 'document',
  icon: EnvelopeIcon,
  readOnly: true,
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string' }),
    defineField({ name: 'email', title: 'Email', type: 'string' }),
    defineField({ name: 'phone', title: 'Phone', type: 'string' }),
    defineField({ name: 'message', title: 'Message', type: 'text' }),
    defineField({ name: 'page', title: 'Page', type: 'string', description: 'Which page the form was submitted from' }),
    defineField({ name: 'source', title: 'Source', type: 'string', description: 'Which form (e.g. contact, newsletter)' }),
    defineField({ name: 'submittedAt', title: 'Submitted At', type: 'datetime' }),
  ],
  orderings: [
    { title: 'Newest First', name: 'submittedAtDesc', by: [{ field: 'submittedAt', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'name', subtitle: 'email', date: 'submittedAt' },
    prepare({ title, subtitle, date }) {
      const dateStr = date ? new Date(date).toLocaleDateString() : ''
      return { title: title || 'Unknown', subtitle: `${subtitle || ''} · ${dateStr}` }
    },
  },
})
