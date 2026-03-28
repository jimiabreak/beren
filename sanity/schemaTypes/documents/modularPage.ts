import { ComposeIcon } from '@sanity/icons'
import { defineType, defineField, defineArrayMember } from 'sanity'

export default defineType({
  name: 'modularPage',
  title: 'Modular Page',
  type: 'document',
  icon: ComposeIcon,
  groups: [
    { name: 'page', title: 'Page', default: true },
    { name: 'content', title: 'Content' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'The page title used in navigation and browser tabs',
      validation: (Rule) => Rule.required(),
      group: 'page',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      description: 'URL-friendly identifier generated from the title',
      validation: (Rule) => Rule.required(),
      group: 'page',
    }),
    defineField({
      name: 'sections',
      title: 'Page Sections',
      type: 'array',
      description: 'Add and arrange sections to build your page',
      group: 'content',
      of: [
        defineArrayMember({ type: 'hero' }),
        defineArrayMember({ type: 'featureGrid' }),
        defineArrayMember({ type: 'richTextBlock' }),
        defineArrayMember({ type: 'imageGallery' }),
        defineArrayMember({ type: 'testimonialCarousel' }),
        defineArrayMember({ type: 'ctaBanner' }),
        defineArrayMember({ type: 'videoSection' }),
        defineArrayMember({ type: 'teamGrid' }),
        defineArrayMember({ type: 'faqAccordion' }),
        defineArrayMember({ type: 'statsBar' }),
        defineArrayMember({ type: 'logoBar' }),
        defineArrayMember({ type: 'spacer' }),
        defineArrayMember({ type: 'newsletterSection' }),
        defineArrayMember({ type: 'splitContent' }),
        defineArrayMember({ type: 'contactForm' }),
        defineArrayMember({ type: 'embed' }),
      ],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      description: 'Search engine optimization settings for this page',
      group: 'seo',
    }),
  ],
  orderings: [
    { title: 'Title A-Z', name: 'titleAsc', by: [{ field: 'title', direction: 'asc' }] },
    { title: 'Recently Updated', name: 'updatedAtDesc', by: [{ field: '_updatedAt', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'title', slug: 'slug.current' },
    prepare({ title, slug }) {
      return { title, subtitle: slug ? `/${slug}` : '', media: ComposeIcon }
    },
  },
})
