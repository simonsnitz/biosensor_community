'use client'

import React from 'react'

type Props = {
  username: string
  buttonLabel: string
}

export const ButtondownForm: React.FC<Props> = ({ username, buttonLabel }) => {
  const safeUser = encodeURIComponent(username)
  return (
    <form
      action={`https://buttondown.com/api/emails/embed-subscribe/${safeUser}`}
      method="post"
      target="popupwindow"
      onSubmit={() => {
        window.open(`https://buttondown.com/${safeUser}`, 'popupwindow')
      }}
      className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
    >
      <label htmlFor="bd-email" className="sr-only">
        Email address
      </label>
      <input
        id="bd-email"
        type="email"
        name="email"
        required
        placeholder="you@example.com"
        className="flex-1 px-5 py-3 rounded-full border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
      />
      <button
        type="submit"
        className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-display font-semibold text-sm uppercase tracking-wider transition hover:opacity-90"
      >
        {buttonLabel}
      </button>
    </form>
  )
}
