import { SiteHeader } from '@/components/site-header'
import { Hero } from '@/components/hero'
import { About } from '@/components/about'
import { Contact } from '@/components/contact'

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <About />
        <Contact />
      </main>
      <footer className="border-t border-border">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-2 px-6 py-8 text-sm text-muted-foreground sm:flex-row sm:justify-between">
          <p>{'© 2026 Miles Green'}</p>
          <a
            href="mailto:speedymg7@berkeley.edu"
            className="transition-colors hover:text-foreground"
          >
            speedymg7@berkeley.edu
          </a>
        </div>
      </footer>
    </>
  )
}
