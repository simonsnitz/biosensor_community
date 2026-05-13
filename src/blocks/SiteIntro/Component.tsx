import React from 'react'

import type { SiteIntroBlock as SiteIntroBlockProps } from '@/payload-types'

/**
 * Full-bleed homepage hero. Text content sits at the top-left with the page's
 * standard left padding; the image is absolutely anchored to the bottom-right
 * corner of the section on desktop, flush with the viewport edges.
 *
 * On small screens the image flows below the heading. We strip the section's
 * bottom padding so the image sits flush with the bottom of the section
 * (the boundary with the next section's white background).
 */
export const SiteIntroBlock: React.FC<SiteIntroBlockProps> = ({
  heading,
  subheading,
  image,
  imagePosition,
}) => {
  const hasImage = image && typeof image === 'object' && image.url
  const pinLeft = imagePosition === 'left'

  return (
    <section className="relative w-full overflow-hidden lg:h-[70vh]">
      <div className="relative z-10 px-6 md:px-10 lg:pl-16 xl:pl-24 pt-6 md:pt-12 pb-0 lg:pb-16 lg:max-w-[42vw]">
        <h1 className="text-5xl sm:text-6xl md:text-[3.375rem] lg:text-[4.125rem] xl:text-[5.25rem] font-light text-foreground">
          {heading}
        </h1>
        {subheading && (
          <p className="mt-5 max-w-xl text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed">
            {subheading}
          </p>
        )}

        {/*
          Always render the CTAs side-by-side. To fit two buttons on narrow
          phones, we shrink the padding/text and hide the second half of each
          label (sm+ shows the full label). `whitespace-nowrap` prevents
          per-button wrapping so they can't push each other below.
        */}
        <div className="mt-8 flex gap-3">
          <a
            href="https://harvard.zoom.us/webinar/register/WN_9-IIPvWIQk-QT_hNR6MdYQ"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full bg-primary text-primary-foreground font-semibold text-xs sm:text-sm uppercase tracking-wider whitespace-nowrap transition hover:opacity-90"
          >
            Register<span className="hidden sm:inline"> to Attend</span>
            <span aria-hidden>→</span>
          </a>
          <a
            href="https://forms.gle/eWfjH1xziYHVQDzKA"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full border border-border text-foreground font-semibold text-xs sm:text-sm uppercase tracking-wider whitespace-nowrap transition hover:border-foreground/60 hover:bg-secondary"
          >
            Sign Up<span className="hidden sm:inline"> to Present</span>
            <span aria-hidden>→</span>
          </a>
        </div>

        {hasImage && (
          // Mobile image: stacks below the heading, flush with section bottom
          // (no margin under it). `mt-10` gives some breathing room from text.
          <div className="mt-10 -mx-6 md:-mx-10 lg:hidden">
            <img src={image.url!} alt={image.alt || heading} className="w-full h-auto block" />
          </div>
        )}
      </div>

      {hasImage && (
        <img
          src={image.url!}
          alt={image.alt || heading}
          aria-hidden
          className={`hidden lg:block pointer-events-none absolute bottom-0 ${
            pinLeft ? 'left-0' : 'right-0'
          } w-[58vw] xl:w-[55vw] max-w-[1000px] max-h-[70vh] object-contain object-bottom`}
        />
      )}
    </section>
  )
}
