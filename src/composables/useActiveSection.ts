import { onBeforeUnmount, onMounted, readonly, ref } from 'vue'

/**
 * Id de la sección que se está viendo, para marcar su enlace en el menú.
 * Una sección cuenta como «vista» cuando cruza la franja que va de debajo de la
 * cabecera (64px) hasta la mitad de la pantalla. Las que aún no existen se ignoran.
 */
export function useActiveSection(ids: readonly string[]) {
  const active = ref<string | null>(null)
  let observer: IntersectionObserver | undefined

  onMounted(() => {
    const visible = new Set<string>()
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id)
          else visible.delete(entry.target.id)
        }
        active.value = ids.find((id) => visible.has(id)) ?? null
      },
      { rootMargin: '-64px 0px -50% 0px' },
    )
    for (const id of ids) {
      const section = document.getElementById(id)
      if (section) observer.observe(section)
    }
  })

  onBeforeUnmount(() => observer?.disconnect())

  return readonly(active)
}
