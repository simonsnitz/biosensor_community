/**
 * Helpers for Seminar rendering.
 *
 * Seminars always happen at 12:00 PM US Eastern Time. We store just the date
 * and compute display strings in multiple timezones.
 */

const SEMINAR_HOUR_ET = 12 // 12:00 PM ET, always

/**
 * Given a Seminar.date string (ISO date, no time), return the absolute Date
 * representing 12:00 PM in US Eastern Time on that day.
 *
 * We compute the UTC instant by checking what offset US/Eastern has on that
 * date (EDT = UTC-4, EST = UTC-5). We do that by formatting the candidate
 * UTC noon through Intl in the New York zone and inspecting the resulting
 * hour.
 */
export function seminarStartUTC(dateString: string): Date {
  // Strip any time portion; we only care about Y/M/D.
  const [y, m, d] = dateString.slice(0, 10).split('-').map(Number)

  // Start with UTC noon as a probe.
  const probe = new Date(Date.UTC(y, m - 1, d, SEMINAR_HOUR_ET, 0, 0))
  const etHour = Number(
    new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York',
      hour: 'numeric',
      hour12: false,
    }).format(probe),
  )
  // Difference between desired ET hour and the probe's ET hour, in hours.
  // Adjust the UTC time by that delta.
  const deltaHours = SEMINAR_HOUR_ET - etHour
  return new Date(probe.getTime() + deltaHours * 3600_000)
}

const TIMEZONES = [
  { label: 'PT', tz: 'America/Los_Angeles' },
  { label: 'ET', tz: 'America/New_York' },
  { label: 'UTC', tz: 'UTC' },
  { label: 'Sydney', tz: 'Australia/Sydney' },
] as const

export type SeminarTimeRow = { label: string; time: string }

export function seminarLocalTimes(dateString: string): SeminarTimeRow[] {
  const startUTC = seminarStartUTC(dateString)
  return TIMEZONES.map(({ label, tz }) => ({
    label,
    time: new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(startUTC),
  }))
}

export function seminarDisplayDate(dateString: string): string {
  const startUTC = seminarStartUTC(dateString)
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(startUTC)
}

export function isUpcoming(dateString: string, now: Date = new Date()): boolean {
  return seminarStartUTC(dateString).getTime() > now.getTime()
}

/**
 * Extract a YouTube video ID from any common YouTube URL form.
 * Supports: youtu.be/<id>, youtube.com/watch?v=<id>, youtube.com/embed/<id>,
 * youtube.com/live/<id>, youtube.com/shorts/<id>.
 * Returns null if no ID could be extracted.
 */
export function youtubeVideoId(url: string | null | undefined): string | null {
  if (!url) return null
  try {
    const u = new URL(url)
    if (u.hostname === 'youtu.be') return u.pathname.slice(1) || null
    if (u.hostname.endsWith('youtube.com')) {
      const v = u.searchParams.get('v')
      if (v) return v
      const m = u.pathname.match(/^\/(?:embed|live|shorts)\/([^/]+)/)
      if (m) return m[1]
    }
  } catch {
    // not a valid URL
  }
  return null
}

export function youtubeEmbedUrl(url: string | null | undefined): string | null {
  const id = youtubeVideoId(url)
  return id ? `https://www.youtube.com/embed/${id}` : null
}
