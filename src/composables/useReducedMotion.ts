import { onBeforeUnmount, onMounted, ref } from 'vue'

/** Tracks the visitor's "reduce motion" preference and updates if it changes. */
export function useReducedMotion() {
  const reduced = ref(
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  let query: MediaQueryList | null = null
  const onChange = (event: MediaQueryListEvent) => (reduced.value = event.matches)

  onMounted(() => {
    query = window.matchMedia('(prefers-reduced-motion: reduce)')
    reduced.value = query.matches
    query.addEventListener('change', onChange)
  })
  onBeforeUnmount(() => query?.removeEventListener('change', onChange))

  return reduced
}
