import React from 'react'

import { cn } from '@/utilities/ui'

type SectionProps = React.HTMLAttributes<HTMLElement> & {
  /** Optional eyebrow label rendered above the heading (e.g. "Seminars"). */
  eyebrow?: string
  /** Section heading. Renders an <h2>. Omit for unlabeled sections. */
  heading?: string
  /** Smaller intro text below the heading. */
  intro?: string
  /** Reduce vertical padding (for tightly stacked sub-sections). */
  compact?: boolean
  /** Constrain inner content width. Defaults to wide. */
  width?: 'narrow' | 'wide' | 'full'
}

const widthClass = {
  narrow: 'max-w-3xl',
  wide: 'max-w-6xl',
  full: 'max-w-none',
}

/**
 * A vertically padded site section with consistent container width and an
 * optional eyebrow / heading / intro header. Use for every top-level chunk
 * of a page so spacing stays uniform.
 */
export const Section: React.FC<SectionProps> = ({
  eyebrow,
  heading,
  intro,
  compact,
  width = 'wide',
  className,
  children,
  ...rest
}) => {
  return (
    <section
      className={cn(
        compact ? 'py-10 md:py-16' : 'py-14 md:py-28',
        'px-5 md:px-10',
        className,
      )}
      {...rest}
    >
      <div className={cn('mx-auto w-full', widthClass[width])}>
        {(eyebrow || heading || intro) && (
          <header className="mb-10 md:mb-14">
            {eyebrow && (
              <p className="font-display text-sm uppercase tracking-[0.18em] text-muted-foreground mb-3">
                {eyebrow}
              </p>
            )}
            {heading && (
              <h2 className="text-4xl md:text-5xl lg:text-6xl">{heading}</h2>
            )}
            {intro && (
              <p className="mt-5 max-w-2xl text-lg text-muted-foreground">{intro}</p>
            )}
          </header>
        )}
        {children}
      </div>
    </section>
  )
}
