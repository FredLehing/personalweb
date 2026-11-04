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
          <strong>I'm a full-stack developer with a project manager's view of the product.</strong> My background is in
          operations and project management. Because of this, I think about the full product lifecycle, from planning
          to launch and maintenance.
        </p>
        <p>
          My interest in technology started when I built my first very own PC. I chose every part myself. At
          Sportradar, I worked closely with developers. Their work made me want to build software. Then I completed the
          Vali IT! retraining program.
        </p>
        <p>
          I like products that are well planned, intuitive and efficient. I also want them to be maintainable. I enjoy
          planning a feature before I write the code.
        </p>
        <p>In my free time, I play basketball and do endurance sports. I also enjoy video games.</p>
      </ChapterSection>

      <ChapterSection :station="work">
        <ExperienceList />
      </ChapterSection>

      <ChapterSection :station="projects">
        <p>
          <strong>Things I've built, on video.</strong>&#32;<span class="ph">[One or two lines on what ties them together, in your own words.]</span>
        </p>
        <ol class="projects">
          <li v-for="(p, i) in projectList" :key="p.id">
            <ProjectScreen :project="p" :index="i" />
          </li>
        </ol>
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
