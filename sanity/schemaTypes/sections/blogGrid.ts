import { InlineIcon } from '@sanity/icons'
import { defineType, defineField, defineArrayMember } from 'sanity'

export default defineType({
  name: 'blogGrid',
  title: 'Blog Grid',
  type: 'object',
  icon: InlineIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'Section heading displayed above the blog posts',
      placeholder: 'Latest from the blog…',
    }),
    defineField({
      name: 'source',
      title: 'Source',
      type: 'string',
      description: 'How to select which posts appear in this grid',
      options: {
        list: [
          { title: 'Latest Posts', value: 'latest' },
          { title: 'By Category', value: 'category' },
          { title: 'Manual Selection', value: 'manual' },
        ],
        layout: 'radio',
      },
      initialValue: 'latest',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      hidden: ({ parent }) => parent?.source !== 'category',
    }),
    defineField({
      name: 'posts',
      title: 'Posts',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'blogPost' }] })],
      validation: (Rule) => Rule.max(12),
      hidden: ({ parent }) => parent?.source !== 'manual',
    }),
    defineField({
      name: 'limit',
      title: 'Number of Posts',
      type: 'number',
      initialValue: 3,
      validation: (Rule) => Rule.min(1).max(12),
      hidden: ({ parent }) => parent?.source === 'manual',
    }),
    defineField({
      name: 'showViewAll',
      title: 'Show "View All" Link',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'viewAllHref',
      title: '"View All" Link',
      type: 'string',
      description: 'e.g. /blog or /blog/category/lifestyle',
      hidden: ({ parent }) => !parent?.showViewAll,
    }),
  ],
  preview: {
    select: { heading: 'heading', source: 'source' },
    prepare({ heading, source }) {
      return {
        title: heading || 'Blog Grid',
        subtitle: `Source: ${source || 'latest'}`,
      }
    },
  },
})
