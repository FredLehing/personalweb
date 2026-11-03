// Single source of truth for everything the page says about Fred.
// Strings wrapped in [square brackets] are placeholders: the page renders them
// visibly marked until real content replaces them. Never invent facts here.

export type Layer = 'frontend' | 'backend' | 'data'

export interface ExperienceEntry {
  period: string
  role: string
  place: string
  layers: Layer[]
}

export interface Profile {
  name: string
  role: string
  status: string
  availability: string
  /** Address the Contact chapter's main button mails, or null while it hasn't been chosen. */
  email: string | null
  /** Path to the CV PDF in /public, or null while it hasn't been added. */
  cvUrl: string | null
  links: { linkedin: string | null; github: string | null }
  stack: Record<Layer, string[]>
  experience: ExperienceEntry[]
}

export const profile: Profile = {
  name: 'Fred Lehing',
  role: 'Full-stack developer',
  status: 'Full-stack intern at [Company]',
  availability: 'open to a first full-time role',
  email: 'lehingfred@gmail.com',
  cvUrl: null,
  links: {
    linkedin: 'https://www.linkedin.com/in/fredlehing/',
    github: 'https://github.com/FredLehing',
  },
  // Frontend is evidenced by this project's own stack; backend and data wait for the CV.
  stack: {
    frontend: ['Vue', 'TypeScript', 'Tailwind CSS'],
    backend: ['[from CV]'],
    data: ['[from CV]'],
  },
  // Empty `layers` renders a marked placeholder until the CV confirms them.
  experience: [
    { period: '[Start] —', role: 'Full-stack intern', place: '[Company] · [City]', layers: [] },
    { period: '[Year]', role: '[Earlier role or project from CV]', place: '[Place]', layers: [] },
  ],
}

export const isPlaceholder = (text: string): boolean => /\[[^\]]+\]/.test(text)
