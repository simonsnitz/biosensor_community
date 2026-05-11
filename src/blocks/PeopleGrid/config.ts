import type { Block } from 'payload'

export const PeopleGrid: Block = {
  slug: 'peopleGrid',
  interfaceName: 'PeopleGridBlock',
  labels: { singular: 'People Grid', plural: 'People Grids' },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Organizing Committee',
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'organizer',
      options: [
        { label: 'Organizers', value: 'organizer' },
        { label: 'Speakers', value: 'speaker' },
        { label: 'Researchers', value: 'researcher' },
      ],
      admin: { description: 'Filter People by this role.' },
    },
    {
      name: 'focus',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Microbiology', value: 'microbiology' },
        { label: 'Biomanufacturing', value: 'biomanufacturing' },
        { label: 'Diagnostics', value: 'diagnostics' },
        { label: 'Environment', value: 'environment' },
      ],
      admin: {
        description:
          'Optional: only show people tagged with one of these focus areas. Leave empty for no filter.',
      },
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 0,
      admin: { description: '0 means no limit.' },
    },
  ],
}
