'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Github, Globe, Linkedin, Mail, Twitter, Youtube, type LucideIcon } from 'lucide-react'

export type SocialLink = {
  platform?: string | null
  url?: string | null
}

/**
 * Icon + brand-color lookup for each `SiteSettings.socialLinks[].platform`
 * value. The `color` is applied as a Tailwind text color via inline style so
 * we don't need to register custom Tailwind classes for one-off brand hues.
 *
 * `other` falls back to a generic globe icon in the foreground color.
 */
const PLATFORM_META: Record<string, { Icon: LucideIcon; color?: string; label: string }> = {
  linkedin: { Icon: Linkedin, color: '#0A66C2', label: 'LinkedIn' },
  youtube: { Icon: Youtube, color: '#FF0000', label: 'YouTube' },
  twitter: { Icon: Twitter, color: '#1DA1F2', label: 'Twitter / X' },
  github: { Icon: Github, label: 'GitHub' },
  email: { Icon: Mail, label: 'Email' },
  other: { Icon: Globe, label: 'Link' },
}

/**
 * Normalize a URL for duplicate-detection. We lowercase, drop the scheme
 * (http/https), drop a leading `www.`, and strip trailing slashes — so e.g.
 *   https://www.youtube.com/@X/  ⟷  http://youtube.com/@X
 * compare equal.
 */
function normalizeUrl(u: string | null | undefined): string {
  if (!u) return ''
  return u
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/+$/, '')
}

export const HeaderNav: React.FC<{ data: HeaderType; socialLinks?: SocialLink[] }> = ({
  data,
  socialLinks = [],
}) => {
  const navItems = data?.navItems || []

  // If a Header navItem points to the same URL as a socialLink, suppress the
  // text navItem so the icon is the only representation (avoids "YouTube"
  // appearing twice in the bar).
  const socialUrls = new Set(
    socialLinks
      .map((s) => normalizeUrl(s?.url ?? null))
      .filter((u): u is string => Boolean(u)),
  )

  const filteredNavItems = navItems.filter(({ link }) => {
    const href = (link as { url?: string | null })?.url
    return !socialUrls.has(normalizeUrl(href))
  })

  return (
    <nav className="flex gap-6 md:gap-10 items-center">
      {filteredNavItems.map(({ link }, i) => (
        <CMSLink
          key={i}
          {...link}
          appearance="link"
          className="font-display text-sm font-medium text-foreground hover:text-primary transition"
        />
      ))}
      {socialLinks.length > 0 && (
        <div className="flex items-center gap-7">
          {socialLinks.map((s, i) => {
            if (!s?.url || !s.platform) return null
            const meta = PLATFORM_META[s.platform] ?? PLATFORM_META.other
            const Icon = meta.Icon
            const isEmail = s.platform === 'email'
            return (
              <a
                key={i}
                href={isEmail && !s.url.startsWith('mailto:') ? `mailto:${s.url}` : s.url}
                target={isEmail ? undefined : '_blank'}
                rel={isEmail ? undefined : 'noopener noreferrer'}
                aria-label={meta.label}
                style={meta.color ? { color: meta.color } : undefined}
                className="hover:opacity-80 transition"
              >
                <Icon className="w-8 h-8" strokeWidth={1.75} />
              </a>
            )
          })}
        </div>
      )}
    </nav>
  )
}
