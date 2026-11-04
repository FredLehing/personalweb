<script setup lang="ts">
import { ref } from 'vue'
import { isPlaceholder, profile } from '@/content/profile'
import { stations } from '@/content/stations'
import { useTowerFacade } from '@/composables/useTowerFacade'
import SignTower from '@/components/SignTower.vue'
import SkylineArt from '@/components/SkylineArt.vue'
import ActionLinks from '@/components/ActionLinks.vue'

// The hero: the night skyline, the sign tower with the name and intro plaques on its left, the
// actions plaque on its right, and the wet street at its foot. On phones it rebuilds into a single
// building (see the phone section of the styles).

const hero = ref<HTMLElement | null>(null)
const tower = ref<HTMLElement | null>(null)
const facade = ref<HTMLElement | null>(null)
const street = ref<HTMLElement | null>(null)
const { signWidth, panes, acUnits, edgeStyle } = useTowerFacade({ hero, tower, facade, street })

// The roof's top floor: 0 dark, 1 cool, 2 warm.
const crownWindows = '1020012'

// Confirmed stack only; placeholders like "[from CV]" never reach the hero.
const stackLine = Object.values(profile.stack)
  .flat()
  .filter((t) => !isPlaceholder(t))
  .join(' · ')
</script>

<template>
  <header id="top" ref="hero" class="hero">
    <SkylineArt />

    <div class="hero-grid">
      <div class="board">
        <!-- The name sign is side-mounted to the tower wall by two steel brackets. -->
        <div class="kanban name-sign">
          <span class="kb-deco kb-mount top" aria-hidden="true" />
          <span class="kb-deco kb-mount bot" aria-hidden="true" />
          <!-- Phones: the name is the rooftop sign, with the mast and aircraft light on top. -->
          <span class="ph-deco ph-mast" aria-hidden="true" />
          <span class="ph-deco ph-beacon" aria-hidden="true" />
          <h1><span class="name-line">Fred</span> <span class="name-line">Lehing</span></h1>
        </div>
        <!-- The role and stack hang on a plain plaque from the bottom of the name sign. A label, not
             a paragraph: the About chapter carries the longer introduction. -->
        <div class="kanban plaque sub">
          <span class="kb-deco kb-hang l" aria-hidden="true" />
          <span class="kb-deco kb-hang r" aria-hidden="true" />
          <p class="intro"><strong>Full-stack developer</strong></p>
          <p v-if="stackLine" class="stack-line">{{ stackLine }}</p>
        </div>
      </div>

      <div ref="tower" class="tower" :style="edgeStyle">
        <!-- Building detail: a stepped crown with the mast and aircraft light on top and two
             condensers on the roof, floor lines and a grid of windows down the facade, AC units,
             the sign's transformer box with its conduit, the name's cyan on the wall beside it, and
             the sign's colours running down both corners. The sign is bolted flat to the facade.
             All dimmer than the sign. -->
        <div class="tw-deco tw-roof" aria-hidden="true">
          <div class="tw-tier t1">
            <div class="tw-crown-wins">
              <span v-for="(w, i) in crownWindows" :key="i" :class="{ cool: w === '1', warm: w === '2' }" />
            </div>
            <div class="tw-tier t2">
              <span class="tw-mast" />
              <span class="tw-beacon" />
            </div>
          </div>
          <span class="tw-condenser l" />
          <span class="tw-condenser r" />
        </div>
        <div ref="facade" class="tw-deco tw-facade" aria-hidden="true">
          <span
            v-for="(p, i) in panes"
            :key="`p${i}`"
            class="tw-pane"
            :class="p.lit"
            :style="{ left: `${p.x}px`, top: `${p.y}px` }"
          />
          <span v-for="(u, i) in acUnits" :key="`ac${i}`" class="tw-ac" :style="{ left: `${u.x}px`, top: `${u.y}px` }" />
        </div>
        <span class="tw-deco tw-edge l halo" aria-hidden="true" />
        <span class="tw-deco tw-edge r halo" aria-hidden="true" />
        <span class="tw-deco tw-edge l" aria-hidden="true" />
        <span class="tw-deco tw-edge r" aria-hidden="true" />
        <span class="tw-deco tw-spill" aria-hidden="true" />
        <span class="tw-deco tw-ballast" aria-hidden="true" />
        <span class="tw-deco tw-conduit" aria-hidden="true" />
        <SignTower />
        <span class="tw-deco tw-bolts" aria-hidden="true" />
      </div>

      <div class="act">
        <!-- The actions sit on a plain, unlit plaque, side-mounted to the tower the same way. -->
        <div class="kanban plaque">
          <span class="kb-deco kb-mount top" aria-hidden="true" />
          <span class="kb-deco kb-mount bot" aria-hidden="true" />
          <ActionLinks layout="stack" />
          <p class="status">{{ profile.status }} · {{ profile.availability }}</p>
        </div>
      </div>
    </div>

    <!-- Wet street at the foot of the skyline. Only signs close to the ground throw their colour
         onto it: on desktop the segments stack, so the two lowest (Contact, then Dream) reflect; on phones
         they hang side by side at one height, so all five do. -->
    <div ref="street" class="street" aria-hidden="true">
      <div class="street-grid">
        <div class="refl" :style="{ width: signWidth ? `${signWidth}px` : undefined }">
          <span v-for="s in stations" :key="s.id" :style="{ '--c': `var(--glow-${s.color})` }" />
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
/* ───────── hero: the night skyline with the sign tower ───────── */
/* How lit each sign is, 0 (off) to 1 (on). At load these flicker on in step with the signs
   themselves (the name at 120ms, then each segment at 380ms + 240ms, same stepped curve), and every
   bit of light a sign throws on the city takes its colour through --glow-*: the edge light, the
   washes on the side signs, the name's cyan on its face and the wall, and the street reflection.
   So the building lights up with its signs instead of glowing before they come on. */
