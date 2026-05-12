'use client'

import React, { useMemo, useState } from 'react'

import type { Person } from '@/payload-types'
import { cn } from '@/utilities/ui'

const ROLES = [
  { value: 'organizer', label: 'Organizers' },
  { value: 'speaker', label: 'Speakers' },
  { value: 'researcher', label: 'Researchers' },
] as const

type RoleValue = (typeof ROLES)[number]['value']

type Props = {
  people: Person[]
  /** When set, cap the visible grid (after role filtering) to this many. */
  limit?: number
}

/**
 * Single-select role tags. Default state shows every Person; clicking a tag
 * narrows the grid to people with that role. Clicking the same tag again
 * clears the filter and shows everyone.
 */
export const PeopleGridClient: React.FC<Props> = ({ people, limit }) => {
  const [active, setActive] = useState<RoleValue | null>(null)

  const filtered = useMemo(() => {
    const matched = active
      ? people.filter((p) => ((p.roles ?? []) as RoleValue[]).includes(active))
      : people
    return limit && limit > 0 ? matched.slice(0, limit) : matched
  }, [people, active, limit])

  return (
    <div>
      <div className="mb-12 flex flex-wrap gap-3">
        {ROLES.map((r) => {
          const isOn = active === r.value
          return (
            <button
              key={r.value}
              type="button"
              onClick={() => setActive(isOn ? null : r.value)}
              aria-pressed={isOn}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition border',
                isOn
                  ? 'bg-foreground text-background border-foreground'
                  : 'bg-transparent text-muted-foreground border-border hover:text-foreground hover:border-foreground/60',
              )}
            >
              {r.label}
            </button>
          )
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted-foreground">No people in this group yet.</p>
      ) : (
        <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((p) => (
            <PersonCard key={p.id} person={p} />
          ))}
        </div>
      )}
    </div>
  )
}

function PersonCard({ person }: { person: Person }) {
  const photo = person.photo && typeof person.photo === 'object' ? person.photo : null
  // The first entry in `person.links`, if any, becomes the link target for
  // both the photo and the name. We assume the first link is the most
  // important one (lab page / personal site) by ordering convention.
  const primary = person.links?.[0]
  const href = primary?.url || null

  const nameEl = (
    <span className="font-semibold text-foreground hover:underline underline-offset-4">
      {person.name}
    </span>
  )

  return (
    <div className="flex flex-col items-start gap-3">
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
          aria-label={person.name}
        >
          {photo?.url ? (
            <img
              src={photo.url}
              alt={photo.alt || person.name}
              className="w-28 h-28 rounded-full object-cover border border-border transition hover:opacity-90"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-muted border border-border" />
          )}
        </a>
      ) : photo?.url ? (
        <img
          src={photo.url}
          alt={photo.alt || person.name}
          className="w-28 h-28 rounded-full object-cover border border-border"
        />
      ) : (
        <div className="w-28 h-28 rounded-full bg-muted border border-border" />
      )}
      <div>
        {href ? (
          <a href={href} target="_blank" rel="noopener noreferrer">
            {nameEl}
          </a>
        ) : (
          nameEl
        )}
        {(person.title || person.affiliation) && (
          <p className="text-sm text-muted-foreground">
            {[person.title, person.affiliation].filter(Boolean).join(', ')}
          </p>
        )}
      </div>
    </div>
  )
}
