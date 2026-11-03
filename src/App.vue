<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { profile } from '@/content/profile'
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
</script>

<template>
  <a class="skip" href="#about">Skip to content</a>
  <RouteLine />

  <div class="page">
    <header id="top" class="hero">
      <SkylineArt />

      <div class="hero-grid">
        <div class="board">
          <h1><span class="name-line">Fred</span> <span class="name-line">Lehing</span></h1>
          <p class="intro">
            <strong>Full-stack developer, interning right now.</strong> I build the interface and the system
            behind it, and I care about both ends the same.
          </p>
        </div>

        <div ref="tower" class="tower">
          <SignTower />
        </div>

        <div class="act">
          <ActionLinks layout="stack" />
          <p class="status">{{ profile.status }} · {{ profile.availability }}</p>
        </div>
      </div>

      <!-- Wet street at the foot of the skyline. The signs stack top to bottom, so only the
           lowest one is close enough to throw its colour onto the ground. -->
      <div class="street" aria-hidden="true">
        <span :style="{ '--c': neonVar(contact.color), width: signWidth ? `${signWidth}px` : undefined }" />
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
}

.hero-grid {
  position: relative;
  z-index: 3;
  max-width: 1300px;
  min-height: max(700px, 100vh);
  margin: 0 auto;
  padding: 0 var(--gutter) 56px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  /* The tower body reaches past the sign into this gap, but always stops short of the name
     and the actions: whatever is left of the gap after the overhang is their breathing room. */
  --hero-gap: clamp(20px, 4vw, 64px);
  --tower-overhang: clamp(12px, calc(var(--hero-gap) - 18px), 48px);
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
  display: flex;
  justify-content: center;
  padding-top: 30px;
  background: linear-gradient(rgb(11 14 26 / 0), var(--color-night) 34px, #0d1121);
  pointer-events: none;
}
.street span {
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
  position: relative;
  display: flex;
  justify-content: center;
  padding-top: 28px;
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

.act {
  justify-self: start;
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
  .tower::before {
    display: none;
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
