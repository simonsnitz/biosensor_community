import type { Block } from 'payload'

export const PeopleDirectory: Block = {
  slug: 'peopleDirectory',
  interfaceName: 'PeopleDirectoryBlock',
  labels: { singular: 'People Directory', plural: 'People Directories' },
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
        description: 'Optional intro text shown above the filters.',
      },
    },
  ],
}
