'use client'

import { useActionState, useEffect, useState } from 'react'
import { sendContact, type ContactState } from '@/app/actions/contact'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

const initialState: ContactState = { status: 'idle' }

const fieldClass = 'h-10 bg-card px-3 text-base md:text-sm'

const CONTACT_METHODS = ['Email', 'Phone call', 'Text message'] as const
type ContactMethod = (typeof CONTACT_METHODS)[number]

export function ContactForm() {
  const [state, formAction, pending] = useActionState(sendContact, initialState)

  const [contactMethod, setContactMethod] = useState<ContactMethod>(
    (state.values?.contactMethod as ContactMethod) ?? 'Email',
  )

  const errors = state.fieldErrors ?? {}

  useEffect(() => {
    if (state.values?.contactMethod) {
      setContactMethod(state.values.contactMethod as ContactMethod)
    }
  }, [state.values?.contactMethod])

  useEffect(() => {
    if (state.status === 'mailto' && state.mailtoHref) {
      window.location.href = state.mailtoHref
    }
  }, [state])

  if (state.status === 'mailto' && state.mailtoHref) {
    return (
      <div
        role="status"
        className="rounded-md border border-border bg-card p-6 leading-relaxed"
      >
        <p className="font-serif text-xl">Almost done.</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Your email app should open with your message ready to go — just press
          send. If it didn&apos;t open, use the button below.
        </p>
        <a
          href={state.mailtoHref}
          target="_top"
          className="mt-4 inline-flex h-10 items-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          Open email
        </a>
      </div>
    )
  }

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
        <input
          id="company"
          name="company"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            autoComplete="name"
            required
            defaultValue={state.values?.name ?? ''}
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
            defaultValue={state.values?.email ?? ''}
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
          <Label htmlFor="phone">
            Phone{' '}
            <span className="font-normal text-muted-foreground">
              {contactMethod === 'Email' ? '(optional)' : '(required)'}
            </span>
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="(555) 123-4567"
            required={contactMethod !== 'Email'}
            defaultValue={state.values?.phone ?? ''}
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
            className={fieldClass}
          />
          {errors.phone && (
            <p id="phone-error" className="text-xs text-destructive">
              {errors.phone}
            </p>
          )}
        </div>

        <fieldset
          className="grid gap-2"
          aria-describedby={
            errors.contactMethod ? 'contactMethod-error' : undefined
          }
        >
          <legend className="mb-2 text-sm font-medium leading-none">
            Best way to reach you
          </legend>

          <div className="flex h-10 items-center gap-1 rounded-lg border border-input bg-card p-1">
            {CONTACT_METHODS.map((method) => (
              <label
                key={method}
                className="flex h-full flex-1 cursor-pointer items-center justify-center rounded-md px-2 text-sm text-muted-foreground transition-colors has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/50"
              >
                <input
                  type="radio"
                  name="contactMethod"
                  value={method}
                  checked={contactMethod === method}
                  onChange={() => setContactMethod(method)}
                  className="sr-only"
                />
                {method === 'Text message'
                  ? 'Text'
                  : method === 'Phone call'
                    ? 'Call'
                    : method}
              </label>
            ))}
          </div>

          {errors.contactMethod && (
            <p id="contactMethod-error" className="text-xs text-destructive">
              {errors.contactMethod}
            </p>
          )}
        </fieldset>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="role">I am a</Label>
          <select
            id="role"
            name="role"
            defaultValue={state.values?.role ?? 'Parent'}
            className="h-10 w-full rounded-lg border border-input bg-card px-3 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm"
          >
            <option>Parent</option>
            <option>Student</option>
            <option>Other</option>
          </select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="testDate">
            Test date{' '}
            <span className="font-normal text-muted-foreground">
              (optional)
            </span>
          </Label>
          <Input
            id="testDate"
            name="testDate"
            placeholder="e.g. March 2027"
            defaultValue={state.values?.testDate ?? ''}
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
          defaultValue={state.values?.message ?? ''}
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
        <Button
          type="submit"
          size="lg"
          disabled={pending}
          className="h-10 px-5"
        >
          {pending ? 'Sending…' : 'Send message'}
        </Button>
      </div>
    </form>
  )
}