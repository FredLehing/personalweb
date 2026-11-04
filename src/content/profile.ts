// Single source of truth for everything the page says about Fred.
// Strings wrapped in [square brackets] are placeholders: the page renders them
// visibly marked until real content replaces them. Never invent facts here.

export type Layer = 'frontend' | 'backend' | 'data'

export interface ExperienceEntry {
  period: string
  role: string
  place: string
  layers: Layer[]
  /** Marks a turning point in the path (e.g. the retraining that started the dev career). */
  milestone?: string
}

export interface Profile {
  name: string
  role: string
  status: string
  availability: string
  /** Address the Contact chapter's main button mails, or null while it hasn't been chosen. */
  email: string | null
  /** Path to the CV PDF under /public, or null while it hasn't been added. */
  cvUrl: string | null
  links: { linkedin: string | null; github: string | null }
  stack: Record<Layer, string[]>
  experience: ExperienceEntry[]
}

export const profile: Profile = {
  name: 'Fred Lehing',
  role: 'Full-stack developer',
  status: 'Junior Software Engineer intern at BCS Koolitus',
  availability: 'open to junior dev roles',
  email: 'lehingfred@gmail.com',
  cvUrl: '/cv/Fred_Lehing_CV_ENG.pdf',
  links: {
    linkedin: 'https://www.linkedin.com/in/fredlehing/',
    github: 'https://github.com/FredLehing',
  },
  // The hero flattens these in key order, so backend leads. Only the core of the CV's stack;
  // the full list lives in the CV itself.
  stack: {
    backend: ['Java', 'Spring Boot', 'Spring AI'],
    data: ['PostgreSQL'],
    frontend: ['Vue', 'TypeScript'],
  },
  // Non-engineering roles have empty `layers` and show no stack chips.
  experience: [
    {
      period: '2026 —',
      role: 'Junior Software Engineer Intern',
      place: 'BCS Koolitus AS · Tallinn',
      layers: ['frontend', 'backend', 'data'],
    },
    {
      period: '2026',
      role: 'Junior Full-Stack AI Developer program',
      place: 'Vali IT! · Tallinn',
      layers: [],
      milestone: 'Career change',
    },
    { period: '2024 — 2026', role: 'Senior Content Operations Specialist', place: 'Sportradar AG · Tallinn', layers: [] },
    { period: '2022 — 2024', role: 'Amazon Listing Manager', place: 'NoCry OÜ · Tallinn', layers: [] },
    { period: '2018 — 2022', role: 'Assistant Store Manager', place: 'Sportland Eesti AS · Tallinn', layers: [] },
  ],
}

export const isPlaceholder = (text: string): boolean => /\[[^\]]+\]/.test(text)
