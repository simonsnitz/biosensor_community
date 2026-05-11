import React from 'react'

import type { SiteIntroBlock as SiteIntroBlockProps } from '@/payload-types'

export const SiteIntroBlock: React.FC<SiteIntroBlockProps> = ({
  heading,
  subheading,
  image,
  imagePosition,
}) => {
  const hasImage = image && typeof image === 'object' && image.url
  const imageOnLeft = imagePosition === 'left'

  return (
    <section className="container mx-auto px-4">
      <div
        className={`grid gap-10 items-center ${
          hasImage ? 'md:grid-cols-2' : 'md:grid-cols-1'
        }`}
      >
        <div className={imageOnLeft ? 'md:order-2' : ''}>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4">{heading}</h1>
          {subheading && (
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              {subheading}
            </p>
          )}
        </div>
        {hasImage && (
          <div className={imageOnLeft ? 'md:order-1' : ''}>
            <img
              src={image.url!}
              alt={image.alt || heading}
              className="w-full h-auto rounded-lg"
            />
          </div>
        )}
      </div>
    </section>
  )
}
