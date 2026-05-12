import type { Block } from 'payload'

export const PeopleGrid: Block = {
  slug: 'peopleGrid',
  interfaceName: 'PeopleGridBlock',
  labels: { singular: 'People Grid', plural: 'People Grids' },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'People',
    },
    {
      name: 'intro',
      type: 'textarea',
      admin: {
        description: 'Optional intro text shown above the role tags.',
      },
    },
  ],
}
