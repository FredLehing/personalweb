<script setup lang="ts">
import { computed } from 'vue'
import { profile } from '@/content/profile'

// GitHub, LinkedIn, Download CV. GitHub is pinned as the amber primary action (owner's choice);
// if it ever has no URL, the first live link takes over so there is always a working next step.
// Links whose target doesn't exist yet render last, as disabled "soon" items instead of broken links.

defineProps<{ layout?: 'stack' | 'row' }>()

type Action = { key: string; label: string; href: string | null; download?: boolean; external?: boolean }

const PRIMARY = 'github'

const actions = computed(() => {
  const all: Action[] = [
    { key: 'github', label: 'GitHub', href: profile.links.github, external: true },
    { key: 'linkedin', label: 'LinkedIn', href: profile.links.linkedin, external: true },
    { key: 'cv', label: 'Download CV', href: profile.cvUrl, download: true },
  ]
  return [...all.filter((a) => a.href), ...all.filter((a) => !a.href)]
})
const primaryKey = computed(
  () => actions.value.find((a) => a.key === PRIMARY && a.href)?.key ?? actions.value.find((a) => a.href)?.key,
)
const soonLabel: Record<string, string> = { cv: 'CV · soon', linkedin: 'LinkedIn · soon', github: 'GitHub · soon' }
</script>

<template>
  <div class="actions" :class="layout ?? 'row'">
    <template v-for="a in actions" :key="a.key">
      <a
        v-if="a.href"
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
      <span v-else class="btn soon" aria-disabled="true">{{ soonLabel[a.key] }}</span>
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
  box-shadow: inset 0 0 0 1px var(--color-rule-strong);
  transition:
    background 0.3s var(--ease-out-expo),
    box-shadow 0.3s var(--ease-out-expo),
    color 0.3s var(--ease-out-expo),
    transform 0.2s var(--ease-out-expo);
}
/* Live links share one width so GitHub and LinkedIn read as a matched pair. */
a.btn {
  min-width: 120px;
  padding: 0 16px;
  justify-content: center;
}
.btn:hover {
  color: var(--color-action);
  box-shadow: inset 0 0 0 1px var(--color-action);
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
.btn.primary:hover {
  background: var(--color-action-hover);
  color: var(--color-action-ink);
}

/* Not available yet: one dashed edge, muted, not interactive. */
.btn.soon {
  height: 40px;
  padding: 0 16px;
  font-size: 14px;
  color: var(--color-faint);
  box-shadow: none;
  border: 1px dashed var(--color-rule-strong);
  cursor: not-allowed;
}
.btn.soon:hover {
  color: var(--color-faint);
}
.btn.soon:active {
  transform: none;
}

@media (max-width: 959px) {
  .actions.stack {
    align-items: center;
  }
}
</style>
