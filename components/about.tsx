const EXPERIENCE = [
  {
    role: 'Math, Physics & CS Teacher',
    org: 'Fusion Education Group',
    dates: '2025 — Present',
  },
  {
    role: 'Assistant Center Director & Instructor',
    org: 'Mathnasium',
    dates: '2023 — 2025',
  },
  {
    role: 'Math Olympiad Teacher',
    org: 'Gauss Education',
    dates: '2024 — 2025',
  },
]

const APPROACH = [
  {
    title: 'Start with a diagnostic',
    body: 'We figure out which question types are costing you points before spending time on anything else.',
  },
  {
    title: 'A plan that fits you',
    body: 'Sessions and practice sets are tailored to your gaps, schedule, and test date.',
  },
  {
    title: 'Clear communication',
    body: 'Parents get regular, honest updates on progress and what we are working on next.',
  },
]

export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
    >
      <div className="mx-auto grid w-full max-w-4xl gap-12 px-6 pt-10 pb-20 md:grid-cols-[12rem_1fr] md:gap-16">
        <h2
          id="about-heading"
          className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground"
        >
          About
        </h2>

        <div className="flex flex-col gap-14">
          <div className="flex flex-col gap-4 leading-relaxed text-pretty">
            <p className="font-serif text-2xl leading-snug tracking-tight">
              {"Hi, I'm Miles. I studied Electrical Engineering and Computer Science at UC Berkeley, and I've spent the last few years teaching math one-on-one."}
            </p>
            <p className="text-muted-foreground">
              {"I've worked with more than 300 students — from middle schoolers building fundamentals to high schoolers preparing for math competitions. Most of what I do comes down to finding exactly where a student gets stuck and making that step feel obvious."}
            </p>
            <p className="text-muted-foreground">
              {"For the SAT, that means steady, targeted practice and test-day strategy without the extra pressure."}
            </p>
          </div>

          <ul className="grid gap-8 sm:grid-cols-3">
            {APPROACH.map((item, i) => (
              <li key={item.title} className="flex flex-col gap-2">
                <span className="text-xs tabular-nums text-accent">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="font-medium">{item.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {item.body}
                </p>
              </li>
            ))}
          </ul>

          <div>
            <h3 className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Experience
            </h3>
            <ul className="divide-y divide-border border-y border-border">
              {EXPERIENCE.map((item) => (
                <li
                  key={item.org}
                  className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between"
                >
                  <div>
                    <p className="font-medium">{item.role}</p>
                    <p className="text-sm text-muted-foreground">{item.org}</p>
                  </div>
                  <p className="text-sm tabular-nums text-muted-foreground">
                    {item.dates}
                  </p>
                </li>
              ))}
              <li className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between">
                <div>
                  <p className="font-medium">B.S. Electrical Engineering & Computer Science</p>
                  <p className="text-sm text-muted-foreground">
                    University of California, Berkeley
                  </p>
                </div>
                <p className="text-sm tabular-nums text-muted-foreground">
                  2023
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
