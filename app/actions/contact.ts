'use server'

import { createHash } from 'node:crypto'
import { Resend } from 'resend'

export type ContactState = {
  status: 'idle' | 'success' | 'error'
  message?: string
  fieldErrors?: Partial<Record<'name' | 'email' | 'message', string>>
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function field(formData: FormData, key: string, max: number) {
  const value = formData.get(key)
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

export async function sendContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  if (field(formData, 'company', 200)) {
    return { status: 'success' }
  }

  const name = field(formData, 'name', 120)
  const email = field(formData, 'email', 200)
  const role = field(formData, 'role', 40)
  const testDate = field(formData, 'testDate', 80)
  const message = field(formData, 'message', 4000)

  const fieldErrors: ContactState['fieldErrors'] = {}
  if (!name) fieldErrors.name = 'Please enter your name.'
  if (!EMAIL_PATTERN.test(email)) fieldErrors.email = 'Please enter a valid email.'
  if (message.length < 10) fieldErrors.message = 'Please add a short message.'

  if (Object.keys(fieldErrors).length > 0) {
    return { status: 'error', fieldErrors }
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return {
      status: 'error',
      message: 'The contact form is not configured yet. Please try again later.',
    }
  }

  const resend = new Resend(apiKey)
  const to = process.env.CONTACT_TO_EMAIL ?? 'speedymg7@berkeley.edu'
  const idempotencyKey = `contact-form/${createHash('sha256')
    .update([name, email, role, testDate, message].join('|'))
    .digest('hex')}`

  const rows: [string, string][] = [
    ['Name', name],
    ['Email', email],
    ['I am a', role || '—'],
    ['Test date', testDate || '—'],
  ]

  const { error } = await resend.emails.send(
    {
      from: 'SAT Tutoring Site <onboarding@resend.dev>',
      to: [to],
      replyTo: email,
      subject: `New tutoring inquiry from ${name}`,
      text: `${rows.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\n${message}`,
      html: `<div style="font-family:system-ui,sans-serif;line-height:1.5">
        ${rows
          .map(([k, v]) => `<p style="margin:0"><strong>${k}:</strong> ${escapeHtml(v)}</p>`)
          .join('')}
        <p style="white-space:pre-wrap;margin-top:16px">${escapeHtml(message)}</p>
      </div>`,
    },
    { idempotencyKey },
  )

  if (error) {
    console.error('[contact] Resend error:', error.message)
    return {
      status: 'error',
      message: 'Something went wrong sending your message. Please try again.',
    }
  }

  return {
    status: 'success',
    message: "Thanks — your message is on its way. I'll get back to you soon.",
  }
}
