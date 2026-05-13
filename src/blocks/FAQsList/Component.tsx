import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import RichText from '@/components/RichText'
import { Section } from '@/components/Section'
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
    <Section heading={heading || undefined} width="narrow" className="pt-8 md:pt-10">
      <div className="divide-y divide-border border-t border-b border-border">
        {faqs.map((faq) => (
          <details key={faq.id} className="group">
            <summary className="cursor-pointer list-none flex justify-between items-center gap-4 py-5 font-display font-semibold text-lg text-foreground">
              <span>{faq.question}</span>
              <span
                aria-hidden
                className="text-2xl leading-none transition-transform group-open:rotate-45 text-muted-foreground"
              >
                +
              </span>
            </summary>
            <div className="pb-6 -mt-1 text-muted-foreground max-w-none">
              <RichText data={faq.answer} enableGutter={false} />
            </div>
          </details>
        ))}
      </div>
    </Section>
  )
}
