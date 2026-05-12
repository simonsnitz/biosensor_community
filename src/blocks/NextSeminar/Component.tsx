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

/**
 * Renders the top of the "Seminar Series" white band on the homepage. The
 * Section-level heading ("Seminar Series") + description sit above the
 * smaller "Next Seminar" subheading that introduces the actual upcoming-talk
 * card.
 */
export const NextSeminarBlock: React.FC<NextSeminarBlockProps> = async ({
  heading,
  showWhenNone,
}) => {
  const seminar = await getNextSeminar()
  const subheading = heading || 'Next Seminar'

  return (
    <Section compact className="bg-white pb-0 md:pb-0">
      <header className="mb-14 md:mb-16">
        <h2 className="text-5xl md:text-6xl lg:text-7xl text-foreground">Seminar Series</h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
          A monthly seminar series held on the first Wednesday of every month at 12 PM ET.
        </p>
      </header>

      <h3 className="text-xl md:text-2xl text-foreground mb-8">{subheading}</h3>

      {!seminar ? (
        showWhenNone && (
          <p className="text-lg text-muted-foreground">
            No upcoming seminars announced yet. Check back soon.
          </p>
        )
      ) : (
        <NextSeminarCard seminar={seminar} />
      )}
    </Section>
  )
}

function NextSeminarCard({ seminar }: { seminar: Seminar }) {
  const speakers = Array.isArray(seminar.speakers)
    ? (seminar.speakers.filter((s) => typeof s === 'object') as Person[])
    : []
  const times = seminarLocalTimes(seminar.date)

  return (
    <div className="grid gap-10 lg:gap-16 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] items-start">
      <div>
        <h4 className="text-3xl md:text-4xl text-foreground mb-6">{seminar.title}</h4>
        {speakers.length > 0 && (
          <div className="mb-6 space-y-3">
            {speakers.map((s) => (
              <div key={s.id}>
                <p className="text-lg font-medium text-foreground">{s.name}</p>
                {(s.title || s.affiliation) && (
                  <p className="text-base text-muted-foreground">
                    {[s.title, s.affiliation].filter(Boolean).join(', ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
        <p className="text-lg font-medium text-foreground mb-4">
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
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm uppercase tracking-wider transition hover:opacity-90"
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
  )
}