@property --lit-name {
  syntax: '<number>';
  inherits: true;
  initial-value: 1;
}
@property --lit-about {
  syntax: '<number>';
  inherits: true;
  initial-value: 1;
}
@property --lit-work {
  syntax: '<number>';
  inherits: true;
  initial-value: 1;
}
@property --lit-projects {
  syntax: '<number>';
  inherits: true;
  initial-value: 1;
}
@property --lit-dream {
  syntax: '<number>';
  inherits: true;
  initial-value: 1;
}
@property --lit-contact {
  syntax: '<number>';
  inherits: true;
  initial-value: 1;
}
.hero {
  --glow-cyan: color-mix(in srgb, var(--color-neon-cyan) calc(var(--lit-name) * 100%), transparent);
  --glow-pink: color-mix(in srgb, var(--color-neon-pink) calc(var(--lit-about) * 100%), transparent);
  --glow-amber: color-mix(in srgb, var(--color-neon-amber) calc(var(--lit-work) * 100%), transparent);
  --glow-vermilion: color-mix(in srgb, var(--color-neon-vermilion) calc(var(--lit-projects) * 100%), transparent);
  --glow-violet: color-mix(in srgb, var(--color-neon-violet) calc(var(--lit-dream) * 100%), transparent);
  --glow-lime: color-mix(in srgb, var(--color-neon-lime) calc(var(--lit-contact) * 100%), transparent);
}
@media (prefers-reduced-motion: no-preference) {
  .hero {
    animation:
      lit-name 0.6s steps(1, end) 120ms backwards,
      lit-about 0.6s steps(1, end) 380ms backwards,
      lit-work 0.6s steps(1, end) 620ms backwards,
      lit-projects 0.6s steps(1, end) 860ms backwards,
      lit-dream 0.6s steps(1, end) 1100ms backwards,
      lit-contact 0.6s steps(1, end) 1340ms backwards;
  }
}
/* The signs' ignite curve, from dark (no light thrown) rather than from the unlit tube's dim. */
@keyframes lit-name { 0% { --lit-name: 0; } 18% { --lit-name: 1; } 30% { --lit-name: 0.45; } 48% { --lit-name: 1; } 62% { --lit-name: 0.75; } 100% { --lit-name: 1; } }
@keyframes lit-about { 0% { --lit-about: 0; } 18% { --lit-about: 1; } 30% { --lit-about: 0.45; } 48% { --lit-about: 1; } 62% { --lit-about: 0.75; } 100% { --lit-about: 1; } }
@keyframes lit-work { 0% { --lit-work: 0; } 18% { --lit-work: 1; } 30% { --lit-work: 0.45; } 48% { --lit-work: 1; } 62% { --lit-work: 0.75; } 100% { --lit-work: 1; } }
@keyframes lit-projects { 0% { --lit-projects: 0; } 18% { --lit-projects: 1; } 30% { --lit-projects: 0.45; } 48% { --lit-projects: 1; } 62% { --lit-projects: 0.75; } 100% { --lit-projects: 1; } }
@keyframes lit-dream { 0% { --lit-dream: 0; } 18% { --lit-dream: 1; } 30% { --lit-dream: 0.45; } 48% { --lit-dream: 1; } 62% { --lit-dream: 0.75; } 100% { --lit-dream: 1; } }
@keyframes lit-contact { 0% { --lit-contact: 0; } 18% { --lit-contact: 1; } 30% { --lit-contact: 0.45; } 48% { --lit-contact: 1; } 62% { --lit-contact: 0.75; } 100% { --lit-contact: 1; } }
.hero {
  position: relative;
  overflow: hidden;
  min-height: max(700px, 100vh);
  background: linear-gradient(var(--color-sky), var(--color-night) 75%);
  /* Shared by the hero grid and the street, so the reflection always sits under the tower. */
  --hero-gap: clamp(20px, 4vw, 64px);
  --tower-overhang: clamp(12px, calc(var(--hero-gap) - 18px), 48px);
  --hero-columns: minmax(0, 1.25fr) auto minmax(0, 1fr);
}

