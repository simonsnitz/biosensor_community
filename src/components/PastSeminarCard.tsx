import Link from 'next/link'
import React from 'react'

import type { Person, Seminar } from '@/payload-types'
import { seminarDisplayDate, youtubeEmbedUrl } from '@/utilities/seminar'

/**
 * Single past-seminar card: video embed (or flyer fallback), date, title,
 * and speaker list. Used by both the homepage `PastSeminars` block and the
 * `/seminars` index page.
 */
export const PastSeminarCard: React.FC<{ seminar: Seminar }> = ({ seminar }) => {
  const embed = youtubeEmbedUrl(seminar.youtubeUrl)
  const speakers = Array.isArray(seminar.speakers)
    ? (seminar.speakers.filter((p) => typeof p === 'object') as Person[])
    : []

  return (
    <article className="flex flex-col gap-4">
      <Link href={`/seminars/${seminar.slug}`} className="group block">
        {embed ? (
          <div className="aspect-video w-full overflow-hidden rounded-xl border border-border">
            <iframe
              src={embed}
              title={seminar.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : seminar.flyerImage &&
          typeof seminar.flyerImage === 'object' &&
          seminar.flyerImage.url ? (
          <img
            src={seminar.flyerImage.url}
            alt={seminar.flyerImage.alt || seminar.title}
            className="aspect-video object-cover rounded-xl w-full border border-border transition group-hover:opacity-90"
          />
        ) : (
          <div className="aspect-video rounded-xl bg-muted" />
        )}
      </Link>
      <div>
        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground mb-2">
          {seminarDisplayDate(seminar.date)}
        </p>
        <Link href={`/seminars/${seminar.slug}`}>
          <h3 className="text-xl text-foreground leading-tight hover:underline underline-offset-4">
            {seminar.title}
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
}
