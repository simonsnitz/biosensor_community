import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'missionStatement',
      type: 'richText',
      label: 'Mission Statement',
      admin: {
        description: 'Shown in the homepage hero.',
      },
    },
    {
      name: 'featuredSeminar',
      type: 'relationship',
      relationTo: 'seminars',
      label: 'Featured Seminar',
      admin: {
        description: 'Manually pin a seminar to the hero. Leave empty to auto-select the next upcoming seminar.',
      },
    },
    {
      type: 'collapsible',
      label: 'External Form URLs',
      fields: [
        {
          name: 'signupFormUrl',
          type: 'text',
          label: 'Sign up to present (Google Form)',
        },
        {
          name: 'nominateFormUrl',
          type: 'text',
          label: 'Nominate a speaker (Google Form)',
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Social Links',
      fields: [
        {
          name: 'socialLinks',
          type: 'array',
          label: false,
          fields: [
            {
              name: 'platform',
              type: 'select',
              required: true,
              options: [
                { label: 'YouTube', value: 'youtube' },
                { label: 'LinkedIn', value: 'linkedin' },
                { label: 'Twitter / X', value: 'twitter' },
                { label: 'GitHub', value: 'github' },
                { label: 'Email', value: 'email' },
                { label: 'Other', value: 'other' },
              ],
            },
            {
              name: 'url',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Mailing List',
      fields: [
        {
          name: 'buttondownUsername',
          type: 'text',
          label: 'Buttondown username',
          admin: {
            description: 'Used to POST signups to https://buttondown.com/api/emails/embed-subscribe/<username>. Leave blank to hide the signup form.',
          },
        },
      ],
    },
  ],
}
