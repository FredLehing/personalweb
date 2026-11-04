<script setup lang="ts">
import { computed } from 'vue'
import { stations } from '@/content/stations'
import { useJourney } from '@/composables/useJourney'

// The Fred Line: a route map to Kyoto that doubles as scroll progress and section navigation.
// Fixed down the left edge on wide screens, a bar along the bottom on phones.

const { active, progress, lit } = useJourney()

const stops = computed(() => [
  { id: 'top', label: 'Start', station: null as string | null },
  ...stations.map((s) => ({ id: s.id, label: s.label, station: s.id as string | null })),
])

// Index into `stops` (0 = Start).
const here = computed(() => active.value + 1)

// Pointing at a stop lights its sign on the tower: a mouse resting on it, or keyboard focus.
// A tap fires the same enter and focus events but never the leave or blur, so touch would leave
// the segment lit after the tap; touch and plain-click focus are ignored.
const point = (station: string | null) => {
  lit.value = station
}
const onPointerEnter = (e: PointerEvent, station: string | null) => {
  if (e.pointerType === 'mouse') point(station)
}
const onFocus = (e: FocusEvent, station: string | null) => {
  if ((e.target as Element).matches(':focus-visible')) point(station)
}
</script>

<template>
  <nav class="line" aria-label="Route through the page">
    <p class="name" aria-hidden="true"><b>Fred Line</b> · 京都行</p>

    <div class="track" :style="{ '--p': progress }">
      <div class="rail" />
      <div class="fill" />
      <ol class="stops">
        <li v-for="(stop, index) in stops" :key="stop.id">
          <a
            class="stop"
            :class="{ past: index < here, here: index === here }"
            :href="`#${stop.id}`"
            :aria-current="index === here ? 'location' : undefined"
            @pointerenter="onPointerEnter($event, stop.station)"
            @pointerleave="point(null)"
            @focus="onFocus($event, stop.station)"
            @blur="point(null)"
          >
            <i aria-hidden="true" />
            <span class="lbl">{{ stop.label }}</span>
          </a>
        </li>
      </ol>
    </div>

    <p class="end"><span lang="ja">終点</span><b>Kyoto</b></p>
  </nav>
</template>

<style scoped>
.line {
  position: fixed;
  z-index: 20;
  left: 0;
  top: 0;
  bottom: 0;
  width: var(--rail);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 28px 0;
  background: rgb(11 14 26 / 0.92);
  border-right: 1px solid var(--color-rule);
}

.name {
  writing-mode: vertical-rl;
  font-family: var(--font-neon);
  font-weight: 900;
  font-size: 13px;
  letter-spacing: 0.14em;
  color: var(--color-muted);
}
.name b {
  color: var(--color-action);
}

.track {
  position: relative;
  flex: 1;
  width: 100%;
  margin: 24px 0;
}

.rail,
.fill {
  position: absolute;
  left: 50%;
  top: 8px;
  bottom: 8px;
  width: 6px;
  margin-left: -3px;
  border-radius: 3px;
}
.rail {
  background: #262c3d;
}
.fill {
  background: var(--color-action);
  transform-origin: top;
  transform: scaleY(var(--p, 0));
}

.stops {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
}

.stop {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  color: inherit;
  text-decoration: none;
}
.stop i {
  display: block;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--color-night);
  box-shadow: inset 0 0 0 3px var(--color-stop);
  transition:
    box-shadow 0.3s var(--ease-out-expo),
    background 0.3s var(--ease-out-expo);
}
.stop.past i {
  box-shadow: inset 0 0 0 3px var(--color-action);
}
.stop.here i {
  background: var(--color-action);
  box-shadow: 0 0 0 5px rgb(255 181 71 / 0.22);
}

.lbl {
  position: absolute;
  left: calc(50% + 16px);
  writing-mode: vertical-rl;
  font-family: var(--font-neon);
  font-weight: 700;
  font-size: 13px;
  white-space: nowrap;
  color: var(--color-ink);
  opacity: 0;
  transition: opacity 0.3s var(--ease-out-expo);
}
.stop.here .lbl,
.stop:focus-visible .lbl {
  opacity: 1;
}
@media (hover: hover) and (pointer: fine) {
  .stop:hover .lbl {
    opacity: 1;
  }
}

.end {
  font-family: var(--font-neon);
  font-weight: 700;
  font-size: 12px;
  line-height: 1.4;
  text-align: center;
  color: var(--color-muted);
}
.end b {
  display: block;
  font-size: 15px;
  color: var(--color-ink);
}

/* Phones: the line runs along the bottom of the screen. */
@media (max-width: 959px) {
  .line {
    top: auto;
    right: 0;
    width: auto;
    height: var(--line-bar);
    flex-direction: row;
    /* --line-bar includes the home-indicator inset; the stops sit above it. */
    padding: 0 max(16px, env(safe-area-inset-right, 0px)) env(safe-area-inset-bottom, 0px)
      max(16px, env(safe-area-inset-left, 0px));
    border-right: 0;
    border-top: 1px solid var(--color-rule);
    /* Near-opaque instead of a backdrop blur: nothing to blur, nothing to repaint on scroll. */
    background: rgb(11 14 26 / 0.97);
  }
  /* The dots stay 18px, but each stop takes a 44px tap. */
  .stop::after {
    content: '';
    position: absolute;
    inset: -9px;
  }
  .name {
    display: none;
  }
  /* Terminus sits at the end of the bar, like the last stop on a route sign. */
  .end {
    flex: none;
    margin-left: 14px;
    font-size: 11px;
    line-height: 1.2;
  }
  .end b {
    font-size: 13px;
  }
  .track {
    height: 100%;
    margin: 0;
  }
  .rail,
  .fill {
    top: 50%;
    bottom: auto;
    left: 8px;
    right: 8px;
    width: auto;
    height: 6px;
    margin: -3px 0 0;
  }
  .fill {
    transform-origin: left;
    transform: scaleX(var(--p, 0));
  }
  .stops {
    flex-direction: row;
  }
  /* Only the current stop's name shows, under its dot; the rest stay readable to screen readers. */
  .lbl {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    opacity: 1;
  }
  .stop.here .lbl {
    width: auto;
    height: auto;
    overflow: visible;
    clip-path: none;
    left: 50%;
    top: calc(50% + 12px);
    transform: translateX(-50%);
    writing-mode: horizontal-tb;
    font-size: 11px;
    /* The name arrives with its stop instead of jumping there. `translate` leaves the centring
       transform alone. */
    animation: lbl-in 180ms var(--ease-out-expo);
  }
  .stops li:first-child .stop.here .lbl {
    left: 0;
    transform: none;
  }
  .stops li:last-child .stop.here .lbl {
    left: auto;
    right: 0;
    transform: none;
  }
}
@keyframes lbl-in {
  from {
    opacity: 0;
    translate: 0 2px;
  }
}
</style>
