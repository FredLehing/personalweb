<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { isPlaceholder, profile } from '@/content/profile'
import { neonVar, stations } from '@/content/stations'
import RouteLine from '@/components/RouteLine.vue'
import SignTower from '@/components/SignTower.vue'
import SkylineArt from '@/components/SkylineArt.vue'
import ActionLinks from '@/components/ActionLinks.vue'
import ContactLinks from '@/components/ContactLinks.vue'
import ChapterSection from '@/components/ChapterSection.vue'
import ExperienceList from '@/components/ExperienceList.vue'

const [about, work, dream, contact] = stations as [
  (typeof stations)[number],
  (typeof stations)[number],
  (typeof stations)[number],
  (typeof stations)[number],
]
const year = new Date().getFullYear()

// The street reflection is as wide as the sign. The tower column is sized by the sign, so its width is the sign's.
const tower = ref<HTMLElement | null>(null)
const signWidth = ref(0)
let observer: ResizeObserver | undefined
onMounted(() => {
  if (!tower.value) return
  observer = new ResizeObserver(([entry]) => {
    if (entry) signWidth.value = entry.contentRect.width
  })
  observer.observe(tower.value)
})
onBeforeUnmount(() => observer?.disconnect())

// Confirmed stack only; placeholders like "[from CV]" never reach the hero.
const stackLine = Object.values(profile.stack)
  .flat()
  .filter((t) => !isPlaceholder(t))
  .join(' · ')

// The tower's windows below the sign, four to a floor: 0 dark, 1 cool, 2 warm. Kept sparse.
const towerWindows = '01000020100000010200100000102001'
</script>

<template>
  <a class="skip" href="#about">Skip to content</a>
  <RouteLine />

  <div class="page">
    <header id="top" class="hero">
      <SkylineArt />

      <div class="hero-grid">
        <div class="board">
          <!-- The name sign is side-mounted to the tower wall by two steel brackets. -->
          <div class="kanban name-sign">
            <span class="kb-deco kb-mount top" aria-hidden="true" />
            <span class="kb-deco kb-mount bot" aria-hidden="true" />
            <h1><span class="name-line">Fred</span> <span class="name-line">Lehing</span></h1>
          </div>
          <!-- The intro hangs on a plain plaque from the bottom of the name sign. -->
          <div class="kanban plaque sub">
            <span class="kb-deco kb-hang l" aria-hidden="true" />
            <span class="kb-deco kb-hang r" aria-hidden="true" />
            <p class="intro">
              <strong>Full-stack developer, interning right now.</strong> I build the interface and the system
              behind it, and I care about both ends the same.
            </p>
            <p v-if="stackLine" class="stack-line">{{ stackLine }}</p>
          </div>
        </div>

        <div ref="tower" class="tower">
          <!-- Building detail: a rooftop with an aircraft light, a few dim windows below the sign,
               the sign's transformer box with its conduit, and the name's cyan falling on the
               wall beside it. The sign is bolted flat to the facade. All dimmer than the sign. -->
          <div class="tw-deco tw-roof" aria-hidden="true">
            <span class="tw-mast" />
            <span class="tw-beacon" />
          </div>
          <div class="tw-deco tw-windows" aria-hidden="true">
            <span v-for="(w, i) in towerWindows" :key="i" :class="{ cool: w === '1', warm: w === '2' }" />
          </div>
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

      <!-- Wet street at the foot of the skyline. The signs stack top to bottom, so only the
           lowest one is close enough to throw its colour onto the ground. -->
      <div class="street" aria-hidden="true">
        <div class="street-grid">
          <span :style="{ '--c': neonVar(contact.color), width: signWidth ? `${signWidth}px` : undefined }" />
        </div>
      </div>
    </header>

    <main>
      <ChapterSection :station="about">
        <p>
          <strong>I'm Fred, a full-stack developer.</strong> I'm an intern right now, working on both the front end
          and the back end, and I enjoy them about equally.
        </p>
        <p class="ph">[A few lines about you in your own words: where you're from and what you do when you're not coding.]</p>
        <p class="ph">[What you care about: how you like to work, what kind of software you want to build, what makes a team good to you.]</p>
      </ChapterSection>

      <ChapterSection :station="work">
        <ExperienceList />
      </ChapterSection>

      <ChapterSection :station="dream">
        <p>
          <strong>It started with <em>Tokyo Drift</em>.</strong> The neon, the night streets, a city that never quite
          goes dark. I haven't been yet. Tokyo and Kyoto have been at the top of my list for years, and this line is
          where it ends.
        </p>
        <span class="note">Draft copy written from Fred's answers, to be rewritten in his own words.</span>
      </ChapterSection>

      <ChapterSection :station="contact">
        <p>
          <strong>Looking for a first full-time role on a team that ships.</strong> If that sounds like your team, write to me.
        </p>
        <ContactLinks class="contact-actions" />
        <p class="terminus"><span lang="ja">終点</span> · End of the line</p>
      </ChapterSection>
    </main>

    <footer class="foot">
      <p>© {{ year }} {{ profile.name }}</p>
      <a href="#top">
        Back to the start
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5m-6 6 6-6 6 6" /></svg>
      </a>
    </footer>
  </div>
