import { ContactForm } from '@/components/contact-form'

export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="border-t border-border"
    >
      <div className="mx-auto grid w-full max-w-4xl gap-12 px-6 py-20 md:grid-cols-[12rem_1fr] md:gap-16">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Contact
        </p>
        <div className="flex flex-col gap-8">
          <div>
            <h2
              id="contact-heading"
              className="font-serif text-3xl tracking-tight text-balance"
            >
              {"Let's talk."}
            </h2>
            <p className="mt-3 max-w-md leading-relaxed text-muted-foreground">
              {"Send a note with a bit about the student and what you're looking for. I usually reply within a day."}
            </p>
          </div>
          <ContactForm />
        </div>
      </div>
    </section>
  )
}
