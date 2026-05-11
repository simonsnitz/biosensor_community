import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import type { NextSeminarBlock as NextSeminarBlockProps, Seminar, Person } from '@/payload-types'
import { Section } from '@/components/Section'
import { seminarDisplayDate, seminarLocalTimes } from '@/utilities/seminar'

async function getNextSeminar(): Promise<Seminar | null> {
  const payload = await getPayload({ config: configPromise })

  const settings = await payload.findGlobal({ slug: 'site-settings', depth: 2 })
  if (settings?.featuredSeminar && typeof settings.featuredSeminar === 'object') {
    return settings.featuredSeminar as Seminar
  }

  const todayISO = new Date().toISOString().slice(0, 10)
  const upcoming = await payload.find({
    collection: 'seminars',
    where: { date: { greater_than_equal: todayISO } },
    sort: 'date',
    limit: 1,
    depth: 2,
  })
  return (upcoming.docs[0] as Seminar) ?? null
}

export const NextSeminarBlock: React.FC<NextSeminarBlockProps> = async ({
  heading,
  showWhenNone,
}) => {
  const seminar = await getNextSeminar()

  if (!seminar) {
    if (!showWhenNone) return null
    return (
      <Section
      eyebrow="Seminars"
      heading={heading || 'Next Seminar'}
      compact
      className="bg-white pb-0 md:pb-0"
    >
        <p className="text-lg text-muted-foreground">
          No upcoming seminars announced yet. Check back soon.
        </p>
      </Section>
    )
  }

  const speakers = Array.isArray(seminar.speakers)
    ? (seminar.speakers.filter((s) => typeof s === 'object') as Person[])
    : []
  const times = seminarLocalTimes(seminar.date)

  return (
    <Section
      eyebrow="Seminars"
      heading={heading || 'Next Seminar'}
      compact
      className="bg-white pb-0 md:pb-0"
    >
      <div className="grid gap-10 lg:gap-16 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] items-start">
        <div>
          <h3 className="text-3xl md:text-4xl text-foreground mb-3">{seminar.title}</h3>
          {speakers.length > 0 && (
            <p className="text-xl text-muted-foreground mb-6">
              {speakers.map((s, i) => (
                <span key={s.id}>
                  {i > 0 && ', '}
                  <span className="text-foreground font-medium">{s.name}</span>
                  {s.affiliation && (
                    <span className="text-muted-foreground"> — {s.affiliation}</span>
                  )}
                </span>
              ))}
            </p>
          )}
          <p className="text-lg font-display font-medium text-foreground mb-4">
            {seminarDisplayDate(seminar.date)}
          </p>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-1 max-w-md text-sm text-muted-foreground mb-8">
            {times.map((t) => (
              <li key={t.label}>
                <span className="font-medium text-foreground/80">{t.label}</span>
                <span className="mx-2 opacity-50">·</span>
                {t.time}
              </li>
            ))}
          </ul>
          {seminar.zoomRegistrationUrl && (
            <a
              href={seminar.zoomRegistrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-display font-semibold text-sm uppercase tracking-wider transition hover:opacity-90"
            >
              Register on Zoom
              <span aria-hidden>→</span>
            </a>
          )}
        </div>
        {seminar.flyerImage && typeof seminar.flyerImage === 'object' && seminar.flyerImage.url && (
          <img
            src={seminar.flyerImage.url}
            alt={seminar.flyerImage.alt || seminar.title}
            className="w-full h-auto rounded-2xl border border-border"
          />
        )}
      </div>
    </Section>
  )
}
