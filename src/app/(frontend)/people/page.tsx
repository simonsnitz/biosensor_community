import type { Metadata } from 'next'
import Link from 'next/link'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import { PeopleGridClient } from '@/blocks/PeopleGrid/Client'
import { Section } from '@/components/Section'
import type { Person } from '@/payload-types'

export const metadata: Metadata = {
  title: 'People — Biosensor Community',
  description:
    'Organizers, speakers, and researchers in the Biosensor Community network.',
}

export default async function AllPeoplePage() {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'people',
    sort: 'name',
    limit: 1000,
    depth: 1,
  })
  const people = result.docs as Person[]

  return (
    <article>
      <Section width="wide">
        <Link
          href="/"
          className="text-sm uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
        >
          ← Home
        </Link>
        <h1 className="mt-8 text-5xl md:text-6xl lg:text-7xl text-foreground">People</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
          Organizers, speakers, and researchers in the Biosensor Community network.
        </p>
        <div className="mt-16">
          <PeopleGridClient people={people} />
        </div>
      </Section>
    </article>
  )
}