.hero-grid {
  position: relative;
  z-index: 3;
  max-width: 1300px;
  min-height: max(700px, 100vh);
  margin: 0 auto;
  padding: 0 var(--gutter) 56px;
  display: grid;
  /* The name side carries two signs; the actions plaque only needs room for 120px buttons. */
  grid-template-columns: var(--hero-columns);
  /* The tower body reaches past the sign into this gap, but always stops short of the name
     and the actions: whatever is left of the gap after the overhang is their breathing room. */
  gap: var(--hero-gap);
  align-items: center;
}

/* Above the tower body, so even a rounding pixel of overlap never hides text behind it. */
.board,
.act {
  position: relative;
  z-index: 1;
}
.board {
  justify-self: end;
  text-align: right;
}

/* Sits in front of the tower base and the skyline so the reflections show; its top fades in,
   so buildings meet the street without a hard edge. */
.street {
  position: absolute;
  z-index: 4;
  left: 0;
  right: 0;
  bottom: 0;
  height: 88px;
  padding-top: 30px;
  background: linear-gradient(rgb(11 14 26 / 0), var(--color-night) 34px, #0d1121);
  pointer-events: none;
}
/* Same columns as the hero grid; the middle one is exactly the sign's width. */
.street-grid {
  max-width: 1300px;
  height: 100%;
  margin: 0 auto;
  padding: 0 var(--gutter);
  display: grid;
  grid-template-columns: var(--hero-columns);
  gap: var(--hero-gap);
}
.refl {
  grid-column: 2;
  display: flex;
  /* Desktop mirrors the sign's foot: the lowest segment nearest the kerb, the next one below it. */
  flex-direction: column-reverse;
  gap: 0;
  width: 100px;
  height: 100%;
}
.refl span {
  flex: 1;
  background: linear-gradient(var(--c), transparent 85%);
  opacity: 0.32;
  filter: blur(6px);
}
/* Desktop: the two lowest segments are near the ground. Contact (lime) is the strong band at the
   kerb; Dream (violet), one sign higher, throws a shorter, fainter band further out. */
.refl span:not(:nth-last-child(-n + 2)) {
  display: none;
}
.refl span:last-child {
  flex: 1.5;
}
/* The two bands overlap by 8px and add their light (screen), so lime's tail runs into the violet
   and the violet's head rises into the lime instead of meeting at a line. */
.refl span:nth-last-child(2) {
  margin-top: -10px;
  opacity: 0.22;
}
.refl span:nth-last-child(-n + 2) {
  mix-blend-mode: screen;
}

h1 {
  font-family: var(--font-neon);
  font-weight: 900;
  font-size: clamp(3rem, 6vw, 6rem);
  line-height: 0.92;
  letter-spacing: -0.035em;
  color: #fff;
  text-shadow:
    0 0 1px #fff,
    0 0 20px rgb(63 224 232 / 0.5),
    0 0 60px rgb(63 224 232 / 0.3);
}
/* The name's lines sit closer than a selection box is tall; the site-wide amber relight
   (style.css) has no box, so "Lehing" never covers "Fred" when selected. */
.name-line {
  display: block;
}
/* At load each line of the name switches on like the signs: a dim unlit tube, then a stepped
   flicker. "Fred" first, then "Lehing", then the sign segments (380ms + 240ms each) carry on
   the sequence. Reduced motion: the name is simply on. */
@media (prefers-reduced-motion: no-preference) {
  .name-line {
    animation: name-ignite 0.6s steps(1, end) 120ms backwards;
  }
  .name-line + .name-line {
    animation-delay: 260ms;
  }
}
@keyframes name-ignite {
  0% { opacity: 0.18; }
  18% { opacity: 1; }
  30% { opacity: 0.45; }
  48% { opacity: 1; }
  62% { opacity: 0.75; }
  100% { opacity: 1; }
}
.intro {
  margin: 18px 0 0 auto;
  max-width: 34ch;
  text-wrap: pretty;
  font-size: clamp(1.05rem, 1.3vw, 1.25rem);
  line-height: 1.55;
  color: var(--color-muted);
}
.intro strong {
  display: block;
  text-wrap: balance;
  color: var(--color-ink);
  font-weight: 600;
}

.tower {
  /* Wall between the roof and the top of the sign: room for the transformer box and conduit. */
  --sign-top: 40px;
  position: relative;
  display: flex;
  justify-content: center;
  padding-top: var(--sign-top);
}
/* The tower's dark body, running down from behind the sign to the street. Sized from the sign
   (this column is exactly as wide as the sign) plus an overhang that fits inside the hero gap. */
.tower::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: -100vh;
  left: 50%;
  width: calc(100% + 2 * var(--tower-overhang));
  transform: translateX(-50%);
  background: var(--color-tower);
  box-shadow: inset 0 0 0 1px #20263d;
}

