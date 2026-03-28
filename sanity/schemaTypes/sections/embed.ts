import { defineType, defineField } from 'sanity'
import { PlayIcon } from '@sanity/icons'

export default defineType({
  name: 'embed',
  title: 'Embed',
  type: 'object',
  icon: PlayIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'Optional heading displayed above the embed',
      placeholder: 'Watch our story…',
    }),
    defineField({
      name: 'embedType',
      title: 'Embed Type',
      type: 'string',
      description: 'The type of content being embedded',
      options: { list: ['video', 'map', 'custom'] },
      initialValue: 'video',
    }),
    defineField({
      name: 'embedUrl',
      title: 'Embed URL',
      type: 'url',
      description: 'The URL of the content to embed (YouTube, Google Maps, etc.)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'aspectRatio',
      title: 'Aspect Ratio',
      type: 'string',
      options: { list: ['16:9', '4:3', '1:1', '9:16'] },
      initialValue: '16:9',
    }),
  ],
  preview: {
    select: { title: 'heading', url: 'embedUrl' },
    prepare({ title, url }) {
      return { title: title || 'Embed', subtitle: url || 'Embed', media: PlayIcon }
    },
  },
})
