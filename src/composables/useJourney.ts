import { ref } from 'vue'
import { stations } from '@/content/stations'

// Shared scroll state for the Fred Line and the sign tower.
// `active` is the index of the station currently in view (-1 = the start, above the chapters),
// `progress` is 0..1 along the line, and `lit` is a station a visitor is pointing at on the line.

const active = ref(-1)
const progress = ref(0)
const lit = ref<string | null>(null)

let listening = false
let queued = false

// The stops are evenly spaced but the chapters aren't evenly tall, so the fill runs stop to stop:
// it reaches a stop at the same scroll position that chapter becomes active.
function lineProgress(y: number, marker: number, max: number) {
  if (max <= 0) return 0
  const reachedAt = [
    0,
    ...stations.map((s) => {
      const el = document.getElementById(s.id)
      return el ? Math.min(el.offsetTop - marker, max) : max
    }),
  ]
  for (let i = 0; i < stations.length; i++) {
    const from = reachedAt[i]!
    const to = reachedAt[i + 1]!
    if (y < to) return Math.max(0, (i + (y - from) / (to - from)) / stations.length)
  }
  return 1
}

function measure() {
  queued = false
  const marker = window.innerHeight * 0.45
  const line = window.scrollY + marker
  let current = -1
  stations.forEach((station, index) => {
    const el = document.getElementById(station.id)
    if (el && el.offsetTop <= line) current = index
  })
  const max = document.documentElement.scrollHeight - window.innerHeight
  progress.value = lineProgress(window.scrollY, marker, max)
  // The last chapter can never scroll up to the marker line, so arriving at the bottom means the last stop.
  if (max > 0 && window.scrollY >= max - 2) current = stations.length - 1
  active.value = current
}

function schedule() {
  if (queued) return
  queued = true
  requestAnimationFrame(measure)
}

export function useJourney() {
  if (!listening && typeof window !== 'undefined') {
    listening = true
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    schedule()
  }
  return { active, progress, lit }
}
