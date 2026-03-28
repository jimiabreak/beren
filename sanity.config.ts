'use client'

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { presentationTool } from 'sanity/presentation'
import { schemaTypes } from './sanity/schemaTypes'
import { apiVersion, dataset, projectId } from './sanity/env'
import { structure, newDocumentOptions, SINGLETONS } from './sanity/structure'

export default defineConfig({
  name: 'default',
  title: 'Bonsai CMS',

  projectId,
  dataset,

  basePath: '/studio',

  plugins: [
    structureTool({ structure }),
    presentationTool({
      previewUrl: {
        draftMode: {
          enable: '/api/draft/enable',
          disable: '/api/draft/disable',
        },
      },
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    newDocumentOptions,
    actions: (input, context) => {
      if (SINGLETONS.includes(context.schemaType)) {
        return input.filter(({ action }) => action && !['delete', 'duplicate'].includes(action))
      }
      return input
    },
  },
})
