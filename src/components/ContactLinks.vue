<script setup lang="ts">
import { computed } from 'vue'
import { profile } from '@/content/profile'

// The Contact chapter's job is "get in touch", not "look me up" (the hero already does that).
// So email is the one primary action here; the profiles and CV follow as quiet text links.
// Anything without a target yet is left out of the text links, and email shows a "soon" state.

const mailto = computed(() => (profile.email ? `mailto:${profile.email}` : null))

const secondary = computed(() =>
  [
    { key: 'linkedin', label: 'LinkedIn', href: profile.links.linkedin, external: true },
    { key: 'github', label: 'GitHub', href: profile.links.github, external: true },
    { key: 'cv', label: 'CV', href: profile.cvUrl, download: true },
  ].filter((l): l is typeof l & { href: string } => !!l.href),
)
</script>

<template>
  <div class="contact">
    <a v-if="mailto" class="email" :href="mailto">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16v12H4zM4 7l8 6 8-6" /></svg>
      Email me
    </a>
    <span v-else class="email soon" aria-disabled="true">Email · soon</span>

    <p v-if="secondary.length" class="also">
      Or find me on
      <template v-for="(l, i) in secondary" :key="l.key">
        <span v-if="i > 0" aria-hidden="true"> · </span>
        <a
          :href="l.href"
          :download="l.download || undefined"
          :target="l.external ? '_blank' : undefined"
          :rel="l.external ? 'noopener' : undefined"
          >{{ l.label }}</a
        >
      </template>
    </p>
  </div>
</template>

<style scoped>
.email {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  height: 52px;
  padding: 0 24px;
  border-radius: 8px;
  background: var(--color-action);
  color: var(--color-action-ink);
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  transition:
    background 0.3s var(--ease-out-expo),
    transform 0.2s var(--ease-out-expo);
}
/* Amber-on-amber would vanish, so selected text on the amber button glows dark instead. */
.email:not(.soon)::selection {
  color: var(--color-action-ink);
  text-shadow: 0 0 8px rgb(0 0 0 / 0.35);
}
.email:hover {
  background: var(--color-action-hover);
}
.email:active {
  transform: scale(0.98);
}
.email svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* Not available yet: dashed edge, muted, not interactive (same language as ActionLinks). */
.email.soon {
  height: 44px;
  padding: 0 18px;
  font-size: 14px;
  background: none;
  color: var(--color-faint);
  border: 1px dashed var(--color-rule-strong);
  cursor: not-allowed;
}
.email.soon:hover {
  background: none;
}
.email.soon:active {
  transform: none;
}

.also {
  margin-top: 16px;
  font-size: 15px;
  color: var(--color-muted);
}
.also a {
  color: var(--color-ink);
  text-decoration: underline;
  text-decoration-color: var(--color-rule-strong);
  text-underline-offset: 3px;
  transition: color 0.2s var(--ease-out-expo), text-decoration-color 0.2s var(--ease-out-expo);
}
.also a:hover {
  color: var(--color-action);
  text-decoration-color: var(--color-action);
}
</style>
