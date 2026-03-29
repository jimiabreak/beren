import { defineType, defineField, defineArrayMember } from 'sanity'

export default defineType({
  name: 'portableText',
  title: 'Rich Text',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
        { title: 'H4', value: 'h4' },
        { title: 'Quote', value: 'blockquote' },
      ],
      marks: {
        decorators: [
          { title: 'Bold', value: 'strong' },
          { title: 'Italic', value: 'em' },
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
              {
                name: 'href',
                type: 'url',
                title: 'URL',
                validation: (Rule) =>
                  Rule.uri({ allowRelative: true, scheme: ['http', 'https', 'mailto', 'tel'] }),
              },
              {
                name: 'blank',
                type: 'boolean',
                title: 'Open in new tab',
                initialValue: false,
              },
            ],
          },
          {
            name: 'internalLink',
            type: 'object',
            title: 'Internal Link',
            fields: [
              {
                name: 'reference',
                type: 'reference',
                title: 'Page',
                to: [{ type: 'modularPage' }],
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt text',
          description: 'Describe the image for screen readers',
          validation: (Rule) => Rule.required(),
        },
      ],
    }),
    defineArrayMember({
      name: 'callout',
      type: 'object',
      title: 'Callout',
      fields: [
        defineField({
          name: 'type',
          title: 'Type',
          type: 'string',
          description: 'Visual style: Info (blue), Warning (yellow), Success (green), Tip (purple)',
          options: {
            list: [
              { title: 'Info', value: 'info' },
              { title: 'Warning', value: 'warning' },
              { title: 'Success', value: 'success' },
              { title: 'Tip', value: 'tip' },
            ],
            layout: 'radio',
          },
          initialValue: 'info',
        }),
        defineField({ name: 'title', title: 'Title', type: 'string', description: 'Optional callout heading' }),
        defineField({ name: 'body', title: 'Body', type: 'text', rows: 3, description: 'The callout message' }),
      ],
      preview: {
        select: { title: 'title', type: 'type' },
        prepare: ({ title, type }) => ({
          title: title || 'Callout',
          subtitle: type ? type.charAt(0).toUpperCase() + type.slice(1) : 'Info',
        }),
      },
    }),
    defineArrayMember({
      name: 'codeBlock',
      type: 'object',
      title: 'Code Block',
      fields: [
        defineField({
          name: 'code',
          title: 'Code',
          type: 'text',
          rows: 10,
          description: 'Paste your code snippet here',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'language',
          title: 'Language',
          type: 'string',
          description: 'e.g. javascript, python, html',
        }),
      ],
      preview: {
        select: { language: 'language' },
        prepare: ({ language }) => ({
          title: 'Code Block',
          subtitle: language || 'plain text',
        }),
      },
    }),
    defineArrayMember({
      name: 'table',
      type: 'object',
      title: 'Table',
      fields: [
        defineField({
          name: 'rows',
          title: 'Rows',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              fields: [
                defineField({
                  name: 'cells',
                  title: 'Cells',
                  type: 'array',
                  of: [defineArrayMember({ type: 'string' })],
                }),
              ],
              preview: {
                select: { cells: 'cells' },
                prepare: ({ cells }) => ({
                  title: (cells || []).join(' | '),
                }),
              },
            }),
          ],
        }),
      ],
      preview: {
        select: { rows: 'rows' },
        prepare: ({ rows }) => ({
          title: 'Table',
          subtitle: `${(rows || []).length} rows`,
        }),
      },
    }),
    defineArrayMember({
      name: 'buttonGroup',
      type: 'object',
      title: 'Button Group',
      fields: [
        defineField({
          name: 'buttons',
          title: 'Buttons',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              fields: [
                defineField({ name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required() }),
                defineField({ name: 'url', title: 'URL', type: 'string', validation: (Rule) => Rule.required() }),
                defineField({
                  name: 'variant',
                  title: 'Variant',
                  type: 'string',
                  options: {
                    list: [
                      { title: 'Primary', value: 'primary' },
                      { title: 'Secondary', value: 'secondary' },
                      { title: 'Outline', value: 'outline' },
                    ],
                    layout: 'radio',
                  },
                  initialValue: 'primary',
                }),
              ],
              preview: {
                select: { title: 'label', subtitle: 'variant' },
              },
            }),
          ],
          validation: (Rule) => Rule.max(4),
        }),
      ],
      preview: {
        select: { buttons: 'buttons' },
        prepare: ({ buttons }) => ({
          title: 'Button Group',
          subtitle: `${(buttons || []).length} buttons`,
        }),
      },
    }),
  ],
})
