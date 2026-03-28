import { defineType, defineField, defineArrayMember } from 'sanity'
import { UsersIcon } from '@sanity/icons'

export default defineType({
  name: 'teamGrid',
  title: 'Team Grid',
  type: 'object',
  icon: UsersIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'Section heading displayed above the team grid',
    }),
    defineField({
      name: 'subheading',
      title: 'Subheading',
      type: 'text',
      rows: 2,
      description: 'Brief description below the heading',
    }),
    defineField({
      name: 'members',
      title: 'Team Members',
      type: 'array',
      description: 'Select team members to display',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'teamMember' }] })],
      validation: (Rule) => Rule.unique(),
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title: title || 'Team Grid', subtitle: 'Team Section', media: UsersIcon }),
  },
})
