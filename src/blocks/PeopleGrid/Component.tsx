import configPromise from '@payload-config'
import { getPayload, type Where } from 'payload'
import React from 'react'

import type { PeopleGridBlock as PeopleGridBlockProps, Person } from '@/payload-types'
import { Section } from '@/components/Section'

export const PeopleGridBlock: React.FC<PeopleGridBlockProps> = async ({
  heading,
  role,
  focus,
  limit,
}) => {
  const payload = await getPayload({ config: configPromise })

  const where: Where = { roles: { contains: role } }
  if (focus && focus.length > 0) {
    where.and = focus.map((f) => ({ focus: { contains: f } }))
  }

  const result = await payload.find({
    collection: 'people',
    where,
    sort: 'name',
    limit: limit && limit > 0 ? limit : 1000,
    depth: 1,
  })

  const people = result.docs as Person[]
  if (people.length === 0) return null

  return (
    <Section heading={heading} compact>
      <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {people.map((p) => {
          const photo = p.photo && typeof p.photo === 'object' ? p.photo : null
          return (
            <div key={p.id} className="flex flex-col items-start gap-3">
              {photo?.url ? (
                <img
                  src={photo.url}
                  alt={photo.alt || p.name}
                  className="w-28 h-28 rounded-full object-cover border border-border"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-muted border border-border" />
              )}
              <div>
                <p className="font-display font-semibold text-foreground">{p.name}</p>
                {p.title && <p className="text-sm text-muted-foreground">{p.title}</p>}
                {p.affiliation && (
                  <p className="text-sm text-muted-foreground">{p.affiliation}</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </Section>
  )
}
