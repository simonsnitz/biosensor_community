import type { Block } from 'payload'

export const MailingListSignup: Block = {
  slug: 'mailingListSignup',
  interfaceName: 'MailingListSignupBlock',
  labels: { singular: 'Mailing List Signup', plural: 'Mailing List Signups' },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Stay in the loop',
    },
    {
      name: 'blurb',
      type: 'textarea',
      defaultValue: 'Monthly seminar announcements and community updates. No spam.',
    },
    {
      name: 'buttonLabel',
      type: 'text',
      defaultValue: 'Subscribe',
    },
  ],
}
