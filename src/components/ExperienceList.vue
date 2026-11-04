<script setup lang="ts">
import { isPlaceholder, profile, type Layer } from '@/content/profile'

const layerName: Record<Layer, string> = { frontend: 'Frontend', backend: 'Backend', data: 'Data' }
</script>

<template>
  <ol class="rows">
    <li v-for="entry in profile.experience" :key="entry.role + entry.period" class="row">
      <span class="period" :class="{ ph: isPlaceholder(entry.period) }">{{ entry.period }}</span>
      <div>
        <p class="role" :class="{ ph: isPlaceholder(entry.role) }">{{ entry.role }}</p>
        <p class="place" :class="{ ph: isPlaceholder(entry.place) }">{{ entry.place }}</p>
      </div>
      <ul v-if="entry.layers.length" class="layers" aria-label="Parts of the stack">
        <li v-for="layer in entry.layers" :key="layer">{{ layerName[layer] }}</li>
      </ul>
      <span v-else-if="entry.milestone" class="milestone">{{ entry.milestone }}</span>
    </li>
  </ol>
</template>

<style scoped>
.rows {
  list-style: none;
  margin: 0;
  padding: 0;
}
.row {
  display: grid;
  grid-template-columns: 110px minmax(0, 1fr) auto;
  gap: 20px;
  align-items: baseline;
  padding: 20px 0;
  border-top: 1px solid var(--color-rule);
}
.row:last-child {
  border-bottom: 1px solid var(--color-rule);
}
.period {
  font-size: 15px;
  font-variant-numeric: tabular-nums;
  color: var(--color-muted);
}
.role {
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--color-ink);
}
.place {
  margin-top: 4px;
  font-size: 15px;
  color: var(--color-muted);
}
.ph {
  color: var(--color-faint);
  font-style: italic;
}
.layers {
  display: flex;
  gap: 6px;
  list-style: none;
  margin: 0;
  padding: 0;
}
.layers li {
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 999px;
  color: var(--color-muted);
  box-shadow: inset 0 0 0 1px var(--color-rule-strong);
}
/* Same chip shape as the layers, in the Work chapter's amber, so the turning point reads apart. */
.milestone {
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 999px;
  white-space: nowrap;
  color: var(--color-neon-amber);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--color-neon-amber) 55%, transparent);
}
@media (max-width: 640px) {
  .milestone {
    justify-self: start;
  }
}
.layers li.ph {
  box-shadow: none;
  padding-left: 0;
}

@media (max-width: 640px) {
  .row {
    grid-template-columns: minmax(0, 1fr);
    gap: 6px;
  }
}
</style>
