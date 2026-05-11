import type { Block } from 'payload'

export const SiteIntro: Block = {
  slug: 'siteIntro',
  interfaceName: 'SiteIntroBlock',
  labels: { singular: 'Site Intro', plural: 'Site Intros' },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      defaultValue: 'Biosensor Community',
    },
    {
      name: 'subheading',
      type: 'textarea',
      admin: {
        description: 'Smaller text shown below the heading.',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'imagePosition',
      type: 'select',
      defaultValue: 'right',
      options: [
        { label: 'Right', value: 'right' },
        { label: 'Left', value: 'left' },
      ],
    },
  ],
}
