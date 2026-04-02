import type { StructureBuilder } from 'sanity/structure'
import {
  HomeIcon,
  EnvelopeIcon,
  CogIcon,
  MenuIcon,
  BlockContentIcon,
  DocumentTextIcon,
} from '@sanity/icons'

export const SINGLETONS = [
  'siteSettings',
  'homePage',
  'header',
  'footer',
  'redirects',
  'ourStoryPage',
  'cateringPage',
  'contactPage',
]

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('BEREN')
    .items([
      S.listItem()
        .title('Homepage')
        .icon(HomeIcon)
        .child(S.document().schemaType('homePage').documentId('homePage')),

      S.divider(),

      S.listItem()
        .title('Our Story')
        .icon(DocumentTextIcon)
        .child(S.document().schemaType('ourStoryPage').documentId('ourStoryPage')),
      S.listItem()
        .title('Catering')
        .icon(DocumentTextIcon)
        .child(S.document().schemaType('cateringPage').documentId('cateringPage')),
      S.listItem()
        .title('Get In Touch')
        .icon(EnvelopeIcon)
        .child(S.document().schemaType('contactPage').documentId('contactPage')),

      S.documentTypeListItem('menuCategory').title('Menu'),

      S.divider(),

      S.documentTypeListItem('submission').title('Submissions').icon(EnvelopeIcon),

      S.divider(),

      S.listItem()
        .title('Site Settings')
        .icon(CogIcon)
        .child(
          S.list()
            .title('Site Settings')
            .items([
              S.listItem()
                .title('General')
                .icon(CogIcon)
                .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
              S.listItem()
                .title('Header')
                .icon(MenuIcon)
                .child(S.document().schemaType('header').documentId('header')),
              S.listItem()
                .title('Footer')
                .icon(BlockContentIcon)
                .child(S.document().schemaType('footer').documentId('footer')),
            ])
        ),
    ])

export const newDocumentOptions = (prev: { templateId: string }[]) =>
  prev.filter(({ templateId }) => !SINGLETONS.includes(templateId))
