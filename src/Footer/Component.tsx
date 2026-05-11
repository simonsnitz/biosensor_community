import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import { CMSLink } from '@/components/Link'

export async function Footer() {
  const footerData = await getCachedGlobal('footer', 1)()
  const settings = await getCachedGlobal('site-settings', 1)()
  const navItems = footerData?.navItems || []
  const socialLinks =
    (settings as { socialLinks?: { platform?: string; url?: string }[] })?.socialLinks ?? []

  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto max-w-6xl px-6 md:px-10 py-12 md:py-16 flex flex-col md:flex-row md:justify-between gap-8">
        <div>
          <Link href="/" className="font-display font-bold text-xl text-foreground">
            Biosensor Community
          </Link>
          <p className="mt-2 text-sm text-muted-foreground max-w-sm">
            A community of scientists building genetically-encoded small molecule sensors.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-8 sm:gap-12">
          {navItems.length > 0 && (
            <nav>
              <p className="font-display text-xs uppercase tracking-[0.18em] text-muted-foreground mb-3">
                Site
              </p>
              <ul className="space-y-2">
                {navItems.map(({ link }, i) => (
                  <li key={i}>
                    <CMSLink className="text-foreground hover:underline" {...link} />
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {socialLinks.length > 0 && (
            <nav>
              <p className="font-display text-xs uppercase tracking-[0.18em] text-muted-foreground mb-3">
                Elsewhere
              </p>
              <ul className="space-y-2">
                {socialLinks.map((s, i) =>
                  s?.url ? (
                    <li key={i}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground hover:underline capitalize"
                      >
                        {s.platform}
                      </a>
                    </li>
                  ) : null,
                )}
              </ul>
            </nav>
          )}
        </div>
      </div>
    </footer>
  )
}
