import { onBeforeUnmount, onMounted, readonly, ref } from 'vue'

/**
 * Id de la sección que se está viendo, para marcar su enlace en el menú.
 * Una sección cuenta como «vista» cuando cruza la franja que va de debajo de la
 * cabecera (64px) hasta la mitad de la pantalla. Las que aún no existen se ignoran.
 * Si al final de la página la última sección no llega a esa franja, se marca igual.
 */
export function useActiveSection(ids: readonly string[]) {
  const active = ref<string | null>(null)
  const visible = new Set<string>()
  let existing: string[] = []
  let observer: IntersectionObserver | undefined

  function update() {
    const atBottom =
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
    const last = existing.at(-1)
    if (atBottom && last) {
      active.value = last
      return
    }
    // Si dos secciones comparten la franja, gana la de abajo: es la que acaba de empezar
    active.value = [...existing].reverse().find((id) => visible.has(id)) ?? null
  }

  onMounted(() => {
    existing = ids.filter((id) => document.getElementById(id))
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id)
          else visible.delete(entry.target.id)
        }
        update()
      },
      { rootMargin: '-64px 0px -50% 0px' },
    )
    for (const id of existing) observer.observe(document.getElementById(id)!)
    window.addEventListener('scroll', update, { passive: true })
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    window.removeEventListener('scroll', update)
  })

  return readonly(active)
}