</template>

<style scoped>
.skip {
  position: fixed;
  z-index: 50;
  left: 16px;
  top: -60px;
  padding: 10px 16px;
  border-radius: 8px;
  background: var(--color-action);
  color: var(--color-action-ink);
  font-weight: 600;
  transition: top 0.2s var(--ease-out-expo);
}
.skip:focus {
  top: 16px;
}

.page {
  margin-left: var(--rail);
}

/* ───────── hero: the night skyline with the sign tower ───────── */
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
.street span {
  grid-column: 2;
  width: 100px;
  height: 100%;
  background: linear-gradient(var(--c), transparent 85%);
  opacity: 0.32;
  filter: blur(6px);
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
.tw-windows {
  position: absolute;
  top: calc(100% + 36px);
  left: calc(-1 * var(--tower-overhang) + 16px);
  right: calc(-1 * var(--tower-overhang) + 16px);
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  row-gap: 22px;
  justify-items: center;
}
.tw-windows span {
  width: 9px;
  height: 6px;
}
.tw-windows .cool {
  background: #cfe0ff;
  opacity: 0.22;
}
.tw-windows .warm {
  background: #ffd48a;
  opacity: 0.32;
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
    color-mix(in srgb, var(--color-neon-cyan) 13%, transparent),
    transparent 75%
  );
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
   with it (top to bottom: pink About, amber Work, violet Dream, lime Contact). Screen-blended,
   so text only gets lighter. Desktop only: phones have no tower beside the signs. */
@media (min-width: 960px) {
  .name-sign {
    background: radial-gradient(
      ellipse 70% 62% at 50% 50%,
      color-mix(in srgb, var(--color-neon-cyan) 9%, var(--color-sign)),
      var(--color-sign) 78%
    );
    box-shadow:
      0 0 0 1px #252b45,
      inset 0 0 0 1px color-mix(in srgb, var(--color-neon-cyan) 22%, #2a3048);
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
    --spill: linear-gradient(var(--color-neon-pink) 60%, var(--color-neon-amber));
  }
  .kanban.sub {
    --spill: linear-gradient(
      var(--color-neon-amber) 8%,
      var(--color-neon-violet) 32% 58%,
      var(--color-neon-lime) 80%
    );
  }
  .act .plaque {
    --spill: linear-gradient(
      var(--color-neon-pink) 22%,
      var(--color-neon-amber) 42% 70%,
      var(--color-neon-violet) 92%
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

/* ───────── chapters & footer ───────── */
.contact-actions {
  margin-top: 32px;
}
.terminus {
  margin-top: 40px;
  font-family: var(--font-neon);
  font-weight: 700;
  font-size: 14px;
  color: var(--color-neon-lime);
}

.foot {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 28px var(--gutter);
  border-top: 1px solid var(--color-rule);
  font-size: 14px;
  color: var(--color-faint);
}
.foot a {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--color-muted);
  text-decoration: none;
}
.foot svg {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.foot a:hover {
  color: var(--color-ink);
}

/* ───────── phones: one centred column ───────── */
@media (max-width: 959px) {
  .hero,
  .hero-grid {
    min-height: 0;
  }
  .hero-grid {
    grid-template-columns: minmax(0, 1fr);
    justify-items: center;
    align-content: start;
    gap: 32px;
    padding-top: 80px;
    padding-bottom: 72px;
    text-align: center;
  }
  .board {
    justify-self: center;
    text-align: center;
  }
  .intro {
    margin: 18px auto 0;
  }
  .tower {
    width: 100%;
    padding-top: 0;
  }
  .tower::before,
  .tw-deco,
  .kb-deco {
    display: none;
  }
  /* No tower wall to hang from on phones, so the signs fall back to plain text. */
  .kanban,
  .kanban.plaque {
    margin-top: 0;
    padding: 0;
    border: 0;
    border-radius: 0;
    background: none;
    box-shadow: none;
  }
  .kanban.sub {
    margin-top: 18px;
    text-align: center;
  }
  .street {
    display: none;
  }
  .act {
    justify-self: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .status {
    text-align: center;
  }
}
</style>
