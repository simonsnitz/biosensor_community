import type { Block } from 'payload'

export const NextSeminar: Block = {
  slug: 'nextSeminar',
  interfaceName: 'NextSeminarBlock',
  labels: { singular: 'Next Seminar', plural: 'Next Seminars' },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Next Seminar',
    },
    {
      name: 'showWhenNone',
      type: 'checkbox',
      label: 'Render even when no upcoming seminar is found',
      defaultValue: true,
    },
  ],
}
