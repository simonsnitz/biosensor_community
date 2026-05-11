import configPromise from '@payload-config'
import { getPayload, type Where } from 'payload'
import React from 'react'

import type { PeopleGridBlock as PeopleGridBlockProps, Person } from '@/payload-types'

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
    <section className="container mx-auto px-4">
      <h2 className="text-3xl font-semibold mb-6">{heading}</h2>
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {people.map((p) => (
          <div key={p.id} className="flex flex-col items-start gap-2">
            {p.photo && typeof p.photo === 'object' && p.photo.url && (
              <img
                src={p.photo.url}
                alt={p.photo.alt || p.name}
                className="w-32 h-32 rounded-full object-cover"
              />
            )}
            <div>
              <p className="font-medium">{p.name}</p>
              {p.title && <p className="text-sm text-muted-foreground">{p.title}</p>}
              {p.affiliation && (
                <p className="text-sm text-muted-foreground">{p.affiliation}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
