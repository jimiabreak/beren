import { defineType, defineField, defineArrayMember } from 'sanity'
import { StarIcon } from '@sanity/icons'

export default defineType({
  name: 'testimonialCarousel',
  title: 'Testimonial Carousel',
  type: 'object',
  icon: StarIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'Section heading displayed above the testimonials',
    }),
    defineField({
      name: 'testimonials',
      title: 'Testimonials',
      type: 'array',
      description: 'Select testimonials to display in the carousel',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'testimonial' }] })],
      validation: (Rule) => Rule.unique().max(12),
    }),
    defineField({
      name: 'autoPlay',
      title: 'Auto Play',
      type: 'boolean',
      description: 'Automatically cycle through testimonials',
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title: title || 'Testimonial Carousel', subtitle: 'Testimonials Section', media: StarIcon }),
  },
})
