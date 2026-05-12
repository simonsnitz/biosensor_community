import type { Block } from 'payload'

export const PastSeminars: Block = {
  slug: 'pastSeminars',
  interfaceName: 'PastSeminarsBlock',
  labels: { singular: 'Past Seminars', plural: 'Past Seminars' },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Past Seminars',
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 3,
      admin: { description: 'How many past seminars to show before the "All past seminars" link.' },
    },
  ],
}
