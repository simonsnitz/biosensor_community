import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import React from 'react'

import type {
  PastSeminarsBlock as PastSeminarsBlockProps,
  Seminar,
  Person,
} from '@/payload-types'
import { Section } from '@/components/Section'
import { seminarDisplayDate, youtubeEmbedUrl } from '@/utilities/seminar'

export const PastSeminarsBlock: React.FC<PastSeminarsBlockProps> = async ({ heading, limit }) => {
  const payload = await getPayload({ config: configPromise })
  const todayISO = new Date().toISOString().slice(0, 10)
  const result = await payload.find({
    collection: 'seminars',
    where: { date: { less_than: todayISO } },
    sort: '-date',
    limit: limit || 6,
    depth: 1,
  })

  const seminars = result.docs as Seminar[]
  if (seminars.length === 0) return null

  return (
    <Section
      heading={heading || 'Past Seminars'}
      compact
      className="bg-white pt-8 md:pt-12"
    >
      <div className="grid gap-10 md:gap-12 sm:grid-cols-2 lg:grid-cols-3">
        {seminars.map((s) => {
          const embed = youtubeEmbedUrl(s.youtubeUrl)
          const speakers = Array.isArray(s.speakers)
            ? (s.speakers.filter((p) => typeof p === 'object') as Person[])
            : []
          return (
            <article key={s.id} className="flex flex-col gap-4">
              <Link href={`/seminars/${s.slug}`} className="group block">
                {embed ? (
                  <div className="aspect-video w-full overflow-hidden rounded-xl border border-border">
                    <iframe
                      src={embed}
                      title={s.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : s.flyerImage && typeof s.flyerImage === 'object' && s.flyerImage.url ? (
                  <img
                    src={s.flyerImage.url}
                    alt={s.flyerImage.alt || s.title}
                    className="aspect-video object-cover rounded-xl w-full border border-border transition group-hover:opacity-90"
                  />
                ) : (
                  <div className="aspect-video rounded-xl bg-muted" />
                )}
              </Link>
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground mb-2">
                  {seminarDisplayDate(s.date)}
                </p>
                <Link href={`/seminars/${s.slug}`}>
                  <h3 className="text-xl text-foreground leading-tight hover:underline underline-offset-4">
                    {s.title}
                  </h3>
                </Link>
                {speakers.length > 0 && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {speakers.map((sp) => sp.name).join(', ')}
                  </p>
                )}
              </div>
            </article>
          )
        })}
      </div>
    </Section>
  )
}
