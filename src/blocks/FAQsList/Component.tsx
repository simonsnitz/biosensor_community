import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import RichText from '@/components/RichText'
import type { FAQsListBlock as FAQsListBlockProps, Faq } from '@/payload-types'

export const FAQsListBlock: React.FC<FAQsListBlockProps> = async ({ heading }) => {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'faqs',
    sort: 'order',
    limit: 1000,
  })

  const faqs = result.docs as Faq[]
  if (faqs.length === 0) return null

  return (
    <section className="container mx-auto px-4 max-w-3xl">
      <h2 className="text-3xl font-semibold mb-6">{heading}</h2>
      <div className="space-y-4">
        {faqs.map((faq) => (
          <details key={faq.id} className="border-b pb-3">
            <summary className="cursor-pointer font-medium py-2 list-none flex justify-between items-center">
              <span>{faq.question}</span>
              <span className="text-2xl leading-none">+</span>
            </summary>
            <div className="pt-2 text-muted-foreground">
              <RichText data={faq.answer} enableGutter={false} />
            </div>
          </details>
        ))}
      </div>
    </section>
  )
}
