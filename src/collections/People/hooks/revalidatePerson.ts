import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath } from 'next/cache'

/**
 * Invalidate the homepage and /people page whenever a Person is created,
 * updated, or deleted. People also appear as speakers on seminar detail
 * pages, but rendering goes through the seminar's own document — so the
 * seminar's revalidate path is unnecessary unless the speaker association
 * changes. For now we just refresh the listing pages.
 */
export const revalidatePerson: CollectionAfterChangeHook = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating person ${doc.name || doc.id}`)
    revalidatePath('/')
    revalidatePath('/people')
  }
  return doc
}

export const revalidatePersonOnDelete: CollectionAfterDeleteHook = ({
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating after deleting a person`)
    revalidatePath('/')
    revalidatePath('/people')
  }
}