/* Building detail on the tower. Same materials as the skyline (mast steel, #ff4a3d aircraft
   light with its slow stepped blink, windows at skyline opacity), so the sign stays brightest. */
.tw-roof {
  position: absolute;
  top: -12px;
  left: calc(-1 * var(--tower-overhang) + 10px);
  right: calc(-1 * var(--tower-overhang) + 10px);
  height: 12px;
  background: var(--color-tower);
  box-shadow: inset 0 0 0 1px #20263d;
}
.tw-mast {
  position: absolute;
  left: 50%;
  bottom: 100%;
  width: 2px;
  height: 38px;
  transform: translateX(-50%);
  background: #252b45;
}
.tw-mast::before {
  content: '';
  position: absolute;
  top: 10px;
  left: -5px;
  width: 12px;
  height: 1.5px;
  background: #252b45;
}
.tw-beacon {
  position: absolute;
  left: 50%;
  bottom: calc(100% + 36px);
  width: 5px;
  height: 5px;
  border-radius: 50%;
  transform: translateX(-50%);
  background: #ff4a3d;
  animation: tw-beacon 3.2s steps(1, end) infinite;
}
@keyframes tw-beacon {
  0% { opacity: 0.25; }
  80% { opacity: 1; }
  100% { opacity: 1; }
}
/* The sign is bolted flat to the facade: one bolt head in each corner of its frame. */
.tw-bolts {
  position: absolute;
  inset: var(--sign-top) 0 0;
  pointer-events: none;
  --bolt: radial-gradient(circle, #4a5373 0 1.1px, #2a3150 1.5px 2.3px, transparent 2.7px);
  background:
    var(--bolt) 1px 1px / 8px 8px no-repeat,
    var(--bolt) calc(100% - 1px) 1px / 8px 8px no-repeat,
    var(--bolt) 1px calc(100% - 1px) / 8px 8px no-repeat,
    var(--bolt) calc(100% - 1px) calc(100% - 1px) / 8px 8px no-repeat;
}
/* The neon's transformer box under the roof, feeding the sign through a short conduit. */
.tw-ballast {
  position: absolute;
  top: 7px;
  right: 8px;
  width: 26px;
  height: 14px;
  border-radius: 1px;
  background:
    repeating-linear-gradient(90deg, transparent 0 4px, #1a1f33 4px 5px) 5px 4px / 16px 6px no-repeat,
    #20263d;
  box-shadow:
    inset 0 1px 0 #39415f,
    0 0 0 1px #151a2c;
}
.tw-conduit {
  position: absolute;
  top: 21px;
  right: 20px;
  width: 3px;
  height: calc(var(--sign-top) - 21px);
  background: #252b45;
  box-shadow: inset 1px 0 0 #39415f;
}
/* The name sign's cyan falling on the stretch of wall that faces it. */
.tw-spill {
  position: absolute;
  top: calc(50% - 220px);
  left: calc(-1 * var(--tower-overhang));
  width: calc(var(--tower-overhang) + 16px);
  height: 230px;
  background: radial-gradient(
    ellipse 100% 50% at 0% 50%,
    color-mix(in srgb, var(--glow-cyan) 13%, transparent),
    transparent 75%
  );
}
/* Stepped crown: two setback floors on the roof, the mast and aircraft light on the top one. */
.tw-tier {
  position: absolute;
  bottom: 100%;
  background: var(--color-tower);
  box-shadow: inset 0 0 0 1px #20263d;
}
.tw-tier.t1 {
  left: 16px;
  right: 16px;
  height: 24px;
}
.tw-tier.t2 {
  left: 50%;
  width: max(calc(100% - 64px), 36px);
  height: 20px;
  transform: translateX(-50%);
}
/* The lower setback's row of windows: upright panes, dark glass unless lit. */
.tw-crown-wins {
  position: absolute;
  left: 12px;
  right: 12px;
  top: 8px;
  height: 9px;
  display: flex;
  justify-content: center;
  gap: 13px;
  overflow: hidden;
}
.tw-crown-wins span {
  flex: none;
  width: 5px;
  height: 9px;
  background: #151a2c;
}
.tw-crown-wins .cool {
  background: rgb(207 224 255 / 0.2);
}
.tw-crown-wins .warm {
  background: rgb(255 212 138 / 0.34);
}
/* Condenser units standing on the main roof, either side of the crown. */
.tw-condenser {
  position: absolute;
  bottom: 100%;
  width: 20px;
  height: 9px;
  border-radius: 1px;
  background:
    repeating-linear-gradient(90deg, #1a1f33 0 2px, #262c45 2px 4px) 3px 3px / 14px 3px no-repeat,
    #20263d;
  box-shadow:
    inset 0 1px 0 #39415f,
    0 0 0 1px #151a2c;
}
.tw-condenser.l { left: 6px; }
.tw-condenser.r { right: 10px; }

/* The facade grid, as wide as the tower body; panes and AC units are placed by layoutFacade(). */
.tw-facade {
  position: absolute;
  top: 0;
  left: calc(-1 * var(--tower-overhang));
  width: calc(100% + 2 * var(--tower-overhang));
  height: 0;
}
.tw-pane {
  position: absolute;
  width: 6px;
  height: 11px;
  background: #151a2c;
}
.tw-pane.c {
  background: #cfe0ff;
  opacity: 0.22;
}
.tw-pane.w {
  background: #ffd48a;
  opacity: 0.34;
}
.tw-ac {
  position: absolute;
  width: 16px;
  height: 11px;
  border-radius: 1px;
  background:
    repeating-linear-gradient(90deg, #1a1f33 0 2px, #262c45 2px 4px) 3px 3px / 10px 5px no-repeat,
    #20263d;
  box-shadow:
    inset 0 1px 0 #39415f,
    0 0 0 1px #151a2c;
}

/* Edge light: a 2px line on each corner of the tower, in each segment's colour at that segment's
   height, blending between them and fading out above and below the sign, with a soft halo. */
.tw-edge {
  position: absolute;
  top: 0;
  width: 2px;
  height: var(--edge-h, 0);
  background: var(--edge-grad, none);
  opacity: 0.55;
  pointer-events: none;
}
.tw-edge.l { left: calc(-1 * var(--tower-overhang) - 1px); }
.tw-edge.r { right: calc(-1 * var(--tower-overhang)); }
.tw-edge.halo {
  width: 8px;
  opacity: 0.28;
  filter: blur(4px);
}
.tw-edge.l.halo { left: calc(-1 * var(--tower-overhang) - 4px); }
.tw-edge.r.halo { right: calc(-1 * var(--tower-overhang) - 3px); }

/* Floor lines on the tower body: a 1px lip over a 1px shadow line every 34px, quieter than the windows. */
.tower::before {
  background:
    repeating-linear-gradient(transparent 0 32px, #1b2137 32px 33px, #0b0e19 33px 34px),
    var(--color-tower);
}

@media (prefers-reduced-motion: reduce) {
  .tw-beacon {
    animation: none;
  }
}

.act {
  justify-self: start;
}

/* Signs (kanban) side-mounted to the tower walls by short steel brackets, in the same steel as
   the tower's own brackets, so the city reads as one material. The name's face is dark: it holds
   the neon name, it isn't a lightbox, and the plaques are plainer still, so the tower stays the
   landmark. */
.kanban {
  /* How far a bracket reaches to the tower wall: whatever the overhang leaves of the gap. */
  --reach: calc(var(--hero-gap) - var(--tower-overhang));
  --rim: 4px;
  position: relative;
  padding: 18px 26px 22px;
  border: var(--rim) solid #151a2c;
  border-radius: 22px;
  background: var(--color-sign);
  box-shadow:
    0 0 0 1px #252b45,
    inset 0 0 0 1px #2a3048;
}
.board .kanban {
  text-align: center;
}
.kanban.plaque {
  --rim: 3px;
  padding: 20px;
  border-radius: 6px;
}
/* Intro plaque: hung from the name sign's bottom edge by two short rods. */
.kanban.sub {
  --drop: 16px;
  margin-top: var(--drop);
  padding: 18px clamp(14px, 1.5vw, 22px) 20px;
  text-align: left;
}
.sub .intro {
  margin: 0;
}
.stack-line {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--color-rule);
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: var(--color-faint);
}
/* Narrow desktops squeeze the column, so the intro gets slightly smaller instead of wrapping on. */
@media (min-width: 960px) {
  .sub .intro {
    font-size: clamp(0.95rem, 1.3vw, 1.25rem);
  }
}
.kb-hang {
  position: absolute;
  top: calc(-1 * (var(--rim) + var(--drop)));
  width: 2px;
  height: calc(var(--drop) + var(--rim));
  background: #252b45;
}
.kb-hang.l { left: 24%; }
.kb-hang.r { right: 24%; }

/* Side mounts: a bar from the sign's edge to the tower wall, with a bolt plate at each end. */
.kb-mount {
  position: absolute;
  width: var(--reach);
  height: 5px;
  background: #252b45;
  box-shadow: inset 0 1px 0 #39415f;
}
.kb-mount::before,
.kb-mount::after {
  content: '';
  position: absolute;
  top: -3px;
  width: 3px;
  height: 11px;
  background: #2a3150;
}
.kb-mount::before { left: 0; }
.kb-mount::after { right: 0; }
.kb-mount.top { top: 24px; }
.kb-mount.bot { bottom: 24px; }
/* Light from the neon. The name sign's dark face catches its own cyan behind the letters, and
   every side sign takes a faint wash, on the edge facing the tower, from the segments level
   with it (top to bottom: pink About, amber Work, vermilion Projects, violet Dream, lime Contact). Screen-blended,
   so text only gets lighter. The side-sign washes are desktop only; phones have their own
   (see the phone section). */
.name-sign {
  background: radial-gradient(
    ellipse 70% 62% at 50% 50%,
    color-mix(in srgb, var(--glow-cyan) 9%, var(--color-sign)),
    var(--color-sign) 78%
  );
  box-shadow:
    0 0 0 1px #252b45,
    inset 0 0 0 1px color-mix(in srgb, var(--glow-cyan) 22%, #2a3048);
}
@media (min-width: 960px) {
  .ph-deco {
    display: none;
  }
  .kanban::after {
    content: '';
    position: absolute;
    inset: calc(-1 * var(--rim));
    border-radius: inherit;
    pointer-events: none;
    background: var(--spill);
    opacity: 0.16;
    mix-blend-mode: screen;
    /* Light falls off fast: strongest on the rim facing the tower, gone a third of the way in. */
    -webkit-mask-image: linear-gradient(var(--spill-from), #000, rgb(0 0 0 / 0.35) 12%, transparent 36%);
    mask-image: linear-gradient(var(--spill-from), #000, rgb(0 0 0 / 0.35) 12%, transparent 36%);
  }
  .board .kanban::after {
    --spill-from: to left;
  }
  .act .kanban::after {
    --spill-from: to right;
  }
  .name-sign {
    --spill: linear-gradient(var(--glow-pink) 60%, var(--glow-amber));
  }
  .kanban.sub {
    --spill: linear-gradient(
      var(--glow-amber) 4%,
      var(--glow-vermilion) 26%,
      var(--glow-violet) 52% 64%,
      var(--glow-lime) 86%
    );
  }
  .act .plaque {
    --spill: linear-gradient(
      var(--glow-pink) 16%,
      var(--glow-amber) 36%,
      var(--glow-vermilion) 60% 72%,
      var(--glow-violet) 94%
    );
  }
}

/* Name sign: the tower is on its right. */
.board .kb-mount { right: calc(-1 * (var(--rim) + var(--reach))); }
/* Actions plaque: the tower is on its left. */
.plaque .kb-mount { left: calc(-1 * (var(--rim) + var(--reach))); }

/* The status line sets the plaque's width; the buttons fill it instead of leaving a dark gap. */
@media (min-width: 960px) {
  .act .plaque :deep(.actions.stack) {
    align-items: stretch;
  }
}

.status {
  margin-top: 20px;
  max-width: 26ch;
  font-size: 14px;
  line-height: 1.45;
  color: var(--color-muted);
}

/* ───────── phones: the tower is the whole hero ─────────
   Top to bottom: the name as a rooftop sign on steel legs, the roof, the five segments as one
   sign bolted across the facade, the intro on a plaque, and the actions at street level under a
   canopy, like the building's entrance. The street reflects all five segments. The DOM order
   stays name, intro, sign, actions; `order` rebuilds the building without moving the markup. */
@media (max-width: 959px) {
  .hero {
    min-height: 0;
  }
  .hero-grid {
    /* The tower's width: the city shows on both sides, and it stops growing on tablets. */
    --tw: min(calc(100% - 2 * clamp(32px, calc(36vw - 94px), 48px)), clamp(340px, 46vw, 400px));
    --tower-overhang: 0px;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100svh;
    padding: 56px 0 0;
    text-align: center;
  }
  .board {
    display: contents;
  }
  /* Tablets get a bigger tower (--tw), so the type grows with it; phones keep the floor sizes. */
  h1 {
    font-size: clamp(3rem, 7.4vw, 4rem);
  }

  /* Rooftop sign (屋上看板): the name, on a lattice of steel legs standing on the roof. */
  .name-sign {
    order: 1;
    width: calc(var(--tw) - 8px);
    /* 24px of legs, then the 12px roof. The hero grid's gap is taken back out here, so the legs
       stand on the roof instead of hanging over a gap. */
    margin-bottom: calc(36px - var(--hero-gap));
    padding: 14px 12px 16px;
    border-radius: 18px;
  }
  .name-sign::before {
    content: '';
    position: absolute;
    left: 18px;
    right: 18px;
    bottom: calc(-1 * (var(--rim) + 24px));
    height: 24px;
    background:
      repeating-linear-gradient(60deg, transparent 0 9px, #252b45 9px 11px),
      repeating-linear-gradient(-60deg, transparent 0 9px, #252b45 9px 11px);
    border-inline: 3px solid #252b45;
    opacity: 0.9;
  }
  .ph-mast {
    position: absolute;
    left: 50%;
    bottom: calc(100% + var(--rim));
    width: 2px;
    height: 38px;
    transform: translateX(-50%);
    background: #252b45;
  }
  .ph-mast::before {
    content: '';
    position: absolute;
    top: 10px;
    left: -5px;
    width: 12px;
    height: 1.5px;
    background: #252b45;
  }
  .ph-beacon {
    position: absolute;
    left: 50%;
    bottom: calc(100% + var(--rim) + 36px);
    width: 5px;
    height: 5px;
    border-radius: 50%;
    transform: translateX(-50%);
    background: #ff4a3d;
    animation: tw-beacon 3.2s steps(1, end) infinite;
  }

  /* The tower: roof, transformer box and the sign row, with the body running down to the street. */
  .tower {
    --sign-top: 28px;
    order: 2;
    width: var(--tw);
    padding-inline: 8px;
  }
  .tw-roof {
    left: -8px;
    right: -8px;
  }
  .tw-tier,
  .tw-condenser,
  .tw-ac,
  .tw-edge,
  .tw-spill {
    display: none;
  }
  .tw-bolts {
    inset: var(--sign-top) 8px 0;
  }

  /* The intro plaque, bolted to the facade under the sign. Its top edge catches the row's light. */
  .kanban.sub {
    order: 3;
    z-index: 1;
    width: calc(var(--tw) - 8px);
    margin-top: 34px;
    /* The canopy keeps its breathing room under the plaque however short the screen. */
    margin-bottom: 26px;
    padding: 14px 12px 16px;
  }
  /* Bolted like the sign row above it: a bolt head in each corner of the rim. */
  .kanban.sub::before {
    content: '';
    position: absolute;
    z-index: 1;
    inset: calc(-1 * var(--rim));
    pointer-events: none;
    --bolt: radial-gradient(circle, #4a5373 0 1.1px, #2a3150 1.5px 2.3px, transparent 2.7px);
    background:
      var(--bolt) 1px 1px / 8px 8px no-repeat,
      var(--bolt) calc(100% - 1px) 1px / 8px 8px no-repeat,
      var(--bolt) 1px calc(100% - 1px) / 8px 8px no-repeat,
      var(--bolt) calc(100% - 1px) calc(100% - 1px) / 8px 8px no-repeat;
  }
  .kanban.sub::after {
    content: '';
    position: absolute;
    inset: calc(-1 * var(--rim));
    border-radius: inherit;
    pointer-events: none;
    background: linear-gradient(
      90deg,
      var(--glow-pink),
      var(--glow-amber) 25%,
      var(--glow-vermilion) 50%,
      var(--glow-violet) 75%,
      var(--glow-lime)
    );
    opacity: 0.16;
    mix-blend-mode: screen;
    -webkit-mask-image: linear-gradient(#000, rgb(0 0 0 / 0.35) 14%, transparent 40%);
    mask-image: linear-gradient(#000, rgb(0 0 0 / 0.35) 14%, transparent 40%);
  }
  .sub .intro {
    max-width: none;
    font-size: clamp(14px, 2.1vw, 16px);
    line-height: 1.5;
  }
  .stack-line {
    margin-top: 10px;
    padding-top: 10px;
    font-size: 12.5px;
  }
  .kb-deco {
    display: none;
  }

  /* Street level: the actions as the entrance, under a steel canopy. Whatever height the screen
     has left goes to the wall above it, so the entrance always stands on the street. */
  .act {
    order: 4;
    width: calc(var(--tw) - 24px);
    margin-top: auto;
    /* Clears the street's fade, so the status line never dims into it. */
    padding: 14px 12px calc(var(--line-bar) + 60px);
    background: #0a0d18;
    box-shadow: inset 0 0 0 1px #20263d;
  }
  .act::before {
    content: '';
    position: absolute;
    top: -8px;
    left: -8px;
    right: -8px;
    height: 8px;
    background: #252b45;
    box-shadow:
      inset 0 1px 0 #39415f,
      0 10px 18px -6px #000;
  }
  .act .plaque {
    padding: 0;
    border: 0;
    border-radius: 0;
    background: none;
    box-shadow: none;
  }
  .act .plaque :deep(.actions.stack) {
    flex-direction: row;
    justify-content: center;
    gap: 10px;
  }
  .act .plaque :deep(a.btn) {
    flex: 1 1 0;
    min-width: 0;
    height: 44px;
    padding: 0 10px;
    gap: 6px;
  }
  .status {
    margin: 10px auto 0;
    max-width: 30ch;
    font-size: 13px;
    text-align: center;
  }

  /* The wet street, above the Fred Line bar: all five segments reflect. */
  .street {
    height: calc(66px + var(--line-bar));
    padding-top: 22px;
    padding-bottom: var(--line-bar);
  }
  .street-grid {
    display: flex;
    justify-content: center;
    padding: 0;
  }
  .refl {
    flex-direction: row;
    gap: 6px;
  }
  .refl span:not(:nth-last-child(-n + 2)) {
    display: block;
  }
  .refl span,
  .refl span:last-child,
  .refl span:nth-last-child(2) {
    flex: 1;
    margin-top: 0;
    mix-blend-mode: normal;
    opacity: 0.3;
    filter: blur(5px);
  }
}
/* ───────── tablets: the actions hang off the tower's side wall ─────────
   From 720px there is room beside the tower (about 190px at 720, 220px at 820), so the actions
   leave the entrance and hang off the right wall on two steel brackets, as on desktop. The
   building then runs straight down to the street, and the window grid fills the lower floors.
   Narrower phones keep the entrance: there is only about 46px of city each side. */
@media (min-width: 720px) and (max-width: 959px) and (min-height: 560px) {
  .act {
    position: absolute;
    top: 56%;
    left: calc(50% + var(--tw) / 2 + 16px);
    width: min(210px, calc((100% - var(--tw)) / 2 - 32px));
    margin: 0;
    padding: 0;
    background: none;
    box-shadow: none;
    transform: translateY(-50%);
    align-items: stretch;
  }
  .act::before {
    display: none;
  }
  .act .plaque {
    --reach: 16px;
    padding: 18px;
    border: 3px solid #151a2c;
    border-radius: 6px;
    background: var(--color-sign);
    box-shadow:
      0 0 0 1px #252b45,
      inset 0 0 0 1px #2a3048;
  }
  .act .kb-mount {
    display: block;
  }
  .act .plaque :deep(.actions.stack) {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
  .act .plaque :deep(a.btn) {
    flex: none;
  }
  .status {
    margin: 16px 0 0;
    max-width: none;
    text-align: left;
  }
}
/* Phones: the plaque sits close under the sign row. The gap there is too short for a floor of
   windows, so instead of a strip of blank wall the plaque moves up and the freed height becomes
   windows above the entrance. */
@media (max-width: 719px), (max-width: 959px) and (max-height: 559px) {
  .kanban.sub {
    margin-top: calc(22px - var(--hero-gap));
  }
}
/* Short phones (iPhone SE/8 class): tighten the top of the building so the entrance's buttons
   clear the Fred Line bar on the first screen. The plaque is short enough to keep its stack line. */
@media (max-width: 719px) and (max-height: 700px) {
  .hero-grid {
    padding-top: 46px;
  }
  .name-sign {
    padding: 10px 12px 12px;
  }
  h1 {
    font-size: 2.6rem;
  }
}
@media (max-width: 959px) and (prefers-reduced-motion: reduce) {
  .ph-beacon {
    animation: none;
  }
}
</style>
