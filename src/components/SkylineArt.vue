<script setup lang="ts">
// The decorative night skyline behind the hero.

type Block = { x: number; w: number; top: number }
type Win = { x: number; y: number; warm: boolean }

// Deterministic randomness so the windows are the same on every load.
function seeded(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const far: Block[] = [
  { x: 0, w: 110, top: 300 }, { x: 105, w: 80, top: 210 }, { x: 180, w: 130, top: 320 },
  { x: 300, w: 95, top: 170 }, { x: 390, w: 120, top: 260 }, { x: 505, w: 90, top: 330 },
  { x: 590, w: 110, top: 230 }, { x: 695, w: 140, top: 290 }, { x: 830, w: 100, top: 200 },
  { x: 925, w: 120, top: 310 }, { x: 1040, w: 90, top: 250 }, { x: 1125, w: 60, top: 360 },
  { x: 1300, w: 80, top: 280 }, { x: 1375, w: 65, top: 220 },
]
const mid: Block[] = [
  { x: 30, w: 150, top: 400 }, { x: 200, w: 110, top: 350 }, { x: 330, w: 170, top: 430 },
  { x: 520, w: 120, top: 380 }, { x: 870, w: 160, top: 390 }, { x: 1050, w: 190, top: 440 },
  { x: 1250, w: 120, top: 410 }, { x: 1360, w: 100, top: 370 },
]

function windows(blocks: Block[], chance: number, seed: number): Win[] {
  const rand = seeded(seed)
  const out: Win[] = []
  for (const b of blocks) {
    for (let y = b.top + 12; y < 630; y += 13) {
      for (let x = b.x + 7; x < b.x + b.w - 9; x += 11) {
        if (rand() < chance) out.push({ x, y, warm: rand() < 0.3 })
      }
    }
  }
  return out
}

const farWindows = windows(far, 0.2, 7)
const midWindows = windows(mid, 0.16, 11)

const tanks = [far[1]!, far[4]!, far[8]!, far[10]!, far[13]!].map((b) => ({ x: b.x + 14, y: b.top }))
const antennas = [far[3]!, far[6]!, far[8]!, far[12]!].map((b, i) => ({ x: b.x + b.w - 18, y: b.top, h: 34 + (i % 2) * 18 }))

const pillars = Array.from({ length: 11 }, (_, i) => 40 + i * 140)
const carWindows = Array.from({ length: 7 }, (_, i) => 12 + i * 19)
</script>

<template>
  <svg class="skyline" viewBox="0 0 1440 640" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
    <!-- Tokyo Tower, faint on the horizon -->
    <g class="landmark">
      <path d="M1176 640 L1221 340 L1228 205 L1233 70 L1237 70 L1242 205 L1249 340 L1294 640 Z" fill="#221f33" />
      <g stroke="#e8875a" stroke-opacity="0.22" stroke-width="1.2" fill="none">
        <path d="M1221 340 L1249 340 M1228 205 L1242 205" />
        <path d="M1200 480 L1272 480 M1190 560 L1282 560" />
        <path d="M1205 440 L1260 520 M1265 440 L1210 520 M1196 520 L1276 600 M1274 520 L1194 600" />
        <path d="M1223 260 L1247 330 M1247 260 L1223 330" />
      </g>
      <rect x="1214" y="330" width="42" height="12" fill="#2a2438" />
      <rect x="1224" y="198" width="22" height="9" fill="#2a2438" />
      <rect class="beacon" x="1233.5" y="64" width="3" height="6" fill="#ff4a3d" />
    </g>

    <!-- Far blocks with rooftops -->
    <g fill="var(--color-far)">
      <rect v-for="b in far" :key="`f${b.x}`" :x="b.x" :y="b.top" :width="b.w" :height="640 - b.top" />
    </g>
    <g fill="#1b2036">
      <g v-for="t in tanks" :key="`t${t.x}`">
        <rect :x="t.x" :y="t.y - 14" width="16" height="14" />
        <ellipse :cx="t.x + 8" :cy="t.y - 14" rx="8" ry="3" />
        <rect :x="t.x + 2" :y="t.y - 4" width="2" height="4" />
        <rect :x="t.x + 12" :y="t.y - 4" width="2" height="4" />
      </g>
    </g>
    <g>
      <g v-for="(a, i) in antennas" :key="`a${a.x}`">
        <rect :x="a.x" :y="a.y - a.h" width="2" :height="a.h" fill="#252b45" />
        <rect :x="a.x - 5" :y="a.y - a.h + 10" width="12" height="1.5" fill="#252b45" />
        <circle class="beacon" :style="{ animationDelay: `${i * 0.7}s` }" :cx="a.x + 1" :cy="a.y - a.h" r="2.4" fill="#ff4a3d" />
      </g>
    </g>
    <g>
      <rect
        v-for="w in farWindows"
        :key="`fw${w.x}-${w.y}`"
        :x="w.x"
        :y="w.y"
        width="5"
        height="7"
        :fill="w.warm ? '#ffd48a' : '#cfe0ff'"
        :opacity="w.warm ? 0.32 : 0.22"
      />
    </g>

    <!-- Mid blocks -->
    <g fill="var(--color-mid)">
      <rect v-for="b in mid" :key="`m${b.x}`" :x="b.x" :y="b.top" :width="b.w" :height="640 - b.top" />
    </g>
    <g>
      <rect
        v-for="w in midWindows"
        :key="`mw${w.x}-${w.y}`"
        :x="w.x"
        :y="w.y"
        width="6"
        height="8"
        :fill="w.warm ? '#ffd48a' : '#d6e6ff'"
        :opacity="w.warm ? 0.42 : 0.3"
      />
    </g>

    <!-- Elevated railway with a passing train -->
    <g class="train">
      <g v-for="c in 4" :key="`car${c}`" :transform="`translate(${(c - 1) * 156} 0)`">
        <rect x="0" y="474" width="150" height="26" rx="3" fill="#2a3150" />
        <rect v-for="x in carWindows" :key="`cw${x}`" :x="x" y="480" width="11" height="8" fill="#f1ecd2" opacity="0.55" />
        <rect x="0" y="493" width="150" height="2" fill="#7a86b0" opacity="0.5" />
      </g>
      <rect x="616" y="482" width="5" height="5" fill="#fff4d6" opacity="0.8" />
    </g>
    <g fill="#1f2540">
      <rect x="0" y="500" width="1440" height="9" />
      <rect v-for="x in pillars" :key="`p${x}`" :x="x" y="509" width="12" height="131" />
    </g>
    <rect x="0" y="499" width="1440" height="1" fill="#39415f" />
  </svg>
</template>

<style scoped>
.skyline {
  position: absolute;
  inset: auto 0 0 0;
  width: 100%;
  height: 78%;
}

/* Aircraft-warning lights: mostly dim, a brief slow pulse. Ends lit under reduced motion. */
.beacon {
  animation: beacon 3.2s steps(1, end) infinite;
}
@keyframes beacon {
  0% { opacity: 0.25; }
  80% { opacity: 1; }
  100% { opacity: 1; }
}

.train {
  animation: train-pass 30s linear 2s infinite;
  transform: translateX(-700px);
}
@keyframes train-pass {
  0% { transform: translateX(-700px); }
  45% { transform: translateX(1500px); }
  100% { transform: translateX(1500px); }
}

/* Phones: the tower covers the line except for a sliver each side, so the train would repaint
   the whole skyline to be barely seen. It waits at the platform, as under reduced motion. */
@media (max-width: 719px) {
  .train {
    animation: none;
    transform: translateX(240px);
  }
}

/* Reduced motion: the train waits at the platform instead of passing. */
@media (prefers-reduced-motion: reduce) {
  .train {
    animation: none;
    transform: translateX(240px);
  }
}
</style>
