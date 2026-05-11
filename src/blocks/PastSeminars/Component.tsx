import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import type {
  PastSeminarsBlock as PastSeminarsBlockProps,
  Seminar,
  Person,
} from '@/payload-types'
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
    <section className="container mx-auto px-4">
      <h2 className="text-3xl font-semibold mb-6">{heading || 'Past Seminars'}</h2>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {seminars.map((s) => {
          const embed = youtubeEmbedUrl(s.youtubeUrl)
          const speakers = Array.isArray(s.speakers)
            ? (s.speakers.filter((p) => typeof p === 'object') as Person[])
            : []
          return (
            <article key={s.id} className="flex flex-col gap-2">
              {embed ? (
                <div className="aspect-video w-full">
                  <iframe
                    src={embed}
                    title={s.title}
                    className="w-full h-full rounded"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : s.flyerImage && typeof s.flyerImage === 'object' && s.flyerImage.url ? (
                <img
                  src={s.flyerImage.url}
                  alt={s.flyerImage.alt || s.title}
                  className="aspect-video object-cover rounded w-full"
                />
              ) : (
                <div className="aspect-video rounded bg-muted" />
              )}
              <h3 className="text-lg font-medium leading-tight">{s.title}</h3>
              {speakers.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  {speakers.map((sp) => sp.name).join(', ')}
                </p>
              )}
              <p className="text-xs text-muted-foreground">{seminarDisplayDate(s.date)}</p>
            </article>
          )
        })}
      </div>
    </section>
  )
}
