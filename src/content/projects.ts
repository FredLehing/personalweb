// The Projects chapter (作品): one platform screen per project, in this order.
// Strings wrapped in [square brackets] are placeholders and render visibly marked. Never invent facts here.

export interface Project {
  id: string
  title: string
  /** Where it was made (e.g. a course or a team), shown quietly beside the heading under the screen. */
  context?: string
  /** What it is and who it's for, in a sentence or two. */
  summary: string
  role: string
  stack: string[]
  /** Repository link, or null while there isn't a public one. */
  repo: string | null
  /** Unlisted or public YouTube id (embedding allowed), or null until the video exists. */
  youtubeId: string | null
  /** Video length as shown on the strip, e.g. "1:24", or null. */
  duration: string | null
  /** Whether the video has captions (shows the CC chip and asks the player to load them). */
  captions: boolean
}

export const projects: Project[] = [
  {
    id: 'personalweb',
    title: 'This site, the Fred Line',
    summary:
      'A developer home page as one Tokyo night: a neon sign tower for navigation and a train line to Kyoto for scroll progress.',
    role: 'Design and build',
    stack: ['Vue', 'TypeScript', 'Tailwind CSS'],
    repo: 'https://github.com/FredLehing/personalweb',
    youtubeId: null,
    duration: null,
    captions: false,
  },
  {
    id: 'bcs-koolitused',
    title: 'BCS Koolitused',
    context: 'Vali IT! group project',
    summary:
      'A prototype course platform for BCS Koolitus: visitors browse and register for trainings, participants get their courses and certificates, and admins run the catalogue. AI reads curriculum PDFs to fill in course details, in Estonian and English.',
    role: 'Team captain. Built the AI PDF reader and end-to-end features.',
    stack: ['Java', 'Spring Boot', 'Spring AI', 'PostgreSQL', 'Vue', 'Tailwind CSS'],
    repo: 'https://github.com/FredLehing/bcs-koolitused',
    youtubeId: null,
    duration: null,
    captions: false,
  },
]
