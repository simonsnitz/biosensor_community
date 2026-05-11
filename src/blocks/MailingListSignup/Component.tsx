import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import { Section } from '@/components/Section'
import type { MailingListSignupBlock as MailingListSignupBlockProps } from '@/payload-types'
import { ButtondownForm } from './Form'

/**
 * Renders a Buttondown embed-subscribe form. The form POSTs to Buttondown's
 * endpoint in a popup window, so the user stays on our page. If the Buttondown
 * username is unset in SiteSettings, the block renders nothing.
 *
 * https://buttondown.com/api-reference#email-embeds
 */
export const MailingListSignupBlock: React.FC<MailingListSignupBlockProps> = async ({
  heading,
  blurb,
  buttonLabel,
}) => {
  const payload = await getPayload({ config: configPromise })
  const settings = await payload.findGlobal({ slug: 'site-settings' })
  const username = settings?.buttondownUsername?.trim()
  if (!username) return null

  return (
    <Section width="narrow" className="text-center">
      <h2 className="text-4xl md:text-5xl mb-4">{heading}</h2>
      {blurb && <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">{blurb}</p>}
      <ButtondownForm username={username} buttonLabel={buttonLabel || 'Subscribe'} />
    </Section>
  )
}
