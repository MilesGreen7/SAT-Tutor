'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

const CHOICES = ['A', 'B', 'C', 'D'] as const
const INITIAL_ANSWERS: (number | null)[] = [1, 3, 0, 2, 1, 3]

export function Scantron({ className }: { className?: string }) {
  const [answers, setAnswers] = useState(INITIAL_ANSWERS)
  const [touched, setTouched] = useState(false)

  const filledCount = answers.filter((a) => a !== null).length

  function bubble(row: number, col: number) {
    setTouched(true)
    setAnswers((prev) =>
      prev.map((answer, i) =>
        i === row ? (answer === col ? null : col) : answer,
      ),
    )
  }

  function erase() {
    setTouched(true)
    setAnswers(INITIAL_ANSWERS.map(() => null))
  }

  return (
    <div
      className={cn(
        'w-full max-w-72 rounded-md border border-border bg-card p-5 shadow-[0_1px_0_rgba(0,0,0,0.03)]',
        className,
      )}
    >
      <div className="mb-4 flex items-center justify-between gap-4 border-b border-dashed border-border pb-3">
        <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-accent">
          Answer Sheet
        </span>
        <button
          type="button"
          onClick={erase}
          disabled={filledCount === 0}
          className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none disabled:opacity-40 disabled:hover:text-muted-foreground"
        >
          Erase
        </button>
      </div>

      <div
        aria-hidden="true"
        className="mb-2 grid grid-cols-[1.5rem_repeat(4,1fr)] items-center"
      >
        <span />
        {CHOICES.map((c) => (
          <span
            key={c}
            className="text-center text-[10px] font-medium text-muted-foreground"
          >
            {c}
          </span>
        ))}
      </div>

      <ol className="grid gap-y-3">
        {answers.map((answer, row) => (
          <li
            key={row}
            role="radiogroup"
            aria-label={`Question ${row + 1}`}
            className="grid grid-cols-[1.5rem_repeat(4,1fr)] items-center"
          >
            <span aria-hidden="true" className="text-xs tabular-nums text-muted-foreground">
              {row + 1}
            </span>
            {CHOICES.map((c, col) => {
              const filled = answer === col
              return (
                <span key={c} className="flex justify-center">
                  <button
                    type="button"
                    role="radio"
                    aria-checked={filled}
                    aria-label={c}
                    onClick={() => bubble(row, col)}
                    className="group relative flex size-6 cursor-pointer items-center justify-center rounded-full focus-visible:outline-none"
                  >
                    <span className="relative flex size-4 items-center justify-center rounded-full border border-accent/50 transition-colors group-hover:border-accent group-focus-visible:ring-2 group-focus-visible:ring-ring/60">
                      {filled ? (
                        <span
                          key={`${row}-${col}-${touched}`}
                          className="animate-bubble-fill absolute inset-[1.5px] rounded-full bg-foreground"
                          style={
                            touched
                              ? undefined
                              : { animationDelay: `${400 + row * 180}ms` }
                          }
                        />
                      ) : (
                        <span className="absolute inset-[1.5px] rounded-full bg-foreground opacity-0 transition-opacity group-hover:opacity-15" />
                      )}
                    </span>
                  </button>
                </span>
              )
            })}
          </li>
        ))}
      </ol>

      <p className="mt-4 border-t border-dashed border-border pt-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {touched ? `${filledCount} of ${answers.length} answered` : 'Try filling one in'}
      </p>
    </div>
  )
}
