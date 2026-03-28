import { HomeIcon } from '@sanity/icons'
import { defineType, defineField, defineArrayMember } from 'sanity'

export default defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  icon: HomeIcon,
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'sections',
      title: 'Page Sections',
      type: 'array',
      description: 'Add and arrange sections to build the homepage',
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
        defineArrayMember({ type: 'blogGrid' }),
      ],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Home Page' }
    },
  },
})
