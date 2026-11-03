<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { neonVar, stations } from '@/content/stations'
import { useJourney } from '@/composables/useJourney'
import { useReducedMotion } from '@/composables/useReducedMotion'

// The tower's one tall sign, split into one segment per chapter. Each segment is a link to its chapter.
// At load the segments switch on one by one, like signs coming on at dusk.

const { lit } = useJourney()
const reduced = useReducedMotion()
const switchedOn = ref<boolean[]>(stations.map(() => false))

onMounted(() => {
  if (reduced.value) {
    switchedOn.value = stations.map(() => true)
    return
  }
  stations.forEach((_, index) => {
    window.setTimeout(() => {
      switchedOn.value[index] = true
    }, 380 + index * 240)
  })
})
</script>

<template>
  <nav class="stack" aria-label="Sections">
    <a
      v-for="(station, index) in stations"
      :key="station.id"
      class="seg"
      :class="{ on: switchedOn[index], lit: lit === station.id }"
      :href="`#${station.id}`"
      :style="{ '--c': neonVar(station.color) }"
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
  display: grid;
  grid-template-columns: auto auto;
  align-items: center;
  gap: 10px;
  padding: 14px;
  border-radius: 4px;
  background: var(--color-sign);
  color: var(--c);
  text-decoration: none;
  /* Unlit tube: outline only, no light. */
  box-shadow: inset 0 0 0 1.5px color-mix(in srgb, var(--c) 30%, transparent);
  opacity: 0.32;
  filter: saturate(0.35);
  transition:
    filter 0.45s var(--ease-out-expo),
    box-shadow 0.45s var(--ease-out-expo);
}

/* Switched on: resting neon. */
.seg.on {
  opacity: 1;
  filter: saturate(0.8) brightness(0.88);
  box-shadow: inset 0 0 0 1.5px color-mix(in srgb, var(--c) 60%, transparent);
  animation: ignite 0.6s steps(1, end);
}

/* Pointed at: full brightness. */
.seg.on:hover,
.seg.on:focus-visible,
.seg.on.lit {
  filter: none;
  box-shadow:
    inset 0 0 0 1.5px var(--c),
    0 0 40px -2px color-mix(in srgb, var(--c) 70%, transparent);
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

@keyframes ignite {
  0% { opacity: 0.32; }
  18% { opacity: 1; }
  30% { opacity: 0.45; }
  48% { opacity: 1; }
  62% { opacity: 0.75; }
  100% { opacity: 1; }
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
    font-size: 1.25rem;
  }
  .label {
    writing-mode: horizontal-tb;
    font-size: 10.5px;
    letter-spacing: 0.06em;
    white-space: nowrap;
  }
}
</style>
