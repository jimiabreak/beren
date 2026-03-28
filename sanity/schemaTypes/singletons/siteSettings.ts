import { CogIcon } from '@sanity/icons'
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  groups: [
    { name: 'identity', title: 'Identity', default: true },
    { name: 'contact', title: 'Contact' },
    { name: 'hours', title: 'Hours' },
    { name: 'social', title: 'Social' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({ name: 'name', title: 'Business Name', type: 'string', description: 'Your business name — used in headers, footers, and SEO', placeholder: 'My Business', validation: (Rule) => Rule.required(), group: 'identity' }),
    defineField({ name: 'tagline', title: 'Tagline', type: 'string', description: 'Short tagline shown in header or hero', validation: (Rule) => Rule.max(120).warning('Keep under 120 characters'), group: 'identity' }),
    defineField({ name: 'logo', title: 'Logo', type: 'image', options: { hotspot: true }, description: 'Main logo (used on light backgrounds)', group: 'identity' }),
    defineField({ name: 'logoAlt', title: 'Logo (Dark Background)', type: 'image', options: { hotspot: true }, description: 'Alternate logo for dark backgrounds (optional)', group: 'identity' }),
    defineField({ name: 'phone', title: 'Phone Number', type: 'string', description: 'Main contact phone number', placeholder: '(555) 123-4567', group: 'contact' }),
    defineField({ name: 'email', title: 'Email', type: 'string', validation: (Rule) => Rule.email(), group: 'contact' }),
    defineField({
      name: 'address', title: 'Address', type: 'object',
      description: 'Business address displayed in the footer and contact page',
      group: 'contact',
      fields: [
        { name: 'street', title: 'Street', type: 'string', placeholder: '123 Main St' },
        { name: 'city', title: 'City', type: 'string', placeholder: 'New York' },
        { name: 'state', title: 'State', type: 'string', placeholder: 'NY' },
        { name: 'zip', title: 'ZIP Code', type: 'string', placeholder: '10001' },
        { name: 'country', title: 'Country', type: 'string', initialValue: 'US' },
      ],
    }),
    defineField({ name: 'location', title: 'Map Location', type: 'geopoint', description: 'Used for the embedded map on the contact page', group: 'contact' }),
    defineField({ name: 'hours', title: 'Opening Hours', type: 'array', of: [{ type: 'openingHours' }], description: 'Set hours for each day of the week', group: 'hours' }),
    defineField({ name: 'socialLinks', title: 'Social Media Links', type: 'array', of: [{ type: 'socialLink' }], validation: (Rule) => Rule.max(10), group: 'social' }),
    defineField({ name: 'reservationUrl', title: 'Reservation URL', type: 'url', description: 'Link to OpenTable, Resy, or other reservation system (optional)', validation: (Rule) => Rule.uri({ scheme: ['http', 'https'] }), group: 'social' }),
    defineField({ name: 'seo', title: 'Default SEO', type: 'seo', description: "Default SEO settings (used when pages don't have their own)", group: 'seo' }),
  ],
  preview: { select: { title: 'name' } },
})
