import Link from 'next/link'

export function DocHeader({ breadcrumb = [], title, description }) {
  return (
    <header className="mb-10 border-b border-white/10 pb-8">
      <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
        <Link href="/docs" className="transition-colors hover:text-foreground">
          Documentation
        </Link>
        {breadcrumb.map((item, i) => (
          <span key={i} className="flex items-center gap-2">
            <span className="text-white/20" aria-hidden>
              /
            </span>
            {item.href ? (
              <Link href={item.href} className="transition-colors hover:text-foreground">
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground">{item.label}</span>
            )}
          </span>
        ))}
      </nav>
      <h1 className="text-balance text-3xl font-semibold tracking-tight text-foreground">{title}</h1>
      {description ? <p className="mt-3 max-w-2xl text-lg leading-relaxed text-muted-foreground">{description}</p> : null}
    </header>
  )
}
