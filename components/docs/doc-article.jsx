/** Presentational primitives for docs pages (JSX, no MDX). */

export function DocLead({ children }) {
  return <p className="text-lg leading-relaxed text-muted-foreground">{children}</p>
}

export function DocH2({ children, id }) {
  return (
    <h2 id={id} className="scroll-mt-24 text-2xl font-semibold tracking-tight text-foreground">
      {children}
    </h2>
  )
}

export function DocH3({ children, id }) {
  return (
    <h3 id={id} className="scroll-mt-24 text-xl font-semibold tracking-tight text-foreground">
      {children}
    </h3>
  )
}

export function DocP({ children }) {
  return <p className="leading-relaxed text-muted-foreground">{children}</p>
}

export function DocUl({ children }) {
  return <ul className="list-disc space-y-2 pl-6 text-muted-foreground">{children}</ul>
}

export function DocOl({ children }) {
  return <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">{children}</ol>
}

export function DocLi({ children }) {
  return <li className="leading-relaxed">{children}</li>
}

export function DocCode({ children }) {
  return (
    <code className="rounded-md border border-white/10 bg-[#0c0c0c] px-1.5 py-0.5 font-mono text-[0.9em] text-[#e6e8e6]">
      {children}
    </code>
  )
}

export function DocCallout({ title, children, variant = 'info' }) {
  const styles =
    variant === 'warning'
      ? 'border-amber-500/35 bg-amber-950/15 text-amber-50'
      : variant === 'tip'
        ? 'border-primary/35 bg-primary/[0.08] text-foreground'
        : 'border-white/10 bg-card/40 text-foreground'

  return (
    <aside className={`rounded-xl border p-4 ${styles}`}>
      {title ? <p className="mb-2 text-sm font-semibold">{title}</p> : null}
      <div className="text-sm leading-relaxed text-muted-foreground [&_strong]:text-foreground">{children}</div>
    </aside>
  )
}

export function DocSection({ children, className = '' }) {
  return <section className={`flex flex-col gap-4 ${className}`}>{children}</section>
}
