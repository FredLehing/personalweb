<script setup lang="ts">
import { neonVar, stations } from '@/content/stations'
import { useJourney } from '@/composables/useJourney'

// The tower's one tall sign, split into one segment per chapter. Each segment is a link to its chapter.
// At load the segments switch on one by one, like signs coming on at dusk. That is pure CSS
// (380ms + 240ms per segment), so it runs on the same clock as the light each segment throws on
// the city (the hero's --lit-* in App.vue) and can't drift behind it when the main thread is busy.

const { lit } = useJourney()
</script>

<template>
  <nav class="stack" aria-label="Sections">
    <a
      v-for="(station, index) in stations"
      :key="station.id"
      class="seg"
      :class="{ lit: lit === station.id }"
      :href="`#${station.id}`"
      :style="{ '--c': neonVar(station.color), '--i': index }"
    >
      <span class="kanji" aria-hidden="true">{{ station.kanji }}</span>
      <span class="label">{{ station.label }}</span>
    </a>
  </nav>
</template>

<style scoped>
.stack {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 8px;
  border-radius: 6px;
  background: var(--color-sign-frame);
  box-shadow:
    0 0 0 1px #2a3048,
    0 30px 60px -20px rgb(0 0 0 / 0.9);
}

.seg {
  /* Unlit tube: outline only, no light. Lit: the resting ring, and the colour it throws on the
     frame and the tower wall around it. */
  --ring-off: inset 0 0 0 1.5px color-mix(in srgb, var(--c) 30%, transparent);
  --ring: inset 0 0 0 1.5px color-mix(in srgb, var(--c) 60%, transparent);
  --spill: 0 0 72px 12px color-mix(in srgb, var(--c) 24%, transparent);
  position: relative;
  display: grid;
  grid-template-columns: auto auto;
  align-items: center;
  gap: 10px;
  padding: 14px;
  border-radius: 4px;
  background: var(--color-sign);
  color: var(--c);
  text-decoration: none;
  -webkit-user-select: none;
  user-select: none;
  box-shadow: var(--ring), var(--spill);
  filter: saturate(0.8) brightness(0.88);
  /* Neon never eases: pointing at a segment flicks it to full in two steps. */
  transition:
    filter 120ms steps(2, end),
    transform 120ms var(--ease-out-expo);
}
@media (prefers-reduced-motion: no-preference) {
  .seg {
    animation: ignite 0.6s steps(1, end) calc(380ms + var(--i) * 240ms) backwards;
  }
}
@keyframes ignite {
  0% { opacity: 0.32; filter: saturate(0.35); box-shadow: var(--ring-off); }
  18% { opacity: 1; filter: saturate(0.8) brightness(0.88); box-shadow: var(--ring), var(--spill); }
  30% { opacity: 0.45; }
  48% { opacity: 1; }
  62% { opacity: 0.75; }
  100% { opacity: 1; }
}

/* Pointed at: full brightness, and more light on the building. The extra light lives on its own
   layer and only its opacity changes, so no large shadow is repainted frame by frame. */
.seg::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  box-shadow:
    inset 0 0 0 1.5px var(--c),
    0 0 40px -2px color-mix(in srgb, var(--c) 70%, transparent),
    0 0 96px 20px color-mix(in srgb, var(--c) 26%, transparent);
  opacity: 0;
  transition: opacity 120ms steps(2, end);
}
.seg:focus-visible,
.seg.lit {
  filter: none;
}
.seg:focus-visible::after,
.seg.lit::after {
  opacity: 1;
}
@media (hover: hover) and (pointer: fine) {
  .seg:hover {
    filter: none;
  }
  .seg:hover::after {
    opacity: 1;
  }
}
/* Press feedback, mostly for touch, where the segments are the main navigation. */
.seg:active {
  transform: scale(0.97);
}

.kanji {
  writing-mode: vertical-rl;
  font-family: var(--font-neon);
  font-weight: 900;
  font-size: clamp(1.5rem, 2.2vw, 2.1rem);
  letter-spacing: 0.06em;
  color: #fff;
  text-shadow:
    0 0 2px #fff,
    0 0 12px var(--c),
    0 0 26px var(--c);
}

/* A touch of white, like a tube's hot core, keeps the small label readable through the resting
   dim (pink was 4.47:1 at rest; now 5.3:1, every colour ≥ 4.5:1 lit or at rest). */
.label {
  color: color-mix(in srgb, var(--c), #fff 15%);
  writing-mode: vertical-rl;
  font-family: var(--font-neon);
  font-weight: 700;
  font-size: 12.5px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

/* Phones: the row hangs on the facade too, so it spills the same way, a little tighter. */
@media (max-width: 959px) {
  .seg {
    --spill: 0 0 56px 10px color-mix(in srgb, var(--c) 22%, transparent);
  }
  .seg::after {
    box-shadow:
      inset 0 0 0 1.5px var(--c),
      0 0 32px -2px color-mix(in srgb, var(--c) 70%, transparent),
      0 0 80px 16px color-mix(in srgb, var(--c) 24%, transparent);
  }
}

/* Phones: the tall sign turns into a row. */
@media (max-width: 959px) {
  .stack {
    flex-direction: row;
    width: 100%;
  }
  /* Kanji above, English below, like a station sign's bilingual plate. The label row sits on
     one shared baseline across segments however tall each kanji column is. */
  .seg {
    flex: 1;
    min-width: 0;
    grid-template-columns: auto;
    grid-template-rows: 1fr auto;
    justify-items: center;
    gap: 8px;
    padding: 12px 2px 10px;
  }
  .kanji {
    align-self: center;
    font-size: clamp(1.25rem, 3.4vw, 1.75rem);
  }
  .label {
    writing-mode: horizontal-tb;
    font-size: clamp(11px, 1.6vw, 13px);
    letter-spacing: 0.04em;
    white-space: nowrap;
  }
}

/* Narrow phones (tower under 340px): five horizontal labels no longer fit at 11px, so each label
   turns vertical beside its kanji, as on the desktop sign. */
@media (max-width: 435px) {
  .seg {
    grid-template-columns: auto auto;
    grid-template-rows: auto;
    justify-content: center;
    align-items: center;
    gap: 3px;
    padding: 10px 2px;
  }
  .label {
    writing-mode: vertical-rl;
    font-size: 11px;
    letter-spacing: 0.08em;
  }
}
</style>
