import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import type { NextSeminarBlock as NextSeminarBlockProps, Seminar, Person } from '@/payload-types'
import { Section } from '@/components/Section'
import { seminarDisplayDate, seminarLocalTimes } from '@/utilities/seminar'

const ABOUT_FALLBACK = `How do microbes respond to chemical cues, and can we engineer these sensors for practical applications? Research on genetically-encoded biosensors has exploded in the past two decades, and we continue to discover new mechanisms (and invent new applications) for these sensors.

This seminar series intends to nucleate a community of scientists unearthing and repurposing nature's chemical sensors.`

const MISSION_FALLBACK = `Bring together a community of scientists and bioengineers building genetically-encoded sensors to:
1. Share research findings (emphasizing early career research)
2. Facilitate collaboration and discussion.
3. Teach fundamental and novel concepts to researchers in this growing field.`

type HeaderData = {
  aboutText: string
  missionText: string
  featured: Seminar | null
}

async function getHeaderData(): Promise<HeaderData> {
  const payload = await getPayload({ config: configPromise })
  const settings = (await payload.findGlobal({
    slug: 'site-settings',
    depth: 2,
  })) as {
    featuredSeminar?: Seminar | number | null
    aboutText?: string | null
    missionText?: string | null
  }

  const aboutText = settings?.aboutText?.trim() || ABOUT_FALLBACK
  const missionText = settings?.missionText?.trim() || MISSION_FALLBACK

  let featured: Seminar | null = null
  if (settings?.featuredSeminar && typeof settings.featuredSeminar === 'object') {
    featured = settings.featuredSeminar as Seminar
  } else {
    const todayISO = new Date().toISOString().slice(0, 10)
    const upcoming = await payload.find({
      collection: 'seminars',
      where: { date: { greater_than_equal: todayISO } },
      sort: 'date',
      limit: 1,
      depth: 2,
    })
    featured = (upcoming.docs[0] as Seminar) ?? null
  }

  return { aboutText, missionText, featured }
}

/**
 * Render textarea content as paragraphs split on blank lines.
 *
 * Within a paragraph, lines that start with `N. ` (e.g. "1. Share research
 * findings") are treated as numbered items: the leading number stays in the
 * text but the whole line is indented so the list reads cleanly. Non-list
 * paragraphs use `whitespace-pre-line` to preserve any manual line breaks.
 */
function Paragraphs({ text }: { text: string }) {
  const paragraphs = text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
  return (
    <>
      {paragraphs.map((para, i) => {
        const lines = para.split('\n').map((l) => l.trim()).filter(Boolean)
        const hasNumberedItem = lines.some((l) => /^\d+\.\s/.test(l))
        if (!hasNumberedItem) {
          return (
            <p key={i} className="whitespace-pre-line">
              {para}
            </p>
          )
        }
        return (
          <div key={i} className="space-y-2">
            {lines.map((line, j) => {
              const isItem = /^\d+\.\s/.test(line)
              return (
                <div key={j} className={isItem ? 'pl-8' : ''}>
                  {line}
                </div>
              )
            })}
          </div>
        )
      })}
    </>
  )
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
  const { aboutText, missionText, featured: seminar } = await getHeaderData()
  const subheading = heading || 'Next Seminar'

  return (
    <Section compact className="bg-white pb-0 md:pb-0">
      <div className="mb-12 md:mb-16">
        <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4">About</h3>
        <div className="space-y-4 text-base md:text-lg text-muted-foreground max-w-none">
          <Paragraphs text={aboutText} />
        </div>
      </div>

      <div className="mb-14 md:mb-20">
        <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4">Mission statement</h3>
        <div className="space-y-4 text-base md:text-lg text-muted-foreground max-w-none">
          <Paragraphs text={missionText} />
        </div>
      </div>

      <h3 className="text-xl md:text-2xl font-bold text-foreground mb-8">{subheading}</h3>

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
        <h4 className="text-xl sm:text-2xl md:text-3xl text-foreground mb-6">{seminar.title}</h4>
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
          className="w-full max-w-xs sm:max-w-sm lg:max-w-none mx-auto h-auto rounded-2xl border border-border"
        />
      )}
    </div>
  )
}
