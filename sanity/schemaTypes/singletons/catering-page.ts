import { BasketIcon } from '@sanity/icons'
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'cateringPage',
  title: 'Catering Page',
  type: 'document',
  icon: BasketIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      hidden: true,
      initialValue: 'Catering',
    }),
    defineField({
      name: 'heading',
      title: 'Page Heading',
      type: 'string',
      description: 'Main heading at the top of the page',
      initialValue: 'Catering',
    }),
    defineField({
      name: 'subheading',
      title: 'Subheading',
      type: 'text',
      rows: 2,
      description: 'Left-column heading below the main heading',
      initialValue:
        'Unique Catering Experiences for Weddings, Private Gatherings, Engagement Celebrations, & Cultural Occasions.',
    }),
    defineField({
      name: 'ctaButtonText',
      title: 'Button Text',
      type: 'string',
      description: 'Text for the call-to-action button',
      initialValue: 'Request a Quote',
    }),
    defineField({
      name: 'bodyParagraph1',
      title: 'Body Paragraph 1',
      type: 'text',
      rows: 4,
      description: 'First paragraph in the right column',
      initialValue:
        "At BEREN, our catering brings the warmth and richness of Turkish cuisine to life's most meaningful moments. From weddings and engagement celebrations to private gatherings and cultural occasions.",
    }),
    defineField({
      name: 'bodyParagraph2',
      title: 'Body Paragraph 2',
      type: 'text',
      rows: 4,
      description: 'Second paragraph in the right column',
      initialValue:
        'Our menus showcase the depth of Anatolian cooking, featuring vibrant meze spreads, iconic street foods, slow-cooked mains, sizzling grills, and traditional desserts prepared with care and authenticity.',
    }),
    defineField({
      name: 'bodyParagraph3',
      title: 'Body Paragraph 3',
      type: 'text',
      rows: 4,
      description: 'Third paragraph in the right column',
      initialValue:
        "Whether you're hosting an intimate dinner or a large celebration, we curate each menu to create a welcoming table that reflects the beauty of Turkish hospitality and brings people together through food, tradition, and shared experience.",
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Catering' }
    },
  },
})
