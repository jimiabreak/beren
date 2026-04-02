import { EnvelopeIcon } from '@sanity/icons'
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'contactPage',
  title: 'Get In Touch Page',
  type: 'document',
  icon: EnvelopeIcon,
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'contact', title: 'Contact Info' },
    { name: 'hours', title: 'Hours' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      hidden: true,
      initialValue: 'Get In Touch',
    }),
    // Content group
    defineField({
      name: 'heading',
      title: 'Page Heading',
      type: 'string',
      description: 'Main heading at the top of the page',
      initialValue: 'Get In Touch',
      group: 'content',
    }),
    defineField({
      name: 'formHeading',
      title: 'Form Section Heading',
      type: 'string',
      description: 'Heading above the contact form',
      initialValue: 'Send Us a Message',
      group: 'content',
    }),
    defineField({
      name: 'formDescription',
      title: 'Form Description',
      type: 'string',
      description: 'Short text below the form heading',
      initialValue: 'For general inquiries please fill out the form below.',
      group: 'content',
    }),
    defineField({
      name: 'gettingThereHeading',
      title: 'Getting There Heading',
      type: 'string',
      description: 'Heading for the parking/directions section',
      initialValue: 'Getting There',
      group: 'content',
    }),

    // Contact info group
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      initialValue: 'info@berentexas.com',
      group: 'contact',
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
      initialValue: '(682) 246 7501',
      group: 'contact',
    }),
    defineField({
      name: 'website',
      title: 'Website',
      type: 'string',
      initialValue: 'berentexas.com',
      group: 'contact',
    }),
    defineField({
      name: 'addressLine1',
      title: 'Address Line 1',
      type: 'string',
      initialValue: '1216 6th Ave.',
      group: 'contact',
    }),
    defineField({
      name: 'addressLine2',
      title: 'Address Line 2',
      type: 'string',
      initialValue: 'Fort Worth, TX',
      group: 'contact',
    }),

    // Hours group
    defineField({
      name: 'hoursLine1Label',
      title: 'Hours Line 1 — Days',
      type: 'string',
      initialValue: 'Monday-Thursday & Sunday:',
      group: 'hours',
    }),
    defineField({
      name: 'hoursLine1Time',
      title: 'Hours Line 1 — Time',
      type: 'string',
      initialValue: '11:00 AM - 10:00 PM',
      group: 'hours',
    }),
    defineField({
      name: 'hoursLine2Label',
      title: 'Hours Line 2 — Days',
      type: 'string',
      initialValue: 'Friday & Saturday:',
      group: 'hours',
    }),
    defineField({
      name: 'hoursLine2Time',
      title: 'Hours Line 2 — Time',
      type: 'string',
      initialValue: '11:00 AM - 11:00 PM',
      group: 'hours',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Get In Touch' }
    },
  },
})
