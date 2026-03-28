import type { StructureBuilder } from 'sanity/structure'
import {
  HomeIcon,
  BookIcon,
  EnvelopeIcon,
  CogIcon,
  MenuIcon,
  BlockContentIcon,
  LinkIcon,
  BellIcon,
} from '@sanity/icons'

export const SINGLETONS = ['siteSettings', 'homePage', 'header', 'footer', 'redirects']

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Homepage')
        .icon(HomeIcon)
        .child(S.document().schemaType('homePage').documentId('homePage')),

      S.divider(),

      S.documentTypeListItem('modularPage').title('Pages'),

      S.divider(),

      S.listItem()
        .title('Content Library')
        .icon(BookIcon)
        .child(
          S.list()
            .title('Content Library')
            .items([
              S.documentTypeListItem('teamMember').title('Team'),
              S.documentTypeListItem('testimonial').title('Testimonials'),
              S.documentTypeListItem('faqItem').title('FAQ'),
              S.documentTypeListItem('galleryImage').title('Gallery'),
            ])
        ),

      S.documentTypeListItem('submission').title('Submissions').icon(EnvelopeIcon),

      S.divider(),

      S.documentTypeListItem('redirect').title('Redirects').icon(LinkIcon),
      S.documentTypeListItem('promoBanner').title('Promo Banners').icon(BellIcon),

      S.divider(),

      S.listItem()
        .title('Site')
        .icon(CogIcon)
        .child(
          S.list()
            .title('Site')
            .items([
              S.listItem()
                .title('Settings')
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
