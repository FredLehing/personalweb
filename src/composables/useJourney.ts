import { ref } from 'vue'
import { stations } from '@/content/stations'

// Shared scroll state for the Fred Line and the sign tower.
// `active` is the index of the station currently in view (-1 = the start, above the chapters),
// `progress` is 0..1 down the page, and `lit` is a station a visitor is pointing at on the line.

const active = ref(-1)
const progress = ref(0)
const lit = ref<string | null>(null)

let listening = false
let queued = false

function measure() {
  queued = false
  const line = window.scrollY + window.innerHeight * 0.45
  let current = -1
  stations.forEach((station, index) => {
    const el = document.getElementById(station.id)
    if (el && el.offsetTop <= line) current = index
  })
  const max = document.documentElement.scrollHeight - window.innerHeight
  progress.value = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
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
