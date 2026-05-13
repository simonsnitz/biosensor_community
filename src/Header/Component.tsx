import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

export async function Header() {
  const headerData = await getCachedGlobal('header', 1)()
  // Bypass unstable_cache for site-settings until the revalidate hook is
  // consistently invalidating. site-settings is one tiny row, so the cost
  // of an extra read on every page render is negligible.
  const payload = await getPayload({ config: configPromise })
  const settings = await payload.findGlobal({ slug: 'site-settings', depth: 1 })
  const socialLinks =
    (settings as { socialLinks?: { platform?: string; url?: string }[] })?.socialLinks ?? []

  return <HeaderClient data={headerData} socialLinks={socialLinks} />
}
