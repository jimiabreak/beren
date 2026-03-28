import { UsersIcon } from '@sanity/icons'
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'teamMember',
  title: 'Team Member',
  type: 'document',
  icon: UsersIcon,
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', description: 'Full name of the team member', placeholder: 'Jane Smith', validation: (Rule) => Rule.required() }),
    defineField({ name: 'role', title: 'Role', type: 'string', description: 'e.g., "Head Chef", "Sommelier", "General Manager"', placeholder: 'Head Chef' }),
    defineField({ name: 'bio', title: 'Bio', type: 'portableText', description: 'Short biography displayed on the team page' }),
    defineField({ name: 'image', title: 'Photo', type: 'image', options: { hotspot: true }, description: 'Professional headshot or photo', validation: (Rule) => Rule.required() }),
    defineField({ name: 'order', title: 'Display Order', type: 'number', description: 'Lower numbers appear first (0 = top of list)', initialValue: 0, validation: (Rule) => Rule.integer().min(0) }),
  ],
  orderings: [
    { title: 'Name A-Z', name: 'nameAsc', by: [{ field: 'name', direction: 'asc' }] },
    { title: 'Display Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
  preview: { select: { title: 'name', subtitle: 'role', media: 'image' } },
})
