// Single source of truth for everything the page says about Fred.
// Strings wrapped in [square brackets] are placeholders and render visibly marked.

export type Layer = 'frontend' | 'backend' | 'data'

export interface ExperienceEntry {
  period: string
  role: string
  place: string
  layers: Layer[]
  /** One sentence on what the role was (two at most), shown under the company line. */
  summary?: string
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
  status: 'Intern at BCS Koolitus',
  availability: 'open to junior roles',
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
      role: 'Junior Software Developer Intern',
      place: 'BCS Koolitus AS · Tallinn',
      layers: ['frontend', 'backend', 'data'],
      summary:
        'Building a greenfield website in a team of three interns: a Java and Spring Boot REST API with PostgreSQL and JWT auth, and a Vue 3 frontend with role-based views. Spec-first and AI-assisted, with Spring AI features such as generating course descriptions from curriculum PDFs.',
    },
    {
      period: '2026',
      role: 'Junior AI Full-Stack Developer program',
      place: 'Vali IT! · Tallinn',
      layers: [],
      milestone: 'Career change',
      summary:
        'An intensive retraining program in full-stack development and AI integration (Java, Spring, Vue, PostgreSQL), ending in a group project.',
    },
    {
      period: '2024 — 2026',
      role: 'Senior Content Operations Specialist',
      place: 'Sportradar AG · Tallinn',
      layers: [],
      summary:
        'Co-owned cross-team projects with 8 internal teams and 3 products, acted as the escalation point for high-priority issues, and built KPI frameworks and documentation in Jira and Confluence.',
    },
    {
      period: '2022 — 2024',
      role: 'Amazon Listing Manager',
      place: 'NoCry OÜ · Tallinn',
      layers: [],
      summary:
        'Managed 50+ product listings across four international Amazon markets, working with shipping, purchasing and sales teams.',
    },
    {
      period: '2018 — 2022',
      role: 'Assistant Store Manager',
      place: 'Sportland Eesti AS · Tallinn',
      layers: [],
      summary:
        "Progressed from cashier to assistant store manager, handling daily operations, staff training and the store's e-shop orders.",
    },
  ],
}

export const isPlaceholder = (text: string): boolean => /\[[^\]]+\]/.test(text)
