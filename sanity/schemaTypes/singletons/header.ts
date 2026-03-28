import { defineType, defineField, defineArrayMember } from 'sanity'
import { MenuIcon } from '@sanity/icons'

export default defineType({
  name: 'header',
  title: 'Header',
  type: 'document',
  icon: MenuIcon,
  groups: [
    { name: 'main', title: 'Main Navigation', default: true },
    { name: 'secondary', title: 'Secondary Navigation' },
  ],
  fields: [
    defineField({
      name: 'megaNavigation',
      title: 'Mega Menu Navigation',
      description: 'Main navigation with dropdown groups. Leave empty to use secondary navigation as a flat menu.',
      type: 'array',
      of: [defineArrayMember({ type: 'megaMenuGroup' })],
      validation: (Rule) => Rule.max(8),
      group: 'main',
    }),
    defineField({
      name: 'secondaryNavigation',
      title: 'Secondary Navigation',
      description: 'Simple link list shown in the top bar (or as main nav if mega menu is empty)',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'label', type: 'string', title: 'Label', validation: (Rule) => Rule.required() }),
            defineField({ name: 'href', type: 'string', title: 'Link', validation: (Rule) => Rule.required() }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'href' },
          },
        }),
      ],
      validation: (Rule) => Rule.max(6),
      group: 'secondary',
    }),
    defineField({
      name: 'cta',
      title: 'CTA Button (optional)',
      type: 'cta',
      description: 'Optional call-to-action button shown in the header',
      group: 'secondary',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Header' }
    },
  },
})
