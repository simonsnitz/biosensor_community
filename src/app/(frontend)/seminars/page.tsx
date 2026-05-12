import type { Metadata } from 'next'
import Link from 'next/link'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import { PastSeminarCard } from '@/components/PastSeminarCard'
import { Section } from '@/components/Section'
import type { Seminar } from '@/payload-types'

export const metadata: Metadata = {
  title: 'Past seminars — Biosensor Community',
  description: 'Recordings of every past Biosensor Community seminar.',
}

export default async function AllSeminarsPage() {
  const payload = await getPayload({ config: configPromise })
  const todayISO = new Date().toISOString().slice(0, 10)
  const result = await payload.find({
    collection: 'seminars',
    where: { date: { less_than: todayISO } },
    sort: '-date',
    limit: 1000,
    depth: 1,
  })

  const seminars = result.docs as Seminar[]

  return (
    <article>
      <Section className="bg-white" width="wide">
        <Link
          href="/"
          className="text-sm uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
        >
          ← Home
        </Link>
        <h1 className="mt-8 text-5xl md:text-6xl lg:text-7xl text-foreground">Past seminars</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
          Recordings of every Biosensor Community seminar to date.
        </p>

        {seminars.length === 0 ? (
          <p className="mt-12 text-muted-foreground">No past seminars yet.</p>
        ) : (
          <div className="mt-16 grid gap-10 md:gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {seminars.map((s) => (
              <PastSeminarCard key={s.id} seminar={s} />
            ))}
          </div>
        )}
      </Section>
    </article>
  )
}
