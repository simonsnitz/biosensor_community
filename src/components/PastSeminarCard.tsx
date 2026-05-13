import Link from 'next/link'
import { Play } from 'lucide-react'
import React from 'react'

import type { Person, Seminar } from '@/payload-types'
import { seminarDisplayDate, youtubeVideoId } from '@/utilities/seminar'

/**
 * Single past-seminar card. Used by both the homepage `PastSeminars` block
 * and the `/seminars` index page.
 *
 * For seminars with a YouTube URL we render the static YouTube thumbnail
 * (`i.ytimg.com/vi/<id>/hqdefault.jpg`) with our own small play overlay
 * instead of embedding the iframe directly. The iframe's built-in play
 * button is sized relative to the player, which makes it absurdly large on
 * narrow mobile cards. Static thumbnails also drop the page weight
 * significantly — the actual embed only loads on the seminar detail page.
 */
export const PastSeminarCard: React.FC<{ seminar: Seminar }> = ({ seminar }) => {
  const videoId = youtubeVideoId(seminar.youtubeUrl)
  const speakers = Array.isArray(seminar.speakers)
    ? (seminar.speakers.filter((p) => typeof p === 'object') as Person[])
    : []
  const href = `/seminars/${seminar.slug}`

  return (
    <article className="flex flex-col gap-3 sm:gap-4">
      <Link href={href} className="group block">
        {videoId ? (
          <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border">
            <img
              src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
              alt={seminar.title}
              loading="lazy"
              className="w-full h-full object-cover transition group-hover:opacity-90"
            />
            <div
              aria-hidden
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <span className="flex items-center justify-center w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-black/55 backdrop-blur-sm transition group-hover:bg-black/70">
                <Play className="w-4 h-4 sm:w-5 sm:h-5 text-white fill-white ml-0.5" />
              </span>
            </div>
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
        <p className="text-[10px] sm:text-xs uppercase tracking-[0.14em] sm:tracking-[0.16em] text-muted-foreground mb-1.5 sm:mb-2">
          {seminarDisplayDate(seminar.date)}
        </p>
        <Link href={href}>
          <h3 className="text-sm sm:text-base md:text-lg text-foreground leading-tight hover:underline underline-offset-4">
            {seminar.title}
          </h3>
        </Link>
        {speakers.length > 0 && (
          <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-muted-foreground">
            {speakers.map((sp) => sp.name).join(', ')}
          </p>
        )}
      </div>
    </article>
  )
}
