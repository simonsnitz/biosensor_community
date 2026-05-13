'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { HeaderNav, type SocialLink } from './Nav'

interface HeaderClientProps {
  data: Header
  socialLinks?: SocialLink[]
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data, socialLinks }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  return (
    <header
      className="sticky top-0 z-30 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b border-border/60"
      {...(theme ? { 'data-theme': theme } : {})}
    >
      <div className="mx-auto max-w-6xl px-6 md:px-10 py-5 flex items-center justify-between">
        <Link
          href="/"
          className="font-display font-bold text-base md:text-lg tracking-tight text-foreground"
        >
          Biosensor Seminar Series
        </Link>
        <HeaderNav data={data} socialLinks={socialLinks} />
      </div>
    </header>
  )
}
