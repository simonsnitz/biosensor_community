import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

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
    <section className="container mx-auto px-4 max-w-2xl text-center">
      <h2 className="text-3xl font-semibold mb-3">{heading}</h2>
      {blurb && <p className="text-muted-foreground mb-6">{blurb}</p>}
      <ButtondownForm username={username} buttonLabel={buttonLabel || 'Subscribe'} />
    </section>
  )
}
