import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import React from 'react'

import type { PastSeminarsBlock as PastSeminarsBlockProps, Seminar } from '@/payload-types'
import { PastSeminarCard } from '@/components/PastSeminarCard'
import { Section } from '@/components/Section'

export const PastSeminarsBlock: React.FC<PastSeminarsBlockProps> = async ({ heading, limit }) => {
  const payload = await getPayload({ config: configPromise })
  const todayISO = new Date().toISOString().slice(0, 10)
  const result = await payload.find({
    collection: 'seminars',
    where: { date: { less_than: todayISO } },
    sort: '-date',
    limit: limit || 3,
    depth: 1,
  })

  const seminars = result.docs as Seminar[]
  if (seminars.length === 0) return null

  return (
    // Larger top padding so the "Past Seminars" heading sits well below the
    // Next Seminar card. We share the white background with NextSeminar so
    // they read as one continuous band.
    <Section compact className="bg-white pt-20 md:pt-24">
      <h3 className="text-xl md:text-2xl text-foreground mb-8">{heading || 'Past Seminars'}</h3>
      <div className="grid gap-10 md:gap-12 sm:grid-cols-2 lg:grid-cols-3">
        {seminars.map((s) => (
          <PastSeminarCard key={s.id} seminar={s} />
        ))}
      </div>
      <div className="mt-14">
        <Link
          href="/seminars"
          className="inline-flex items-center gap-2 text-foreground font-medium hover:underline underline-offset-4"
        >
          All past seminars
          <span aria-hidden>→</span>
        </Link>
      </div>
    </Section>
  )
}
