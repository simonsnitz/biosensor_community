import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React, { cache } from 'react'

import { Section } from '@/components/Section'
import { Divider } from '@/components/Divider'
import type { Person, Seminar } from '@/payload-types'
import RichText from '@/components/RichText'
import {
  isUpcoming,
  seminarDisplayDate,
  seminarLocalTimes,
  youtubeEmbedUrl,
} from '@/utilities/seminar'

type Args = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const seminars = await payload.find({
    collection: 'seminars',
    limit: 1000,
    pagination: false,
    select: { slug: true },
  })
  return seminars.docs.filter((d) => d.slug).map(({ slug }) => ({ slug: slug as string }))
}

const querySeminar = cache(async (slug: string) => {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'seminars',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })
  return (result.docs[0] as Seminar) ?? null
})

export default async function SeminarDetail({ params }: Args) {
  const { slug } = await params
  const seminar = await querySeminar(slug)
  if (!seminar) return notFound()

  const speakers = Array.isArray(seminar.speakers)
    ? (seminar.speakers.filter((s) => typeof s === 'object') as Person[])
    : []
  const upcoming = isUpcoming(seminar.date)
  const times = seminarLocalTimes(seminar.date)
  const embed = youtubeEmbedUrl(seminar.youtubeUrl)

  return (
    <article>
      <Section className="pt-20 md:pt-28" width="wide">
        <Link
          href="/"
          className="font-display text-sm uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
        >
          ← All seminars
        </Link>
        <p className="mt-8 font-display text-sm uppercase tracking-[0.18em] text-muted-foreground">
          {seminarDisplayDate(seminar.date)} · 12:00 PM ET
        </p>
        <h1 className="mt-4 text-5xl md:text-6xl lg:text-7xl">{seminar.title}</h1>
        {speakers.length > 0 && (
          <p className="mt-6 text-xl md:text-2xl text-muted-foreground">
            {speakers.map((s, i) => (
              <span key={s.id}>
                {i > 0 && ', '}
                <span className="text-foreground">{s.name}</span>
                {s.affiliation && (
                  <span className="text-muted-foreground"> — {s.affiliation}</span>
                )}
              </span>
            ))}
          </p>
        )}
        <ul className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-1 max-w-2xl text-sm text-muted-foreground">
          {times.map((t) => (
            <li key={t.label}>
              <span className="font-medium text-foreground/80">{t.label}</span>
              <span className="mx-2 opacity-50">·</span>
              {t.time}
            </li>
          ))}
        </ul>
        {upcoming && seminar.zoomRegistrationUrl && (
          <div className="mt-10">
            <a
              href={seminar.zoomRegistrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-display font-semibold text-sm uppercase tracking-wider transition hover:opacity-90"
            >
              Register on Zoom
              <span aria-hidden>→</span>
            </a>
          </div>
        )}
      </Section>

      {(embed ||
        (seminar.flyerImage && typeof seminar.flyerImage === 'object' && seminar.flyerImage.url)) && (
        <>
          <Divider />
          <Section width="wide" compact>
            {embed ? (
              <div className="aspect-video w-full overflow-hidden rounded-2xl border border-border">
                <iframe
                  src={embed}
                  title={seminar.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              seminar.flyerImage &&
              typeof seminar.flyerImage === 'object' &&
              seminar.flyerImage.url && (
                <img
                  src={seminar.flyerImage.url}
                  alt={seminar.flyerImage.alt || seminar.title}
                  className="mx-auto max-w-3xl w-full h-auto rounded-2xl border border-border"
                />
              )
            )}
          </Section>
        </>
      )}

      {speakers.some((s) => s.bio) && (
        <>
          <Divider />
          <Section heading="About the speakers" width="narrow">
            <div className="space-y-12">
              {speakers.map((s) =>
                s.bio ? (
                  <div key={s.id}>
                    <h3 className="text-2xl mb-2">{s.name}</h3>
                    {s.affiliation && (
                      <p className="text-sm text-muted-foreground mb-4">{s.affiliation}</p>
                    )}
                    <div className="text-muted-foreground max-w-none">
                      <RichText data={s.bio} enableGutter={false} />
                    </div>
                  </div>
                ) : null,
              )}
            </div>
          </Section>
        </>
      )}
    </article>
  )
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const seminar = await querySeminar(slug)
  if (!seminar) return {}
  const speakers = Array.isArray(seminar.speakers)
    ? (seminar.speakers.filter((s) => typeof s === 'object') as Person[])
    : []
  return {
    title: `${seminar.title} — Biosensor Community`,
    description: speakers.length
      ? `${seminarDisplayDate(seminar.date)} · ${speakers.map((s) => s.name).join(', ')}`
      : seminarDisplayDate(seminar.date),
  }
}
