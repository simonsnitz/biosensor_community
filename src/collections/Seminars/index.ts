import type { CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'
import { slugField } from 'payload'

import { revalidateSeminar, revalidateSeminarOnDelete } from './hooks/revalidateSeminar'

export const Seminars: CollectionConfig = {
  slug: 'seminars',
  labels: {
    singular: 'Seminar',
    plural: 'Seminars',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'speakers'],
    description: 'Monthly seminars. Time is always 12:00 PM ET.',
  },
  hooks: {
    afterChange: [revalidateSeminar],
    afterDelete: [revalidateSeminarOnDelete],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'MMMM d, yyyy',
        },
        description: 'Seminar date. Time is always 12:00 PM ET.',
      },
    },
    {
      name: 'speakers',
      type: 'relationship',
      relationTo: 'people',
      hasMany: true,
      required: true,
      filterOptions: {
        roles: { contains: 'speaker' },
      },
      admin: {
        description: 'One or more speakers. Filtered to People with the Speaker role.',
      },
    },
    {
      name: 'flyerImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'zoomRegistrationUrl',
      type: 'text',
      admin: {
        description: 'Zoom registration link. Shown for upcoming seminars.',
      },
    },
    {
      name: 'youtubeUrl',
      type: 'text',
      admin: {
        description: 'YouTube link to the recording. Shown for past seminars.',
      },
    },
    slugField({ position: undefined }),
  ],
}
