import { Scantron } from '@/components/scantron'

export function Hero() {
  return (
    <section className="mx-auto grid w-full max-w-4xl items-center gap-12 px-6 pt-12 pb-8 md:grid-cols-[1fr_auto] md:gap-16 md:pt-20 md:pb-10">
      <div>
        <p className="mb-5 text-xs font-medium uppercase tracking-[0.2em] text-accent">
          SAT Tutoring
        </p>
        <h1 className="font-serif text-4xl leading-[1.1] tracking-tight text-balance md:text-5xl">
          Calm, focused help for the{' '}
          <em className="italic">SAT</em>.
        </h1>
        <p className="mt-6 max-w-md leading-relaxed text-muted-foreground text-pretty">
          One-on-one sessions, online or in person, built around where you are
          now and where you want your score to be.
        </p>
        <a
          href="#contact"
          className="mt-8 inline-flex items-center gap-2 border-b border-foreground pb-0.5 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
        >
          Get in touch
          <span aria-hidden="true">{'→'}</span>
        </a>
      </div>
      <Scantron className="mx-auto md:mx-0" />
    </section>
  )
}
