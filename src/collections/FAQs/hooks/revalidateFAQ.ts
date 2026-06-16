import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath } from 'next/cache'

/** Invalidate the homepage whenever an FAQ changes — that's the only page that lists them. */
export const revalidateFAQ: CollectionAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating FAQ`)
    revalidatePath('/')
  }
  return doc
}

export const revalidateFAQOnDelete: CollectionAfterDeleteHook = ({
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating after deleting an FAQ`)
    revalidatePath('/')
  }
}
