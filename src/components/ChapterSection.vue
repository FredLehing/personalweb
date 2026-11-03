<script setup lang="ts">
import { neonVar, type Station } from '@/content/stations'

// One stop on the Fred Line. The heading is a station nameboard: kanji and English name
// at the same scale over a band in the line colour.
defineProps<{ station: Station }>()
</script>

<template>
  <section :id="station.id" class="chapter" :style="{ '--c': neonVar(station.color) }" :aria-labelledby="`${station.id}-title`">
    <div class="inner">
      <div class="board">
        <h2 :id="`${station.id}-title`">
          <span class="kanji" lang="ja">{{ station.chapterKanji ?? station.kanji }}</span>
          <span class="name">{{ station.title }}</span>
        </h2>
        <div class="band" aria-hidden="true" />
      </div>
      <div class="body">
        <slot />
      </div>
    </div>
  </section>
</template>

<style scoped>
.chapter {
  border-top: 1px solid var(--color-rule);
  padding: clamp(72px, 10vh, 120px) var(--gutter);
}

.inner {
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
  gap: clamp(24px, 5vw, 80px);
}

.board {
  align-self: start;
}

h2 {
  font-family: var(--font-neon);
  font-weight: 900;
  font-size: clamp(2rem, 3vw, 2.75rem);
  letter-spacing: -0.02em;
  line-height: 1.08;
  text-wrap: balance;
}
.kanji {
  display: block;
  color: var(--c);
  letter-spacing: 0.02em;
}
.name {
  display: block;
  color: var(--color-ink);
}

.band {
  height: 6px;
  margin-top: 18px;
  border-radius: 3px;
  background: var(--c);
}

.body {
  font-size: clamp(1.125rem, 1.35vw, 1.3rem);
  line-height: 1.6;
  color: var(--color-muted);
  max-width: 62ch;
}
.body :deep(p + p) {
  margin-top: 1em;
}
.body :deep(strong) {
  color: var(--color-ink);
  font-weight: 600;
}
.body :deep(.ph) {
  color: var(--color-faint);
  font-style: italic;
}
.body :deep(.note) {
  display: block;
  margin-top: 18px;
  font-size: 13px;
  font-style: normal;
  color: var(--color-faint);
}

@media (max-width: 959px) {
  .inner {
    grid-template-columns: minmax(0, 1fr);
  }
  .board {
    max-width: 420px;
  }
}
</style>
