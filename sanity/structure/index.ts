import type { StructureBuilder } from 'sanity/structure'
import {
  HomeIcon,
  EnvelopeIcon,
  CogIcon,
  MenuIcon,
  BlockContentIcon,
  LinkIcon,
  BellIcon,
  DocumentsIcon,
} from '@sanity/icons'

export const SINGLETONS = ['siteSettings', 'homePage', 'header', 'footer', 'redirects']

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('BEREN')
    .items([
      S.listItem()
        .title('Homepage')
        .icon(HomeIcon)
        .child(S.document().schemaType('homePage').documentId('homePage')),

      S.divider(),

      S.documentTypeListItem('modularPage').title('Pages').icon(DocumentsIcon),
      S.documentTypeListItem('menuCategory').title('Menu Categories'),

      S.divider(),

      S.documentTypeListItem('submission').title('Submissions').icon(EnvelopeIcon),
      S.documentTypeListItem('promoBanner').title('Promo Banners').icon(BellIcon),
      S.documentTypeListItem('redirect').title('Redirects').icon(LinkIcon),

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
              S.listItem()
                .title('Redirects')
                .icon(LinkIcon)
                .child(S.document().schemaType('redirects').documentId('redirects')),
            ])
        ),
    ])

export const newDocumentOptions = (prev: { templateId: string }[]) =>
  prev.filter(({ templateId }) => !SINGLETONS.includes(templateId))
