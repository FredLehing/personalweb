<script setup lang="ts">
import { profile } from '@/content/profile'
import { stations } from '@/content/stations'
import RouteLine from '@/components/RouteLine.vue'
import HeroTower from '@/components/HeroTower.vue'
import ContactLinks from '@/components/ContactLinks.vue'
import ChapterSection from '@/components/ChapterSection.vue'
import ExperienceList from '@/components/ExperienceList.vue'
import ProjectScreen from '@/components/ProjectScreen.vue'
import { projects as projectList } from '@/content/projects'

const [about, work, projects, dream, contact] = stations as [
  (typeof stations)[number],
  (typeof stations)[number],
  (typeof stations)[number],
  (typeof stations)[number],
  (typeof stations)[number],
]
const year = new Date().getFullYear()
</script>

<template>
  <a class="skip" href="#about">Skip to content</a>
  <RouteLine />

  <div class="page">
    <HeroTower />

    <main>
      <ChapterSection :station="about">
        <p>
          Before I started programming, I worked in operations and project management. That's still how I approach
          things: I want to understand what we're building and why before I start writing code.
        </p>
        <p>
          The same goes for the code itself. I try to understand every line I write and learn from it as I go, because
          I'm the one who has to own it, explain it and fix it later.
        </p>
        <p>
          It started when I was about 18 and built my own PC, the personal desktop I'd never had. Years later at
          Sportradar I worked alongside developers and learned to read API endpoints properly, something I had never
          done before. That made me curious about how the software behind them is built.
        </p>
        <p>
          So I went to learn programming at the Vali IT! course. During the course I built a working prototype for BCS,
          and later I joined them as an intern. That's where I'm building my first production product now.
        </p>
        <p>
          Outside work I love basketball, cycling, swimming and running. When I game, it's mostly MMOs: Old School
          RuneScape, and lately World of Warcraft: Forever.
        </p>
      </ChapterSection>

      <ChapterSection :station="work">
        <ExperienceList />
      </ChapterSection>

      <ChapterSection :station="projects">
        <p>These are some of the projects I've worked on, both solo and in a team.</p>
        <ol class="projects">
          <li v-for="(p, i) in projectList" :key="p.id">
            <ProjectScreen :project="p" :index="i" />
          </li>
        </ol>
      </ChapterSection>

      <ChapterSection :station="dream">
        <p>
          It all started when I first saw <em>The Fast and the Furious: Tokyo Drift</em> when I was young. I was instantly
          drawn to the bright neon city lights of Tokyo, which also became the inspiration for this website. The sign tower
          at the top of the page, the kanji on every section and the train line you've been following all come from that.
        </p>
        <p>
          These days the closest I can get is Forza Horizon 6, where you can drive the many holy grails of Japanese car
          culture past Mount Fuji and go to a car meet at the Daikoku Parking Area. That's where I really noticed the other side of the country, and how the old
          buildings and torii gates blend into the nature around them.
        </p>
        <p>
          I've never actually been to Japan, so for now all of this is from a distance. That's why this stop is called Dream
          on the sign. The line on this page ends in Kyoto, and one day I want to make that trip for real: see the neon of
          Tokyo in person, take the train to Kyoto, walk through a torii gate and try as much of the food as I can along the
          way.
        </p>
      </ChapterSection>

      <ChapterSection :station="contact">
        <p>
          <strong>I'm looking for a junior developer role.</strong> I also take on freelance projects. Feel free to get in touch.
        </p>
        <ContactLinks class="contact-actions" />
        <p class="terminus"><span lang="ja">終点</span> · End of the line. Thanks for visiting!</p>
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
}
.skip:focus {
  top: 16px;
}

.page {
  margin-left: var(--rail);
}

/* ───────── chapters & footer ───────── */
.projects {
  display: grid;
  gap: 72px;
  margin: 44px 0 0;
  padding: 0;
  list-style: none;
}
@media (max-width: 959px) {
  .projects {
    gap: 56px;
    margin-top: 32px;
  }
}
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
@media (hover: hover) and (pointer: fine) {
  .foot a:hover {
    color: var(--color-ink);
  }
}
</style>
