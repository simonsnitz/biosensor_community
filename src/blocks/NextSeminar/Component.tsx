import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import type { NextSeminarBlock as NextSeminarBlockProps, Seminar, Person } from '@/payload-types'
import { seminarDisplayDate, seminarLocalTimes } from '@/utilities/seminar'

async function getNextSeminar(): Promise<Seminar | null> {
  const payload = await getPayload({ config: configPromise })

  // Prefer the manually featured seminar if set.
  const settings = await payload.findGlobal({ slug: 'site-settings', depth: 2 })
  if (settings?.featuredSeminar && typeof settings.featuredSeminar === 'object') {
    return settings.featuredSeminar as Seminar
  }

  // Otherwise: the earliest seminar with a date >= today.
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
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold mb-4">{heading || 'Next Seminar'}</h2>
        <p className="text-muted-foreground">
          No upcoming seminars announced yet. Check back soon.
        </p>
      </section>
    )
  }

  const speakers = Array.isArray(seminar.speakers)
    ? (seminar.speakers.filter((s) => typeof s === 'object') as Person[])
    : []
  const times = seminarLocalTimes(seminar.date)

  return (
    <section className="container mx-auto px-4">
      <h2 className="text-3xl font-semibold mb-6">{heading || 'Next Seminar'}</h2>
      <div className="grid gap-8 md:grid-cols-[2fr_1fr] items-start">
        <div>
          <h3 className="text-2xl font-medium mb-2">{seminar.title}</h3>
          {speakers.length > 0 && (
            <p className="text-lg mb-4">
              {speakers.map((s, i) => (
                <span key={s.id}>
                  {i > 0 && ', '}
                  <strong>{s.name}</strong>
                  {s.affiliation && ` — ${s.affiliation}`}
                </span>
              ))}
            </p>
          )}
          <p className="mb-2">
            <strong>{seminarDisplayDate(seminar.date)}</strong>
          </p>
          <ul className="text-sm text-muted-foreground mb-6 grid grid-cols-2 gap-x-4 gap-y-1 max-w-sm">
            {times.map((t) => (
              <li key={t.label}>
                <span className="font-medium">{t.label}:</span> {t.time}
              </li>
            ))}
          </ul>
          {seminar.zoomRegistrationUrl && (
            <a
              href={seminar.zoomRegistrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-5 py-2 rounded bg-primary text-primary-foreground font-medium"
            >
              Register on Zoom
            </a>
          )}
        </div>
        {seminar.flyerImage && typeof seminar.flyerImage === 'object' && seminar.flyerImage.url && (
          <img
            src={seminar.flyerImage.url}
            alt={seminar.flyerImage.alt || seminar.title}
            className="rounded-lg w-full h-auto"
          />
        )}
      </div>
    </section>
  )
}
