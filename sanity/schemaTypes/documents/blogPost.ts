import { DocumentTextIcon } from '@sanity/icons'
import { defineType, defineField, defineArrayMember } from 'sanity'

export default defineType({
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  icon: DocumentTextIcon,
  groups: [
    { name: 'post', title: 'Post', default: true },
    { name: 'content', title: 'Content' },
    { name: 'meta', title: 'Meta' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().max(70).warning('Keep under 70 characters for SEO'),
      group: 'post',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (Rule) => Rule.required(),
      group: 'post',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
      initialValue: () => new Date().toISOString(),
      group: 'post',
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      description: 'Short summary shown on cards and in search results (max 200 chars)',
      validation: (Rule) => Rule.max(200).warning('Keep under 200 characters'),
      group: 'post',
    }),
    defineField({
      name: 'highlightImage',
      title: 'Highlight Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Describe the image for screen readers',
          validation: (Rule) => Rule.required(),
        }),
      ],
      group: 'post',
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
      group: 'meta',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (Rule) => Rule.required(),
      group: 'meta',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'tag' }] })],
      group: 'meta',
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'portableText',
      group: 'content',
    }),
    defineField({
      name: 'relatedPosts',
      title: 'Related Posts',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'blogPost' }] })],
      validation: (Rule) => Rule.max(3),
      description: 'Up to 3 related posts shown at the bottom',
      group: 'meta',
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured Post',
      type: 'boolean',
      description: 'Feature this post in curated sections',
      initialValue: false,
      group: 'meta',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
  ],
  orderings: [
    { title: 'Published (Newest)', name: 'publishedAtDesc', by: [{ field: 'publishedAt', direction: 'desc' }] },
    { title: 'Published (Oldest)', name: 'publishedAtAsc', by: [{ field: 'publishedAt', direction: 'asc' }] },
    { title: 'Title A-Z', name: 'titleAsc', by: [{ field: 'title', direction: 'asc' }] },
  ],
  preview: {
    select: {
      title: 'title',
      date: 'publishedAt',
      media: 'highlightImage',
      category: 'category.title',
    },
    prepare({ title, date, media, category }) {
      return {
        title,
        subtitle: [category, date ? new Date(date).toLocaleDateString() : ''].filter(Boolean).join(' — '),
        media,
      }
    },
  },
})
