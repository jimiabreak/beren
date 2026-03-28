import { defineType, defineField } from 'sanity'
import { PlayIcon } from '@sanity/icons'

export default defineType({
  name: 'videoSection',
  title: 'Video',
  type: 'object',
  icon: PlayIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'Optional heading displayed above the video',
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
      description: 'YouTube or Vimeo video URL',
      validation: (Rule) => Rule.required().uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'posterImage',
      title: 'Poster Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Thumbnail image shown before the video plays',
    }),
    defineField({
      name: 'autoplay',
      title: 'Autoplay',
      type: 'boolean',
      description: 'Start playing automatically when scrolled into view (muted)',
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'heading', subtitle: 'videoUrl' },
    prepare: ({ title, subtitle }) => ({ title: title || 'Video', subtitle: subtitle || 'Video Section', media: PlayIcon }),
  },
})
