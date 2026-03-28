import { defineType, defineField } from 'sanity'
import { InsertAboveIcon } from '@sanity/icons'

export default defineType({
  name: 'spacer',
  title: 'Spacer',
  type: 'object',
  icon: InsertAboveIcon,
  fields: [
    defineField({
      name: 'size',
      title: 'Size',
      type: 'string',
      description: 'Amount of vertical space to add between sections',
      options: {
        list: [
          { title: 'Small', value: 'sm' },
          { title: 'Medium', value: 'md' },
          { title: 'Large', value: 'lg' },
          { title: 'Extra Large', value: 'xl' },
        ],
        layout: 'radio',
      },
      initialValue: 'md',
    }),
  ],
  preview: {
    select: { size: 'size' },
    prepare: ({ size }) => ({ title: `Spacer (${size || 'md'})`, subtitle: 'Spacing Section', media: InsertAboveIcon }),
  },
})
