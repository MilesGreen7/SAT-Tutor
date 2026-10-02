'use client'

import { useActionState } from 'react'
import { sendContact, type ContactState } from '@/app/actions/contact'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

const initialState: ContactState = { status: 'idle' }

const fieldClass = 'h-10 bg-card px-3 text-base md:text-sm'

export function ContactForm() {
  const [state, formAction, pending] = useActionState(sendContact, initialState)
  const errors = state.fieldErrors ?? {}

  if (state.status === 'success') {
    return (
      <div
        role="status"
        className="rounded-md border border-border bg-card p-6 leading-relaxed"
      >
        <p className="font-serif text-xl">Message sent.</p>
        <p className="mt-2 text-sm text-muted-foreground">
          {state.message ?? "Thanks — I'll be in touch soon."}
        </p>
      </div>
    )
  }

  return (
    <form action={formAction} noValidate className="grid gap-5">
      <div className="hidden" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            autoComplete="name"
            required
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
            className={fieldClass}
          />
          {errors.name && (
            <p id="name-error" className="text-xs text-destructive">
              {errors.name}
            </p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            className={fieldClass}
          />
          {errors.email && (
            <p id="email-error" className="text-xs text-destructive">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="role">I am a</Label>
          <select
            id="role"
            name="role"
            defaultValue="Parent"
            className="h-10 w-full rounded-lg border border-input bg-card px-3 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm"
          >
            <option>Parent</option>
            <option>Student</option>
            <option>Other</option>
          </select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="testDate">
            Test date <span className="font-normal text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="testDate"
            name="testDate"
            placeholder="e.g. March 2027"
            className={fieldClass}
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          rows={5}
          required
          placeholder="A little about the student, current scores, goals, and availability."
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'message-error' : undefined}
          className="min-h-32 bg-card px-3 py-2.5 text-base md:text-sm"
        />
        {errors.message && (
          <p id="message-error" className="text-xs text-destructive">
            {errors.message}
          </p>
        )}
      </div>

      {state.status === 'error' && state.message && (
        <p role="alert" className="text-sm text-destructive">
          {state.message}
        </p>
      )}

      <div>
        <Button type="submit" size="lg" disabled={pending} className="h-10 px-5">
          {pending ? 'Sending…' : 'Send message'}
        </Button>
      </div>
    </form>
  )
}
