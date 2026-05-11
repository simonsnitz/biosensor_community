import type { Block } from 'payload'

export const FAQsList: Block = {
  slug: 'faqsList',
  interfaceName: 'FAQsListBlock',
  labels: { singular: 'FAQs', plural: 'FAQs' },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Frequently Asked Questions',
    },
  ],
}
