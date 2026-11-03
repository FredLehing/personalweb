// The four chapters of the page. Each one is a sign segment on the tower,
// a stop on the Fred Line, and a section on the page, in this order.

export type NeonColor = 'pink' | 'cyan' | 'amber' | 'violet' | 'lime'

export interface Station {
  id: string
  /** Short label used on the sign and the line. */
  label: string
  /** Full chapter heading. */
  title: string
  /** Kanji on the sign segment. */
  kanji: string
  /** Kanji shown above the chapter heading (defaults to `kanji`). */
  chapterKanji?: string
  color: NeonColor
}

export const stations: Station[] = [
  { id: 'about', label: 'About', title: 'About', kanji: '自己紹介', color: 'pink' },
  { id: 'work', label: 'Work', title: 'Experience', kanji: '仕事', color: 'amber' },
  { id: 'dream', label: 'Dream', title: 'Japan', kanji: '夢', chapterKanji: '日本', color: 'violet' },
  { id: 'contact', label: 'Contact', title: 'Contact', kanji: '連絡', chapterKanji: '連絡 · 終点', color: 'lime' },
]

export const neonVar = (color: NeonColor): string => `var(--color-neon-${color})`
