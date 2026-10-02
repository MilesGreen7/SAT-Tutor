'use server'

import { createHash } from 'node:crypto'
import { Resend } from 'resend'

export type ContactState = {
  status: 'idle' | 'success' | 'error' | 'mailto'
  message?: string
  mailtoHref?: string
  fieldErrors?: Partial<Record<'name' | 'email' | 'phone' | 'contactMethod' | 'message', string>>
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_PATTERN = /^[\d\s()+.-]+$/
const CONTACT_METHODS = ['Email', 'Phone call', 'Text message'] as const

function isValidPhone(value: string) {
  const digits = value.replace(/\D/g, '').length
  return PHONE_PATTERN.test(value) && digits >= 7 && digits <= 15
}

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
  const phone = field(formData, 'phone', 40)
  const contactMethod = field(formData, 'contactMethod', 40)
  const role = field(formData, 'role', 40)
  const testDate = field(formData, 'testDate', 80)
  const message = field(formData, 'message', 4000)

  const fieldErrors: ContactState['fieldErrors'] = {}
  if (!name) fieldErrors.name = 'Please enter your name.'
  if (!EMAIL_PATTERN.test(email)) fieldErrors.email = 'Please enter a valid email.'
  if (!CONTACT_METHODS.includes(contactMethod as (typeof CONTACT_METHODS)[number])) {
    fieldErrors.contactMethod = 'Please choose how you’d like to be contacted.'
  }
  if (phone && !isValidPhone(phone)) {
    fieldErrors.phone = 'Please enter a valid phone number.'
  } else if (!phone && contactMethod !== 'Email' && contactMethod) {
    fieldErrors.phone = 'Please add a phone number so I can reach you.'
  }
  if (message.length < 10) fieldErrors.message = 'Please add a short message.'

  if (Object.keys(fieldErrors).length > 0) {
    return { status: 'error', fieldErrors }
  }

  const to = process.env.CONTACT_TO_EMAIL ?? 'speedymg7@berkeley.edu'
  const subject = `New tutoring inquiry from ${name}`
  const rows: [string, string][] = [
    ['Name', name],
    ['Email', email],
    ['Phone', phone || '—'],
    ['Preferred contact', contactMethod],
    ['I am a', role || '—'],
    ['Test date', testDate || '—'],
  ]

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    const body = `${rows.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\n${message.slice(0, 1500)}`
    return {
      status: 'mailto',
      mailtoHref: `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
    }
  }

  const resend = new Resend(apiKey)
  const idempotencyKey = `contact-form/${createHash('sha256')
    .update([name, email, phone, contactMethod, role, testDate, message].join('|'))
    .digest('hex')}`

  const { error } = await resend.emails.send(
    {
      from: 'SAT Tutoring Site <onboarding@resend.dev>',
      to: [to],
      replyTo: email,
      subject,
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
