import { BookIcon } from '@sanity/icons'
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'ourStoryPage',
  title: 'Our Story Page',
  type: 'document',
  icon: BookIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      hidden: true,
      initialValue: 'Our Story',
    }),
    defineField({
      name: 'heading',
      title: 'Page Heading',
      type: 'string',
      description: 'Main heading at the top of the page',
      initialValue: 'Our Story',
    }),
    defineField({
      name: 'subheading',
      title: 'Subheading',
      type: 'string',
      description: 'Left-column heading below the main heading',
      initialValue: 'A Taste of Tradition, Authentic Turkish Cuisine at Beren',
    }),
    defineField({
      name: 'bodyParagraph1',
      title: 'Body Paragraph 1',
      type: 'text',
      rows: 4,
      description: 'First paragraph in the right column',
      initialValue:
        'BEREN Meze & Grill House was born from a deep love for Turkish cuisine and a desire to share its rich cultural heritage with our Texas community. What started as a dream, has blossomed into a cherished dining experience where tradition meets taste.',
    }),
    defineField({
      name: 'bodyParagraph2',
      title: 'Body Paragraph 2',
      type: 'text',
      rows: 4,
      description: 'Second paragraph in the right column',
      initialValue:
        'At BEREN, we take pride in crafting every dish with the finest local ingredients, time-honored recipes, and a touch of contemporary flair. Each plate we serve tells a story of family, flavor, and the warmth of Turkish hospitality. More than just a meal, dining with us is an experience that celebrates the essence of Mediterranean living.',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Our Story' }
    },
  },
})
