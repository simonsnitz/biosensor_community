import React from 'react'

import type { SiteIntroBlock as SiteIntroBlockProps } from '@/payload-types'

/**
 * Full-bleed homepage hero. Text content sits at the top-left with the page's
 * standard left padding; the image is absolutely anchored to the bottom-right
 * corner of the section, flush with the viewport edges (no margin, no
 * padding) — Isomorphic Labs style.
 *
 * On small screens the image flows below the heading instead of overlapping,
 * since absolute-positioning a large image behind text on mobile would hurt
 * legibility.
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
    // Fixed 70vh on desktop — guaranteed to fit inside the viewport
    // regardless of header / admin-bar height.
    <section className="relative w-full overflow-hidden lg:h-[70vh]">
      {/*
        Content wrapper is constrained to ~48vw on lg+ so the heading can't
        extend into the right-half image area. No mx-auto on desktop — we
        intentionally left-align the text rather than center within a
        page-wide container.
      */}
      <div className="relative z-10 px-6 md:px-10 lg:pl-16 xl:pl-24 pt-20 md:pt-28 pb-16 lg:max-w-[48vw]">
        <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-foreground">
          {heading}
        </h1>
        {subheading && (
          <p className="mt-6 max-w-xl text-lg md:text-xl text-muted-foreground leading-relaxed">
            {subheading}
          </p>
        )}

        {hasImage && (
          <div className="mt-12 lg:hidden">
            <img
              src={image.url!}
              alt={image.alt || heading}
              className="w-full h-auto rounded-2xl"
            />
          </div>
        )}
      </div>

      {hasImage && (
        // Capped width + height so the image always fits within the section.
        // object-contain + object-bottom anchors it flush to the bottom edge.
        <img
          src={image.url!}
          alt={image.alt || heading}
          aria-hidden
          className={`hidden lg:block pointer-events-none absolute bottom-0 ${
            pinLeft ? 'left-0' : 'right-0'
          } w-[50vw] xl:w-[45vw] max-w-[800px] max-h-[60vh] object-contain object-bottom`}
        />
      )}
    </section>
  )
}
