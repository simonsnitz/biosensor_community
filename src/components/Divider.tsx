import React from 'react'

import { cn } from '@/utilities/ui'

/**
 * Horizontal rule used between top-level page sections. Faint, full-width
 * within the container, no vertical margin (let the surrounding Section
 * provide spacing).
 */
export const Divider: React.FC<{ className?: string }> = ({ className }) => (
  <div className="px-6 md:px-10">
    <hr className={cn('mx-auto w-full max-w-6xl border-t border-border', className)} />
  </div>
)
