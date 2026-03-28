import { defineType, defineField, defineArrayMember } from 'sanity'

export default defineType({
  name: 'megaMenuGroup',
  title: 'Mega Menu Group',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      description: 'Navigation item text shown in the menu bar',
      placeholder: 'About',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'href',
      title: 'Link',
      type: 'string',
      description: 'Optional — makes the group label itself a link',
    }),
    defineField({
      name: 'children',
      title: 'Dropdown Links',
      type: 'array',
      description: 'Links that appear in the dropdown when hovering this menu item',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'label', type: 'string', title: 'Label', description: 'Link text', placeholder: 'Our Story', validation: (Rule) => Rule.required() }),
            defineField({ name: 'href', type: 'string', title: 'Link', description: 'URL path or full URL', placeholder: '/about/story', validation: (Rule) => Rule.required() }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'href' },
          },
        }),
      ],
      validation: (Rule) => Rule.max(10),
    }),
  ],
  preview: {
    select: { title: 'label', children: 'children' },
    prepare({ title, children }) {
      return {
        title,
        subtitle: children?.length ? `${children.length} links` : 'No dropdown',
      }
    },
  },
})
