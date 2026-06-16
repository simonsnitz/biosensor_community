import type { CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'
import { slugField } from 'payload'

import { revalidatePerson, revalidatePersonOnDelete } from './hooks/revalidatePerson'

export const People: CollectionConfig = {
  slug: 'people',
  labels: {
    singular: 'Person',
    plural: 'People',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'affiliation', 'roles'],
  },
  hooks: {
    afterChange: [revalidatePerson],
    afterDelete: [revalidatePersonOnDelete],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'title',
      type: 'text',
      admin: {
        description: 'Job title or position (e.g., "Assistant Professor")',
      },
    },
    {
      name: 'affiliation',
      type: 'text',
      admin: {
        description: 'Institution or lab',
      },
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'bio',
      type: 'richText',
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      required: true,
      options: [
        { label: 'Speaker', value: 'speaker' },
        { label: 'Organizer', value: 'organizer' },
        { label: 'Researcher', value: 'researcher' },
      ],
      admin: {
        description: 'A person can have multiple roles.',
      },
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
        description: 'Research focus areas. Multiple can be selected.',
      },
    },
    {
      name: 'links',
      type: 'array',
      labels: {
        singular: 'Link',
        plural: 'Links',
      },
      fields: [
        {
          name: 'type',
          type: 'select',
          required: true,
          options: [
            { label: 'Website / Lab', value: 'website' },
            { label: 'Email', value: 'email' },
            { label: 'Twitter / X', value: 'twitter' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'GitHub', value: 'github' },
            { label: 'Google Scholar', value: 'scholar' },
            { label: 'ORCID', value: 'orcid' },
            { label: 'Other', value: 'other' },
          ],
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
        {
          name: 'label',
          type: 'text',
          admin: {
            description: 'Optional custom label (shown instead of the type name).',
          },
        },
      ],
    },
    slugField({ position: undefined }),
  ],
}
