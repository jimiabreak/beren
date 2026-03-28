import { StarIcon } from '@sanity/icons'
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  icon: StarIcon,
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'meta', title: 'Meta' },
  ],
  fields: [
    defineField({ name: 'author', title: 'Author Name', type: 'string', description: 'Name of the person who gave this testimonial', placeholder: 'Jane D.', validation: (Rule) => Rule.required(), group: 'content' }),
    defineField({ name: 'quote', title: 'Quote', type: 'text', rows: 4, description: 'The testimonial text', placeholder: 'This was an amazing experience…', validation: (Rule) => Rule.required().max(300).warning('Keep under 300 characters for readability'), group: 'content' }),
    defineField({ name: 'rating', title: 'Rating', type: 'number', description: '1-5 stars (optional)', validation: (Rule) => Rule.min(1).max(5).integer(), group: 'meta' }),
    defineField({ name: 'source', title: 'Source', type: 'string', description: 'e.g., "Google", "Yelp", "TripAdvisor"', group: 'meta' }),
    defineField({ name: 'date', title: 'Date', type: 'date', description: 'When this testimonial was received', group: 'meta' }),
  ],
  orderings: [
    { title: 'Date (Newest)', name: 'dateDesc', by: [{ field: 'date', direction: 'desc' }] },
    { title: 'Rating (Highest)', name: 'ratingDesc', by: [{ field: 'rating', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'author', subtitle: 'quote', rating: 'rating' },
    prepare({ title, subtitle, rating }) { return { title, subtitle: rating ? `${'★'.repeat(rating)} — ${subtitle}` : subtitle } },
  },
})
