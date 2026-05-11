'use client'

import React, { useMemo, useState } from 'react'

import type { Person } from '@/payload-types'
import { cn } from '@/utilities/ui'

const ROLES = [
  { value: 'organizer', label: 'Organizers' },
  { value: 'speaker', label: 'Speakers' },
  { value: 'researcher', label: 'Researchers' },
] as const

const FOCUSES = [
  { value: 'microbiology', label: 'Microbiology' },
  { value: 'biomanufacturing', label: 'Biomanufacturing' },
  { value: 'diagnostics', label: 'Diagnostics' },
  { value: 'environment', label: 'Environment' },
] as const

type RoleValue = (typeof ROLES)[number]['value']
type FocusValue = (typeof FOCUSES)[number]['value']

type Props = {
  people: Person[]
}

/**
 * People directory with toggleable role + focus filters. A person is shown
 * when:
 *   - at least one of their roles is enabled, AND
 *   - either no focus filter is active, or at least one of their focuses is
 *     enabled.
 *
 * Both filter sets default to all-enabled — toggling chips narrows the view.
 */
export const PeopleDirectoryClient: React.FC<Props> = ({ people }) => {
  const [activeRoles, setActiveRoles] = useState<Set<RoleValue>>(
    new Set(ROLES.map((r) => r.value)),
  )
  const [activeFocuses, setActiveFocuses] = useState<Set<FocusValue>>(
    new Set(FOCUSES.map((f) => f.value)),
  )

  const toggle = <T,>(set: Set<T>, value: T): Set<T> => {
    const next = new Set(set)
    if (next.has(value)) next.delete(value)
    else next.add(value)
    return next
  }

  const filtered = useMemo(() => {
    return people.filter((p) => {
      const roles = (p.roles ?? []) as RoleValue[]
      if (roles.length === 0) return false
      if (!roles.some((r) => activeRoles.has(r))) return false

      const focus = (p.focus ?? []) as FocusValue[]
      // If the user has narrowed the focus filter (i.e. not all focuses
      // active), require an overlap with the person's focuses. People with
      // no focus tags are hidden when any focus filter is narrowed.
      if (activeFocuses.size < FOCUSES.length) {
        if (focus.length === 0) return false
        if (!focus.some((f) => activeFocuses.has(f))) return false
      }
      return true
    })
  }, [people, activeRoles, activeFocuses])

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-start md:gap-12 mb-12">
        <FilterGroup
          label="Role"
          items={ROLES}
          active={activeRoles}
          onToggle={(v) => setActiveRoles((prev) => toggle(prev, v))}
        />
        <FilterGroup
          label="Focus"
          items={FOCUSES}
          active={activeFocuses}
          onToggle={(v) => setActiveFocuses((prev) => toggle(prev, v))}
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted-foreground">No people match the current filters.</p>
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

function FilterGroup<T extends string>({
  label,
  items,
  active,
  onToggle,
}: {
  label: string
  items: readonly { value: T; label: string }[]
  active: Set<T>
  onToggle: (value: T) => void
}) {
  return (
    <div className="mb-6 md:mb-0">
      <p className="font-display text-xs uppercase tracking-[0.18em] text-muted-foreground mb-3">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => {
          const isOn = active.has(item.value)
          return (
            <button
              key={item.value}
              type="button"
              onClick={() => onToggle(item.value)}
              aria-pressed={isOn}
              className={cn(
                'px-4 py-1.5 rounded-full text-sm font-display font-medium transition border',
                isOn
                  ? 'bg-foreground text-background border-foreground'
                  : 'bg-transparent text-muted-foreground border-border hover:text-foreground hover:border-foreground/60',
              )}
            >
              {item.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function PersonCard({ person }: { person: Person }) {
  const photo = person.photo && typeof person.photo === 'object' ? person.photo : null
  return (
    <div className="flex flex-col items-start gap-3">
      {photo?.url ? (
        <img
          src={photo.url}
          alt={photo.alt || person.name}
          className="w-28 h-28 rounded-full object-cover border border-border"
        />
      ) : (
        <div className="w-28 h-28 rounded-full bg-muted border border-border" />
      )}
      <div>
        <p className="font-display font-semibold text-foreground">{person.name}</p>
        {person.title && <p className="text-sm text-muted-foreground">{person.title}</p>}
        {person.affiliation && (
          <p className="text-sm text-muted-foreground">{person.affiliation}</p>
        )}
      </div>
    </div>
  )
}
