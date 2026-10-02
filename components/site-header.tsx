export function SiteHeader() {
  return (
    <header className="mx-auto flex w-full max-w-4xl items-center justify-between px-6 py-6">
      <a href="#" className="font-serif text-2xl font-medium tracking-tight md:text-3xl">
        Miles Green
      </a>
      <nav aria-label="Main">
        <ul className="flex items-center gap-6 text-sm text-muted-foreground">
          <li>
            <a href="#about" className="transition-colors hover:text-foreground">
              About
            </a>
          </li>
          <li>
            <a
              href="#contact"
              className="transition-colors hover:text-foreground"
            >
              Contact
            </a>
          </li>
        </ul>
      </nav>
    </header>
  )
}
