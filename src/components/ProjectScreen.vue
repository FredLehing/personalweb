<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue'
import { isPlaceholder } from '@/content/profile'
import type { Project } from '@/content/projects'

// Click-to-load: until play, only the YouTube thumbnail loads; play swaps in the youtube-nocookie
// player. One screen plays at a time, and Esc stops it.
const props = defineProps<{ project: Project; index: number }>()

const isPlaying = computed(() => nowPlaying.value === props.project.id)
const no = String(props.index + 1).padStart(2, '0')
const thumb = computed(() =>
  props.project.youtubeId ? `https://i.ytimg.com/vi/${props.project.youtubeId}/hqdefault.jpg` : null,
)
const embed = computed(() => {
  const id = props.project.youtubeId
  if (!id) return null
  const q = new URLSearchParams({ autoplay: '1', rel: '0', playsinline: '1' })
  if (props.project.captions) q.set('cc_load_policy', '1')
  return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?${q}`
})
const ph = (s: string) => isPlaceholder(s)

const onKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isPlaying.value) nowPlaying.value = null
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<script lang="ts">
import { ref } from 'vue'

// Module scope, shared by every screen: starting one stops the other.
const nowPlaying = ref<string | null>(null)
</script>

<template>
  <figure class="screen" :class="{ playing: isPlaying }">
    <span class="rod l" aria-hidden="true" />
    <span class="rod r" aria-hidden="true" />
    <div class="housing">
      <div class="dep">
        <span class="no" lang="ja">作品<span>{{ no }}</span></span>
        <h3 class="ttl" :class="{ ph: ph(project.title) }">
          {{ project.title }}<span v-if="project.context" class="context"> · {{ project.context }}</span>
        </h3>
        <span class="meta">
          <span v-if="isPlaying" class="now"><span lang="ja">再生中</span> · Playing</span>
          <span v-else-if="project.duration" class="dur">{{ project.duration }}</span>
          <span v-if="project.captions" class="cc" title="Captions">CC</span>
        </span>
      </div>
      <div class="panel">
        <iframe
          v-if="isPlaying && embed"
          class="player"
          :src="embed"
          :title="`${project.title} (video)`"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowfullscreen
        />
        <template v-else-if="thumb">
          <img class="thumb" :src="thumb" alt="" loading="lazy" decoding="async" width="480" height="360" />
          <button class="play" type="button" :aria-label="`Play video: ${project.title}`" @click="nowPlaying = project.id">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l13-7.5z" /></svg>
          </button>
        </template>
        <template v-else-if="project.image">
          <img
            class="shot"
            :src="project.image"
            :alt="project.imageAlt ?? ''"
            loading="lazy"
            decoding="async"
            width="1600"
            height="900"
          />
          <a v-if="project.self" class="chip here" href="#top"><span lang="ja">現在地</span> · You are here</a>
          <span v-else class="chip">Video coming soon</span>
        </template>
        <span v-else class="empty">[video coming]</span>
      </div>
    </div>

    <figcaption class="info">
      <p :class="{ ph: ph(project.summary) }">{{ project.summary }}</p>
      <dl class="facts">
        <dt>Role</dt>
        <dd :class="{ ph: ph(project.role) }">{{ project.role }}</dd>
        <dt>Stack</dt>
        <dd v-if="project.stack.length">
          <ul class="pills">
            <li v-for="t in project.stack" :key="t">{{ t }}</li>
          </ul>
        </dd>
        <dd v-else class="ph">[from CV]</dd>
        <dt>Code</dt>
        <dd v-if="project.repo">
          <a class="code" :href="project.repo" target="_blank" rel="noopener">
            GitHub
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9" /></svg>
          </a>
        </dd>
        <dd v-else class="ph">[repo link]</dd>
      </dl>
    </figcaption>
  </figure>
</template>

<style scoped>
.screen {
  position: relative;
  padding-top: 20px;
}
.rod {
  position: absolute;
  top: 0;
  width: 2px;
  height: 20px;
  background: #252b45;
}
.rod::after {
  content: '';
  position: absolute;
  top: 0;
  left: -4px;
  width: 10px;
  height: 3px;
  background: #39415f;
}
.rod.l { left: 18%; }
.rod.r { right: 18%; }

.housing {
  padding: 8px;
  border-radius: 6px;
  background: var(--color-sign-frame);
  box-shadow:
    0 0 0 1px #2a3048,
    0 30px 60px -20px rgb(0 0 0 / 0.9);
}

.dep {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 34px;
  padding: 0 10px 8px 6px;
  font-family: var(--font-neon);
  font-weight: 700;
  font-size: 13px;
  line-height: 1;
  white-space: nowrap;
}
.no {
  color: var(--c);
  letter-spacing: 0.04em;
}
.no span {
  margin-left: 6px;
  font-variant-numeric: tabular-nums;
}
.ttl {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  font: inherit;
  /* The strip sets line-height 1; overflow: hidden would then clip descenders (g, p, j). */
  line-height: 1.35;
  color: var(--color-ink);
  letter-spacing: 0.02em;
}
.context {
  font-weight: 400;
  color: var(--color-muted);
}
.meta {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--color-faint);
  font-variant-numeric: tabular-nums;
}
.now {
  color: var(--color-action);
}
.cc {
  padding: 2px 5px;
  border-radius: 3px;
  box-shadow: inset 0 0 0 1px var(--color-rule-strong);
  font-size: 11px;
  letter-spacing: 0.06em;
}

.panel {
  position: relative;
  aspect-ratio: 16 / 9;
  border-radius: 3px;
  overflow: hidden;
  background: #05070e;
  box-shadow: inset 0 0 0 1px #1c2136;
}
.thumb {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.55) saturate(0.7);
  transition: filter 220ms ease-out;
}
.play {
  position: absolute;
  inset: 0;
  margin: auto;
  width: 64px;
  height: 64px;
  border: 0;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: var(--color-action);
  color: var(--color-action-ink);
  cursor: pointer;
  transition:
    background 180ms ease,
    transform 120ms var(--ease-out-expo);
}
.play svg {
  width: 22px;
  height: 22px;
  margin-left: 3px;
  fill: currentColor;
}
.play:active {
  transform: scale(0.96);
}
@media (hover: hover) and (pointer: fine) {
  .panel:hover .thumb {
    filter: none;
  }
  .panel:hover .play {
    background: var(--color-action-hover);
  }
}
.play:focus-visible {
  background: var(--color-action-hover);
}
.panel:has(.play:focus-visible) .thumb {
  filter: none;
}
.shot {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
}
.chip {
  position: absolute;
  left: 12px;
  bottom: 12px;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.2;
  color: var(--color-ink);
  background: rgb(5 7 14 / 0.82);
  box-shadow: inset 0 0 0 1px var(--color-rule-strong);
  backdrop-filter: blur(6px);
}
.here {
  color: var(--color-action);
  text-decoration: none;
  transition:
    color 180ms ease,
    transform 120ms var(--ease-out-expo);
}
.here:active {
  transform: scale(0.97);
}
@media (hover: hover) and (pointer: fine) {
  .here:hover {
    color: var(--color-action-hover);
  }
}
.here:focus-visible {
  color: var(--color-action-hover);
}
.player {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
}
.empty {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-size: 14px;
  font-style: italic;
  color: var(--color-faint);
  background: radial-gradient(ellipse at 50% 40%, #1a2036, #0b0e1a 70%);
}

.info {
  display: grid;
  /* The facts column takes what it needs up to 20rem, then the stack pills wrap, so a long stack
     never squeezes the description into a narrow strip. */
  grid-template-columns: minmax(0, 1fr) fit-content(20rem);
  gap: 8px 32px;
  margin-top: 22px;
}
.info p {
  grid-column: 1;
  font-size: 1.05rem;
  line-height: 1.6;
  max-width: 56ch;
}
.facts {
  grid-column: 2;
  grid-row: 1;
  display: grid;
  grid-template-columns: max-content minmax(0, 1fr);
  gap: 10px 16px;
  align-content: start;
  font-size: 14px;
  line-height: 1.45;
}
.facts dt {
  color: var(--color-faint);
}
.facts dd {
  color: var(--color-ink);
}
.pills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  list-style: none;
  margin: 0;
  padding: 0;
}
.pills li {
  font-size: 12px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 999px;
  color: var(--color-muted);
  box-shadow: inset 0 0 0 1px var(--color-rule-strong);
}
.code {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  color: var(--color-ink);
  text-decoration: none;
  transition: color 180ms ease;
}
.code svg {
  width: 14px;
  height: 14px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
@media (hover: hover) and (pointer: fine) {
  .code:hover {
    color: var(--color-action);
  }
}
.ph {
  color: var(--color-faint);
  font-style: italic;
}

@media (max-width: 959px) {
  .screen { padding-top: 14px; }
  .rod { height: 14px; }
  .housing { padding: 6px; }
  .dep {
    height: 30px;
    gap: 8px;
    padding: 0 6px 6px 4px;
    font-size: 12px;
  }
  .dur { display: none; }
  .play {
    width: 56px;
    height: 56px;
  }
  .info {
    grid-template-columns: minmax(0, 1fr);
    margin-top: 18px;
  }
  .info p { font-size: 1rem; }
  .facts {
    grid-column: 1;
    grid-row: auto;
    margin-top: 6px;
  }
}
</style>
