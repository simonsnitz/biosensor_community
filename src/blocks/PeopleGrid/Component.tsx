import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import React from 'react'

import type { PeopleGridBlock as PeopleGridBlockProps, Person } from '@/payload-types'
import { Section } from '@/components/Section'

import { PeopleGridClient } from './Client'

const HOMEPAGE_LIMIT = 4

/**
 * Server entry: fetches every Person doc once and hands the data to the
 * client component which manages the tag filter UI. Cheap for our scale —
 * the People collection is in the dozens, not thousands.
 *
 * On the homepage we cap to {@link HOMEPAGE_LIMIT} people and surface an
 * "All people" link for the full directory at /people.
 */
export const PeopleGridBlock: React.FC<PeopleGridBlockProps> = async ({ heading, intro }) => {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'people',
    sort: 'name',
    limit: 1000,
    depth: 1,
  })
  const people = result.docs as Person[]

  return (
    <Section heading={heading || 'People'} intro={intro || undefined}>
      <PeopleGridClient people={people} limit={HOMEPAGE_LIMIT} />
      {people.length > HOMEPAGE_LIMIT && (
        <div className="mt-14">
          <Link
            href="/people"
            className="inline-flex items-center gap-2 text-foreground font-medium hover:underline underline-offset-4"
          >
            All people
            <span aria-hidden>→</span>
          </Link>
        </div>
      )}
    </Section>
  )
}
