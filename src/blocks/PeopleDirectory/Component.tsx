import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import type { PeopleDirectoryBlock as PeopleDirectoryBlockProps, Person } from '@/payload-types'
import { Section } from '@/components/Section'

import { PeopleDirectoryClient } from './Client'

/**
 * Server entry: fetches every Person doc once and hands the data to the
 * client component which manages the filter UI. Cheap for our scale —
 * we're talking dozens to low hundreds of people.
 */
export const PeopleDirectoryBlock: React.FC<PeopleDirectoryBlockProps> = async ({
  heading,
  intro,
}) => {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'people',
    sort: 'name',
    limit: 1000,
    depth: 1,
  })
  const people = result.docs as Person[]

  return (
    <Section eyebrow="Community" heading={heading || 'People'} intro={intro || undefined}>
      <PeopleDirectoryClient people={people} />
    </Section>
  )
}
