import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'
import { stations } from '@/content/stations'

// The facade, laid out from the live tower because its width and the sign's height follow the
// viewport. On phones and tablets the same grid fills the wall the plaque and entrance leave free,
// so a tall screen shows more building instead of a blank wall. Floors are 34px, counted from the top of the tower body (the floor lines in CSS use the
// same rhythm). Windows are upright panes on a fixed column grid: two columns in the wall either side
// of the sign, a full row below it, stopping before the street's fade. AC units hang on three floors.
// The edge light takes each segment's colour at that segment's height.
const FLOOR = 34

type Pane = { x: number; y: number; lit: '' | 'c' | 'w' }

export function useTowerFacade(els: {
  hero: Ref<HTMLElement | null>
  tower: Ref<HTMLElement | null>
  facade: Ref<HTMLElement | null>
  street: Ref<HTMLElement | null>
}) {
  const { hero, tower, facade, street } = els
  // The street reflection is as wide as the sign. The tower column is sized by the sign, so its width is the sign's.
  const signWidth = ref(0)
  const panes = ref<Pane[]>([])
  const acUnits = ref<{ x: number; y: number }[]>([])
  const edgeStyle = ref<Record<string, string>>({})

  function layoutFacade() {
    const t = tower.value
    const f = facade.value
    const h = street.value
    const sign = t?.querySelector('nav')
    if (!t || !f || !h || !sign) {
      panes.value = []
      acUnits.value = []
      edgeStyle.value = {}
      return
    }
    const top = t.getBoundingClientRect().top
    const signBox = sign.getBoundingClientRect()
    const signTop = signBox.top - top
    const signBottom = signBox.bottom - top
    const streetTop = h.getBoundingClientRect().top - top
    const W = f.offsetWidth
    const wall = (W - t.offsetWidth) / 2 // the stretch of facade either side of the sign

    // Same seeded generator every time, so the lit windows never shuffle between loads.
    let seed = 9
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647
    const side = wall >= 37 ? [11, 25] : wall >= 20 ? [Math.round((wall - 6) / 2)] : []
    const sideX = [...side, ...side.map((x) => W - x - 6)]
    // Below the sign. The desktop body (about 200px) takes one even row of about eight. A wider body
    // (phones, tablets) groups them in bays, two panes 5px apart with 20px of wall between bays, so a
    // broad facade reads as a building rather than an even field of dashes.
    let belowX: number[]
    if (W <= 260) {
      const n = Math.max(4, Math.round((W - 22) / 23))
      belowX = Array.from({ length: n }, (_, i) => Math.round(11 + (i * (W - 28)) / (n - 1)))
    } else {
      const bays = Math.floor((W - 22 + 20) / 37)
      const start = Math.round((W - (bays * 37 - 20)) / 2)
      belowX = Array.from({ length: bays }, (_, i) => [start + i * 37, start + i * 37 + 11]).flat()
    }
    const out: Pane[] = []
    for (let floor = 1; floor * FLOOR + 22 <= streetTop; floor++) {
      const y = floor * FLOOR + 11
      for (const x of y + 11 > signTop && y < signBottom ? sideX : belowX) {
        const r = rnd()
        out.push({ x, y, lit: r < 0.13 ? 'w' : r < 0.24 ? 'c' : '' })
      }
    }
    // Keep panes 6px clear of everything hung on the facade (the sign, and on phones the plaque and
    // the entrance), so no row gets squeezed into a thin gap. Desktop's side plaques sit off the body.
    const left = f.getBoundingClientRect().left
    // The entrance's canopy stands 8px proud of its box, so it gets 8px more room on top.
    const hung = [sign, hero.value?.querySelector('.kanban.sub'), hero.value?.querySelector('.act')]
      .filter((el): el is Element => !!el)
      .map((el) => ({ box: el.getBoundingClientRect(), extra: el.classList.contains('act') ? 8 : 0 }))
      .map(({ box: b, extra }) => ({
        l: b.left - left - 6 - extra,
        r: b.right - left + 6 + extra,
        t: b.top - top - 6 - extra,
        b: b.bottom - top + 6,
      }))
    panes.value = out.filter(({ x, y }) => !hung.some((o) => x + 6 > o.l && x < o.r && y + 11 > o.t && y < o.b))

    const firstBelow = Math.ceil(signBottom / FLOOR)
    acUnits.value = [
      { x: 6, y: (firstBelow + 1) * FLOOR + 8 },
      { x: W - 22, y: (firstBelow + 3) * FLOOR + 8 },
      ...(wall >= 26 ? [{ x: W - 22, y: Math.floor((signBottom - 35) / FLOOR) * FLOOR + 8 }] : []),
    ].filter((u) => u.y + 11 <= streetTop)

    const stops = ['transparent 0']
    sign.querySelectorAll('.seg').forEach((seg, i) => {
      const box = seg.getBoundingClientRect()
      const color = stations[i] ? `var(--glow-${stations[i].color})` : 'transparent'
      stops.push(`${color} ${box.top - top + 12}px ${box.bottom - top - 12}px`)
    })
    stops.push(`transparent ${signBottom + 115}px`)
    edgeStyle.value = {
      '--edge-grad': `linear-gradient(${stops.join(', ')})`,
      '--edge-h': `${signBottom + 115}px`,
    }
  }

  let observer: ResizeObserver | undefined
  onMounted(() => {
    if (!tower.value || !hero.value) return
    observer = new ResizeObserver((entries) => {
      for (const entry of entries) if (entry.target === tower.value) signWidth.value = entry.contentRect.width
      layoutFacade()
    })
    observer.observe(tower.value)
    observer.observe(hero.value)
  })
  onBeforeUnmount(() => observer?.disconnect())

  return { signWidth, panes, acUnits, edgeStyle }
}
