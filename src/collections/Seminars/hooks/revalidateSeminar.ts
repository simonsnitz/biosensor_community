import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath } from 'next/cache'

/**
 * Invalidate the homepage, the /seminars index, and the seminar's own
 * detail page whenever a Seminar is created, updated, or deleted. The
 * homepage shows the next + past seminar grids; the index shows all past;
 * /seminars/[slug] is the detail page.
 */
export const revalidateSeminar: CollectionAfterChangeHook = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating seminar ${doc.slug || doc.id}`)
    revalidatePath('/')
    revalidatePath('/seminars')
    if (doc.slug) revalidatePath(`/seminars/${doc.slug}`)
    if (previousDoc?.slug && previousDoc.slug !== doc.slug) {
      revalidatePath(`/seminars/${previousDoc.slug}`)
    }
  }
  return doc
}

export const revalidateSeminarOnDelete: CollectionAfterDeleteHook = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating after deleting seminar ${doc.slug || doc.id}`)
    revalidatePath('/')
    revalidatePath('/seminars')
    if (doc.slug) revalidatePath(`/seminars/${doc.slug}`)
  }
  return doc
}
