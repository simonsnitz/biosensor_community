import type { GlobalAfterChangeHook } from 'payload'

import { revalidateTag } from 'next/cache'

/**
 * Invalidate the `global_site-settings` unstable_cache tag whenever the
 * global is saved, so changes (e.g. adding a social link) show up on the
 * next request instead of being masked by stale cached data.
 */
export const revalidateSiteSettings: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating site-settings`)
    revalidateTag('global_site-settings', 'max')
  }
  return doc
}
