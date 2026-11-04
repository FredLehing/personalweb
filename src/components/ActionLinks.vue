<script setup lang="ts">
import { computed } from 'vue'
import { profile } from '@/content/profile'

// GitHub, LinkedIn, Download CV. GitHub is pinned as the amber primary action (owner's choice);
// if it ever has no URL, the first live link takes over so there is always a working next step.
// Links whose target doesn't exist yet are left out (no "soon" placeholders in the hero), and
// appear on their own once profile.ts gives them a URL.

defineProps<{ layout?: 'stack' | 'row' }>()

type Action = { key: string; label: string; href: string | null; download?: boolean; external?: boolean }

const PRIMARY = 'github'

const actions = computed(() => {
  const all: Action[] = [
    { key: 'github', label: 'GitHub', href: profile.links.github, external: true },
    { key: 'linkedin', label: 'LinkedIn', href: profile.links.linkedin, external: true },
    { key: 'cv', label: 'Download CV', href: profile.cvUrl, download: true },
  ]
  return all.filter((a): a is Action & { href: string } => !!a.href)
})
const primaryKey = computed(
  () => actions.value.find((a) => a.key === PRIMARY && a.href)?.key ?? actions.value.find((a) => a.href)?.key,
)
</script>

<template>
  <div class="actions" :class="layout ?? 'row'">
    <template v-for="a in actions" :key="a.key">
      <a
        class="btn"
        :class="{ primary: a.key === primaryKey }"
        :href="a.href"
        :download="a.download || undefined"
        :target="a.external ? '_blank' : undefined"
        :rel="a.external ? 'noopener' : undefined"
      >
        <svg v-if="a.download" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 19h14" /></svg>
        {{ a.label }}
        <svg v-if="a.external" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8" /></svg>
      </a>
    </template>
  </div>
</template>

<style scoped>
.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.actions.stack {
  flex-direction: column;
  align-items: flex-start;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  height: 48px;
  padding: 0 20px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  color: var(--color-ink);
  text-decoration: none;
  /* Night fill, so the skyline (antennas, aircraft lights) never shows through a button
     and reads as part of it. */
  background: rgb(11 14 26 / 0.92);
  box-shadow: inset 0 0 0 1px var(--color-rule-strong);
  /* Colour changes are quick and plain; the press lands inside 120ms. */
  transition:
    background 180ms ease,
    box-shadow 180ms ease,
    color 180ms ease,
    transform 120ms var(--ease-out-expo);
}
/* Live links share one width so GitHub and LinkedIn read as a matched pair. */
a.btn {
  min-width: 120px;
  padding: 0 16px;
  justify-content: center;
}
/* Mouse only: a tap would leave the button stuck amber. */
@media (hover: hover) and (pointer: fine) {
  .btn:hover {
    color: var(--color-action);
    box-shadow: inset 0 0 0 1px var(--color-action);
  }
}
.btn:active {
  transform: scale(0.98);
}
.btn svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.btn.primary {
  background: var(--color-action);
  color: var(--color-action-ink);
  box-shadow: none;
}
/* Amber-on-amber would vanish, so selected text on the amber button glows dark instead. */
.btn.primary::selection {
  color: var(--color-action-ink);
  text-shadow: 0 0 8px rgb(0 0 0 / 0.35);
}
@media (hover: hover) and (pointer: fine) {
  .btn.primary:hover {
    background: var(--color-action-hover);
    color: var(--color-action-ink);
  }
}

@media (max-width: 959px) {
  .actions.stack {
    align-items: center;
  }
}
</style>
